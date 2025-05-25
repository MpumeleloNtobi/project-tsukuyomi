const request = require("supertest");
const app = require("../index"); // Make sure your index.js exports `app`
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// --- Environment Variables ---
// IMPORTANT: These MUST be set in your .env file and loaded by your main app (index.js).
// They should be real, functional credentials for a test environment.
const testDbUrl = process.env.DATABASE_URL;
const STITCH_CLIENT_KEY = process.env.STITCH_CLIENT_KEY;
const STITCH_CLIENT_SECRET = process.env.STITCH_CLIENT_SECRET;

// Basic validation for essential environment variables
if (!testDbUrl || !STITCH_CLIENT_KEY || !STITCH_CLIENT_SECRET) {
  console.error(
    "❌ ERROR: Missing required environment variables for payments tests.",
  );
  console.error(
    "Ensure DATABASE_URL, STITCH_CLIENT_KEY, STITCH_CLIENT_SECRET are set in your .env",
  );
  // Optionally, you might want to throw an error or skip tests if not configured
  // throw new Error("Missing environment variables for payments tests.");
}

let storeId; // This store will be created in beforeAll and used for tests

// Set a longer timeout for integration tests hitting live external services (DB + Stitch)
jest.setTimeout(60000); // 60 seconds
const clerkId = `user_2wfipmUA0kgcJfAwDzcbwWOLu1k`; // Generate a unique clerkId

beforeAll(async () => {
  // Ensure DATABASE_URL is explicitly set for testing if index.js relies on process.env
  process.env.DATABASE_URL = testDbUrl;

  // Create a unique store for payment tests
  const storeName = `Payment Test Store ${Date.now()}`; // Unique store name

  const delRes = await request(app).delete(`/stores/clerk/${clerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`🧹 Successfully deleted store with ID}`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }

  const storeRes = await request(app).post("/stores").send({
    clerkId: clerkId,
    storeName: storeName,
    storeDescription: "For payment tests",
    stitchClientKey: STITCH_CLIENT_KEY, // Use actual Stitch client key
    stitchClientSecret: STITCH_CLIENT_SECRET, // Use actual Stitch client secret
    town: "Testville",
    postalCode: "12345",
    streetName: "Test Street",
    streetNumber: "1",
  });

  if (storeRes.statusCode !== 201) {
    console.error(
      "❌ Failed to create store:",
      storeRes.body,
      storeRes.statusCode,
    );
    throw new Error(
      `Store creation failed with status ${storeRes.statusCode}: ${JSON.stringify(storeRes.body)}`,
    );
  }

  storeId = storeRes.body.id;
  console.log(`✅ Created store with ID: ${storeId}`);
});

afterAll(async () => {
  const delRes = await request(app).delete(`/stores/clerk/${clerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`🧹 Successfully deleted store with ID}`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }
});

describe("Payment Routes (Live Integration)", () => {
  // Test 1: Missing required fields (covers initial validation in `paymentsRoute`)
  test("POST /stitch/payment-link - should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/stitch/payment-link").send({
      storeId,
      amount: 100, // orderId is missing
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe(
      "Missing required fields: storeId, amount, and orderId are required.",
    );
  });

  // Test 2: Store not found (covers DB lookup failure)
  test("POST /stitch/payment-link - should return 404 if store does not exist", async () => {
    const nonExistentStoreId = uuidv4(); // A valid UUID, but not in DB

    const res = await request(app).post("/stitch/payment-link").send({
      storeId: nonExistentStoreId,
      amount: 150,
      orderId: uuidv4(),
      payerName: "Jane Doe",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Store not found");
  });

  // Test 3: Successful payment link creation (Happy Path)
  test("POST /stitch/payment-link - should successfully create a payment link", async () => {
    const orderId = uuidv4();
    const amount = 1000; // Smallest possible amount for live tests, typically in cents

    const res = await request(app).post("/stitch/payment-link").send({
      storeId,
      amount: amount,
      orderId: orderId,
      payerName: "Test Payer",
      deliveryFee: 0, // Test with optional fields
    });

    // You MUST ensure your STITCH_CLIENT_KEY and STITCH_CLIENT_SECRET are valid
    // and allow token generation and payment link creation for this to pass.
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("redirectUrl");
    expect(typeof res.body.redirectUrl).toBe("string");
  });

  // Test 4: Handling invalid amount or other Stitch-side validation errors
  // This will only work if Stitch actually returns an error for the given input.
  test("POST /stitch/payment-link - should handle Stitch API validation errors (e.g., invalid amount)", async () => {
    const orderId = uuidv4();
    const invalidAmount = -100; // Stitch will likely reject negative amounts

    const res = await request(app).post("/stitch/payment-link").send({
      storeId,
      amount: invalidAmount,
      orderId: orderId,
      payerName: "Error Payer",
    });

    expect(res.statusCode).toBe(500);
  });
});
