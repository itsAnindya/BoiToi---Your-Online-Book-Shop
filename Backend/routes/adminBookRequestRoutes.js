const express = require('express');
const router = express.Router();
const adminBookRequestController = require('../controllers/adminBookRequestController');

// Get all pending book requests
router.get('/book-requests/pending', adminBookRequestController.getPendingBookRequests);

// Get all book requests (for dashboard)
router.get('/book-requests', adminBookRequestController.getAllBookRequests);

// Approve book request
router.post('/book-requests/:requestId/approve', adminBookRequestController.approveBookRequest);

// Reject book request
router.post('/book-requests/:requestId/reject', adminBookRequestController.rejectBookRequest);

module.exports = router;
