const { neon, sql: neonSqlHelper } = require("@neondatabase/serverless");
const { config } = require("dotenv");

config();

const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  // Initialize neon sql function for each request (common pattern for serverless)
  return neon(process.env.DATABASE_URL);
};

module.exports = { getDb };
