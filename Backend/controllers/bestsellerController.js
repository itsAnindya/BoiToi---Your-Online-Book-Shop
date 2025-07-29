const db = require('../config/database');

/**
 * Get all categories for the bestsellers page
 */
const getCategories = async (req, res) => {
  try {
    console.log('Fetching categories for bestsellers page...');
    
    const categoriesQuery = `
      SELECT 
        c.ID,
        c.NAME,
        c.DESCRIPTION,
        COUNT(DISTINCT b.ID) as book_count
      FROM category c
      LEFT JOIN book b ON c.ID = b.CATEGORY_ID AND b.SHOW_BOOK = 1
      WHERE c.ID IN (
        SELECT DISTINCT CATEGORY_ID 
        FROM category_bestseller 
        WHERE PERIOD_TYPE = 'MONTHLY'
        AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
      )
      GROUP BY c.ID, c.NAME, c.DESCRIPTION
      ORDER BY c.NAME
    `;

    db.query(categoriesQuery, (err, categories) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch categories',
          error: err.message
        });
      }

      console.log(`Found ${categories.length} categories with bestsellers`);
      
      return res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: categories
      });
    });

  } catch (error) {
    console.error('Unexpected error in getCategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get bestsellers for a specific category with ratings
 */
const getBestsellersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 10 } = req.query;
    
    console.log(`Fetching bestsellers for category ${categoryId}, limit: ${limit}`);

    const bestsellersQuery = `
      SELECT 
        cb.POSITION,
        cb.BOOK_ID,
        b.TITLE,
        b.PRICE,
        b.COVER_URL,
        b.ISBN,
        b.DESCRIPTION,
        b.STOCK_QUANTITY,
        c.NAME as CATEGORY_NAME,
        c.ID as CATEGORY_ID,
        COALESCE(GROUP_CONCAT(DISTINCT a.NAME SEPARATOR ', '), 'Unknown Author') as AUTHORS,
        COALESCE(AVG(r.RATING), 0) as AVERAGE_RATING,
        COUNT(DISTINCT r.ID) as REVIEW_COUNT,
        cb.PERIOD_START
      FROM category_bestseller cb
      INNER JOIN book b ON cb.BOOK_ID = b.ID
      INNER JOIN category c ON cb.CATEGORY_ID = c.ID
      LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
      LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
      LEFT JOIN review r ON b.ID = r.BOOK_ID
      WHERE cb.PERIOD_TYPE = 'MONTHLY'
        AND cb.PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND cb.CATEGORY_ID = ?
        AND b.SHOW_BOOK = 1
      GROUP BY cb.POSITION, cb.BOOK_ID, b.TITLE, b.PRICE, b.COVER_URL, 
               b.ISBN, b.DESCRIPTION, b.STOCK_QUANTITY, c.NAME, c.ID, cb.PERIOD_START
      ORDER BY cb.POSITION
      LIMIT ?
    `;

    db.query(bestsellersQuery, [categoryId, parseInt(limit)], (err, bestsellers) => {
      if (err) {
        console.error('Error fetching bestsellers:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch bestsellers',
          error: err.message
        });
      }

      console.log(`Found ${bestsellers.length} bestsellers for category ${categoryId}`);

      // Format the response
      const formattedBestsellers = bestsellers.map(book => ({
        position: book.POSITION,
        ID: book.BOOK_ID,
        TITLE: book.TITLE,
        PRICE: parseFloat(book.PRICE || 0),
        COVER_URL: book.COVER_URL || '/images/books/defaultbook.jpg',
        ISBN: book.ISBN,
        DESCRIPTION: book.DESCRIPTION,
        STOCK_QUANTITY: book.STOCK_QUANTITY,
        AUTHORS: book.AUTHORS,
        AVERAGE_RATING: parseFloat(book.AVERAGE_RATING || 0).toFixed(1),
        REVIEW_COUNT: book.REVIEW_COUNT,
        categoryName: book.CATEGORY_NAME,
        categoryId: book.CATEGORY_ID,
        periodStart: book.PERIOD_START
      }));

      return res.status(200).json({
        success: true,
        message: 'Bestsellers fetched successfully',
        data: {
          categoryId: parseInt(categoryId),
          categoryName: bestsellers.length > 0 ? bestsellers[0].CATEGORY_NAME : 'Unknown',
          books: formattedBestsellers,
          totalCount: bestsellers.length,
          periodStart: bestsellers.length > 0 ? bestsellers[0].PERIOD_START : null
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in getBestsellersByCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all bestsellers grouped by category
 */
const getAllBestsellers = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    console.log(`Fetching all bestsellers, limit: ${limit}`);

    const allBestsellersQuery = `
      SELECT 
        cb.CATEGORY_ID,
        cb.POSITION,
        cb.BOOK_ID,
        b.TITLE,
        b.PRICE,
        b.COVER_URL,
        b.ISBN,
        b.DESCRIPTION,
        b.STOCK_QUANTITY,
        c.NAME as CATEGORY_NAME,
        COALESCE(GROUP_CONCAT(DISTINCT a.NAME SEPARATOR ', '), 'Unknown Author') as AUTHORS,
        COALESCE(AVG(r.RATING), 0) as AVERAGE_RATING,
        COUNT(DISTINCT r.ID) as REVIEW_COUNT,
        cb.PERIOD_START
      FROM category_bestseller cb
      INNER JOIN book b ON cb.BOOK_ID = b.ID
      INNER JOIN category c ON cb.CATEGORY_ID = c.ID
      LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
      LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
      LEFT JOIN review r ON b.ID = r.BOOK_ID
      WHERE cb.PERIOD_TYPE = 'MONTHLY'
        AND cb.PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND b.SHOW_BOOK = 1
      GROUP BY cb.CATEGORY_ID, cb.POSITION, cb.BOOK_ID, b.TITLE, b.PRICE, b.COVER_URL, 
               b.ISBN, b.DESCRIPTION, b.STOCK_QUANTITY, c.NAME, cb.PERIOD_START
      ORDER BY cb.CATEGORY_ID, cb.POSITION
      LIMIT ?
    `;

    db.query(allBestsellersQuery, [parseInt(limit)], (err, results) => {
      if (err) {
        console.error('Error fetching all bestsellers:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch bestsellers',
          error: err.message
        });
      }

      console.log(`Found ${results.length} total bestseller entries`);

      // Group by category
      const bestsellersByCategory = {};
      results.forEach(book => {
        if (!bestsellersByCategory[book.CATEGORY_ID]) {
          bestsellersByCategory[book.CATEGORY_ID] = {
            categoryId: book.CATEGORY_ID,
            categoryName: book.CATEGORY_NAME,
            periodStart: book.PERIOD_START,
            books: []
          };
        }

        bestsellersByCategory[book.CATEGORY_ID].books.push({
          position: book.POSITION,
          ID: book.BOOK_ID,
          TITLE: book.TITLE,
          PRICE: parseFloat(book.PRICE || 0),
          COVER_URL: book.COVER_URL || '/images/books/defaultbook.jpg',
          ISBN: book.ISBN,
          DESCRIPTION: book.DESCRIPTION,
          STOCK_QUANTITY: book.STOCK_QUANTITY,
          AUTHORS: book.AUTHORS,
          AVERAGE_RATING: parseFloat(book.AVERAGE_RATING || 0).toFixed(1),
          REVIEW_COUNT: book.REVIEW_COUNT
        });
      });

      return res.status(200).json({
        success: true,
        message: 'All bestsellers fetched successfully',
        data: Object.values(bestsellersByCategory)
      });
    });

  } catch (error) {
    console.error('Unexpected error in getAllBestsellers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update Category Bestsellers
 * Updates the category_bestseller table based on sales from the last 30 days
 */
const updateCategoryBestsellers = async (req, res) => {
  console.log('Starting category bestsellers update...');
  
  try {
    // Start transaction
    db.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        console.error('Transaction start error:', transactionErr);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during bestsellers update' 
        });
      }

      try {
        // Step 1: Calculate bestsellers for the current month
        const calculateBestsellersQuery = `
          WITH book_category_sales AS (
              SELECT 
                  bc.CATEGORY_ID,
                  bc.BOOK_ID,
                  SUM(ob.QUANTITY) as total_quantity_sold,
                  COUNT(DISTINCT o.ID) as total_orders
              FROM \`order\` o
              INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
              INNER JOIN book b ON ob.BOOK_ID = b.ID
              INNER JOIN book_category bc ON b.ID = bc.BOOK_ID
              WHERE 
                  o.ORDER_STATUS = 'delivered'
                  AND o.ORDERD_AT >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  AND b.SHOW_BOOK = 1
              GROUP BY bc.CATEGORY_ID, bc.BOOK_ID
          ),
          ranked_bestsellers AS (
              SELECT 
                  CATEGORY_ID,
                  BOOK_ID,
                  total_quantity_sold,
                  total_orders,
                  ROW_NUMBER() OVER (
                      PARTITION BY CATEGORY_ID 
                      ORDER BY total_quantity_sold DESC, total_orders DESC, BOOK_ID ASC
                  ) as book_rank
              FROM book_category_sales
          )
          SELECT 
              'MONTHLY' as PERIOD_TYPE,
              DATE_FORMAT(NOW(), '%Y-%m-01') as PERIOD_START,
              CATEGORY_ID,
              book_rank as POSITION,
              BOOK_ID
          FROM ranked_bestsellers 
          WHERE book_rank <= 10
          ORDER BY CATEGORY_ID, book_rank
        `;

        db.query(calculateBestsellersQuery, (err, bestsellers) => {
          if (err) {
            console.error('Error calculating bestsellers:', err);
            return db.rollback(() => {
              res.status(500).json({ 
                success: false,
                message: 'Error calculating bestsellers' 
              });
            });
          }

          console.log(`Found ${bestsellers.length} bestseller entries to update`);

          // Step 2: Clear existing monthly data for current month
          const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
          const clearQuery = `
            DELETE FROM category_bestseller 
            WHERE PERIOD_TYPE = 'MONTHLY' 
            AND PERIOD_START = ?
          `;

          db.query(clearQuery, [currentMonth], (clearErr, clearResult) => {
            if (clearErr) {
              console.error('Error clearing old bestsellers:', clearErr);
              return db.rollback(() => {
                res.status(500).json({ 
                  success: false,
                  message: 'Error clearing old bestsellers data' 
                });
              });
            }

            console.log(`Cleared ${clearResult.affectedRows} old bestseller entries`);

            if (bestsellers.length === 0) {
              // No bestsellers to insert - commit and return
              db.commit((commitErr) => {
                if (commitErr) {
                  console.error('Transaction commit error:', commitErr);
                  return db.rollback(() => {
                    res.status(500).json({ 
                      success: false,
                      message: 'Error committing transaction' 
                    });
                  });
                }

                console.log('Category bestsellers update completed - no data to insert');
                return res.status(200).json({
                  success: true,
                  message: 'Category bestsellers updated successfully',
                  data: {
                    cleared: clearResult.affectedRows,
                    inserted: 0,
                    categories_updated: 0
                  }
                });
              });
              return;
            }

            // Step 3: Insert new bestsellers data
            const insertQuery = `
              INSERT INTO category_bestseller (PERIOD_TYPE, PERIOD_START, CATEGORY_ID, POSITION, BOOK_ID) 
              VALUES ?
            `;

            const insertData = bestsellers.map(item => [
              item.PERIOD_TYPE,
              item.PERIOD_START,
              item.CATEGORY_ID,
              item.POSITION,
              item.BOOK_ID
            ]);

            db.query(insertQuery, [insertData], (insertErr, insertResult) => {
              if (insertErr) {
                console.error('Error inserting new bestsellers:', insertErr);
                return db.rollback(() => {
                  res.status(500).json({ 
                    success: false,
                    message: 'Error inserting new bestsellers data' 
                  });
                });
              }

              console.log(`Inserted ${insertResult.affectedRows} new bestseller entries`);

              // Commit transaction
              db.commit((commitErr) => {
                if (commitErr) {
                  console.error('Transaction commit error:', commitErr);
                  return db.rollback(() => {
                    res.status(500).json({ 
                      success: false,
                      message: 'Error committing transaction' 
                    });
                  });
                }

                // Calculate number of unique categories updated
                const categoriesUpdated = [...new Set(bestsellers.map(item => item.CATEGORY_ID))].length;

                console.log('Category bestsellers update completed successfully');
                return res.status(200).json({
                  success: true,
                  message: 'Category bestsellers updated successfully',
                  data: {
                    cleared: clearResult.affectedRows,
                    inserted: insertResult.affectedRows,
                    categories_updated: categoriesUpdated,
                    period_type: 'MONTHLY',
                    period_start: currentMonth
                  }
                });
              });
            });
          });
        });

      } catch (error) {
        console.error('Unexpected error in updateCategoryBestsellers transaction:', error);
        return db.rollback(() => {
          res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
          });
        });
      }
    });

  } catch (error) {
    console.error('Unexpected error in updateCategoryBestsellers:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get Current Bestsellers Status
 * Returns information about the current bestsellers data
 */
const getBestsellersStatus = async (req, res) => {
  try {
    const statusQuery = `
      SELECT 
        PERIOD_TYPE,
        PERIOD_START,
        COUNT(*) as total_entries,
        COUNT(DISTINCT CATEGORY_ID) as categories_count,
        MIN(POSITION) as min_position,
        MAX(POSITION) as max_position
      FROM category_bestseller 
      WHERE PERIOD_TYPE = 'MONTHLY'
      GROUP BY PERIOD_TYPE, PERIOD_START
      ORDER BY PERIOD_START DESC
      LIMIT 5
    `;

    db.query(statusQuery, (err, results) => {
      if (err) {
        console.error('Error fetching bestsellers status:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error fetching bestsellers status' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Bestsellers status fetched successfully',
        data: results
      });
    });

  } catch (error) {
    console.error('Unexpected error in getBestsellersStatus:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Manual Trigger for Bestsellers Update
 * Allows manual triggering of the bestsellers update process
 */
const triggerBestsellersUpdate = async (req, res) => {
  console.log('Manual bestsellers update triggered');
  
  // Check if user is admin (optional security check)
  const userRole = req.body.userRole || req.headers['user-role'];
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can trigger bestsellers update'
    });
  }

  // Call the main update function
  return updateCategoryBestsellers(req, res);
};

module.exports = {
  updateCategoryBestsellers,
  getBestsellersStatus,
  triggerBestsellersUpdate,
  getCategories,
  getBestsellersByCategory,
  getAllBestsellers
};
