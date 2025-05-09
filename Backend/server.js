const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql', // use your actual password
  database: 'BoiToi_DB',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM USER WHERE USERNAME = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.PASSWORD_HASH);

    if (match) {
      res.json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Start the server
const PORT = 3001;
const HOST = '0.0.0.0';  // This allows connections from any IP

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
