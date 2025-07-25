const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

/**
 * Review Routes
 * Base path: /api/reviews
 */

// POST /api/reviews - Submit a new review
router.post('/', reviewController.submitReview);

// GET /api/reviews/book/:bookId - Get all reviews for a book
router.get('/book/:bookId', reviewController.getBookReviews);

// GET /api/reviews/book/:bookId/user/:userId - Get user's review for a specific book
router.get('/book/:bookId/user/:userId', reviewController.getUserBookReview);

// PUT /api/reviews/:reviewId - Update an existing review
router.put('/:reviewId', reviewController.updateReview);

// DELETE /api/reviews/:reviewId - Delete a review
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
