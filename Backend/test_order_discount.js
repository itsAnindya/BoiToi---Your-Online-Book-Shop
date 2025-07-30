// Test script to verify discount functionality in admin order management
// Run this to add test discount data to the database

const db = require('./config/database');

console.log('Adding test order_discount records...');

// First check existing data
console.log('Checking existing orders...');
db.query('SELECT ID, TOTAL_AMOUNT, SHIPPING_FEE FROM `order` ORDER BY ID DESC LIMIT 5', (err, orders) => {
  if (err) {
    console.error('Error fetching orders:', err);
    return;
  }
  
  console.log('Recent orders:', orders);
  
  console.log('Checking existing discounts...');
  db.query('SELECT ID, CODE, DISCOUNT_TYPE, PERCENTAGE, VALUE FROM discount', (err, discounts) => {
    if (err) {
      console.error('Error fetching discounts:', err);
      return;
    }
    
    console.log('Available discounts:', discounts);
    
    if (orders.length > 0 && discounts.length > 0) {
      const orderId = orders[0].ID;
      const discountId = discounts[0].ID;
      
      console.log(`Adding discount ${discountId} to order ${orderId}...`);
      
      // Add order_discount record
      db.query(
        'INSERT INTO order_discount (ORDER_ID, DISCOUNT_ID) VALUES (?, ?)',
        [orderId, discountId],
        (err, result) => {
          if (err) {
            console.error('Error adding order_discount:', err);
          } else {
            console.log('Successfully added order_discount record:', result);
            
            // Verify the record was added
            db.query(
              `SELECT od.*, d.CODE, d.DISCOUNT_TYPE, d.PERCENTAGE, d.VALUE 
               FROM order_discount od 
               JOIN discount d ON od.DISCOUNT_ID = d.ID 
               WHERE od.ORDER_ID = ?`,
              [orderId],
              (err, verification) => {
                if (err) {
                  console.error('Error verifying order_discount:', err);
                } else {
                  console.log('Verification - order_discount records for order', orderId, ':', verification);
                }
                
                process.exit(0);
              }
            );
          }
        }
      );
    } else {
      console.log('No orders or discounts found to test with');
      process.exit(0);
    }
  });
});
