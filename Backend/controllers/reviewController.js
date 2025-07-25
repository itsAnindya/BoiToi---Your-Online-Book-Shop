const db = require('../config/database');

/**
 * Submit a review (rating + comment) for a book
 * Creates a single review entry in the review table
 */
const submitReview = async (req, res) => {
  try {
    const { bookId, userId, rating, comment } = req.body;

    // Input validation
    if (!bookId || !userId || !rating) {
      return res.status(400).json({ message: 'Book ID, User ID, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has already reviewed this book
    const checkExistingSql = 'SELECT ID FROM review WHERE USER_ID = ? AND BOOK_ID = ?';
    
    db.query(checkExistingSql, [userId, bookId], (err, existingReviews) => {
      if (err) {
        console.error('Database error checking existing review:', err);
        return res.status(500).json({ message: 'Server error checking existing review' });
      }

      if (existingReviews.length > 0) {
        return res.status(400).json({ message: 'You have already reviewed this book. You can update your existing review.' });
      }

      // Check if user has purchased this book (optional feature for IS_VERIFIED_PURCHASER)
      const checkPurchaseSql = `
        SELECT COUNT(*) as purchase_count 
        FROM orders o 
        JOIN order_item oi ON o.ID = oi.ORDER_ID 
        WHERE o.USER_ID = ? AND oi.BOOK_ID = ? AND o.STATUS = 'DELIVERED'
      `;

      db.query(checkPurchaseSql, [userId, bookId], (err, purchaseResults) => {
        if (err) {
          console.error('Database error checking purchase:', err);
          // Continue without verification if purchase check fails
        }

        const isVerifiedPurchaser = purchaseResults && purchaseResults[0] && purchaseResults[0].purchase_count > 0;

        // Insert the review (AUTO_INCREMENT will handle ID)
        const insertReviewSql = `
          INSERT INTO review (USER_ID, BOOK_ID, RATING, COMMENT, POSTED_AT, IS_VERIFIED_PURCHASER)
          VALUES (?, ?, ?, ?, NOW(), ?)
        `;

        const reviewComment = comment && comment.trim() ? comment.trim() : null;

        db.query(insertReviewSql, [userId, bookId, rating, reviewComment, isVerifiedPurchaser], (err, result) => {
          if (err) {
            console.error('Database error inserting review:', err);
            return res.status(500).json({ message: 'Server error creating review' });
          }

          const reviewId = result.insertId;
          console.log('Review created successfully with ID:', reviewId);

          res.status(201).json({
            message: 'Review submitted successfully',
            reviewId,
            isVerifiedPurchaser
          });
        });
      });
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all reviews for a specific book
 */
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const sql = `
      SELECT 
        r.ID,
        r.RATING,
        r.COMMENT,
        r.POSTED_AT,
        r.IS_VERIFIED_PURCHASER,
        u.USERNAME,
        u.FIRST_NAME,
        u.LAST_NAME
      FROM review r
      JOIN user u ON r.USER_ID = u.ID
      WHERE r.BOOK_ID = ?
      ORDER BY r.POSTED_AT DESC
    `;

    db.query(sql, [bookId], (err, reviews) => {
      if (err) {
        console.error('Database error fetching reviews:', err);
        return res.status(500).json({ message: 'Server error fetching reviews' });
      }

      // Get average rating and total count
      const statsSql = `
        SELECT 
          COUNT(*) as total_reviews,
          AVG(RATING) as average_rating,
          COUNT(CASE WHEN RATING = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN RATING = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN RATING = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN RATING = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN RATING = 1 THEN 1 END) as one_star
        FROM review 
        WHERE BOOK_ID = ?
      `;

      db.query(statsSql, [bookId], (err, statsResults) => {
        if (err) {
          console.error('Database error fetching review stats:', err);
          return res.status(500).json({ message: 'Server error fetching review statistics' });
        }

        const stats = statsResults[0] || {
          total_reviews: 0,
          average_rating: 0,
          five_star: 0,
          four_star: 0,
          three_star: 0,
          two_star: 0,
          one_star: 0
        };

        res.json({
          reviews,
          stats: {
            totalReviews: stats.total_reviews,
            averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
            ratingDistribution: {
              5: stats.five_star,
              4: stats.four_star,
              3: stats.three_star,
              2: stats.two_star,
              1: stats.one_star
            }
          }
        });
      });
    });
  } catch (error) {
    console.error('Get book reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update an existing review
 */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!reviewId || !userId) {
      return res.status(400).json({ message: 'Review ID and User ID are required' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if review exists and belongs to user
    const checkOwnershipSql = 'SELECT ID FROM review WHERE ID = ? AND USER_ID = ?';
    
    db.query(checkOwnershipSql, [reviewId, userId], (err, results) => {
      if (err) {
        console.error('Database error checking review ownership:', err);
        return res.status(500).json({ message: 'Server error checking review ownership' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Review not found or you do not have permission to update it' });
      }

      // Build update query dynamically
      const updateFields = [];
      const updateValues = [];

      if (rating !== undefined) {
        updateFields.push('RATING = ?');
        updateValues.push(rating);
      }

      if (comment !== undefined) {
        updateFields.push('COMMENT = ?');
        updateValues.push(comment.trim() || null);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update provided' });
      }

      updateFields.push('POSTED_AT = NOW()'); // Update timestamp
      updateValues.push(reviewId);

      const updateSql = `UPDATE review SET ${updateFields.join(', ')} WHERE ID = ?`;

      db.query(updateSql, updateValues, (err, result) => {
        if (err) {
          console.error('Database error updating review:', err);
          return res.status(500).json({ message: 'Server error updating review' });
        }

        res.json({ message: 'Review updated successfully' });
      });
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a review
 */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!reviewId || !userId) {
      return res.status(400).json({ message: 'Review ID and User ID are required' });
    }

    // Check if review exists and belongs to user
    const checkOwnershipSql = 'SELECT ID FROM review WHERE ID = ? AND USER_ID = ?';
    
    db.query(checkOwnershipSql, [reviewId, userId], (err, results) => {
      if (err) {
        console.error('Database error checking review ownership:', err);
        return res.status(500).json({ message: 'Server error checking review ownership' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Review not found or you do not have permission to delete it' });
      }

      // Delete the review
      const deleteSql = 'DELETE FROM review WHERE ID = ?';
      
      db.query(deleteSql, [reviewId], (err, result) => {
        if (err) {
          console.error('Database error deleting review:', err);
          return res.status(500).json({ message: 'Server error deleting review' });
        }

        res.json({ message: 'Review deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user's review for a specific book
 */
const getUserBookReview = async (req, res) => {
  try {
    const { bookId, userId } = req.params;

    if (!bookId || !userId) {
      return res.status(400).json({ message: 'Book ID and User ID are required' });
    }

    const sql = `
      SELECT 
        r.ID,
        r.RATING,
        r.COMMENT,
        r.POSTED_AT,
        r.IS_VERIFIED_PURCHASER
      FROM review r
      WHERE r.BOOK_ID = ? AND r.USER_ID = ?
    `;

    db.query(sql, [bookId, userId], (err, results) => {
      if (err) {
        console.error('Database error fetching user review:', err);
        return res.status(500).json({ message: 'Server error fetching review' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No review found for this user and book' });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error('Get user book review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitReview,
  getBookReviews,
  updateReview,
  deleteReview,
  getUserBookReview
};
