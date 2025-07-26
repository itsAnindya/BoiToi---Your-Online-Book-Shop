const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const bookRoutes = require('./bookRoutes');
const userRoutes = require('./userRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoute');
const authorRoutes = require('./authorRoutes');

// Use routes
router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/authors', authorRoutes);
router.use('/', bookRoutes);

// Health check route
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is connected!' });
});

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;