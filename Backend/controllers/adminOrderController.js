const db = require('../config/database');

/**
 * Get all orders with comprehensive details for admin management
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, payment_status, limit = 50, offset = 0, sort = 'newest' } = req.query;
    
    let whereConditions = [];
    let queryParams = [];
    
    // Add status filter if provided
    if (status && status !== 'all') {
      whereConditions.push('o.ORDER_STATUS = ?');
      queryParams.push(status);
    }
    
    // Add payment status filter if provided
    if (payment_status && payment_status !== 'all') {
      whereConditions.push('p.PAYMENT_STATUS = ?');
      queryParams.push(payment_status);
    }
    
    // Build WHERE clause
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Build ORDER clause
    let orderClause;
    switch (sort) {
      case 'oldest':
        orderClause = 'ORDER BY o.ORDERD_AT ASC';
        break;
      case 'amount_high':
        orderClause = 'ORDER BY o.TOTAL_AMOUNT DESC';
        break;
      case 'amount_low':
        orderClause = 'ORDER BY o.TOTAL_AMOUNT ASC';
        break;
      default: // newest
        orderClause = 'ORDER BY o.ORDERD_AT DESC';
    }
    
    const sql = `
      SELECT 
        o.ID as order_id,
        o.USER_ID,
        o.ORDERD_AT,
        o.SHIPPING_ADDRESS,
        o.ORDER_STATUS,
        o.SHIPPING_FEE,
        o.TOTAL_AMOUNT,
        o.STATUS_UPDATED_BY,
        o.STATUS_UPDATED_AT,
        u.USERNAME,
        u.EMAIL,
        u.FIRST_NAME,
        u.LAST_NAME,
        u.PHONE,
        p.ID as payment_id,
        p.PAYMENT_DATE,
        p.PAYMENT_METHOD,
        p.AMOUNT as payment_amount,
        p.PAYMENT_STATUS,
        p.TRANSACTION_ID,
        admin_user.USERNAME as updated_by_admin,
        (SELECT COUNT(*) FROM order_book ob WHERE ob.ORDER_ID = o.ID) as total_books
      FROM \`order\` o
      LEFT JOIN \`user\` u ON o.USER_ID = u.ID
      LEFT JOIN \`payment\` p ON o.ID = p.ORDER_ID
      LEFT JOIN \`admin\` a ON o.STATUS_UPDATED_BY = a.USER_ID
      LEFT JOIN \`user\` admin_user ON a.USER_ID = admin_user.ID
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    db.query(sql, queryParams, (err, results) => {
      if (err) {
        console.error('Database error fetching orders:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error fetching orders: ' + err.message 
        });
      }
      
      // Transform results to match frontend expectations
      const orders = results.map(row => ({
        id: row.order_id,
        user_id: row.USER_ID,
        customer: {
          id: row.USER_ID,
          name: `${row.FIRST_NAME || ''} ${row.LAST_NAME || ''}`.trim() || row.USERNAME,
          email: row.EMAIL,
          phone: row.PHONE
        },
        ordered_at: row.ORDERD_AT,
        shipping_address: row.SHIPPING_ADDRESS,
        order_status: row.ORDER_STATUS,
        shipping_fee: parseFloat(row.SHIPPING_FEE) || 0,
        total_amount: parseFloat(row.TOTAL_AMOUNT) || 0,
        status_updated_by: row.STATUS_UPDATED_BY,
        status_updated_at: row.STATUS_UPDATED_AT,
        updated_by_admin: row.updated_by_admin,
        total_books: row.total_books || 0,
        payment: row.payment_id ? {
          id: row.payment_id,
          payment_date: row.PAYMENT_DATE,
          payment_method: row.PAYMENT_METHOD,
          amount: parseFloat(row.payment_amount) || 0,
          payment_status: row.PAYMENT_STATUS,
          transaction_id: row.TRANSACTION_ID
        } : null
      }));
      
      console.log(`Fetched ${orders.length} orders for admin`);
      res.json({
        success: true,
        orders,
        total: orders.length
      });
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get detailed order information including books
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Get order basic information
    const orderSql = `
      SELECT 
        o.ID as order_id,
        o.USER_ID,
        o.ORDERD_AT,
        o.SHIPPING_ADDRESS,
        o.ORDER_STATUS,
        o.SHIPPING_FEE,
        o.TOTAL_AMOUNT,
        o.STATUS_UPDATED_BY,
        o.STATUS_UPDATED_AT,
        u.USERNAME,
        u.EMAIL,
        u.FIRST_NAME,
        u.LAST_NAME,
        u.PHONE,
        p.ID as payment_id,
        p.PAYMENT_DATE,
        p.PAYMENT_METHOD,
        p.AMOUNT as payment_amount,
        p.PAYMENT_STATUS,
        p.TRANSACTION_ID,
        admin_user.USERNAME as updated_by_admin
      FROM \`order\` o
      LEFT JOIN \`user\` u ON o.USER_ID = u.ID
      LEFT JOIN \`payment\` p ON o.ID = p.ORDER_ID
      LEFT JOIN \`admin\` a ON o.STATUS_UPDATED_BY = a.USER_ID
      LEFT JOIN \`user\` admin_user ON a.USER_ID = admin_user.ID
      WHERE o.ID = ?
    `;
    
    db.query(orderSql, [parseInt(orderId)], (err, orderResults) => {
      if (err) {
        console.error('Database error fetching order details:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error fetching order details: ' + err.message
        });
      }
      
      if (orderResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      const orderData = orderResults[0];
      
      // Get order books
      const booksSql = `
        SELECT 
          ob.BOOK_ID,
          ob.QUANTITY,
          b.TITLE,
          b.ISBN,
          b.PRICE,
          b.COVER_URL,
          COALESCE(GROUP_CONCAT(DISTINCT a.NAME SEPARATOR ', '), 'Unknown Author') as authors
        FROM order_book ob
        JOIN book b ON ob.BOOK_ID = b.ID
        LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
        LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
        WHERE ob.ORDER_ID = ?
        GROUP BY ob.BOOK_ID, ob.QUANTITY, b.TITLE, b.ISBN, b.PRICE, b.COVER_URL
      `;
      
      db.query(booksSql, [parseInt(orderId)], (booksErr, booksResults) => {
        if (booksErr) {
          console.error('Database error fetching order books:', booksErr);
          return res.status(500).json({
            success: false,
            message: 'Server error fetching order books: ' + booksErr.message
          });
        }
        
        // Transform results
        const order = {
          id: orderData.order_id,
          user_id: orderData.USER_ID,
          customer: {
            id: orderData.USER_ID,
            name: `${orderData.FIRST_NAME || ''} ${orderData.LAST_NAME || ''}`.trim() || orderData.USERNAME,
            email: orderData.EMAIL,
            phone: orderData.PHONE
          },
          ordered_at: orderData.ORDERD_AT,
          shipping_address: orderData.SHIPPING_ADDRESS,
          order_status: orderData.ORDER_STATUS,
          shipping_fee: parseFloat(orderData.SHIPPING_FEE) || 0,
          total_amount: parseFloat(orderData.TOTAL_AMOUNT) || 0,
          status_updated_by: orderData.STATUS_UPDATED_BY,
          status_updated_at: orderData.STATUS_UPDATED_AT,
          updated_by_admin: orderData.updated_by_admin,
          payment: orderData.payment_id ? {
            id: orderData.payment_id,
            payment_date: orderData.PAYMENT_DATE,
            payment_method: orderData.PAYMENT_METHOD,
            amount: parseFloat(orderData.payment_amount) || 0,
            payment_status: orderData.PAYMENT_STATUS,
            transaction_id: orderData.TRANSACTION_ID
          } : null,
          books: booksResults.map(book => ({
            book_id: book.BOOK_ID,
            title: book.TITLE,
            author: book.authors,
            isbn: book.ISBN,
            price: parseFloat(book.PRICE) || 0,
            quantity: book.QUANTITY,
            cover_url: book.COVER_URL
          }))
        };
        
        res.json({
          success: true,
          order
        });
      });
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update order status and/or payment status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { admin_id, order_status, payment_status } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required'
      });
    }
    
    if (!order_status && !payment_status) {
      return res.status(400).json({
        success: false,
        message: 'At least one status (order or payment) must be provided'
      });
    }
    
    // Verify admin exists
    const checkAdminSql = 'SELECT USER_ID FROM admin WHERE USER_ID = ?';
    db.query(checkAdminSql, [parseInt(admin_id)], (err, adminResults) => {
      if (err) {
        console.error('Error checking admin:', err);
        return res.status(500).json({
          success: false,
          message: 'Error verifying admin: ' + err.message
        });
      }
      
      if (adminResults.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID. User is not an admin or does not exist.'
        });
      }
      
      // Start transaction
      db.beginTransaction((transErr) => {
        if (transErr) {
          console.error('Transaction start error:', transErr);
          return res.status(500).json({
            success: false,
            message: 'Server error during status update'
          });
        }
        
        let updateQueries = [];
        let queryParams = [];
        
        // Update order status if provided
        if (order_status) {
          const updateOrderSql = `
            UPDATE \`order\` 
            SET ORDER_STATUS = ?, STATUS_UPDATED_BY = ?, STATUS_UPDATED_AT = NOW()
            WHERE ID = ?
          `;
          updateQueries.push({
            sql: updateOrderSql,
            params: [order_status, parseInt(admin_id), parseInt(orderId)]
          });
        }
        
        // Update payment status if provided
        if (payment_status) {
          const updatePaymentSql = `
            UPDATE payment 
            SET PAYMENT_STATUS = ?
            WHERE ORDER_ID = ?
          `;
          updateQueries.push({
            sql: updatePaymentSql,
            params: [payment_status, parseInt(orderId)]
          });
        }
        
        // Execute all update queries
        let completedQueries = 0;
        let hasError = false;
        
        updateQueries.forEach((query) => {
          db.query(query.sql, query.params, (updateErr, result) => {
            if (updateErr && !hasError) {
              hasError = true;
              console.error('Database error during status update:', updateErr);
              return db.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: 'Server error updating status: ' + updateErr.message
                });
              });
            }
            
            completedQueries++;
            
            if (completedQueries === updateQueries.length && !hasError) {
              db.commit((commitErr) => {
                if (commitErr) {
                  console.error('Transaction commit error:', commitErr);
                  return db.rollback(() => {
                    res.status(500).json({
                      success: false,
                      message: 'Server error committing changes'
                    });
                  });
                }
                
                console.log(`Order ${orderId} status updated by admin ${admin_id}`);
                res.json({
                  success: true,
                  message: 'Order status updated successfully',
                  order_id: parseInt(orderId),
                  updated_by: parseInt(admin_id),
                  order_status: order_status || undefined,
                  payment_status: payment_status || undefined
                });
              });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get order statistics for admin dashboard
 */
const getOrderStatistics = async (req, res) => {
  try {
    const statsSql = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN ORDER_STATUS = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN ORDER_STATUS = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN ORDER_STATUS = 'processing' THEN 1 ELSE 0 END) as processing_orders,
        SUM(CASE WHEN ORDER_STATUS = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN ORDER_STATUS = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN ORDER_STATUS = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(TOTAL_AMOUNT) as total_revenue,
        AVG(TOTAL_AMOUNT) as average_order_value,
        (SELECT COUNT(*) FROM payment WHERE PAYMENT_STATUS = 'paid') as paid_orders,
        (SELECT COUNT(*) FROM payment WHERE PAYMENT_STATUS = 'pending') as pending_payments,
        (SELECT COUNT(*) FROM payment WHERE PAYMENT_STATUS = 'failed') as failed_payments
      FROM \`order\`
    `;
    
    db.query(statsSql, (err, results) => {
      if (err) {
        console.error('Database error fetching order statistics:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error fetching statistics: ' + err.message
        });
      }
      
      const stats = results[0];
      
      res.json({
        success: true,
        statistics: {
          total_orders: stats.total_orders || 0,
          pending_orders: stats.pending_orders || 0,
          confirmed_orders: stats.confirmed_orders || 0,
          processing_orders: stats.processing_orders || 0,
          shipped_orders: stats.shipped_orders || 0,
          delivered_orders: stats.delivered_orders || 0,
          cancelled_orders: stats.cancelled_orders || 0,
          total_revenue: parseFloat(stats.total_revenue) || 0,
          average_order_value: parseFloat(stats.average_order_value) || 0,
          paid_orders: stats.paid_orders || 0,
          pending_payments: stats.pending_payments || 0,
          failed_payments: stats.failed_payments || 0
        }
      });
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getOrderStatistics
};
