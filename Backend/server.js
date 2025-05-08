const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// MySQL database connection config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mysqlServer#9971',  // your real password
  database: 'BoiToi_DB',
  port: 3306                     // default MySQL port
};

let connection;

// Connect to MySQL
async function connectDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

connectDB();

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await connection.execute('SELECT * FROM USER WHERE USERNAME = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful!' });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
