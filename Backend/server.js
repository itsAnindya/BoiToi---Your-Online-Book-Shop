
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const healthRoutes = require('./routes/healthRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const adminBookRequestRoutes = require('./routes/adminBookRequestRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authorRoutes= require('./routes/authorRoutes');
const wishlistRoutes = require('./routes/wishlistRoute');
const { addToWishlist } = require('./controllers/wishListController');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api', healthRoutes);
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/publisher', publisherRoutes);
app.use('/api/admin', adminBookRequestRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack + 'u');
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

console.log(
  'ACTIVE ROUTES:',
  app._router?.stack
    ?.filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`) || 'No routes defined yet'
);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});