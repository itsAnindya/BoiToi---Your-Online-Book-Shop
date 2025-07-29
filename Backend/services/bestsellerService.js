const db = require('../config/database');

/**
 * Bestseller Service - Handle category bestseller updates
 */
class BestsellerService {
  
  /**
   * Update category bestsellers based on last 30 days sales data
   */
  static async updateCategoryBestsellers() {
    return new Promise((resolve, reject) => {
      console.log('Starting category bestseller update...');
      
      // Call the stored procedure
      const callProcedure = 'CALL UpdateCategoryBestsellers()';
      
      db.query(callProcedure, (err, results) => {
        if (err) {
          console.error('Error updating category bestsellers:', err);
          reject({
            success: false,
            message: 'Failed to update category bestsellers',
            error: err.message
          });
          return;
        }

        const summary = results[0][0]; // First result set from procedure
        console.log('Category bestsellers updated successfully:', summary);
        
        resolve({
          success: true,
          message: 'Category bestsellers updated successfully',
          data: {
            totalBestsellersUpdated: summary.total_bestsellers_updated,
            categoriesWithBestsellers: summary.categories_with_bestsellers,
            periodStart: summary.period_start,
            updatedAt: new Date().toISOString()
          }
        });
      });
    });
  }

  /**
   * Update category bestsellers using raw SQL (alternative to stored procedure)
   */
  static async updateCategoryBestsellersSQL() {
    return new Promise((resolve, reject) => {
      console.log('Starting category bestseller update (SQL method)...');
      
      db.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error('Transaction start error:', transactionErr);
          reject({
            success: false,
            message: 'Failed to start transaction',
            error: transactionErr.message
          });
          return;
        }

        // Clear existing monthly bestseller data for current period
        const clearSql = `
          DELETE FROM category_bestseller 
          WHERE PERIOD_TYPE = 'MONTHLY' 
          AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
        `;

        db.query(clearSql, (clearErr) => {
          if (clearErr) {
            console.error('Error clearing old bestseller data:', clearErr);
            return db.rollback(() => {
              reject({
                success: false,
                message: 'Failed to clear old bestseller data',
                error: clearErr.message
              });
            });
          }

          // Insert new bestseller data
          const insertSql = `
            INSERT INTO category_bestseller (PERIOD_TYPE, PERIOD_START, CATEGORY_ID, POSITION, BOOK_ID)
            SELECT 
                'MONTHLY' as PERIOD_TYPE,
                DATE_FORMAT(CURDATE(), '%Y-%m-01') as PERIOD_START,
                ranked_books.CATEGORY_ID,
                ranked_books.book_rank as POSITION,
                ranked_books.BOOK_ID
            FROM (
                SELECT 
                    c.ID as CATEGORY_ID,
                    b.ID as BOOK_ID,
                    SUM(ob.QUANTITY) as total_sold,
                    ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY SUM(ob.QUANTITY) DESC) as book_rank
                FROM \`order\` o
                INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
                INNER JOIN book b ON ob.BOOK_ID = b.ID
                INNER JOIN category c ON b.CATEGORY_ID = c.ID
                WHERE 
                    o.ORDER_STATUS = 'delivered'
                    AND o.ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                    AND b.SHOW_BOOK = 1
                    AND b.CATEGORY_ID IS NOT NULL
                GROUP BY c.ID, b.ID
                HAVING total_sold > 0
            ) ranked_books
            WHERE ranked_books.book_rank <= 10
            ORDER BY ranked_books.CATEGORY_ID, ranked_books.book_rank
          `;

          db.query(insertSql, (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error inserting new bestseller data:', insertErr);
              return db.rollback(() => {
                reject({
                  success: false,
                  message: 'Failed to insert new bestseller data',
                  error: insertErr.message
                });
              });
            }

            // Get summary of updated data
            const summarySql = `
              SELECT 
                  COUNT(*) as total_bestsellers_updated,
                  COUNT(DISTINCT CATEGORY_ID) as categories_with_bestsellers,
                  DATE_FORMAT(CURDATE(), '%Y-%m-01') as period_start
              FROM category_bestseller 
              WHERE PERIOD_TYPE = 'MONTHLY' 
              AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
            `;

            db.query(summarySql, (summaryErr, summaryResult) => {
              if (summaryErr) {
                console.error('Error getting summary:', summaryErr);
                return db.rollback(() => {
                  reject({
                    success: false,
                    message: 'Failed to get update summary',
                    error: summaryErr.message
                  });
                });
              }

              db.commit((commitErr) => {
                if (commitErr) {
                  console.error('Transaction commit error:', commitErr);
                  return db.rollback(() => {
                    reject({
                      success: false,
                      message: 'Failed to commit transaction',
                      error: commitErr.message
                    });
                  });
                }

                const summary = summaryResult[0];
                console.log('Category bestsellers updated successfully:', summary);
                
                resolve({
                  success: true,
                  message: 'Category bestsellers updated successfully',
                  data: {
                    totalBestsellersUpdated: summary.total_bestsellers_updated,
                    categoriesWithBestsellers: summary.categories_with_bestsellers,
                    periodStart: summary.period_start,
                    updatedAt: new Date().toISOString(),
                    rowsAffected: insertResult.affectedRows
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  /**
   * Get current bestsellers by category
   */
  static async getBestsellersByCategory(categoryId = null, limit = 10) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
            cb.CATEGORY_ID,
            cb.POSITION,
            cb.BOOK_ID,
            cb.PERIOD_START,
            b.TITLE,
            b.PRICE,
            b.COVER_URL,
            c.NAME as CATEGORY_NAME,
            COALESCE(GROUP_CONCAT(DISTINCT a.NAME SEPARATOR ', '), 'Unknown Author') as AUTHORS
        FROM category_bestseller cb
        INNER JOIN book b ON cb.BOOK_ID = b.ID
        INNER JOIN category c ON cb.CATEGORY_ID = c.ID
        LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
        LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
        WHERE cb.PERIOD_TYPE = 'MONTHLY'
        AND cb.PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
      `;

      const queryParams = [];

      if (categoryId) {
        sql += ' AND cb.CATEGORY_ID = ?';
        queryParams.push(categoryId);
      }

      sql += `
        GROUP BY cb.CATEGORY_ID, cb.POSITION, cb.BOOK_ID, cb.PERIOD_START, 
                 b.TITLE, b.PRICE, b.COVER_URL, c.NAME
        ORDER BY cb.CATEGORY_ID, cb.POSITION
        LIMIT ?
      `;
      queryParams.push(limit);

      db.query(sql, queryParams, (err, results) => {
        if (err) {
          console.error('Error fetching bestsellers:', err);
          reject({
            success: false,
            message: 'Failed to fetch bestsellers',
            error: err.message
          });
          return;
        }

        // Group results by category
        const bestsellersByCategory = {};
        results.forEach(row => {
          if (!bestsellersByCategory[row.CATEGORY_ID]) {
            bestsellersByCategory[row.CATEGORY_ID] = {
              categoryId: row.CATEGORY_ID,
              categoryName: row.CATEGORY_NAME,
              periodStart: row.PERIOD_START,
              books: []
            };
          }

          bestsellersByCategory[row.CATEGORY_ID].books.push({
            position: row.POSITION,
            bookId: row.BOOK_ID,
            title: row.TITLE,
            price: parseFloat(row.PRICE || 0),
            coverUrl: row.COVER_URL || '/images/books/defaultbook.jpg',
            authors: row.AUTHORS
          });
        });

        resolve({
          success: true,
          message: 'Bestsellers fetched successfully',
          data: Object.values(bestsellersByCategory)
        });
      });
    });
  }
}

module.exports = BestsellerService;
