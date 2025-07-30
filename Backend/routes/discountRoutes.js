const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

/**
 * Discount Management Routes
 * Base path: /api/admin/discounts
 */

// GET /api/admin/discounts - Get all discounts with optional filtering and pagination
router.get('/', discountController.getAllDiscounts);

// POST /api/admin/discounts - Create a new discount
router.post('/', discountController.createDiscount);

// GET /api/admin/discounts/statistics - Get discount statistics for dashboard
router.get('/statistics', discountController.getDiscountStatistics);

// PUT /api/admin/discounts/:discountId - Update discount details
router.put('/:discountId', discountController.updateDiscount);

// PUT /api/admin/discounts/:discountId/status - Update discount status (activate/deactivate)
router.put('/:discountId/status', discountController.updateDiscountStatus);

// DELETE /api/admin/discounts/:discountId - Delete a discount
router.delete('/:discountId', discountController.deleteDiscount);

module.exports = router;
