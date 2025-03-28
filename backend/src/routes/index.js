// src/routes/index.js
const express = require("express");
const router = express.Router();
const healthRoutes = require("./healthRoutes");

router.use("/health", healthRoutes); // Health check route

module.exports = router;
