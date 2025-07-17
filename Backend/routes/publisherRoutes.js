const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

// Publisher authentication
router.post('/login', publisherController.publisherLogin);

// Publisher profile
router.get('/:id/profile', publisherController.getPublisherProfile);

// Book requests
router.post('/:id/book-request', publisherController.submitBookRequest);
router.get('/:id/book-requests', publisherController.getPublisherRequests);

// Publisher statistics
router.get('/stats/:id', publisherController.getPublisherStats);

module.exports = router;
