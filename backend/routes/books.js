const express = require('express');
const router = express.Router();
const { getHomeBooks, showBooks, getBestsellers } = require('../controllers/bookController');

// Home route to get top 5 books based on average rating
router.post('/home', getHomeBooks);

// Show books route
router.get('/show_books', showBooks);

// Bestsellers route
router.get('/bestsellers', getBestsellers);

module.exports = router;