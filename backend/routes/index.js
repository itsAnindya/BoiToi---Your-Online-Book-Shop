const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const bookRoutes = require('./books');

// Use routes
router.use('/api', authRoutes);
router.use('/', bookRoutes);

// Health check route
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is connected!' });
});

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;