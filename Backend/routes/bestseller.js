// routes/bestsellers.js
import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/bestsellers', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.ID AS category_id,
        c.NAME AS category_name,
        c.DESCRIPTION AS category_description,
        b.ID AS book_id,
        b.TITLE,
        b.PRICE,
        b.COVER_URL,
        b.STOCK_QUANTITY,
        cb.RANK,
        GROUP_CONCAT(a.NAME ORDER BY a.NAME SEPARATOR '|') AS authors
      FROM category c
      JOIN category_bestseller cb ON c.ID = cb.CATEGORY_ID
      JOIN book b                ON cb.BOOK_ID = b.ID
      JOIN book_author ba        ON b.ID = ba.BOOK_ID
      JOIN author a              ON ba.AUTHOR_ID = a.ID
      WHERE cb.RANK <= 5
        AND b.SHOW_BOOK = 1
        AND b.STOCK_QUANTITY >= 0
      GROUP BY c.ID, c.NAME, c.DESCRIPTION,
               b.ID, b.TITLE, b.PRICE, b.COVER_URL,
               b.STOCK_QUANTITY, cb.RANK
      ORDER BY c.NAME, cb.RANK;
    `);

    const map = new Map();
    rows.forEach(r => {
      if (!map.has(r.category_id)) {
        map.set(r.category_id, {
          id: r.category_id,
          name: r.category_name,
          description: r.category_description,
          books: []
        });
      }
      map.get(r.category_id).books.push({
        id: r.book_id,
        title: r.TITLE,
        authors: r.authors?.split('|') ?? [],
        price: Number(r.PRICE),
        cover_url: r.COVER_URL,
        stock_quantity: r.STOCK_QUANTITY,
        rank: r.RANK,
      });
    });

    res.json([...map.values()]);
  } catch (err) {
    next(err);
  }
});

export default router;
