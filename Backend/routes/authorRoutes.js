const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

/**
 * Author Routes
 * Base path: /api/authors
 */

// GET /api/authors - Get all authors
router.get('/', authorController.getAllAuthors);

// GET /api/authors/search - Search authors by name or bio
router.get('/search', authorController.searchAuthors);

// GET /api/authors/:id - Get author by ID
router.get('/:id', authorController.getAuthorById);

// GET /api/authors/:id/books - Get books by author ID
router.get('/:id/books', authorController.getBooksByAuthor);


module.exports = router;
