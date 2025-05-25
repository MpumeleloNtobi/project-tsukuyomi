const request = require("supertest");
const app = require("../index");

describe("GET /", () => {
  test("should return status UP", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: "UP" });
  });
});
