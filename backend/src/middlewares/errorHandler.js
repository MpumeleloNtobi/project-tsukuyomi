// src/middlewares/errorHandler.js
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    // Log error details (simple, readable format)
    logger.error(`[${req.method}] ${req.url} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
    });
};
