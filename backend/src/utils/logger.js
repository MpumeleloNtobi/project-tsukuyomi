// src/utils/logger.js
const winston = require("winston");

// Simple log format for readability
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Create a basic logger
const logger = winston.createLogger({
    level: "info", // Default log level is 'info'
    format: logFormat,
    transports: [
        new winston.transports.Console({ format: logFormat }), // Logs to console
        new winston.transports.File({ filename: "logs/app.log" }), // Logs to file
    ],
});

module.exports = logger;
