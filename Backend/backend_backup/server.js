const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const router = express.Router();

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
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  const sql = 'SELECT * FROM USER WHERE USERNAME = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error (query failed)' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'No such user' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userId = user.ID;

    // Update is_active and last_active
    const updateSql = 'UPDATE USER SET IS_ACTIVE = 1, LAST_ACTIVE = NOW() WHERE ID = ?';
    db.query(updateSql, [userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server error (updating active state)' });
      }

      // Check admin
      const adminSql = 'SELECT * FROM ADMIN WHERE USER_ID = ?';
      db.query(adminSql, [userId], (err, adminResults) => {
        if (err) {
          return res.status(500).json({ message: 'Server error (admin check) ' + err.message });
        }

        const role = adminResults.length > 0 ? 'admin' : 'user';
        console.log(`User ${userId} logged in as ${role}`);
        return res.json({ message: 'Login successful', role, id: userId });
      });
    });
  });
});

// -------------------- Signup Route --------------------
app.post('/api/signup', async (req, res) => {

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    phone,
    gender,
    birthday,
    address: addressObj
  } = req.body;

  const {
    type: address_type,
    address,
    city,
    state,
    country,
    zipCode
  } = addressObj || {};

  // Validate required fields
  if (
    !username || !email || !password ||
    !address_type || !address || !city || !state || !country || !zipCode
  ) {
    console.log('Missing required fields:', {
      username, email, password, address_type, address, city, state, country, zipCode
    });
    return res.status(400).json({ message: 'Missing required user or address fields' });

  }
  try {
    // Check if username or email already exists
    const checkSql = 'SELECT * FROM USER WHERE USERNAME = ? OR EMAIL = ?';
    db.query(checkSql, [username, email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Server error (checking existing user)' });
      }

      if (results.length > 0) {
        console.log('Username or email already exists:', { username, email });
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      // Get new user ID = user count + 1
      const countUserSql = 'SELECT COUNT(*) AS count FROM USER';
      db.query(countUserSql, async (err, countResult) => {
        if (err) {
          return res.status(500).json({ message: 'Server error (counting users)' });
        }
        if (err) {
          console.log('Error counting users:', err.message);
        }
        const id = countResult[0].count + 1;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertUserSql = `
          INSERT INTO USER (
            ID, USERNAME, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, PHONE,
            CREATED_AT, LAST_ACTIVE, IS_ACTIVE, GENDER, BIRTHDAY
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)
        `;

        const userValues = [
          id,
          username,
          email,
          hashedPassword,
          first_name || null,
          last_name || null,
          phone || null,
          0, // is_active initial value
          gender || 'UNSPECIFIED',
          birthday || null
        ];

        db.query(insertUserSql, userValues, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Server error (insert user)', error: err.message });
            console.log('Error inserting user:', err.message);
          }

          // Get new address ID = user_address count + 1
          const countAddressSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS';
          db.query(countAddressSql, (err, addressCountResult) => {
            if (err) {
              return res.status(500).json({ message: 'Server error (counting user_address)' });
            }
            if (err) {
              console.log('Error counting user_address:', err.message);
            }
            const userAddressId = addressCountResult[0].count + 1;

            // Insert address with userAddressId and userId
            const insertAddressSql = `
              INSERT INTO USER_ADDRESS (
                ID, USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const addressValues = [
              userAddressId,
              id,
              address_type,
              address,
              city,
              state,
              country,
              zipCode,
              1 // IS_DEFAULT always 1
            ];

            db.query(insertAddressSql, addressValues, (err) => {
              if (err) {
                return res.status(500).json({ message: 'Server error (insert address)', error: err.message });
              }
              if (err) {
                console.log('Error inserting address:', err.message);
              }
              res.status(201).json({ message: 'Signup successful (user + address inserted)' });
            });
          });
        });
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

    //console.log('Top 5 book IDs:', topBookIds);

    // Step 2: Get book info for top 5 book IDs
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

      //console.log('Top 5 books:', books);
      res.status(200).json(books);
    });
  });
});

app.get('/show_books', (req, res) => {
  console.log('Received request to show top 5 books in each category');
  const query = `
  SELECT 
    c.ID AS category_id, 
    c.NAME AS category_name, 
    c.DESCRIPTION AS category_description, 
    c.PARENT_ID AS category_parent_id,
    b.ID AS book_id,
    b.TITLE,
    b.ISBN,
    b.PUBLISHED_DATE,
    b.PUBLISHER_ID,
    b.PAGE_COUNT,
    b.LANGUAGE,
    b.EDITION,
    b.PRICE,
    b.STOCK_QUANTITY,
    b.DESCRIPTION AS book_description,
    b.SHOW_BOOK,
    b.COVER_URL,
    b.ADDED_AT,
    b.GENRE
  FROM (
    SELECT * 
    FROM category_bestseller 
    WHERE \`RANK\` BETWEEN 1 AND 5
  ) AS bs
  JOIN book b ON bs.BOOK_ID = b.ID
  JOIN category c ON bs.CATEGORY_ID = c.ID
  ORDER BY bs.CATEGORY_ID, bs.\`RANK\`;
`;

  console.log('Executing query to show books:', query);
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const response = {};

    for (const row of results) {
      const catId = row.category_id;
      if (!response[catId]) {
        response[catId] = {
          category: {
            ID: row.category_id,
            NAME: row.category_name ?? null,
            DESCRIPTION: row.category_description ?? null,
            PARENT_ID: row.category_parent_id ?? null
          },
          top_books: []
        };
      }

      response[catId].top_books.push({
        ID: row.book_id,
        TITLE: row.TITLE ?? null,
        ISBN: row.ISBN ?? null,
        PUBLISHED_DATE: row.PUBLISHED_DATE ?? null,
        PUBLISHER_ID: row.PUBLISHER_ID ?? null,
        PAGE_COUNT: row.PAGE_COUNT ?? null,
        LANGUAGE: row.LANGUAGE ?? null,
        EDITION: row.EDITION ?? null,
        PRICE: row.PRICE ?? null,
        STOCK_QUANTITY: row.STOCK_QUANTITY ?? null,
        DESCRIPTION: row.book_description ?? null,
        SHOW_BOOK: row.SHOW_BOOK ?? null,
        COVER_URL: row.COVER_URL ?? null,
        ADDED_AT: row.ADDED_AT ?? null,
        GENRE: row.GENRE ?? null
      });
      console.log(`Added book ${row.TITLE} price ${row.PRICE}`);
    }

    res.json(Object.values(response));
  });
});

router.get('/bestsellers', async (req, res) => {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    const query = `
      SELECT 
        c.ID as category_id,
        c.NAME as category_name,
        c.DESCRIPTION as category_description,
        b.ID as book_id,
        b.TITLE,
        b.PRICE,
        b.COVER_URL,
        b.STOCK_QUANTITY,
        cb.RANK,
        GROUP_CONCAT(a.NAME ORDER BY a.NAME SEPARATOR '|') as authors
      FROM category c
      JOIN category_bestseller cb ON c.ID = cb.CATEGORY_ID
      JOIN book b ON cb.BOOK_ID = b.ID
      JOIN book_author ba ON b.ID = ba.BOOK_ID
      JOIN author a ON ba.AUTHOR_ID = a.ID
      WHERE cb.RANK <= 5 
        AND b.SHOW_BOOK = 1 
        AND b.STOCK_QUANTITY >= 0
      GROUP BY c.ID, c.NAME, c.DESCRIPTION, b.ID, b.TITLE, b.PRICE, b.COVER_URL, b.STOCK_QUANTITY, cb.RANK
      ORDER BY c.NAME, cb.RANK;
    `;

    const [rows] = await connection.execute(query);

    // Group books by category
    const categoriesMap = new Map();

    rows.forEach(row => {
      const categoryId = row.category_id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: row.category_name,
          description: row.category_description,
          books: []
        });
      }

      const category = categoriesMap.get(categoryId);
      category.books.push({
        id: row.book_id,
        title: row.TITLE,
        authors: row.authors ? row.authors.split('|') : [],
        price: parseFloat(row.PRICE),
        cover_url: row.COVER_URL,
        stock_quantity: row.STOCK_QUANTITY,
        rank: row.RANK
      });
    });

    const result = Array.from(categoriesMap.values());

    res.json(result);

  } catch (error) {
    console.error('Error fetching bestseller books:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch bestseller books'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is connected!' });
});

// server.js
app.get('/health', (_, res) => res.send('OK'));


// -------------------- Start Server --------------------
const PORT = 3001;
const HOST = '0.0.0.0';  // listen from any IP

app.listen(PORT, HOST, () => {
  console.log(` Server running on http://${HOST}:${PORT}`);
});