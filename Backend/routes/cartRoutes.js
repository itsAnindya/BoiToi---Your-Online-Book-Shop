const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
  clearCart
} = require('../controllers/cartController');

/**
 * @route   POST /api/cart/add
 * @desc    Add a book to user's cart
 * @access  Public
 * @body    { bookId, userId }
 */
router.post('/add', addToCart);

/**
 * @route   GET /api/cart/:userId
 * @desc    Get all cart items for a specific user
 * @access  Public
 * @param   userId - The ID of the user
 */
router.get('/:userId', getCartItems);

/**
 * @route   DELETE /api/cart/remove
 * @desc    Remove a specific item from user's cart
 * @access  Public
 * @body    { userId, bookId }
 */
router.delete('/remove', removeFromCart);

/**
 * @route   PUT /api/cart/update-quantity
 * @desc    Update quantity of a specific item in user's cart
 * @access  Public
 * @body    { userId, bookId, quantity }
 */
router.put('/update-quantity', updateCartQuantity);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart for a user
 * @access  Public
 * @body    { userId }
 */
router.delete('/clear', clearCart);

module.exports = router;
