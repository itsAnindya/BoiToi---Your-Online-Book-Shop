const db = require('../config/database');

/**
 * Place order - Convert cart items to order
 */
const placeOrder = async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    console.log(`Placing order for user ${user_id}`);

    // Start a transaction to ensure all operations succeed or fail together
    db.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        console.error('Transaction start error:', transactionErr);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during order processing' 
        });
      }

      try {
        // First, get all cart items for the user with book details
        const getCartSql = `
          SELECT 
            c.book_id,
            c.quantity,
            b.price,
            b.title
          FROM cart c
          JOIN book b ON c.book_id = b.id
          WHERE c.user_id = ? AND b.SHOW_BOOK = 1
        `;

        db.query(getCartSql, [user_id], (err, cartItems) => {
          if (err) {
            console.error('Database error during cart fetch for order:', err);
            return db.rollback(() => {
              res.status(500).json({ 
                success: false,
                message: 'Server error during order processing' 
              });
            });
          }

          if (cartItems.length === 0) {
            return db.rollback(() => {
              res.status(400).json({ 
                success: false,
                message: 'Cart is empty' 
              });
            });
          }

          // Calculate total amount (excluding shipping)
          const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const shippingFee = 40.00; // Default shipping fee
          const totalAmount = subtotal + shippingFee;

          // Insert into order table
          const insertOrderSql = `
            INSERT INTO \`order\` (USER_ID, ORDERD_AT, ORDER_STATUS, SHIPPING_FEE, TOTAL_AMOUNT) 
            VALUES (?, NOW(), 'pending', ?, ?)
          `;
          
          db.query(insertOrderSql, [user_id, shippingFee, totalAmount], (orderErr, orderResult) => {
            if (orderErr) {
              console.error('Database error during order creation:', orderErr);
              return db.rollback(() => {
                res.status(500).json({ 
                  success: false,
                  message: 'Server error during order creation' 
                });
              });
            }

            const orderId = orderResult.insertId;
            console.log(`Created order with ID: ${orderId}`);

            // Insert order items into order_book table
            let orderItemsCompleted = 0;
            let hasOrderItemError = false;

            const insertOrderItemSql = `
              INSERT INTO order_book (ORDER_ID, BOOK_ID, QUANTITY) 
              VALUES (?, ?, ?)
            `;

            cartItems.forEach((item) => {
              db.query(insertOrderItemSql, [orderId, item.book_id, item.quantity], (itemErr) => {
                if (itemErr && !hasOrderItemError) {
                  hasOrderItemError = true;
                  console.error('Database error during order item creation:', itemErr);
                  return db.rollback(() => {
                    res.status(500).json({ 
                      success: false,
                      message: 'Server error during order item creation' 
                    });
                  });
                }
                
                orderItemsCompleted++;
                
                // When all order items are inserted, clear the cart
                if (orderItemsCompleted === cartItems.length && !hasOrderItemError) {
                  const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';
                  
                  db.query(clearCartSql, [user_id], (clearErr) => {
                    if (clearErr) {
                      console.error('Database error during cart clear:', clearErr);
                      return db.rollback(() => {
                        res.status(500).json({ 
                          success: false,
                          message: 'Server error during cart cleanup' 
                        });
                      });
                    }

                    // Commit the transaction
                    db.commit((commitErr) => {
                      if (commitErr) {
                        console.error('Transaction commit error:', commitErr);
                        return db.rollback(() => {
                          res.status(500).json({ 
                            success: false,
                            message: 'Server error during order finalization' 
                          });
                        });
                      }

                      console.log(`Order placed successfully for user ${user_id}, Order ID: ${orderId}`);
                      return res.status(200).json({
                        success: true,
                        message: 'Order placed successfully',
                        orderId: orderId,
                        orderDetails: {
                          items: cartItems,
                          subtotal: parseFloat(subtotal.toFixed(2)),
                          shippingFee: parseFloat(shippingFee.toFixed(2)),
                          totalAmount: parseFloat(totalAmount.toFixed(2)),
                          orderDate: new Date().toISOString(),
                          status: 'pending'
                        }
                      });
                    });
                  });
                }
              });
            });
          });
        });
      } catch (error) {
        console.error('Unexpected error during order processing:', error);
        db.rollback(() => {
          res.status(500).json({ 
            success: false,
            message: 'Internal server error during order processing' 
          });
        });
      }
    });

  } catch (error) {
    console.error('Unexpected error in placeOrder:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get order history for a user
 */
const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    console.log(`Fetching order history for user ${userId}`);

    const getOrdersSql = `
      SELECT 
        o.ID as order_id,
        o.ORDERD_AT,
        o.ORDER_STATUS,
        o.SHIPPING_FEE,
        o.TOTAL_AMOUNT,
        o.SHIPPING_ADDRESS,
        COUNT(ob.BOOK_ID) as item_count
      FROM \`order\` o
      LEFT JOIN order_book ob ON o.ID = ob.ORDER_ID
      WHERE o.USER_ID = ?
      GROUP BY o.ID, o.ORDERD_AT, o.ORDER_STATUS, o.SHIPPING_FEE, o.TOTAL_AMOUNT, o.SHIPPING_ADDRESS
      ORDER BY o.ORDERD_AT DESC
    `;

    db.query(getOrdersSql, [userId], (err, orders) => {
      if (err) {
        console.error('Database error during order history fetch:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during order history fetch' 
        });
      }

      const formattedOrders = orders.map(order => ({
        order_id: order.order_id,
        ordered_at: order.ORDERD_AT,
        status: order.ORDER_STATUS,
        shipping_fee: parseFloat(order.SHIPPING_FEE || 0),
        total_amount: parseFloat(order.TOTAL_AMOUNT || 0),
        shipping_address: order.SHIPPING_ADDRESS,
        item_count: order.item_count
      }));

      console.log(`Found ${formattedOrders.length} orders for user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Order history fetched successfully',
        orders: formattedOrders
      });
    });

  } catch (error) {
    console.error('Unexpected error in getOrderHistory:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get detailed order information
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.query; // Optional user verification
    
    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    console.log(`Fetching order details for order ${orderId}`);

    const getOrderDetailsSql = `
      SELECT 
        o.ID as order_id,
        o.USER_ID,
        o.ORDERD_AT,
        o.ORDER_STATUS,
        o.SHIPPING_FEE,
        o.TOTAL_AMOUNT,
        o.SHIPPING_ADDRESS,
        ob.BOOK_ID,
        ob.QUANTITY,
        b.TITLE,
        b.PRICE,
        b.ISBN,
        b.COVER_URL as thumbnail,
        COALESCE(GROUP_CONCAT(DISTINCT a.NAME SEPARATOR ', '), 'Unknown Author') as author
      FROM \`order\` o
      JOIN order_book ob ON o.ID = ob.ORDER_ID
      JOIN book b ON ob.BOOK_ID = b.ID
      LEFT JOIN book_author ba ON b.ID = ba.BOOK_ID
      LEFT JOIN author a ON ba.AUTHOR_ID = a.ID
      WHERE o.ID = ?
      ${userId ? 'AND o.USER_ID = ?' : ''}
      GROUP BY o.ID, o.USER_ID, o.ORDERD_AT, o.ORDER_STATUS, o.SHIPPING_FEE, o.TOTAL_AMOUNT, o.SHIPPING_ADDRESS, ob.BOOK_ID, ob.QUANTITY, b.TITLE, b.PRICE, b.ISBN, b.COVER_URL
      ORDER BY b.TITLE
    `;

    const queryParams = userId ? [orderId, userId] : [orderId];

    db.query(getOrderDetailsSql, queryParams, (err, results) => {
      if (err) {
        console.error('Database error during order details fetch:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during order details fetch' 
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Order not found' 
        });
      }

      // Format the response
      const orderInfo = {
        order_id: results[0].order_id,
        user_id: results[0].USER_ID,
        ordered_at: results[0].ORDERD_AT,
        status: results[0].ORDER_STATUS,
        shipping_fee: parseFloat(results[0].SHIPPING_FEE || 0),
        total_amount: parseFloat(results[0].TOTAL_AMOUNT || 0),
        shipping_address: results[0].SHIPPING_ADDRESS,
        items: results.map(item => ({
          book_id: item.BOOK_ID,
          title: item.TITLE,
          author: item.author,
          price: parseFloat(item.PRICE || 0),
          quantity: item.QUANTITY,
          isbn: item.ISBN,
          thumbnail: item.thumbnail || '/images/books/defaultbook.jpg',
          subtotal: parseFloat((item.PRICE * item.QUANTITY).toFixed(2))
        }))
      };

      console.log(`Order details fetched for order ${orderId}`);

      return res.status(200).json({
        success: true,
        message: 'Order details fetched successfully',
        order: orderInfo
      });
    });

  } catch (error) {
    console.error('Unexpected error in getOrderDetails:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Update order status (for admin use)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID and status are required' 
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded', 'on_hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid order status' 
      });
    }

    console.log(`Updating order ${orderId} status to ${status}`);

    const updateStatusSql = `
      UPDATE \`order\` 
      SET ORDER_STATUS = ? 
      WHERE ID = ?
    `;

    db.query(updateStatusSql, [status, orderId], (err, result) => {
      if (err) {
        console.error('Database error during order status update:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during order status update' 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Order not found' 
        });
      }

      console.log(`Order ${orderId} status updated to ${status}`);

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          order_id: orderId,
          new_status: status
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in updateOrderStatus:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory,
  getOrderDetails,
  updateOrderStatus
};
