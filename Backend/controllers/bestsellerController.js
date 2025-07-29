const db = require('../config/database');

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
  triggerBestsellersUpdate
};
