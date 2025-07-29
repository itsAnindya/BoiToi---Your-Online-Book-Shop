const express = require('express');
const router = express.Router();
const { getAdminStats, getUserStats, getBookStats } = require('../controllers/adminStatsController');

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin only
 */
router.get('/stats', getAdminStats);

/**
 * @route   GET /api/admin/stats/users
 * @desc    Get detailed user statistics
 * @access  Admin only
 */
router.get('/stats/users', getUserStats);

/**
 * @route   GET /api/admin/stats/books
 * @desc    Get detailed book statistics
 * @access  Admin only
 */
router.get('/stats/books', getBookStats);

module.exports = router;
