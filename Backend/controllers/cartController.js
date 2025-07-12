const db = require('../config/database');

/**
 * Add book to cart
 * Handles adding a book to user's cart
 */
const addToCart = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    
    // Input validation
    if (!bookId || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Book ID and User ID are required' 
      });
    }

    console.log(`Adding book ${bookId} to cart for user ${userId}`);

    // Check if user exists and is active
    const userCheckSql = 'SELECT ID FROM USER WHERE ID = ?';
    
    db.query(userCheckSql, [userId], (err, userResults) => {
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

      /*if (userResults[0].IS_ACTIVE !== 1) {
        return res.status(403).json({ 
          success: false,
          message: 'User account is not active' 
        });
      }*/

      // Check if book exists
      const bookCheckSql = 'SELECT id, title, price FROM book WHERE id = ?';
      
      db.query(bookCheckSql, [bookId], (err, bookResults) => {
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
        
        db.query(checkCartSql, [userId, bookId], (err, cartResults) => {
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
              SET quantity = quantity + 1 
              WHERE user_id = ? AND book_id = ?
            `;
            
            db.query(updateCartSql, [userId, bookId], (err) => {
              if (err) {
                console.error('Database error during cart update:', err);
                return res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart update' 
                });
              }

              console.log(`Updated quantity for book ${bookId} in user ${userId}'s cart`);
              return res.status(200).json({
                success: true,
                message: `Book - ${book.title} quantity updated in your cart`,
                data: {
                  bookId: bookId,
                  userId: userId,
                  action: 'quantity_updated',
                  bookTitle: book.title
                }
              });
            });
          } else {
            // Item doesn't exist, add new item to cart
            // First get the count of existing rows to determine the next ID
            const getCountSql = 'SELECT COUNT(*) as count FROM cart';
            
            db.query(getCountSql, (err, countResult) => {
              if (err) {
                console.error('Database error during count fetch:', err);
                return res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart count' 
                });
              }
              
              const nextId = countResult[0].count + 1;
              
              const addToCartSql = `
                INSERT INTO cart (id, user_id, book_id, quantity, added_at) 
                VALUES (?, ?, ?, 1, NOW())
              `;
              
              db.query(addToCartSql, [nextId, userId, bookId], (err, result) => {
              if (err) {
                console.error('Database error during cart insertion:', err);
                return res.status(500).json({ 
                  success: false,
                  message: 'Server error during cart addition' 
                });
              }

              console.log(`Added book ${bookId} to user ${userId}'s cart`);
              return res.status(201).json({
                success: true,
                message: `Book - ${book.title} has been added to your cart`,
                data: {
                  cartId: result.insertId,
                  bookId: bookId,
                  userId: userId,
                  quantity: 1,
                  action: 'item_added',
                  bookTitle: book.title
                }
              });
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
        b.image_url
      FROM cart c
      JOIN book b ON c.book_id = b.id
      WHERE c.user_id = ?
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

      const totalItems = results.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = results.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return res.status(200).json({
        success: true,
        message: 'Cart items fetched successfully',
        data: {
          items: results,
          summary: {
            totalItems: totalItems,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount: results.length
          }
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
    const { userId, bookId } = req.body;
    
    if (!userId || !bookId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID and Book ID are required' 
      });
    }

    console.log(`Removing book ${bookId} from cart for user ${userId}`);

    const removeFromCartSql = 'DELETE FROM cart WHERE user_id = ? AND book_id = ?';
    
    db.query(removeFromCartSql, [userId, bookId], (err, result) => {
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

      console.log(`Removed book ${bookId} from user ${userId}'s cart`);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          bookId: bookId,
          userId: userId
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
    const { userId, bookId, quantity } = req.body;
    
    if (!userId || !bookId || quantity === undefined || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID, Book ID, and valid quantity (>= 1) are required' 
      });
    }

    console.log(`Updating quantity to ${quantity} for book ${bookId} in user ${userId}'s cart`);

    const updateQuantitySql = `
      UPDATE cart 
      SET quantity = ? 
      WHERE user_id = ? AND book_id = ?
    `;
    
    db.query(updateQuantitySql, [quantity, userId, bookId], (err, result) => {
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

      console.log(`Updated quantity for book ${bookId} in user ${userId}'s cart`);
      return res.status(200).json({
        success: true,
        message: 'Cart quantity updated successfully',
        data: {
          bookId: bookId,
          userId: userId,
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

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
  clearCart
};