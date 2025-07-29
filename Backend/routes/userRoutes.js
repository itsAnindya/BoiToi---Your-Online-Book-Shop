const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * User Profile Routes
 * Base path: /api/user
 */

// GET /api/user/:userId - Get user profile with addresses
router.get('/:userId', userController.getUserProfile);

// PUT /api/user/:userId - Update user basic profile information
router.put('/:userId', userController.updateUserProfile);

// PUT /api/user/:userId/password - Change user password
router.put('/:userId/password', userController.changePassword);

// POST /api/user/:userId/address - Create new address
router.post('/:userId/address', userController.updateUserAddress);

// PUT /api/user/:userId/address/:addressId - Update existing address
router.put('/:userId/address/:addressId', userController.updateUserAddress);

// PUT /api/user/:userId/address/:addressId/default - Set address as default
router.put('/:userId/address/:addressId/default', userController.setDefaultAddress);

// DELETE /api/user/:userId/address/:addressId - Delete user address
router.delete('/:userId/address/:addressId', userController.deleteUserAddress);

module.exports = router;
