const express = require('express');
const router = express.Router();
const { 
  updateCategoryBestsellers, 
  getBestsellersStatus, 
  triggerBestsellersUpdate,
  getCategories,
  getBestsellersByCategory,
  getAllBestsellers
} = require('../controllers/bestsellerController');

/**
 * @route   GET /api/bestsellers/categories
 * @desc    Get all categories that have bestsellers
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/bestsellers/category/:categoryId
 * @desc    Get bestsellers for a specific category
 * @access  Public
 */
router.get('/category/:categoryId', getBestsellersByCategory);

/**
 * @route   GET /api/bestsellers/all
 * @desc    Get all bestsellers grouped by category
 * @access  Public
 */
router.get('/all', getAllBestsellers);

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
