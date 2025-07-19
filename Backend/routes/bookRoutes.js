const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const booksById = require('../controllers/booksById');
/**
 * Book Routes
 * Base path: /api/books
 */

// POST /api/books/home - Get top 5 books based on average rating
router.post('/home', bookController.getHomeBooks);

// GET /api/books/categories - Get top 5 books in each category
router.get('/categories', bookController.getBooksByCategory);

// GET /api/books/all - Get all books in the database
router.get('/all', bookController.getAllBooks);

router.get('/:bookId', booksById.getBookById);


module.exports = router;