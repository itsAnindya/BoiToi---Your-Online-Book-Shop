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
        pr.REVIEWED_AT,
        pr.NOTES,
        pr.admin_feedback,
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
        return res.status(500).json({ message: 'Server error fetching requests: ' + err.message });
      }

      console.log('Fetched pending requests:', results.length);
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
    const { adminId, notes, admin_feedback } = req.body;
    
    // Input validation
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Use admin_feedback if provided, otherwise fall back to notes, or use default message
    const feedbackText = admin_feedback || notes || 'Request approved by admin';

    console.log('Approving book request:', { requestId, adminId, notes, admin_feedback: feedbackText });

    // First, check if the admin user exists
    const checkAdminSql = 'SELECT a.USER_ID, u.USERNAME FROM ADMIN a JOIN USER u ON a.USER_ID = u.ID WHERE a.USER_ID = ?';
    
    db.query(checkAdminSql, [parseInt(adminId)], (err, adminResults) => {
      if (err) {
        console.error('Error checking admin:', err);
        return res.status(500).json({ message: 'Error verifying admin: ' + err.message });
      }

      if (adminResults.length === 0) {
        console.log('Admin not found for ID:', adminId);
        return res.status(400).json({ message: 'Invalid admin ID. User is not an admin or does not exist.' });
      }

      console.log('Admin verified:', adminResults[0]);

      // Call the updated stored procedure with admin feedback
      const sql = 'CALL ApproveBookRequest(?, ?, ?, @result_message, @new_book_id)';
      
      db.query(sql, [parseInt(requestId), parseInt(adminId), feedbackText], (err, results) => {
        if (err) {
          console.error('Database error calling stored procedure:', err);
          return res.status(500).json({ message: 'Server error approving request: ' + err.message });
        }

        console.log('Stored procedure results:', results);

        // Get the output parameters
        db.query('SELECT @result_message as message, @new_book_id as book_id', (err, outputResults) => {
          if (err) {
            console.error('Error getting stored procedure output:', err);
            return res.status(500).json({ message: 'Error processing request: ' + err.message });
          }

          console.log('Output results:', outputResults);

          if (!outputResults || outputResults.length === 0) {
            return res.status(500).json({ message: 'No output from stored procedure' });
          }

          const { message, book_id } = outputResults[0];
          
          console.log('Procedure output:', { message, book_id });
          
          if (book_id && book_id > 0) {
            return res.json({ 
              message: 'Book request approved successfully',
              bookId: book_id,
              requestId: requestId,
              procedureMessage: message
            });
          } else {
            return res.status(400).json({ 
              message: message || 'Failed to approve request - no book was created',
              procedureMessage: message
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Approve book request error:', error);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};

/**
 * Reject a book request - Rejection reason goes to admin_feedback column
 */
const rejectBookRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminId, notes, rejection_reason, admin_feedback } = req.body;
    
    // The rejection reason becomes the admin feedback (as per requirement)
    const rejectionReason = rejection_reason || admin_feedback || notes || 'Request rejected by admin';
    
    // Input validation
    if (!adminId || !rejectionReason) {
      return res.status(400).json({ message: 'Admin ID and rejection reason are required' });
    }

    console.log('Rejecting book request:', { requestId, adminId, rejectionReason });

    // First, check if the admin user exists
    const checkAdminSql = 'SELECT a.USER_ID, u.USERNAME FROM ADMIN a JOIN USER u ON a.USER_ID = u.ID WHERE a.USER_ID = ?';
    
    db.query(checkAdminSql, [parseInt(adminId)], (err, adminResults) => {
      if (err) {
        console.error('Error checking admin:', err);
        return res.status(500).json({ message: 'Error verifying admin: ' + err.message });
      }

      if (adminResults.length === 0) {
        console.log('Admin not found for ID:', adminId);
        return res.status(400).json({ message: 'Invalid admin ID. User is not an admin or does not exist.' });
      }

      console.log('Admin verified:', adminResults[0]);

      // Call the corrected stored procedure - rejection reason goes to admin_feedback
      const sql = 'CALL RejectBookRequest(?, ?, ?, @result_message)';
      
      db.query(sql, [parseInt(requestId), parseInt(adminId), rejectionReason], (err, results) => {
        if (err) {
          console.error('Database error rejecting book request:', err);
          return res.status(500).json({ message: 'Server error rejecting request: ' + err.message });
        }

        console.log('Reject procedure results:', results);

        // Get the output parameter
        db.query('SELECT @result_message as message', (err, outputResults) => {
          if (err) {
            console.error('Error getting stored procedure output:', err);
            return res.status(500).json({ message: 'Error processing request: ' + err.message });
          }

          console.log('Reject output results:', outputResults);

          const { message } = outputResults[0] || {};
          
          return res.json({ 
            message: 'Book request rejected successfully',
            details: message,
            requestId: requestId
          });
        });
      });
    });
  } catch (error) {
    console.error('Reject book request error:', error);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
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
        pr.NOTES,
        pr.admin_feedback,
        pr.REVIEWED_BY,
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
        pbd.GENRE,
        admin_user.USERNAME as REVIEWED_BY_USERNAME
      FROM PUBLISHER_REQUEST pr
      JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
      LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
      LEFT JOIN ADMIN admin_table ON pr.REVIEWED_BY = admin_table.USER_ID
      LEFT JOIN USER admin_user ON admin_table.USER_ID = admin_user.ID
      ORDER BY pr.SUBMITTED_AT DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error fetching all book requests:', err);
        return res.status(500).json({ message: 'Server error fetching requests: ' + err.message });
      }

      console.log('Fetched all requests:', results.length);
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
