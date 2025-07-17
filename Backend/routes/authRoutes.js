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

// POST /api/auth/publisher/login
router.post('/publisher/login', authController.publisherLogin);

// POST /api/auth/publisher/signup
router.post('/publisher/signup', authController.publisherSignup);

module.exports = router;