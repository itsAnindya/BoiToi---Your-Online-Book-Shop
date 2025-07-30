const bcrypt = require('bcrypt');
const db = require('../config/database');

/**
 * Publisher Login Controller
 * Handles publisher authentication
 */
const publisherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Publisher name and password are required' });
    }

    console.log('Publisher login attempt:', { publisherName: username });

    // Query publisher by name
    const sql = 'SELECT * FROM PUBLISHER WHERE NAME = ? AND STATUS = "ACTIVE"';
    
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Database error during publisher login:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'No such publisher or account is inactive' });
      }

      const publisher = results[0];
      
      // Check if publisher has password hash (required for login)
      if (!publisher.PASSWORD_HASH) {
        return res.status(401).json({ message: 'Publisher account not configured for login. Please contact administrator.' });
      }
      
      // Verify password
      const match = await bcrypt.compare(password, publisher.PASSWORD_HASH);
      if (!match) {
        return res.status(401).json({ message: 'Invalid publisher name or password' });
      }

      console.log(`Publisher ${publisher.ID} logged in successfully`);
      
      return res.json({ 
        message: 'Login successful', 
        role: 'publisher',
        id: publisher.ID,
        name: publisher.NAME,
        email: publisher.EMAIL,
        username: publisher.NAME // Use name as username
      });
    });
  } catch (error) {
    console.error('Publisher login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get Publisher Profile
 */
const getPublisherProfile = async (req, res) => {
  try {
    const publisherId = req.params.id;
    
    const sql = `
      SELECT ID, NAME, EMAIL, PHONE, WEBSITE, ADDRESS, CITY, STATE, COUNTRY, STATUS, CREATED_AT
      FROM PUBLISHER 
      WHERE ID = ? AND STATUS = "ACTIVE"
    `;
    
    db.query(sql, [publisherId], (err, results) => {
      if (err) {
        console.error('Database error fetching publisher profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Publisher not found' });
      }

      return res.json(results[0]);
    });
  } catch (error) {
    console.error('Get publisher profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Submit Book Contribution Request
 */
const submitBookRequest = async (req, res) => {
  try {
    const publisherId = req.params.id;
    const {
      title,
      isbn,
      published_date,
      page_count,
      language,
      edition,
      price,
      stock_quantity,
      description,
      cover_url,
      genre,
      authors,
      categories
    } = req.body;

    // Input validation
    if (!title || !isbn || !price || !stock_quantity || !genre) {
      return res.status(400).json({ message: 'Title, ISBN, genre, price, and stock quantity are required' });
    }

    // Validate numeric fields
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }

    if (isNaN(stock_quantity) || parseInt(stock_quantity) <= 0) {
      return res.status(400).json({ message: 'Stock quantity must be a valid positive integer' });
    }

    // Start transaction
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Transaction start error' });
      }

      try {
        // Insert publisher request (AUTO_INCREMENT will handle ID)
        const insertRequestSql = `
          INSERT INTO PUBLISHER_REQUEST 
          (PUBLISHER_ID, REQUEST_TYPE, STATUS, SUBMITTED_AT, NOTES)
          VALUES (?, 'ADD_BOOK', 'PENDING', NOW(), ?)
        `;
        
        const notes = `New book contribution request: ${title}`;
        
        db.query(insertRequestSql, [publisherId, notes], (err, requestResult) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error creating request' });
            });
          }

          const requestId = requestResult.insertId; // Get auto-generated request ID

          // Insert book draft (AUTO_INCREMENT will handle ID)
          const insertDraftSql = `
            INSERT INTO PUBLISHER_BOOK_DRAFT 
            (TITLE, ISBN, PUBLISHED_DATE, PAGE_COUNT, LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE, AUTHORS, REQUEST_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
              
          db.query(insertDraftSql, [
            title, isbn, published_date, page_count, language || 'English', 
            edition || '1st', price, stock_quantity, description, 
            cover_url, genre, authors, requestId
          ], (err, draftResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error creating book draft' });
              });
            }

            const draftId = draftResult.insertId; // Get auto-generated draft ID

            // Create notification for all admins
            const notificationSql = `
              INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
              SELECT a.USER_ID, 
                     CONCAT('New book contribution request: "', ?, '" by ', p.NAME), 
                     'SYSTEM', 
                     0, 
                     NOW()
              FROM ADMIN a
              CROSS JOIN PUBLISHER p
              WHERE p.ID = ?
            `;
            
            db.query(notificationSql, [title, publisherId], (err) => {
              if (err) {
                console.error('Error creating notification:', err);
                // Don't rollback for notification error, just log it
              }

              // Commit transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                }

                res.json({ 
                  message: 'Book contribution request submitted successfully',
                  request_id: requestId,
                  draft_id: draftId
                });
              });
            });
          });
        });
      } catch (error) {
        db.rollback(() => {
          console.error('Transaction error:', error);
          res.status(500).json({ message: 'Transaction failed' });
        });
      }
    });
  } catch (error) {
    console.error('Submit book request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get Publisher's Book Requests
 */
const getPublisherRequests = async (req, res) => {
  try {
    const publisherId = req.params.id;
    
    const sql = `
      SELECT 
        pr.ID,
        pr.REQUEST_TYPE,
        pr.STATUS,
        pr.SUBMITTED_AT,
        pr.REVIEWED_AT,
        pr.NOTES,
        pbd.TITLE,
        pbd.ISBN,
        pbd.PUBLISHED_DATE,
        pbd.PRICE,
        pbd.GENRE
      FROM PUBLISHER_REQUEST pr
      LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
      WHERE pr.PUBLISHER_ID = ?
      ORDER BY pr.SUBMITTED_AT DESC
    `;
    
    db.query(sql, [publisherId], (err, results) => {
      if (err) {
        console.error('Database error fetching publisher requests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json(results);
    });
  } catch (error) {
    console.error('Get publisher requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get publisher statistics
const getPublisherStats = async (req, res) => {
  try {
    const { id } = req.params;

    const statsQuery = `
      SELECT 
        COUNT(*) as totalRequests,
        SUM(CASE WHEN STATUS = 'PENDING' THEN 1 ELSE 0 END) as pendingRequests,
        SUM(CASE WHEN STATUS = 'APPROVED' THEN 1 ELSE 0 END) as approvedRequests,
        SUM(CASE WHEN STATUS = 'REJECTED' THEN 1 ELSE 0 END) as rejectedRequests
      FROM publisher_request
      WHERE PUBLISHER_ID = ?
    `;

    db.query(statsQuery, [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error('Error fetching publisher stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all publishers for public display
 * Returns list of all publishers with their ID and name
 */
const getAllPublishers = (req, res) => {
  console.log('Fetching all publishers for public display');

  const query = `
    SELECT 
      ID as PUBLISHER_ID,
      NAME as PUBLISHER_NAME,
      EMAIL
    FROM publisher 
    WHERE STATUS = 'ACTIVE'
    ORDER BY NAME ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching publishers:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching publishers',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Publishers fetched successfully',
      publishers: results,
      count: results.length
    });
  });
};

/**
 * Get publisher by ID with their books for public display
 * Returns publisher details and all books published by them
 */
const getPublisherByIdPublic = (req, res) => {
  const publisherId = req.params.id;
  console.log(`Fetching publisher with ID: ${publisherId} for public display`);

  if (!publisherId || isNaN(publisherId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid publisher ID provided'
    });
  }

  // First get publisher details
  const publisherQuery = `
    SELECT 
      ID as PUBLISHER_ID,
      NAME as PUBLISHER_NAME,
      CASE 
        WHEN ADDRESS IS NULL OR ADDRESS = '' THEN 'Polashi,BUET'
        ELSE ADDRESS
      END as ADDRESS,
      CASE 
        WHEN CITY IS NULL OR CITY = '' THEN 'Dhaka'
        ELSE CITY
      END as CITY,
      CASE 
        WHEN STATE IS NULL OR STATE = '' THEN 'LA'
        ELSE STATE
      END as STATE,
      CASE 
        WHEN COUNTRY IS NULL OR COUNTRY = '' THEN 'USA'
        ELSE COUNTRY
      END as COUNTRY,
      COALESCE(EMAIL, 'NULL') as EMAIL,
      CASE 
        WHEN PHONE IS NULL OR PHONE = '' THEN '01234567891'
        ELSE PHONE
      END as PHONE,
      CASE 
        WHEN WEBSITE IS NULL OR WEBSITE = '' THEN CONCAT(LOWER(REPLACE(NAME, ' ', '')), '.org')
        ELSE WEBSITE
      END as WEBSITE
    FROM publisher 
    WHERE ID = ? AND STATUS = 'ACTIVE'
  `;

  db.query(publisherQuery, [publisherId], (err, publisherResults) => {
    if (err) {
      console.error('Error fetching publisher:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching publisher',
        error: err.message
      });
    }

    if (publisherResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found'
      });
    }

    const publisher = publisherResults[0];

    // Then get books by this publisher
    const booksQuery = `
      SELECT 
        b.ID as BOOK_ID,
        b.TITLE,
        b.COVER_URL,
        GROUP_CONCAT(a.NAME SEPARATOR ' · ') as AUTHORS
      FROM book b
      LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
      LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
      WHERE b.PUBLISHER_ID = ?
      GROUP BY b.ID, b.TITLE, b.COVER_URL
      ORDER BY b.ADDED_AT DESC
    `;

    db.query(booksQuery, [publisherId], (err, bookResults) => {
      if (err) {
        console.error('Error fetching publisher books:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error while fetching publisher books',
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'Publisher details fetched successfully',
        publisher: {
          ...publisher,
          books: bookResults
        },
        bookCount: bookResults.length
      });
    });
  });
};

module.exports = {
  publisherLogin,
  getPublisherProfile,
  submitBookRequest,
  getPublisherRequests,
  getPublisherStats,
  getAllPublishers,
  getPublisherByIdPublic
};
