const request = require("supertest");
const app = require("../index");
const { v4: uuidv4 } = require("uuid");

const testDbUrl = process.env.DATABASE_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY; // Needed for Clerk API call in POST /stores

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
let productId;
const uniqueClerkId = "user_2wff1xBHeuz3rY4DnIhg4R8qfNe";

beforeAll(async () => {
  console.log(`🧹 Attempting to delete store with ID`);
  const delRes = await request(app).delete(`/stores/clerk/${uniqueClerkId}`);
  if (delRes.statusCode === 204) {
    console.log(`✅ Successfully deleted store`);
  } else {
    console.error(`❌ Failed to delete store`, delRes.statusCode, delRes.body);
  }
  const storeRes = await request(app).post("/stores").send({
    clerkId: "user_2wff1xBHeuz3rY4DnIhg4R8qfNe",
    storeName: "Product Store",
    storeDescription: "For product tests",
    stitchClientKey: "test_key",
    stitchClientSecret: "test_secret",
    town: "Townsville",
    postalCode: "12345",
    streetName: "Main",
    streetNumber: "42",
  });

  if (storeRes.statusCode !== 201) {
    console.error(
      "Failed to create store:",
      storeRes.statusCode,
      storeRes.body,
    );
    throw new Error("Store creation failed in test setup");
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

describe("Product Routes", () => {
  test("POST /products - should create a product", async () => {
    const res = await request(app).post("/products").send({
      storeId,
      name: "Test Product",
      description: "A good product",
      price: 9.99,
      stockQuantity: 100,
      category: "Test",
      image1url: "http://image.url/product1.png",
      image2url: "http://image.url/product2.png",
      image3url: "http://image.url/product3.png",
    });

    if (res.statusCode !== 201) {
      console.error("Create Product Error:", res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    productId = res.body.id;
  });

  test("GET /products/:id - should return the created product", async () => {
    const res = await request(app).get(`/products/${productId}`);

    if (res.statusCode !== 200) {
      console.error("Fetch Product Error:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  test("PUT /products/:id - should update product name and stock", async () => {
    const res = await request(app).put(`/products/${productId}`).send({
      name: "Updated Product",
      stockQuantity: 50,
    });

    if (res.statusCode !== 200) {
      console.error("Update Product Error:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Product");
    expect(res.body.stockQuantity).toBe(50);
  });

  test("DELETE /products/:id - should delete the product", async () => {
    const res = await request(app).delete(`/products/${productId}`);

    expect(res.statusCode).toBe(204);
  });

  test("GET /products/:id - should return 404 after deletion", async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
