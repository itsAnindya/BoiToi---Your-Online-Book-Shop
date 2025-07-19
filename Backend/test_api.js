const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const adminBookRequestRoutes = require('./routes/adminBookRequestRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', adminBookRequestRoutes);

// Start test server
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  
  // Test the API after 1 second
  setTimeout(() => {
    const http = require('http');
    
    console.log('🔍 Testing /api/admin/book-requests endpoint...');
    
    http.get(`http://localhost:${PORT}/api/admin/book-requests`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ API Response Success!');
          console.log(`📊 Found ${result.length} book requests`);
          if (result.length > 0) {
            console.log('📋 First request:', {
              id: result[0].ID,
              title: result[0].TITLE,
              publisher: result[0].PUBLISHER_NAME,
              status: result[0].STATUS
            });
          }
        } catch (error) {
          console.error('❌ JSON Parse Error:', error.message);
          console.log('Raw response:', data);
        }
        process.exit(0);
      });
    }).on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      process.exit(1);
    });
  }, 1000);
});
