const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/signup
router.post('/signup', authController.signup);

module.exports = router;