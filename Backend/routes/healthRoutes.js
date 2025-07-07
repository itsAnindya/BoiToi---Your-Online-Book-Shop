const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * Health Check Routes
 * Base path: /api
 */

// GET /api/test
router.get('/test', healthController.test);

// GET /api/health
router.get('/health', healthController.health);

module.exports = router;