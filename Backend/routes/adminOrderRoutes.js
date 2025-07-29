const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');

/**
 * Admin Order Management Routes
 * Base path: /api/admin
 */

// GET /api/admin/orders - Get all orders with optional filtering and pagination
router.get('/orders', adminOrderController.getAllOrders);

// GET /api/admin/orders/statistics - Get order statistics for dashboard
router.get('/orders/statistics', adminOrderController.getOrderStatistics);

// GET /api/admin/orders/:orderId - Get detailed order information
router.get('/orders/:orderId', adminOrderController.getOrderDetails);

// PUT /api/admin/orders/:orderId/status - Update order and/or payment status
router.put('/orders/:orderId/status', adminOrderController.updateOrderStatus);

module.exports = router;
