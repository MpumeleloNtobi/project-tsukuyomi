const request = require("supertest");
const app = require("../index"); // Import your main app which initializes all routes
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs and testing non-existent ones

// --- Environment Variables ---
// IMPORTANT: These MUST be set in your .env file and loaded by your main app (index.js).
// They should be real, functional credentials for a test database.
const testDbUrl = process.env.DATABASE_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY; // Needed for Clerk API call in POST /stores
const uniqueClerkId = `user_2xa1ce7PKRCHZSDP5x18TDH8cv6`;

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

let createdStoreId; // This will hold the ID of the store we create in the POST test

// Set a longer timeout for integration tests hitting a live database and Clerk API
jest.setTimeout(40000); // 40 seconds, adjust as needed

let setupStoreId; // To manage cleanup from beforeAll

beforeAll(async () => {
  console.log(`🧹 Attempting to delete store with ID`);
  const delRes = await request(app).delete(`/stores/clerk/${uniqueClerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`✅ Successfully deleted store`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }
});

afterAll(async () => {
  // Clean up the store created in the main POST test
  console.log(`🧹 Attempting to delete store with ID`);
  const delRes = await request(app).delete(`/stores/clerk/${uniqueClerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`✅ Successfully deleted store`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }
});

describe("Store Routes", () => {
  // --- GET /stores ---
  test("GET /stores - should return an array of stores", async () => {
    const res = await request(app).get("/stores");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // --- POST /stores (Validation Errors) ---
  test("POST /stores - should return 400 for missing required fields", async () => {
    const incompleteStore = {
      clerkId: "user_incomplete_test",
      storeName: "Incomplete Store",
      // Missing storeDescription, stitchClientKey, stitchClientSecret, town, postalCode, streetName, streetNumber
    };
    const res = await request(app).post("/stores").send(incompleteStore);

    expect(res.statusCode).toBe(400);
    // Be specific about the error message if your backend is (e.g., "There are some missing fields!")
    expect(res.text).toBe("There are some missing fields!");
  });

  test("POST /stores - should return 400 if clerkId or name are not strings", async () => {
    const invalidTypeStore = {
      clerkId: 12345, // Invalid type
      storeName: "Invalid Type Store",
      storeDescription: "Description",
      stitchClientKey: "key",
      stitchClientSecret: "secret",
      town: "Town",
      postalCode: "123",
      streetName: "Street",
      streetNumber: "1",
    };
    const res = await request(app).post("/stores").send(invalidTypeStore);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("clerkId and name must be strings");

    // Test with storeName as non-string
    const invalidStoreName = {
      ...invalidTypeStore,
      clerkId: "user_valid",
      storeName: 123,
    };
    const res2 = await request(app).post("/stores").send(invalidStoreName);
    expect(res2.statusCode).toBe(400);
    expect(res2.text).toBe("clerkId and name must be strings");
  });

  // --- POST /stores (Happy Path) ---
  test("POST /stores - should successfully create a store", async () => {
    // Ensure unique Clerk ID for each test run
    const uniqueStoreName = `Test Store ${Date.now()}`; // Ensure unique store name

    const res = await request(app)
      .post("/stores")
      .send({
        clerkId: uniqueClerkId,
        storeName: uniqueStoreName,
        storeDescription: "Test description for creation",
        stitchClientKey: process.env.STITCH_CLIENT_KEY || "dummy_key", // Use actual or a dummy if testing without stitch
        stitchClientSecret: process.env.STITCH_CLIENT_SECRET || "dummy_secret", // Use actual or a dummy
        town: "Created Town",
        postalCode: "67890",
        streetName: "Created St",
        streetNumber: "789",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(uniqueStoreName);
    expect(res.body.clerkId).toBe(uniqueClerkId);
    expect(res.body.description).toBe("Test description for creation");
    createdStoreId = res.body.id; // Save the ID for later tests
    console.log(
      `✅ Created test store ID for subsequent tests: ${createdStoreId}`,
    );
  });

  // --- GET /stores/:store_id ---
  test("GET /stores/:store_id - should fetch a specific store", async () => {
    // This relies on `createdStoreId` from the previous POST test
    expect(createdStoreId).toBeDefined(); // Ensure it was created

    const res = await request(app).get(`/stores/${createdStoreId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", createdStoreId);
  });

  test("GET /stores/:store_id - should return 404 for a non-existent store", async () => {
    const nonExistentId = uuidv4(); // Valid UUID format, but not in DB
    const res = await request(app).get(`/stores/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Store not found");
  });

  // NOTE: Your `storesRoute` doesn't use `isValidUUID` for `GET /stores/:store_id`,
  // so `GET /stores/not-a-uuid-format` will likely hit the `try-catch` for database error.
  // We'll add a test for that.
  test("GET /stores/:store_id - should return 500 for invalid UUID format due to DB error", async () => {
    // This will cause a database error because `sql` will receive a non-UUID string
    const res = await request(app).get("/stores/invalid-uuid-format");
    expect(res.statusCode).toBe(500); // Expect 500 as per your error handling
    expect(res.text).toBe("Error fetching store"); // Your error message
  });

  // --- PUT /stores/:store_id ---
  test("PUT /stores/:store_id - should update store name and status", async () => {
    expect(createdStoreId).toBeDefined();

    const res = await request(app)
      .put(`/stores/${createdStoreId}`)
      .send({
        name: "Updated Store Name " + Date.now(),
        status: "approved",
        town: "Updated Town", // Add more fields to cover
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdStoreId);
    expect(res.body.status).toBe("approved");
    expect(res.body.town).toBe("Updated Town");
  });

  test("PUT /stores/:store_id - should return 400 for invalid UUID format", async () => {
    const res = await request(app).put("/stores/not-a-uuid-format").send({
      name: "Should Fail",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Invalid store ID format (must be a UUID).",
    );
  });

  test("PUT /stores/:store_id - should return 400 if request body is not an object", async () => {
    expect(createdStoreId).toBeDefined();

    // Test with array
    const resArray = await request(app)
      .put(`/stores/${createdStoreId}`)
      .send(["name", "value"]);
    expect(resArray.statusCode).toBe(400);
    expect(resArray.body).toHaveProperty(
      "error",
      "Request body must be an object.",
    );

    // Test with null
    const resNull = await request(app)
      .put(`/stores/${createdStoreId}`)
      .send(null);
    expect(resNull.statusCode).toBe(400);
    expect(resNull.body).toHaveProperty(
      "error",
      "No fields provided for update.",
    );
  });

  test("PUT /stores/:store_id - should return 400 if no fields are provided for update", async () => {
    expect(createdStoreId).toBeDefined();
    const res = await request(app).put(`/stores/${createdStoreId}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "No fields provided for update.");
  });

  test("PUT /stores/:store_id - should return 404 if store to update does not exist", async () => {
    const nonExistentId = uuidv4();
    const res = await request(app).put(`/stores/${nonExistentId}`).send({
      name: "Non Existent Store",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Store not found.");
  });

  // --- DELETE /stores/:store_id ---
  test("DELETE /stores/:store_id - should delete the store successfully", async () => {
    expect(createdStoreId).toBeDefined();

    const res = await request(app).delete(`/stores/${createdStoreId}`);
    expect(res.statusCode).toBe(204); // No Content for successful deletion

    // Confirm deletion with a follow-up GET (should be 404)
    const followUp = await request(app).get(`/stores/${createdStoreId}`);
    expect(followUp.statusCode).toBe(404);
  });

  test("DELETE /stores/:store_id - should return 404 if store to delete does not exist", async () => {
    const nonExistentId = uuidv4();
    const res = await request(app).delete(`/stores/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Store not found");
  });

  // NOTE: Your `storesRoute` doesn't use `isValidUUID` for `DELETE /stores/:store_id`,
  // so `DELETE /stores/not-a-uuid-format` will likely hit the `try-catch` for database error.
  test("DELETE /stores/:store_id - should return 500 for invalid UUID format due to DB error", async () => {
    const res = await request(app).delete("/stores/invalid-uuid-format");
    expect(res.statusCode).toBe(500); // Expect 500 as per your error handling
    expect(res.body).toHaveProperty("error", "Error deleting store"); // Your error message
  });
});
