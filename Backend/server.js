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
  password: 'mysql', // change if needed
  database: 'BoiToi_DB',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error(' Database connection failed:', err);
  } else {
    console.log(' Connected to MySQL');
  }
});

// -------------------- Login Route --------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM USER WHERE USERNAME = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error (query failed)' });
    console.log('Login query executed:', sql, 'with username:', username);
    // Step 1: USER not found
    if (results.length === 0) {
      return res.status(401).json({ message: 'No such user' });
    }

    const user = results[0];

    // Step 2: Password check
    const match = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userId = user.ID;
    // Step 3: Check if user is in ADMIN table
    const adminSql = 'SELECT * FROM ADMIN WHERE USER_ID = ?';
    db.query(adminSql, [userId], (err, adminResults) => {
      if (err) return res.status(500).json({ message: 'Server error (admin check) '+err.message });

      if (adminResults.length > 0) {
        return res.json({ message: 'Login successful', role: 'admin', id: userId });
      } else {
        return res.json({ message: 'Login successful', role: 'user', id: userId });
      }
    });
  });
});


// -------------------- Signup Route --------------------
app.post('/signup', async (req, res) => {
  const {
    id,
    username,
    email,
    password,
    first_name,
    last_name,
    phone,
    created_at,
    last_active,
    is_active,
    gender,
    birthday
  } = req.body;
  console.log('Signup request received:', req.body);
  // Basic validation
  if (!id || !username || !email || !password) {
    return res.status(400).json({ message: 'Required fields are missing (id, username, email, password)' });
  }

  try {
    // Check for existing username/email
    const checkSql = 'SELECT * FROM USER WHERE USERNAME = ? OR EMAIL = ?';
    db.query(checkSql, [username, email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error (checking existing user)' });

      if (results.length > 0) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertSql = `
        INSERT INTO USER (
          ID, USERNAME, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, PHONE,
          CREATED_AT, LAST_ACTIVE, IS_ACTIVE, GENDER, BIRTHDAY
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id,
        username,
        email,
        hashedPassword,
        first_name || null,
        last_name || null,
        phone || null,
        created_at || null,
        last_active || null,
        is_active !== undefined ? is_active : 0,
        gender || 'UNSPECIFIED',
        birthday || null
      ];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Server error (insert failed)', error: err.message });
        }

        res.status(201).json({ message: 'Signup successful' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error (try/catch block)', error: err.message });
  }
});
//--------home route to get top 5 books based on average rating--------
app.post('/home', (req, res) => {
  // Step 1: Get top 5 books based on average rating
  const avgQuery = `
    SELECT BOOK_ID, AVG(Rating) AS avg_rating
    FROM review
    GROUP BY BOOK_ID
    ORDER BY avg_rating DESC
    LIMIT 5;
  `;
  console.log('Executing avg rating query:', avgQuery);
  db.query(avgQuery, (err, topBooks) => {
    if (err) {
      console.error('Error in avg rating query:', err);
      return res.status(500).json({ error: 'Database error while getting top books' });
    }

    const topBookIds = topBooks.map(book => book.BOOK_ID);
    if (topBookIds.length === 0) {
      return res.status(200).json([]); // No reviews
    }
    console.log('Top 5 book IDs:', topBookIds);
    // Step 2: Get book
    //  info for top 5 book IDs
    const placeholders = topBookIds.map(() => '?').join(', ');
    const bookQuery = `
      SELECT id, title, isbn, published_date, publisher_id,
             page_count, language, edition, price,
             stock_quantity, description, cover_url,
             added_at, genre
      FROM book
      WHERE id IN (${placeholders});
    `;

    db.query(bookQuery, topBookIds, (err, books) => {
      if (err) {
        console.error('Error in book info query:', err);
        return res.status(500).json({ error: 'Database error while getting book details' });
      }

      console.log('Top 5 books:', books);
      res.status(200).json(books);
    });
  });
});

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is connected!' });
});
// -------------------- Start Server --------------------
const PORT = 3001;
const HOST = '0.0.0.0';  // listen from any IP

app.listen(PORT, HOST, () => {
  console.log(` Server running on http://${HOST}:${PORT}`);
});
