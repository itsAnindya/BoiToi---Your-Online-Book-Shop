const db = require('../config/database');

/**
 * Get all pending book requests for admin review
 */
const getPendingBookRequests = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pr.ID,
        pr.PUBLISHER_ID,
        pr.REQUEST_TYPE,
        pr.STATUS,
        pr.SUBMITTED_AT,
        pr.NOTES,
        p.NAME as PUBLISHER_NAME,
        p.EMAIL as PUBLISHER_EMAIL,
        pbd.TITLE,
        pbd.ISBN,
        pbd.PAGE_COUNT,
        pbd.LANGUAGE,
        pbd.EDITION,
        pbd.PRICE,
        pbd.STOCK_QUANTITY,
        pbd.DESCRIPTION,
        pbd.COVER_URL,
        pbd.GENRE
      FROM PUBLISHER_REQUEST pr
      JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
      LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
      WHERE pr.STATUS = 'PENDING'
      ORDER BY pr.SUBMITTED_AT ASC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error fetching pending book requests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json(results);
    });
  } catch (error) {
    console.error('Get pending book requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Approve a book request
 */
const approveBookRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminId, notes } = req.body;
    
    // Input validation
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Call the stored procedure
    const sql = 'CALL approve_book_request(?, ?, ?)';
    
    db.query(sql, [requestId, adminId, notes || 'Request approved'], (err, results) => {
      if (err) {
        console.error('Database error approving book request:', err);
        return res.status(500).json({ message: 'Server error approving request' });
      }

      const newBookId = results[0] && results[0][0] ? results[0][0].book_id : null;
      
      return res.json({ 
        message: 'Book request approved successfully',
        bookId: newBookId,
        requestId: requestId
      });
    });
  } catch (error) {
    console.error('Approve book request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reject a book request
 */
const rejectBookRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminId, notes } = req.body;
    
    // Input validation
    if (!adminId || !notes) {
      return res.status(400).json({ message: 'Admin ID and rejection reason are required' });
    }

    // Call the stored procedure
    const sql = 'CALL reject_book_request(?, ?, ?)';
    
    db.query(sql, [requestId, adminId, notes], (err, results) => {
      if (err) {
        console.error('Database error rejecting book request:', err);
        return res.status(500).json({ message: 'Server error rejecting request' });
      }

      return res.json({ 
        message: 'Book request rejected successfully',
        requestId: requestId
      });
    });
  } catch (error) {
    console.error('Reject book request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all book requests (approved, rejected, pending) for admin dashboard
 */
const getAllBookRequests = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pr.ID,
        pr.PUBLISHER_ID,
        pr.REQUEST_TYPE,
        pr.STATUS,
        pr.SUBMITTED_AT,
        pr.REVIEWED_AT,
        pr.REVIEWED_BY,
        pr.NOTES,
        p.NAME as PUBLISHER_NAME,
        p.EMAIL as PUBLISHER_EMAIL,
        pbd.TITLE,
        pbd.ISBN,
        pbd.PRICE,
        pbd.GENRE,
        admin_user.USERNAME as REVIEWED_BY_USERNAME
      FROM PUBLISHER_REQUEST pr
      JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
      LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
      LEFT JOIN ADMIN a ON pr.REVIEWED_BY = a.USER_ID
      LEFT JOIN USER admin_user ON a.USER_ID = admin_user.ID
      ORDER BY pr.SUBMITTED_AT DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error fetching all book requests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json(results);
    });
  } catch (error) {
    console.error('Get all book requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPendingBookRequests,
  approveBookRequest,
  rejectBookRequest,
  getAllBookRequests
};
