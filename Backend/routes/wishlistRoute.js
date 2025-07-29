const express = require('express');
const router = express.Router();
const wishListController = require('../controllers/wishListController');

/**
 * Wishlist Routes
 * Base path: /api/wishlist
 */

// POST /api/wishlist - Add book to wishlist
router.post('/', wishListController.addToWishlist);

// GET /api/wishlist/:userId - Get user's wishlist
router.get('/:userId', wishListController.getUserWishlist);

// DELETE /api/wishlist - Remove book from wishlist
router.delete('/', wishListController.removeFromWishlist);

module.exports = router;
