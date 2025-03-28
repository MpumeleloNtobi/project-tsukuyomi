// src/routes/healthRoutes.js
const express = require("express");
const logger = require("../utils/logger"); // Import the logger
const router = express.Router();

router.get("/", (req, res) => {
    // Log the health check request
    logger.info("Health check requested");

    // Respond with status and timestamp
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
