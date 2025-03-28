// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes"); // Import index.js inside the routes folder

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logger

// Routes
app.use("/api", routes); // Base route for APIs

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
