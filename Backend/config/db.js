// backend/config/db.js
require('dotenv').config();                 // ONE call, done early
const mysql = require('mysql2/promise');    // promise pool

const pool = mysql.createPool({
  host               : process.env.DB_HOST     || 'localhost',
  user               : process.env.DB_USER     || 'root',
  password           : process.env.DB_PASSWORD || 'mysql',
  database           : process.env.DB_NAME     || 'BoiToi_DB',
  port               : Number(process.env.DB_PORT) || 3306,
  waitForConnections : true,
  connectionLimit    : Number(process.env.DB_CONNECTION_LIMIT) || 10,
  connectTimeout     : Number(process.env.DB_CONNECT_TIMEOUT)  || 10000,
  charset            : 'utf8mb4',
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL pool is ready');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
})();

module.exports = { pool };
