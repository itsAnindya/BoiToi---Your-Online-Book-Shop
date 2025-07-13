// Simple test script to verify server startup
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Simple test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ 
    success: true, 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Test cart route
app.post('/api/cart/test', (req, res) => {
  console.log('Cart test route accessed');
  console.log('Request body:', req.body);
  res.json({ 
    success: true, 
    message: 'Cart route is working!',
    receivedData: req.body
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});
