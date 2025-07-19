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

const PORT = 3334;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  
  // Test the approval endpoint
  setTimeout(() => {
    const http = require('http');
    
    console.log('🔍 Testing approval endpoint with correct parameters...');
    
    const testData = JSON.stringify({
      admin_id: 1001,  // Using the test admin ID
      notes: 'Test approval from script'
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin/book-requests/1001/approve',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Approval Response:', result);
        } catch (error) {
          console.log('❌ Response not JSON:', data);
        }
        process.exit(0);
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      process.exit(1);
    });

    req.write(testData);
    req.end();
  }, 1000);
});
