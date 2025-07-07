const db = require('../config/database');

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
  console.log('Fetching top 5 books in each category');
  
  const query = `
    SELECT 
      c.ID AS category_id, 
      c.NAME AS category_name, 
      c.DESCRIPTION AS category_description, 
      c.PARENT_ID AS category_parent_id,
      b.ID AS book_id,
      b.TITLE,
      b.ISBN,
      b.PUBLISHED_DATE,
      b.PUBLISHER_ID,
      b.PAGE_COUNT,
      b.LANGUAGE,
      b.EDITION,
      b.PRICE,
      b.STOCK_QUANTITY,
      b.DESCRIPTION AS book_description,
      b.SHOW_BOOK,
      b.COVER_URL,
      b.ADDED_AT,
      b.GENRE
    FROM (
      SELECT * 
      FROM category_bestseller 
      WHERE \`RANK\` BETWEEN 1 AND 5
    ) AS bs
    JOIN book b ON bs.BOOK_ID = b.ID
    JOIN category c ON bs.CATEGORY_ID = c.ID
    ORDER BY bs.CATEGORY_ID, bs.\`RANK\`;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('No category bestsellers found');
      return res.status(200).json([]);
    }

    // Group books by category
    const response = {};

    for (const row of results) {
      const catId = row.category_id;
      
      if (!response[catId]) {
        response[catId] = {
          category: {
            ID: row.category_id,
            NAME: row.category_name ?? null,
            DESCRIPTION: row.category_description ?? null,
            PARENT_ID: row.category_parent_id ?? null
          },
          top_books: []
        };
      }

      response[catId].top_books.push({
        ID: row.book_id,
        TITLE: row.TITLE ?? null,
        ISBN: row.ISBN ?? null,
        PUBLISHED_DATE: row.PUBLISHED_DATE ?? null,
        PUBLISHER_ID: row.PUBLISHER_ID ?? null,
        PAGE_COUNT: row.PAGE_COUNT ?? null,
        LANGUAGE: row.LANGUAGE ?? null,
        EDITION: row.EDITION ?? null,
        PRICE: row.PRICE ?? null,
        STOCK_QUANTITY: row.STOCK_QUANTITY ?? null,
        DESCRIPTION: row.book_description ?? null,
        SHOW_BOOK: row.SHOW_BOOK ?? null,
        COVER_URL: row.COVER_URL ?? null,
        ADDED_AT: row.ADDED_AT ?? null,
        GENRE: row.GENRE ?? null
      });
      
      console.log(`Added book "${row.TITLE}" with price ${row.PRICE} to category ${row.category_name}`);
    }

    console.log(`Returning ${Object.keys(response).length} categories with books`);
    res.json(Object.values(response));
  });
};

module.exports = {
  getHomeBooks,
  getBooksByCategory
};