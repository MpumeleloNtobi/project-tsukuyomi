const request = require("supertest");
const express = require("express");

// Create a minimal Express app for testing purposes
const app = express();

// Define the health check route as provided by the user
app.get("/api/health", async (_, res) => {
  res.json({ status: "UP" });
});

// Describe the test suite for the health check endpoint
describe("GET /api/health", () => {
  // Define a test case for the health check endpoint
  it("should return 200 OK and status UP", async () => {
    // Use supertest to make a GET request to the /api/health endpoint
    const response = await request(app).get("/api/health");

    // Assert that the response status code is 200
    expect(response.statusCode).toBe(200);

    // Assert that the response body is the expected JSON object
    expect(response.body).toEqual({ status: "UP" });
  });
});
