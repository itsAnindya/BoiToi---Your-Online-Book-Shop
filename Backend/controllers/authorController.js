const db = require('../config/database');

/**
 * Get all authors
 * Returns all authors from the database
 */
const getAllAuthors = (req, res) => {
  console.log('Fetching all authors');

  const query = `
    SELECT 
      ID,
      NAME,
      BIO,
      DATE_OF_BIRTH,
      NATIONALITY,
      WEBSITE,
      PHOTO_URL
    FROM author
    ORDER BY NAME ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching authors:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching authors',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Authors fetched successfully',
      data: results,
      count: results.length
    });
  });
};



/**
 * Get author by ID
 * Returns a specific author by their ID along with their books
 */
const getAuthorById = (req, res) => {
  const authorId = req.params.id;
  console.log(`Fetching author with ID: ${authorId}`);

  if (!authorId || isNaN(authorId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid author ID provided'
    });
  }

  // First query to get author details
  const authorQuery = `
    SELECT 
      ID,
      NAME,
      BIO,
      DATE_OF_BIRTH,
      NATIONALITY,
      WEBSITE,
      PHOTO_URL
    FROM author
    WHERE ID = ?;
  `;

  // Second query to get books by this author
  const booksQuery = `
    SELECT 
      b.ID as BOOK_ID,
      b.TITLE,
      b.DESCRIPTION as SUMMARY,
      b.PUBLISHED_DATE as PUBLICATION_DATE,
      b.LANGUAGE,
      b.PAGE_COUNT,
      b.PRICE,
      b.STOCK_QUANTITY,
      b.COVER_URL
    FROM book_author ba
    INNER JOIN book b ON ba.BOOK_ID = b.ID
    WHERE ba.AUTHOR_ID = ?
    ORDER BY b.PUBLISHED_DATE DESC;
  `;

  // Execute author query first
  db.query(authorQuery, [authorId], (err, authorResults) => {
    if (err) {
      console.error('Error fetching author:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching author',
        error: err.message
      });
    }

    if (authorResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    const author = authorResults[0];

    // Execute books query
    db.query(booksQuery, [authorId], (err, booksResults) => {
      if (err) {
        console.error('Error fetching author books:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error while fetching author books',
          error: err.message
        });
      }

      // Combine author data with books
      const responseData = {
        ...author,
        BOOKS: booksResults,
        BOOK_COUNT: booksResults.length
      };

      res.status(200).json({
        success: true,
        message: 'Author fetched successfully',
        data: responseData
      });
    });
  });
};

/**
 * Get books by author ID
 * Returns all books written by a specific author
 */
const getBooksByAuthor = (req, res) => {
  const authorId = req.params.id;
  console.log(`Fetching books by author ID: ${authorId}`);

  if (!authorId || isNaN(authorId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid author ID provided'
    });
  }

  const query = `
    SELECT 
      b.ID as BOOK_ID,
      b.TITLE,
      b.DESCRIPTION as SUMMARY,
      b.PUBLISHED_DATE as PUBLICATION_DATE,
      b.LANGUAGE,
      b.PAGE_COUNT,
      b.PRICE,
      b.STOCK_QUANTITY,
      b.COVER_URL,
      a.NAME as AUTHOR_NAME
    FROM book_author ba
    INNER JOIN book b ON ba.BOOK_ID = b.ID
    INNER JOIN author a ON ba.AUTHOR_ID = a.ID
    WHERE ba.AUTHOR_ID = ?
    ORDER BY b.PUBLISHED_DATE DESC;
  `;

  db.query(query, [authorId], (err, results) => {
    if (err) {
      console.error('Error fetching books by author:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching books by author',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Books by author fetched successfully',
      data: results,
      count: results.length
    });
  });
};

/**
 * Search authors by name
 * Returns authors matching the search query
 */
const searchAuthors = (req, res) => {
  const { query: searchQuery } = req.query;
  console.log(`Searching authors with query: ${searchQuery}`);

  if (!searchQuery || searchQuery.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const query = `
    SELECT 
      ID,
      NAME,
      BIO,
      DATE_OF_BIRTH,
      NATIONALITY,
      WEBSITE,
      PHOTO_URL
    FROM author
    WHERE NAME LIKE ? OR BIO LIKE ?
    ORDER BY NAME ASC;
  `;

  const searchTerm = `%${searchQuery.trim()}%`;

  db.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error searching authors:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while searching authors',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Author search completed successfully',
      data: results,
      count: results.length,
      searchQuery: searchQuery
    });
  });
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  getBooksByAuthor,
  searchAuthors
};
