const express = require('express');
const router = express.Router();
const { validateDiscountCode } = require('../controllers/discountValidationController');

// POST /api/discounts/validate - Validate discount code for checkout
router.post('/validate', validateDiscountCode);

module.exports = router;
