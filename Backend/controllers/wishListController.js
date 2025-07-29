const db = require('../config/database');

/**
 * Add book to wishlist
 * Creates a new wishlist entry for a user
 */
const addToWishlist = (req, res) => {
  console.log('Adding book to wishlist');
  
  // Get data from request body
  const { userId, bookId, added_at } = req.body;
  
  // Validate required fields
  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Book ID are required'
    });
  }

  // First, get the current count of rows to generate new ID
  const countQuery = 'SELECT COUNT(*) as total FROM wishlist';
  
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error counting wishlist rows:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while counting wishlist entries',
        error: err.message
      });
    }

    // Generate new ID: current total + 1
    const newId = countResult[0].total + 1;
    
    // Check if this book is already in user's wishlist
    const checkQuery = 'SELECT * FROM wishlist WHERE USER_ID = ? AND BOOK_ID = ?';
    
    db.query(checkQuery, [userId, bookId], (err, existingResults) => {
      if (err) {
        console.error('Error checking existing wishlist:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error while checking wishlist',
          error: err.message
        });
      }

      // If book already exists in wishlist
      if (existingResults.length > 0) {
        console.log('Book already in wishlist');
        return res.status(409).json({
          success: false,
          message: 'Book is already in your wishlist'
        });
      }

      // Insert new wishlist entry
      const insertQuery = `
        INSERT INTO wishlist (ID, USER_ID, BOOK_ID, ADDED_AT) 
        VALUES (?, ?, ?, ?)
      `;
      
      const addedAt = added_at || new Date().toISOString();
      
      db.query(insertQuery, [newId, userId, bookId, addedAt], (err, result) => {
        if (err) {
          console.error('Error adding to wishlist:', err);
          return res.status(500).json({
            success: false,
            message: 'Internal server error while adding to wishlist',
            error: err.message
          });
        }

        res.status(201).json({
          success: true,
          message: 'Book added to wishlist successfully',
          data: {
            id: newId,
            userId: userId,
            bookId: bookId,
            addedAt: addedAt
          }
        });
      });
    });
  });
};

/**
 * Get user's wishlist
 * Returns all books in user's wishlist
 */
const getUserWishlist = (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching wishlist for user ID: ${userId}`);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided'
    });
  }

  const query = `
    SELECT 
      w.ID,
      w.USER_ID,
      w.BOOK_ID,
      w.ADDED_AT,
      b.TITLE,
      b.DESCRIPTION,
      b.PRICE,
      b.COVER_URL,
      b.PUBLISHER_ID
    FROM wishlist w
    INNER JOIN book b ON w.BOOK_ID = b.ID
    WHERE w.USER_ID = ?
    ORDER BY w.ADDED_AT DESC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching wishlist:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching wishlist',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: results,
      count: results.length
    });
  });
};

/**
 * Remove book from wishlist
 * Deletes a book from user's wishlist
 */
const removeFromWishlist = (req, res) => {
  const { userId, bookId } = req.body;
  console.log(`Removing book ${bookId} from user ${userId} wishlist`);

  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Book ID are required'
    });
  }

  const deleteQuery = 'DELETE FROM wishlist WHERE USER_ID = ? AND BOOK_ID = ?';

  db.query(deleteQuery, [userId, bookId], (err, result) => {
    if (err) {
      console.error('Error removing from wishlist:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while removing from wishlist',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in wishlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book removed from wishlist successfully'
    });
  });
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist
};