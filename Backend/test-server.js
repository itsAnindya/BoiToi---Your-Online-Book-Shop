// Test server to verify user routes
const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());

// Test user routes
app.use('/api/user', userRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log('User routes mounted at /api/user');
  console.log('Available endpoints:');
  console.log('  GET /api/user/:userId - Get user profile');
  console.log('  PUT /api/user/:userId - Update user profile');
  console.log('  PUT /api/user/:userId/password - Change password');
  console.log('  POST /api/user/:userId/address - Create address');
  console.log('  PUT /api/user/:userId/address/:addressId - Update address');
  console.log('  DELETE /api/user/:userId/address/:addressId - Delete address');
});
