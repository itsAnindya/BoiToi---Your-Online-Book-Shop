const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  saveCart,
  placeOrder
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
 * @route   PUT /api/cart/update
 * @desc    Update quantity of a specific item in user's cart
 * @access  Public
 * @body    { user_id, book_id, quantity }
 */
router.put('/update', updateCartQuantity);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart for a user
 * @access  Public
 * @body    { userId }
 */
router.delete('/clear', clearCart);

/**
 * @route   PUT /api/cart/save
 * @desc    Save cart (update multiple items at once)
 * @access  Public
 * @body    { user_id, items }
 */
router.put('/save', saveCart);

/**
 * @route   POST /api/cart/place-order
 * @desc    Place order (convert cart to order)
 * @access  Public
 * @body    { user_id }
 */
router.post('/place-order', placeOrder);

module.exports = router;
