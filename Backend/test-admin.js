// Test script to check admin book requests functionality
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
app.use(express.json());
app.use(cors());

// Test admin validation
app.get('/test/admin/:id', (req, res) => {
  const adminId = req.params.id;
  const checkAdminSql = 'SELECT a.USER_ID, u.USERNAME FROM ADMIN a JOIN USER u ON a.USER_ID = u.ID WHERE a.USER_ID = ?';
  
  db.query(checkAdminSql, [parseInt(adminId)], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ adminId, results, isAdmin: results.length > 0 });
  });
});

// Test book requests
app.get('/test/requests', (req, res) => {
  const sql = 'SELECT * FROM BookRequestView ORDER BY SUBMITTED_AT DESC LIMIT 5';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Test stored procedure
app.post('/test/approve/:requestId/:adminId', (req, res) => {
  const { requestId, adminId } = req.params;
  
  const sql = 'CALL ApproveBookRequest(?, ?, @result_message, @new_book_id)';
  
  db.query(sql, [parseInt(requestId), parseInt(adminId)], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.query('SELECT @result_message as message, @new_book_id as book_id', (err, outputResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        procedureResults: results,
        outputResults,
        success: true
      });
    });
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /test/admin/:id - Check if user is admin');
  console.log('- GET /test/requests - Get book requests');
  console.log('- POST /test/approve/:requestId/:adminId - Test approval');
});
