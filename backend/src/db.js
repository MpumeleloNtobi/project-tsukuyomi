// src/db.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set in .env');
}

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
