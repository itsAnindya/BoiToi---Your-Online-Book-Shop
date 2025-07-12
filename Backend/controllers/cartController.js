const db = require('../config/database');

/**
 * Add book to cart
 * Handles adding a book to user's cart
 */
const addToCart = async (req, res) => {
  try {
    const { bookId, userId, book_id, user_id, quantity = 1 } = req.body;
    
    // Support both naming conventions
    const finalBookId = bookId || book_id;
    const finalUserId = userId || user_id;
    
    // Input validation
    if (!finalBookId || !finalUserId) {
      return res.status(400).json({ 
        success: false,
        message: 'Book ID and User ID are required' 
      });
    }

    console.log(`Adding book ${finalBookId} to cart for user ${finalUserId}`);

    // Check if user exists and is active
    const userCheckSql = 'SELECT ID FROM USER WHERE ID = ?';
    
    db.query(userCheckSql, [finalUserId], (err, userResults) => {
      if (err) {
        console.error('Database error during user check:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during user verification' 
        });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Check if book exists
      const bookCheckSql = 'SELECT id, title, price FROM book WHERE id = ?';
      
      db.query(bookCheckSql, [finalBookId], (err, bookResults) => {
        if (err) {
          console.error('Database error during book check:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Server error during book verification' 
          });
        }

        if (bookResults.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Book not found' 
          });
        }

        const book = bookResults[0];

        // Check if item already exists in cart
        const checkCartSql = 'SELECT * FROM cart WHERE user_id = ? AND book_id = ?';
        
        db.query(checkCartSql, [finalUserId, finalBookId], (err, cartResults) => {
          if (err) {
            console.error('Database error during cart check:', err);
            return res.status(500).json({ 
              success: false,
              message: 'Server error during cart check' 
            });
          }

          if (cartResults.length > 0) {
            // Item already exists, update quantity
            const updateCartSql = `
              UPDATE cart 
              SET quantity = quantity + ? 
              WHERE user_id = ? AND book_id = ?
            `;
            
            db.query(updateCartSql, [quantity, finalUserId, finalBookId], (err) => {
              if (err) {
                console.error('Database error during cart update:', err);
                return res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart update' 
                });
              }

              console.log(`Updated quantity for book ${finalBookId} in user ${finalUserId}'s cart`);
              return res.status(200).json({
                success: true,
                message: `Book - ${book.title} quantity updated in your cart`,
                data: {
                  bookId: finalBookId,
                  userId: finalUserId,
                  action: 'quantity_updated',
                  bookTitle: book.title
                }
              });
            });
          } else {
            // Item doesn't exist, add new item to cart
            const addToCartSql = `
              INSERT INTO cart (user_id, book_id, quantity, added_at) 
              VALUES (?, ?, ?, NOW())
            `;
            
            db.query(addToCartSql, [finalUserId, finalBookId, quantity], (err, result) => {
              if (err) {
                // Check if it's a duplicate key error (in case of race condition)
                if (err.code === 'ER_DUP_ENTRY') {
                  // If duplicate, try to update instead
                  const updateCartSql = `
                    UPDATE cart 
                    SET quantity = quantity + ? 
                    WHERE user_id = ? AND book_id = ?
                  `;
                  
                  db.query(updateCartSql, [quantity, finalUserId, finalBookId], (updateErr) => {
                    if (updateErr) {
                      console.error('Database error during cart update after duplicate:', updateErr);
                      return res.status(500).json({ 
                        success: false,
                        message: 'Server error during cart addition' 
                      });
                    }
                    
                    return res.status(200).json({
                      success: true,
                      message: `Book - ${book.title} quantity updated in your cart`,
                      data: {
                        bookId: finalBookId,
                        userId: finalUserId,
                        quantity: quantity,
                        action: 'quantity_updated',
                        bookTitle: book.title
                      }
                    });
                  });
                } else {
                  console.error('Database error during cart insertion:', err);
                  return res.status(500).json({ 
                    success: false,
                    message: 'Server error during cart addition' 
                  });
                }
                return;
              }

              console.log(`Added book ${finalBookId} to user ${finalUserId}'s cart`);
              return res.status(201).json({
                success: true,
                message: `Book - ${book.title} has been added to your cart`,
                data: {
                  cartId: result.insertId,
                  bookId: finalBookId,
                  userId: finalUserId,
                  quantity: quantity,
                  action: 'item_added',
                  bookTitle: book.title
                }
              });
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in addToCart:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get cart items for a user
 */
const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    console.log(`Fetching cart items for user ${userId}`);

    const getCartSql = `
      SELECT 
        c.id as cart_id,
        c.user_id,
        c.book_id,
        c.quantity,
        c.added_at,
        b.title,
        b.price,
        b.isbn,
        b.cover_url as thumbnail,
        b.description,
        COALESCE(GROUP_CONCAT(DISTINCT a.name SEPARATOR ', '), 'Unknown Author') as author
      FROM cart c
      JOIN book b ON c.book_id = b.id
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN author a ON ba.author_id = a.id
      WHERE c.user_id = ? AND b.show_book = 1
      GROUP BY c.id, c.user_id, c.book_id, c.quantity, c.added_at, b.title, b.price, b.isbn, b.cover_url, b.description
      ORDER BY c.added_at DESC
    `;

    db.query(getCartSql, [userId], (err, results) => {
      if (err) {
        console.error('Database error during cart fetch:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during cart fetch' 
        });
      }

      // Transform results to match frontend expectations
      const cartItems = results.map(item => ({
        cart_id: item.cart_id,
        book_id: item.book_id,
        title: item.title,
        author: item.author || 'Unknown Author',
        price: parseFloat(item.price) || 0,
        thumbnail: item.thumbnail || '/images/books/defaultbook.jpg',
        quantity: item.quantity,
        added_at: item.added_at,
        isbn: item.isbn,
        description: item.description
      }));

      const totalItems = results.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = results.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);

      console.log(`Found ${cartItems.length} items in cart for user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Cart items fetched successfully',
        cart: cartItems, // Frontend expects 'cart' property
        summary: {
          totalItems: totalItems,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          itemCount: results.length
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in getCartItems:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Remove item from cart
 */
const removeFromCart = async (req, res) => {
  try {
    const { userId, bookId, user_id, book_id } = req.body;
    
    // Support both naming conventions
    const finalUserId = userId || user_id;
    const finalBookId = bookId || book_id;
    
    if (!finalUserId || !finalBookId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID and Book ID are required' 
      });
    }

    console.log(`Removing book ${finalBookId} from cart for user ${finalUserId}`);

    const removeFromCartSql = 'DELETE FROM cart WHERE user_id = ? AND book_id = ?';
    
    db.query(removeFromCartSql, [finalUserId, finalBookId], (err, result) => {
      if (err) {
        console.error('Database error during cart removal:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during cart removal' 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Item not found in cart' 
        });
      }

      console.log(`Removed book ${finalBookId} from user ${finalUserId}'s cart`);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          bookId: finalBookId,
          userId: finalUserId
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in removeFromCart:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Update cart item quantity
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { userId, bookId, quantity, user_id, book_id } = req.body;
    
    // Support both naming conventions
    const finalUserId = userId || user_id;
    const finalBookId = bookId || book_id;
    
    if (!finalUserId || !finalBookId || quantity === undefined || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID, Book ID, and valid quantity (>= 1) are required' 
      });
    }

    console.log(`Updating quantity to ${quantity} for book ${finalBookId} in user ${finalUserId}'s cart`);

    const updateQuantitySql = `
      UPDATE cart 
      SET quantity = ? 
      WHERE user_id = ? AND book_id = ?
    `;
    
    db.query(updateQuantitySql, [quantity, finalUserId, finalBookId], (err, result) => {
      if (err) {
        console.error('Database error during quantity update:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during quantity update' 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Item not found in cart' 
        });
      }

      console.log(`Updated quantity for book ${finalBookId} in user ${finalUserId}'s cart`);
      return res.status(200).json({
        success: true,
        message: 'Cart quantity updated successfully',
        data: {
          bookId: finalBookId,
          userId: finalUserId,
          quantity: quantity
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in updateCartQuantity:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Clear entire cart for a user
 */
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    console.log(`Clearing cart for user ${userId}`);

    const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';
    
    db.query(clearCartSql, [userId], (err, result) => {
      if (err) {
        console.error('Database error during cart clear:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during cart clear' 
        });
      }

      console.log(`Cleared cart for user ${userId}, removed ${result.affectedRows} items`);
      return res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
          userId: userId,
          itemsRemoved: result.affectedRows
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in clearCart:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Save cart (update multiple items at once)
 */
const saveCart = async (req, res) => {
  try {
    const { user_id, items } = req.body;
    
    if (!user_id || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID and items array are required' 
      });
    }

    console.log(`Saving cart for user ${user_id} with ${items.length} items`);

    // Start a transaction to ensure all updates succeed or fail together
    db.beginTransaction((err) => {
      if (err) {
        console.error('Transaction start error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during cart save' 
        });
      }

      let completed = 0;
      let hasError = false;

      if (items.length === 0) {
        db.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return res.status(500).json({ 
              success: false,
              message: 'Server error during cart save' 
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Cart saved successfully'
          });
        });
        return;
      }

      items.forEach((item) => {
        const { book_id, quantity } = item;
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          const removeSql = 'DELETE FROM cart WHERE user_id = ? AND book_id = ?';
          db.query(removeSql, [user_id, book_id], (err) => {
            if (err && !hasError) {
              hasError = true;
              console.error('Database error during item removal:', err);
              return db.rollback(() => {
                res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart save' 
                });
              });
            }
            
            completed++;
            if (completed === items.length && !hasError) {
              db.commit((err) => {
                if (err) {
                  console.error('Transaction commit error:', err);
                  return res.status(500).json({ 
                    success: false,
                    message: 'Server error during cart save' 
                  });
                }
                return res.status(200).json({
                  success: true,
                  message: 'Cart saved successfully'
                });
              });
            }
          });
        } else {
          // Update quantity
          const updateSql = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?';
          db.query(updateSql, [quantity, user_id, book_id], (err) => {
            if (err && !hasError) {
              hasError = true;
              console.error('Database error during item update:', err);
              return db.rollback(() => {
                res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart save' 
                });
              });
            }
            
            completed++;
            if (completed === items.length && !hasError) {
              db.commit((err) => {
                if (err) {
                  console.error('Transaction commit error:', err);
                  return res.status(500).json({ 
                    success: false,
                    message: 'Server error during cart save' 
                  });
                }
                return res.status(200).json({
                  success: true,
                  message: 'Cart saved successfully'
                });
              });
            }
          });
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in saveCart:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Place order (convert cart to order)
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

    // First, get all cart items for the user
    const getCartSql = `
      SELECT 
        c.book_id,
        c.quantity,
        b.price,
        b.title
      FROM cart c
      JOIN book b ON c.book_id = b.id
      WHERE c.user_id = ?
    `;

    db.query(getCartSql, [user_id], (err, cartItems) => {
      if (err) {
        console.error('Database error during cart fetch for order:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error during order processing' 
        });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Cart is empty' 
        });
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Generate a simple order ID (in production, you'd want a more sophisticated system)
      const orderId = `ORD${Date.now()}${user_id}`;

      // For now, we'll just clear the cart and return the order ID
      // In a full implementation, you'd create order tables and store the order details
      const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';
      
      db.query(clearCartSql, [user_id], (err) => {
        if (err) {
          console.error('Database error during cart clear for order:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Server error during order processing' 
          });
        }

        console.log(`Order placed successfully for user ${user_id}, Order ID: ${orderId}`);
        return res.status(200).json({
          success: true,
          message: 'Order placed successfully',
          orderId: orderId,
          orderDetails: {
            items: cartItems,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            orderDate: new Date().toISOString()
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in placeOrder:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  saveCart,
  placeOrder
};