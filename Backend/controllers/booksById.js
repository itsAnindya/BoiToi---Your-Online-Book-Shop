const db = require('../config/database');

const getBookById = (req, res) => {
  const bookId = req.params.bookId;
  console.log(`Fetching book with ID: ${bookId}`);

  const query = `
    SELECT 
      b.ID,
      b.TITLE,
      b.ISBN,
      b.PUBLISHED_DATE,
      b.PUBLISHER_ID,
      b.PAGE_COUNT,
      b.LANGUAGE,
      b.EDITION,
      b.PRICE,
      b.STOCK_QUANTITY,
      b.DESCRIPTION,
      b.SHOW_BOOK,
      b.COVER_URL,
      b.ADDED_AT,
      b.GENRE,
      GROUP_CONCAT(DISTINCT a.NAME ORDER BY a.NAME SEPARATOR ' · ') AS author_names,
      GROUP_CONCAT(DISTINCT pu.NAME ORDER BY pu.NAME SEPARATOR ' . ') AS publisher_names
    FROM book b
    LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
    LEFT JOIN author a ON a.ID = ba.AUTHOR_ID
    LEFT JOIN publisher pu ON b.PUBLISHER_ID = pu.ID
    WHERE b.ID = ?
    GROUP BY b.ID;
  `;

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('No book found with the given ID');
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = results[0];
    res.json({
      ID: book.ID,
      TITLE: book.TITLE,
      ISBN: book.ISBN,
      PUBLISHED_DATE: book.PUBLISHED_DATE,
      PUBLISHER_NAME: book.publisher_names,
      PAGE_COUNT: book.PAGE_COUNT,
      LANGUAGE: book.LANGUAGE,
      EDITION: book.EDITION,
      PRICE: book.PRICE,
      STOCK_QUANTITY: book.STOCK_QUANTITY,
      DESCRIPTION: book.DESCRIPTION,
      SHOW_BOOK: book.SHOW_BOOK,
      COVER_URL: book.COVER_URL,
      ADDED_AT: book.ADDED_AT,
      GENRE: book.GENRE,
      AUTHORS: book.author_names ?? ''
    });
    console.log(`Book details fetched successfully:  ${book.publisher_names} ${book.TITLE}`);
  });
};

module.exports = {
  getBookById
};