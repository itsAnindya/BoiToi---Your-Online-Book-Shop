const db = require('../config/database');

/**
 * Get admin dashboard statistics
 */
const getAdminStats = async (req, res) => {
  try {
    console.log('Fetching admin dashboard statistics...');

    // Get all stats in parallel using Promise.all
    const statsPromises = [
      // Total Users (count all users, not just active ones)
      new Promise((resolve, reject) => {
        const usersSql = 'SELECT COUNT(*) as total_users FROM user';
        db.query(usersSql, (err, result) => {
          if (err) reject(err);
          else resolve({ total_users: result[0].total_users });
        });
      }),

      // Total Books
      new Promise((resolve, reject) => {
        const booksSql = 'SELECT COUNT(*) as total_books FROM book WHERE SHOW_BOOK = 1';
        db.query(booksSql, (err, result) => {
          if (err) reject(err);
          else resolve({ total_books: result[0].total_books });
        });
      }),

      // Total Orders
      new Promise((resolve, reject) => {
        const ordersSql = 'SELECT COUNT(*) as total_orders FROM `order`';
        db.query(ordersSql, (err, result) => {
          if (err) reject(err);
          else resolve({ total_orders: result[0].total_orders });
        });
      }),

      // Total Revenue
      new Promise((resolve, reject) => {
        const revenueSql = `
          SELECT 
            COALESCE(SUM(TOTAL_AMOUNT), 0) as total_revenue,
            COALESCE(SUM(CASE WHEN ORDER_STATUS = 'delivered' THEN TOTAL_AMOUNT ELSE 0 END), 0) as confirmed_revenue
          FROM \`order\`
        `;
        db.query(revenueSql, (err, result) => {
          if (err) reject(err);
          else resolve({ 
            total_revenue: parseFloat(result[0].total_revenue || 0),
            confirmed_revenue: parseFloat(result[0].confirmed_revenue || 0)
          });
        });
      }),

      // Order Status Breakdown
      new Promise((resolve, reject) => {
        const orderStatusSql = `
          SELECT 
            ORDER_STATUS,
            COUNT(*) as count
          FROM \`order\`
          GROUP BY ORDER_STATUS
        `;
        db.query(orderStatusSql, (err, result) => {
          if (err) reject(err);
          else {
            const statusBreakdown = {};
            result.forEach(row => {
              statusBreakdown[row.ORDER_STATUS] = row.count;
            });
            resolve({ order_status_breakdown: statusBreakdown });
          }
        });
      }),

      // Recent Activity Stats
      new Promise((resolve, reject) => {
        const recentActivitySql = `
          SELECT 
            COUNT(CASE WHEN DATE(ORDERD_AT) = CURDATE() THEN 1 END) as orders_today,
            COUNT(CASE WHEN DATE(ORDERD_AT) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as orders_this_week,
            COUNT(CASE WHEN DATE(ORDERD_AT) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as orders_this_month
          FROM \`order\`
        `;
        db.query(recentActivitySql, (err, result) => {
          if (err) reject(err);
          else resolve({
            orders_today: result[0].orders_today,
            orders_this_week: result[0].orders_this_week,
            orders_this_month: result[0].orders_this_month
          });
        });
      }),

      // Top Categories
      new Promise((resolve, reject) => {
        const categoriesSql = `
          SELECT 
            c.NAME as category_name,
            COUNT(b.ID) as book_count
          FROM category c
          LEFT JOIN book b ON c.ID = b.CATEGORY_ID AND b.SHOW_BOOK = 1
          GROUP BY c.ID, c.NAME
          ORDER BY book_count DESC
          LIMIT 5
        `;
        db.query(categoriesSql, (err, result) => {
          if (err) reject(err);
          else resolve({ top_categories: result });
        });
      })
    ];

    // Execute all queries in parallel
    const results = await Promise.all(statsPromises);

    // Combine all results
    const stats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // Add some calculated fields
    stats.revenue_per_order = stats.total_orders > 0 
      ? (stats.total_revenue / stats.total_orders).toFixed(2) 
      : 0;

    stats.books_per_category = stats.top_categories && stats.top_categories.length > 0
      ? (stats.total_books / stats.top_categories.length).toFixed(1)
      : 0;

    console.log('Admin stats fetched successfully:', {
      users: stats.total_users,
      books: stats.total_books,
      orders: stats.total_orders,
      revenue: stats.total_revenue
    });

    return res.status(200).json({
      success: true,
      message: 'Admin statistics fetched successfully',
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message || 'Internal server error'
    });
  }
};

/**
 * Get detailed user statistics
 */
const getUserStats = async (req, res) => {
  try {
    console.log('Fetching detailed user statistics...');

    const userStatsSql = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN IS_ACTIVE = 1 THEN 1 END) as active_users,
        COUNT(CASE WHEN IS_ACTIVE = 0 THEN 1 END) as inactive_users,
        COUNT(CASE WHEN DATE(CREATED_AT) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as new_users_last_30_days,
        COUNT(CASE WHEN LAST_ACTIVE >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_last_week
      FROM user
    `;

    db.query(userStatsSql, (err, result) => {
      if (err) {
        console.error('Error fetching user stats:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch user statistics',
          error: err.message
        });
      }

      const userStats = result[0];

      return res.status(200).json({
        success: true,
        message: 'User statistics fetched successfully',
        data: userStats
      });
    });

  } catch (error) {
    console.error('Error in getUserStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get detailed book statistics
 */
const getBookStats = async (req, res) => {
  try {
    console.log('Fetching detailed book statistics...');

    const bookStatsSql = `
      SELECT 
        COUNT(*) as total_books,
        COUNT(CASE WHEN SHOW_BOOK = 1 THEN 1 END) as visible_books,
        COUNT(CASE WHEN SHOW_BOOK = 0 THEN 1 END) as hidden_books,
        COUNT(CASE WHEN STOCK_QUANTITY > 0 THEN 1 END) as in_stock_books,
        COUNT(CASE WHEN STOCK_QUANTITY = 0 THEN 1 END) as out_of_stock_books,
        AVG(PRICE) as average_price,
        MIN(PRICE) as min_price,
        MAX(PRICE) as max_price,
        COUNT(DISTINCT CATEGORY_ID) as categories_with_books
      FROM book
    `;

    db.query(bookStatsSql, (err, result) => {
      if (err) {
        console.error('Error fetching book stats:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch book statistics',
          error: err.message
        });
      }

      const bookStats = result[0];
      
      // Format prices
      bookStats.average_price = parseFloat(bookStats.average_price || 0).toFixed(2);
      bookStats.min_price = parseFloat(bookStats.min_price || 0);
      bookStats.max_price = parseFloat(bookStats.max_price || 0);

      return res.status(200).json({
        success: true,
        message: 'Book statistics fetched successfully',
        data: bookStats
      });
    });

  } catch (error) {
    console.error('Error in getBookStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  getUserStats,
  getBookStats
};
