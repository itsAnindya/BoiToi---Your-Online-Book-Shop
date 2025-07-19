const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const adminBookRequestRoutes = require('./routes/adminBookRequestRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/admin', adminBookRequestRoutes);

// Add a test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Server error: ' + err.message });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.url);
  res.status(404).json({ message: 'Route not found: ' + req.url });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`📍 Book requests endpoint: http://localhost:${PORT}/api/admin/book-requests`);
});
