// src/server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Start Server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
