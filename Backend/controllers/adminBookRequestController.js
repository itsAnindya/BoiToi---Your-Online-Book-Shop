const db = require('../config/database');

/**
 * Get All Pending Book Requests
 */
const getPendingBookRequests = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pr.ID,
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
      ORDER BY pr.SUBMITTED_AT DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error fetching pending requests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json(results);
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Approve Book Request
 */
const approveBookRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { admin_id: adminId } = req.body;
    
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Start transaction
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Transaction start error' });
      }

      try {
        // Get request and book draft details
        const getRequestSql = `
          SELECT 
            pr.ID,
            pr.PUBLISHER_ID,
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
          JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
          WHERE pr.ID = ? AND pr.STATUS = 'PENDING'
        `;
        
        db.query(getRequestSql, [requestId], (err, requestResults) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error fetching request details' });
            });
          }

          if (requestResults.length === 0) {
            return db.rollback(() => {
              res.status(404).json({ message: 'Request not found or already processed' });
            });
          }

          const request = requestResults[0];

          // Insert new book (AUTO_INCREMENT will handle ID)
          const insertBookSql = `
            INSERT INTO BOOK 
            (TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE, SHOW_BOOK, ADDED_AT)
            VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
          `;
          
          db.query(insertBookSql, [
            request.TITLE, request.ISBN, request.PUBLISHER_ID,
            request.PAGE_COUNT, request.LANGUAGE, request.EDITION,
            request.PRICE, request.STOCK_QUANTITY, request.DESCRIPTION,
            request.COVER_URL, request.GENRE
          ], (err, bookResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error creating book' });
              });
            }

            const bookId = bookResult.insertId; // Get auto-generated book ID

              // Update request status
              const updateRequestSql = `
                UPDATE PUBLISHER_REQUEST 
                SET STATUS = 'APPROVED', REVIEWED_AT = NOW(), REVIEWED_BY = ?, NOTES = CONCAT(COALESCE(NOTES, ''), ' | Approved and book added to catalog')
                WHERE ID = ?
              `;
              
              db.query(updateRequestSql, [adminId, requestId], (err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error updating request status' });
                  });
                }

                // Create notification for publisher
                const notificationSql = `
                  INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
                  SELECT p.ID, 
                         CONCAT('Your book contribution request for "', ?, '" has been approved and added to the catalog!'), 
                         'SYSTEM', 
                         0, 
                         NOW()
                  FROM PUBLISHER p
                  WHERE p.ID = ?
                `;
                
                db.query(notificationSql, [request.TITLE, request.PUBLISHER_ID], (err) => {
                  if (err) {
                    console.error('Error creating publisher notification:', err);
                    // Don't rollback for notification error
                  }

                  // Commit transaction
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        res.status(500).json({ message: 'Error committing transaction' });
                      });
                    }

                    res.json({ 
                      message: 'Book request approved and added to catalog',
                      book_id: bookId,
                      request_id: requestId
                    });
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
    console.error('Approve book request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reject Book Request
 */
const rejectBookRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { admin_id, rejection_reason } = req.body;
    
    if (!admin_id || !rejection_reason) {
      return res.status(400).json({ message: 'Admin ID and rejection reason are required' });
    }

    // Start transaction
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Transaction start error' });
      }

      try {
        // Get request details
        const getRequestSql = `
          SELECT pr.PUBLISHER_ID, pbd.TITLE
          FROM PUBLISHER_REQUEST pr
          JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
          WHERE pr.ID = ? AND pr.STATUS = 'PENDING'
        `;
        
        db.query(getRequestSql, [requestId], (err, requestResults) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error fetching request details' });
            });
          }

          if (requestResults.length === 0) {
            return db.rollback(() => {
              res.status(404).json({ message: 'Request not found or already processed' });
            });
          }

          const request = requestResults[0];

          // Update request status
          const updateRequestSql = `
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'REJECTED', REVIEWED_AT = NOW(), REVIEWED_BY = ?, NOTES = CONCAT(COALESCE(NOTES, ''), ' | Rejected: ', ?)
            WHERE ID = ?
          `;
          
          db.query(updateRequestSql, [admin_id, rejection_reason, requestId], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error updating request status' });
              });
            }

            // Create notification for publisher
            const notificationSql = `
              INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
              SELECT p.ID, 
                     CONCAT('Your book contribution request for "', ?, '" has been rejected. Reason: ', ?), 
                     'SYSTEM', 
                     0, 
                     NOW()
              FROM PUBLISHER p
              WHERE p.ID = ?
            `;
            
            db.query(notificationSql, [request.TITLE, rejection_reason, request.PUBLISHER_ID], (err) => {
              if (err) {
                console.error('Error creating publisher notification:', err);
                // Don't rollback for notification error
              }

              // Commit transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                }

                res.json({ 
                  message: 'Book request rejected',
                  request_id: requestId
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
    console.error('Reject book request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get All Book Requests (for admin dashboard)
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
        console.error('Database error fetching all requests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.json(results);
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPendingBookRequests,
  approveBookRequest,
  rejectBookRequest,
  getAllBookRequests
};
