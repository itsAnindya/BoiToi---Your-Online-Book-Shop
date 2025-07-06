const { pool } = require('../config/db');

// ---------------- getHomeBooks ----------------
const getHomeBooks = async (req, res) => {
  try {
    const [topBooks] = await pool.promise().query(`
      SELECT BOOK_ID, AVG(Rating) AS avg_rating
      FROM review
      GROUP BY BOOK_ID
      ORDER BY avg_rating DESC
      LIMIT 5;
    `);

    const topBookIds = topBooks.map(book => book.BOOK_ID);
    if (topBookIds.length === 0) {
      return res.status(200).json([]);
    }

    const placeholders = topBookIds.map(() => '?').join(', ');
    const [books] = await pool.promise().query(`
      SELECT id, title, isbn, published_date, publisher_id,
             page_count, language, edition, price,
             stock_quantity, description, cover_url,
             added_at, genre
      FROM book
      WHERE id IN (${placeholders});
    `, topBookIds);

    res.status(200).json(books);
  } catch (err) {
    console.error('Error in getHomeBooks:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// ---------------- showBooks ----------------
const showBooks = async (req, res) => {
  console.log('Received request to show top 5 books in each category');

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
      SELECT * FROM category_bestseller 
      WHERE \`RANK\` BETWEEN 1 AND 5
    ) AS bs
    JOIN book b ON bs.BOOK_ID = b.ID
    JOIN category c ON bs.CATEGORY_ID = c.ID
    ORDER BY bs.CATEGORY_ID, bs.\`RANK\`;
  `;

  try {
    const [results] = await pool.promise().query(query);

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
    }

    res.json(Object.values(response));
  } catch (err) {
    console.error('Error in showBooks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ---------------- getBestsellers ----------------
const getBestsellers = async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        c.ID as category_id,
        c.NAME as category_name,
        c.DESCRIPTION as category_description,
        b.ID as book_id,
        b.TITLE,
        b.PRICE,
        b.COVER_URL,
        b.STOCK_QUANTITY,
        cb.RANK,
        GROUP_CONCAT(a.NAME ORDER BY a.NAME SEPARATOR '|') as authors
      FROM category c
      JOIN category_bestseller cb ON c.ID = cb.CATEGORY_ID
      JOIN book b ON cb.BOOK_ID = b.ID
      JOIN book_author ba ON b.ID = ba.BOOK_ID
      JOIN author a ON ba.AUTHOR_ID = a.ID
      WHERE cb.RANK <= 5 
        AND b.SHOW_BOOK = 1 
        AND b.STOCK_QUANTITY >= 0
      GROUP BY c.ID, c.NAME, c.DESCRIPTION, b.ID, b.TITLE, b.PRICE, b.COVER_URL, b.STOCK_QUANTITY, cb.RANK
      ORDER BY c.NAME, cb.RANK;
    `);

    const categoriesMap = new Map();

    rows.forEach(row => {
      const categoryId = row.category_id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: row.category_name,
          description: row.category_description,
          books: []
        });
      }

      categoriesMap.get(categoryId).books.push({
        id: row.book_id,
        title: row.TITLE,
        authors: row.authors ? row.authors.split('|') : [],
        price: parseFloat(row.PRICE),
        cover_url: row.COVER_URL,
        stock_quantity: row.STOCK_QUANTITY,
        rank: row.RANK
      });
    });

    res.json(Array.from(categoriesMap.values()));
  } catch (error) {
    console.error('Error fetching bestseller books:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch bestseller books'
    });
  }
};

module.exports = {
  getHomeBooks,
  showBooks,
  getBestsellers
};
