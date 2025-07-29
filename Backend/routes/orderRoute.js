const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getOrderHistory,
  getOrderDetails,
  updateOrderStatus,
  createOrder
} = require('../controllers/orderController');

/**
 * @route   POST /api/orders/create
 * @desc    Create a new order with comprehensive checkout data
 * @access  Public
 * @body    { user_id, shipping_address, phone_number, payment_method, transaction_id, total_amount, shipping_fee, items }
 */
router.post('/create', createOrder);

/**
 * @route   POST /api/orders/place
 * @desc    Place a new order from cart items (simple version)
 * @access  Public
 * @body    { user_id }
 */
router.post('/place', placeOrder);

/**
 * @route   GET /api/orders/history/:userId
 * @desc    Get order history for a specific user
 * @access  Public
 * @param   userId - The ID of the user
 */
router.get('/history/:userId', getOrderHistory);

/**
 * @route   GET /api/orders/details/:orderId
 * @desc    Get detailed information about a specific order
 * @access  Public
 * @param   orderId - The ID of the order
 * @query   userId - Optional user ID for verification
 */
router.get('/details/:orderId', getOrderDetails);

/**
 * @route   PUT /api/orders/status/:orderId
 * @desc    Update order status (admin function)
 * @access  Public (should be protected in production)
 * @param   orderId - The ID of the order
 * @body    { status }
 */
router.put('/status/:orderId', updateOrderStatus);

module.exports = router;
