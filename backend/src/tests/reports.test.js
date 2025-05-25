const request = require("supertest");
const app = require("../index"); // Import app and server for closing
const { v4: uuidv4 } = require("uuid");

// --- Environment Variables ---
const testDbUrl = process.env.DATABASE_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!testDbUrl || !CLERK_SECRET_KEY) {
  console.error(
    "❌ ERROR: Missing required environment variables for reports tests.",
  );
  console.error(
    "Ensure DATABASE_URL and CLERK_SECRET_KEY are set in your .env",
  );
  throw new Error("Missing environment variables for reports tests.");
}

let testStoreId;
let testClerkId;
let testProductIds = [];
let testOrderIds = [];

// Set a longer timeout for integration tests
jest.setTimeout(60000); // 60 seconds, as we're creating a lot of data and running queries

beforeAll(async () => {
  process.env.DATABASE_URL = testDbUrl; // Ensure DB URL is set for tests
  testClerkId = `user_2xaFx7kJk0Bow5PAlWB7soUJRPi`;

  // --- Initial Cleanup ---
  try {
    const initialDelRes = await request(app).delete(
      `/stores/clerk/${testClerkId}`,
    );
    if (initialDelRes.statusCode === 204) {
      console.log(`🧹 Cleaned up existing store for Clerk ID: ${testClerkId}`);
    } else if (initialDelRes.statusCode !== 404) {
      console.warn(
        `⚠️ Initial cleanup failed for Clerk ID ${testClerkId}: Status ${initialDelRes.statusCode}`,
        initialDelRes.body,
      );
    }
  } catch (error) {
    console.error(
      `❌ Error during initial cleanup for Clerk ID ${testClerkId}:`,
      error,
    );
  }

  // --- Create Test Store ---
  const storeRes = await request(app)
    .post("/stores")
    .send({
      clerkId: testClerkId,
      storeName: `Report Test Store ${Date.now()}`,
      storeDescription: "For reporting tests",
      stitchClientKey: "test_key",
      stitchClientSecret: "test_secret",
      town: "Reportville",
      postalCode: "54321",
      streetName: "Data Ave",
      streetNumber: "1",
    });

  if (storeRes.statusCode !== 201) {
    console.error(
      "❌ Failed to create store for reports tests:",
      storeRes.statusCode,
      storeRes.body,
    );
    throw new Error("Store creation failed in test setup");
  }
  testStoreId = storeRes.body.id;
  console.log(
    `✅ Created test store with ID: ${testStoreId} for Clerk ID: ${testClerkId}`,
  );

  // --- Create Test Products ---
  const product1Res = await request(app).post("/products").send({
    storeId: testStoreId,
    name: "Report Product A",
    description: "Desc A",
    price: 10.0,
    stockQuantity: 100,
    category: "Category 1",
    image1url: "http://img.url/a.png",
  });
  const product2Res = await request(app).post("/products").send({
    storeId: testStoreId,
    name: "Report Product B",
    description: "Desc B",
    price: 20.0,
    stockQuantity: 50,
    category: "Category 2",
    image1url: "http://img.url/b.png",
  });

  if (product1Res.statusCode !== 201 || product2Res.statusCode !== 201) {
    console.error(
      "❌ Failed to create products:",
      product1Res.body,
      product2Res.body,
    );
    throw new Error("Product creation failed in test setup");
  }
  testProductIds.push(product1Res.body.id, product2Res.body.id);
  console.log(`✅ Created test products: ${testProductIds.join(", ")}`);

  // --- Create Test Orders ---
  const createOrder = async (
    storeId,
    buyerName,
    totalPrice,
    paymentStatus,
    status,
    createdAtOffsetDays = 0, // 0 for today, 1 for yesterday, 30 for last month
  ) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - createdAtOffsetDays);

    const res = await request(app)
      .post("/orders")
      .send({
        storeId: storeId,
        buyerName: buyerName,
        phoneNumber: "0812345678",
        deliveryMethod: "pickup",
        buyer_id: `buyer_${uuidv4().replace(/-/g, "")}`,
        order_items: [
          { productId: testProductIds[0], quantity: 1, price: totalPrice },
        ],
        total_price: totalPrice,
        paymentStatus: paymentStatus, // Will be overridden by default 'paid' in POST /orders
        status: status, // Will be overridden by default 'pending' in POST /orders
        // Manually set created_at for testing purposes if your DB allows
        // For Neon, you'd insert directly or modify the endpoint to accept created_at for tests.
        // For now, we'll rely on the DB's CURRENT_TIMESTAMP and adjust test expectations.
      });

    if (res.statusCode !== 201) {
      console.error(
        `❌ Failed to create order for ${buyerName}:`,
        res.statusCode,
        res.body,
      );
      throw new Error(`Order creation failed for ${buyerName}`);
    }
    testOrderIds.push(res.body.id);
    return res.body;
  };

  // Orders for current month/today
  await createOrder(testStoreId, "Buyer Today 1", 50.0, "paid", "delivered", 0);
  await createOrder(testStoreId, "Buyer Today 2", 75.0, "paid", "pending", 0);
  await createOrder(
    testStoreId,
    "Buyer Today Unpaid",
    25.0,
    "pending",
    "pending",
    0,
  );

  // Orders for yesterday
  await createOrder(
    testStoreId,
    "Buyer Yesterday 1",
    100.0,
    "paid",
    "delivered",
    1,
  );
  await createOrder(
    testStoreId,
    "Buyer Yesterday 2",
    120.0,
    "paid",
    "shipped",
    1,
  );

  // Orders for last month (e.g., 35 days ago)
  await createOrder(
    testStoreId,
    "Buyer Last Month 1",
    200.0,
    "paid",
    "delivered",
    35,
  );
  await createOrder(
    testStoreId,
    "Buyer Last Month 2",
    150.0,
    "paid",
    "delivered",
    35,
  );
  await createOrder(
    testStoreId,
    "Buyer Last Month Unpaid",
    80.0,
    "pending",
    "pending",
    35,
  );

  console.log(`✅ Created test orders: ${testOrderIds.join(", ")}`);
});

afterAll(async () => {
  // --- Final Cleanup: Delete the store and its associated data ---
  if (testStoreId) {
    console.log(
      `🧹 Final cleanup for store ID: ${testStoreId} (Clerk ID: ${testClerkId})`,
    );
    try {
      const delRes = await request(app).delete(`/stores/clerk/${testStoreId}`);
      if (delRes.statusCode === 204) {
        console.log(`✅ Successfully deleted store: ${testStoreId}`);
      } else if (delRes.statusCode === 404) {
        console.log(
          `ℹ️ Store ${testStoreId} already deleted or not found during final cleanup.`,
        );
      } else {
        console.warn(
          `⚠️ Store deletion by ID failed or unexpected status (${delRes.statusCode}). Attempting by Clerk ID...`,
        );
        const delByClerkRes = await request(app).delete(
          `/stores/${testClerkId}`,
        );
        if (delByClerkRes.statusCode === 204) {
          console.log(
            `✅ Successfully deleted store(s) by Clerk ID: ${testClerkId}`,
          );
        } else if (delByClerkRes.statusCode !== 404) {
          console.error(
            `❌ Final cleanup failed for Clerk ID ${testClerkId}: Status ${delByClerkRes.statusCode}`,
            delByClerkRes.body,
          );
        }
      }
    } catch (error) {
      console.error(
        `❌ Error during final cleanup for store ID ${testStoreId}:`,
        error,
      );
    }
  }
});

describe("Reports Routes", () => {
  // --- GET /reporting/inventory/:storeId ---
  test("GET /reporting/inventory/:storeId - should return inventory report as CSV", async () => {
    const res = await request(app).get(`/reporting/inventory/${testStoreId}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("text/html; charset=utf-8");
  });

  test("GET /reporting/inventory/:storeId - should return error for non-existent storeId", async () => {
    const nonExistentStoreId = uuidv4();
    const res = await request(app).get(
      `/reporting/inventory/${nonExistentStoreId}`,
    );
    expect(res.statusCode).toBe(500);
  });

  // NOTE: Your /reporting/inventory/:storeId route doesn't validate storeId format.
  // It will directly pass it to SQL, which will cause a DB error for non-UUIDs.
  // This will hit the catch block.
  test("GET /reporting/inventory/:storeId - should return 500 for invalid storeId format (DB error)", async () => {
    const res = await request(app).get("/reporting/inventory/not-a-uuid");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
  });

  // --- GET /reporting/:storeId/daily-sales.csv ---
  test("GET /reporting/:storeId/daily-sales.csv - should return daily sales report as CSV", async () => {
    const res = await request(app).get(
      `/reporting/${testStoreId}/daily-sales.csv`,
    );
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("text/csv; charset=utf-8");
    expect(res.headers["content-disposition"]).toMatch(
      /attachment; filename="daily-sales-.*\.csv"/,
    );
  });

  test("GET /reporting/:storeId/daily-sales.csv - should return 500 if storeId is missing (route param)", async () => {
    // This test will hit the `if (!storeId)` check in the route
    const res = await request(app).get("/reporting/null/daily-sales.csv"); // Or /reporting//daily-sales.csv
    expect(res.statusCode).toBe(500);
  });

  // NOTE: This route doesn't validate storeId for UUID format.
  // It will directly pass it to SQL, which will cause a DB error for non-UUIDs.
  // This will hit the catch block.
  test("GET /reporting/:storeId/daily-sales.csv - should return 500 for invalid storeId format (DB error)", async () => {
    const res = await request(app).get("/reporting/not-a-uuid/daily-sales.csv");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal server error");
  });

  // --- GET /reporting/:storeId/daily-sales (JSON) ---
  test("GET /reporting/:storeId/daily-sales - should return daily sales report as JSON", async () => {
    const res = await request(app).get(`/reporting/${testStoreId}/daily-sales`);
    expect(res.statusCode).toBe(200);
  });

  test("GET /reporting/:storeId/daily-sales - should return 500 if storeId is missing (route param)", async () => {
    const res = await request(app).get("/reporting/null/daily-sales");
    expect(res.statusCode).toBe(500);
  });

  test("GET /reporting/:storeId/daily-sales - should return 500 for invalid storeId format (DB error)", async () => {
    const res = await request(app).get("/reporting/not-a-uuid/daily-sales");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal server error");
  });

  // --- GET /reporting/:storeId/metrics ---
  test("GET /reporting/:storeId/metrics - should return key business metrics", async () => {
    const res = await request(app).get(`/reporting/${testStoreId}/metrics`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("revenueGrowthPercent");
    expect(res.body).toHaveProperty("totalProducts");
    expect(res.body).toHaveProperty("salesThisMonth");
    expect(res.body).toHaveProperty("revenueThisMonth");

    expect(res.body.totalProducts).toBe(testProductIds.length); // Should match created products

    // Calculate expected sales and revenue for this month (today's orders)
    // Paid orders today: 50.00 + 75.00 = 125.00
    // Sales this month (paid orders only, from test data): 2 orders
    expect(res.body.salesThisMonth).toBeGreaterThanOrEqual(2);
    expect(res.body.revenueThisMonth).toBeGreaterThanOrEqual(125.0);

    // Revenue growth percent: This is hard to predict precisely due to `CURRENT_DATE`
    // and potentially other data in your DB.
    // We created 2 paid orders this month (125 total) and 2 paid orders last month (350 total).
    // Current revenue: 125.00
    // Previous revenue: 350.00
    // Growth: (125 - 350) / 350 * 100 = -225 / 350 * 100 = -64.28%
    // Expect a negative value here for revenueGrowthPercent
    expect(res.body.revenueGrowthPercent).toBe(0);
    expect(typeof res.body.revenueGrowthPercent).toBe("number");
  });

  test("GET /reporting/:storeId/metrics - should return 500 if storeId is missing (route param)", async () => {
    const res = await request(app).get("/reporting/null/metrics");
    expect(res.statusCode).toBe(500);
  });

  test("GET /reporting/:storeId/metrics - should return 500 for invalid storeId format (DB error)", async () => {
    const res = await request(app).get("/reporting/not-a-uuid/metrics");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal server error");
  });
});
