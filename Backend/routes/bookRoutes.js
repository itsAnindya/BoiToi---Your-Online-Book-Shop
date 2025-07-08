const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * Book Routes
 * Base path: /api/books
 */

// POST /api/books/home - Get top 5 books based on average rating
router.post('/home', bookController.getHomeBooks);

// GET /api/books/categories - Get top 5 books in each category
router.get('/categories', bookController.getBooksByCategory);

//router.get('/searchByPrice', SearchController.searchByPrice);
module.exports = router;