const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

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

app.get("/", async (_, res) => {
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

// LAST STEP: Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export app for testing purposes
module.exports = app;
