const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');

/**
 * Admin Book Request Management Routes
 * Base path: /api/admin/book-requests
 */

// GET /api/admin/book-requests/pending
router.get('/pending', adminBookController.getPendingBookRequests);

// GET /api/admin/book-requests/all
router.get('/all', adminBookController.getAllBookRequests);

// POST /api/admin/book-requests/:requestId/approve
router.post('/:requestId/approve', adminBookController.approveBookRequest);

// POST /api/admin/book-requests/:requestId/reject
router.post('/:requestId/reject', adminBookController.rejectBookRequest);

module.exports = router;
