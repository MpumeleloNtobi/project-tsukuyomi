const request = require("supertest");
const app = require("../index");

const testDbUrl = process.env.DATABASE_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY; // Needed for Clerk API call in POST /stores
const uniqueClerkId = `user_2wfhZJCGa7VWqwPlxtHNkYFPLwh`;

// Basic validation for essential environment variables
if (!testDbUrl || !CLERK_SECRET_KEY) {
  console.error(
    "❌ ERROR: Missing required environment variables for stores tests.",
  );
  console.error(
    "Ensure DATABASE_URL and CLERK_SECRET_KEY are set in your .env",
  );
  throw new Error("Missing environment variables for stores tests."); // Fail early if not configured
}

let storeId;
let orderId;

beforeAll(async () => {
  // Initialize routes
  // Create a store to associate with the order
  console.log(`🧹 Attempting to delete store with ID`);
  const delRes = await request(app).delete(`/stores/clerk/${uniqueClerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`✅ Successfully deleted store`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }

  const storeRes = await request(app).post("/stores").send({
    clerkId: uniqueClerkId,
    storeName: "Order Test Store",
    storeDescription: "Store for testing orders",
    stitchClientKey: "test_key",
    stitchClientSecret: "test_secret",
    town: "Test Town",
    postalCode: "12345",
    streetName: "Main Street",
    streetNumber: "99",
  });

  if (storeRes.statusCode !== 201) {
    console.error("Failed to create store:", storeRes.body);
    throw new Error("Could not create test store");
  }

  storeId = storeRes.body.id;
});

afterAll(async () => {
  console.log(`🧹 Attempting to delete store with ID`);
  const delRes = await request(app).delete(`/stores/clerk/${uniqueClerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`✅ Successfully deleted store`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }
});

describe("Order Routes", () => {
  test("POST /orders - should create an order", async () => {
    const res = await request(app).post("/orders").send({
      storeId,
      buyerName: "John Doe",
      phoneNumber: "123456789",
      deliveryMethod: "pickup",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.storeId).toBe(storeId);
    expect(res.body.deliveryMethod).toBe("pickup");
    orderId = res.body.order_id;
  });

  test("GET /orders/:order_id - should fetch the order", async () => {
    const res = await request(app).get(`/orders/id/${orderId}`);
    expect(res.statusCode).toBe(200);
  });

  test("PUT /orders/:order_id - should update the order details", async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({
      status: "confirmed",
      paymentStatus: "paid",
      city: "New City",
      town: "New Town",
      buyerName: "Jane Doe",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("confirmed");
    expect(res.body.paymentStatus).toBe("paid");
    expect(res.body.city).toBe("New City");
    expect(res.body.buyerName).toBe("Jane Doe");
  });

  test("GET /orders/:order_id - should return 400 on invalid UUID", async () => {
    const res = await request(app).get("/orders/not-a-uuid");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("PUT /orders/:order_id - should return 500 on no valid fields", async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({});
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  test("GET /orders/:order_id - should return 200 after store deletion (if cascade works)", async () => {
    // Simulate what would happen if store deletion cascades
    await request(app).delete(`/stores/${storeId}`);

    const res = await request(app).get(`/orders/id/${orderId}`);
    // Depending on cascade setup, this may be 404 or 200 with orphaned order
    expect(res.statusCode).toBe(200);
  });
});
