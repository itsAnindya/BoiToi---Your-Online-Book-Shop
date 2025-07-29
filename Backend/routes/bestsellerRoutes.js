const express = require('express');
const router = express.Router();
const { 
  updateCategoryBestsellers, 
  getBestsellersStatus, 
  triggerBestsellersUpdate 
} = require('../controllers/bestsellerController');

/**
 * @route   GET /api/bestsellers/status
 * @desc    Get current bestsellers status and information
 * @access  Public
 */
router.get('/status', getBestsellersStatus);

/**
 * @route   POST /api/bestsellers/update
 * @desc    Manually trigger bestsellers update (Admin only)
 * @access  Admin
 */
router.post('/update', triggerBestsellersUpdate);

/**
 * @route   POST /api/bestsellers/auto-update
 * @desc    Automatic bestsellers update (for cron jobs)
 * @access  Internal
 */
router.post('/auto-update', updateCategoryBestsellers);

module.exports = router;
