const db = require('../config/database');
const { router } = require('../routes/bookRoutes');

/**
 * Get Home Page Books
 * Returns top 5 books based on average rating
 */
const getHomeBooks = (req, res) => {
  console.log('Fetching top 5 books based on average rating');

  // Get top 5 books based on average rating
  const avgQuery = `
    SELECT BOOK_ID, AVG(Rating) AS avg_rating
    FROM review
    GROUP BY BOOK_ID
    ORDER BY avg_rating DESC
    LIMIT 5;
  `;

  db.query(avgQuery, (err, topBooks) => {
    if (err) {
      console.error('Error in avg rating query:', err);
      return res.status(500).json({ error: 'Database error while getting top books' });
    }

    const topBookIds = topBooks.map(book => book.BOOK_ID);

    if (topBookIds.length === 0) {
      console.log('No reviews found, returning empty array');
      return res.status(200).json([]);
    }

    console.log('Top 5 book IDs:', topBookIds);

    // Get book details for top 5 book IDs
    const placeholders = topBookIds.map(() => '?').join(', ');
    const bookQuery = `
      SELECT id, title, isbn, published_date, publisher_id,
             page_count, language, edition, price,
             stock_quantity, description, cover_url,
             added_at, genre
      FROM book
      WHERE id IN (${placeholders});
    `;

    db.query(bookQuery, topBookIds, (err, books) => {
      if (err) {
        console.error('Error in book info query:', err);
        return res.status(500).json({ error: 'Database error while getting book details' });
      }

      console.log(`Found ${books.length} books for home page`);
      res.status(200).json(books);
    });
  });
};

/**
 * Get Books by Category
 * Returns top 5 books in each category
 */
const getBooksByCategory = (req, res) => {
  console.log('Fetching top 5 books per category sorted by number of books');

  const query = `
  SELECT 
  c.ID AS category_id,
  c.NAME AS category_name,
  b.ID AS book_id,
  b.TITLE,
  b.COVER_URL,
  b.PRICE,
  GROUP_CONCAT(DISTINCT a.NAME ORDER BY a.NAME SEPARATOR ' · ') AS author_names,
  cb.book_count
FROM (
    SELECT CATEGORY_ID, COUNT(*) AS book_count
    FROM category_bestseller
    WHERE POSITION BETWEEN 1 AND 5
    GROUP BY CATEGORY_ID
) AS cb
JOIN category c ON c.ID = cb.CATEGORY_ID
JOIN category_bestseller bs ON bs.CATEGORY_ID = c.ID AND bs.POSITION BETWEEN 1 AND 5
JOIN book b ON b.ID = bs.BOOK_ID
LEFT JOIN book_author ba ON ba.BOOK_ID = b.ID
LEFT JOIN author a ON a.ID = ba.AUTHOR_ID
GROUP BY c.ID, b.ID, cb.book_count
ORDER BY cb.book_count DESC, c.ID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('No books found');
      return res.status(200).json([]);
    }

    const response = {};
    for (const row of results) {
      const catId = row.category_id;

      if (!response[catId]) {
        response[catId] = {
          category_id: catId,
          category_name: row.category_name,
          top_books: []
        };
      }

      response[catId].top_books.push({
        ID: row.book_id,
        TITLE: row.TITLE ?? null,
        COVER_URL: row.COVER_URL ?? null,
        PRICE: row.PRICE ?? null,
        AUTHORS: row.author_names ?? ''
      });
    }

    // Sort categories by number of books (already done in SQL), but grouping flattened it
    const finalResponse = Object.values(response);
    //for(row of finalResponse) {
      //console.log(`Category: ${row.category_name}, Books: ${row.top_books.length}`);
    //}
    //console.log(`Returning ${finalResponse.length} categories`);
    res.json(finalResponse);
  });
};


module.exports = {
  getHomeBooks,
  getBooksByCategory
};
