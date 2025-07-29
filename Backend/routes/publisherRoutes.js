const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

// Public routes for browsing publishers (similar to authors)
router.get('/', publisherController.getAllPublishers);
router.get('/:id', publisherController.getPublisherByIdPublic);

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
