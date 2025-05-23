const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");
const { Clerk } = require("@clerk/backend");
const { clerkMiddleware, getAuth } = require("@clerk/express");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER = process.env.AZURE_CONTAINER;

const { imagesRoute } = require("./images");
const { ordersRoute } = require("./orders");
const { paymentsRoute } = require("./payments");
const { productsRoute } = require("./products");
const { storesRoute } = require("./stores");
const { reportsRoute } = require("./reports");

const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

app.get("/", async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.get("/health", async (_, res) => {
  res.json({ status: "UP" });
});

// LAST STEP: Start the server
imagesRoute(
  app,
  DATABASE_URL,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_CONTAINER,
);
ordersRoute(app, DATABASE_URL);
paymentsRoute(app, DATABASE_URL);
productsRoute(app, DATABASE_URL);
reportsRoute(app, DATABASE_URL);
storesRoute(app, DATABASE_URL);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
