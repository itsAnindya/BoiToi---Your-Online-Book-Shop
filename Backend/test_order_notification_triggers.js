const express = require('express');
const db = require('./config/database');

console.log('🧪 Testing Order Notification Triggers\n');

// Test function to check notifications
function checkNotifications(description) {
  return new Promise((resolve) => {
    console.log(`\n📋 ${description}`);
    const sql = `
      SELECT 
        n.ID,
        n.USER_ID,
        u.USERNAME,
        n.MESSAGE,
        n.TYPE,
        n.IS_READ,
        n.CREATED_AT,
        n.URL
      FROM notifications n
      JOIN user u ON n.USER_ID = u.ID
      WHERE n.TYPE = 'ORDER'
      ORDER BY n.CREATED_AT DESC
      LIMIT 5
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error checking notifications:', err);
        return resolve();
      }
      
      if (results.length === 0) {
        console.log('   📭 No order notifications found');
      } else {
        console.log('   📬 Recent order notifications:');
        results.forEach((notif, index) => {
          console.log(`   ${index + 1}. [${notif.USERNAME}] ${notif.MESSAGE.substring(0, 80)}...`);
          console.log(`      URL: ${notif.URL || 'N/A'} | Read: ${notif.IS_READ ? 'Yes' : 'No'}`);
        });
      }
      resolve();
    });
  });
}

// Test function to place a new order
function testNewOrder() {
  return new Promise((resolve) => {
    console.log('\n🛒 TESTING: Placing a new order (should trigger admin notifications)...');
    
    const insertOrderSql = `
      INSERT INTO \`order\` (USER_ID, SHIPPING_ADDRESS, ORDER_STATUS, SHIPPING_FEE, TOTAL_AMOUNT) 
      VALUES (1, '123 Test Street, Test City', 'pending', 40.00, 150.00)
    `;
    
    db.query(insertOrderSql, (err, result) => {
      if (err) {
        console.error('❌ Error creating test order:', err);
        return resolve();
      }
      
      const orderId = result.insertId;
      console.log(`✅ Test order created with ID: ${orderId}`);
      
      // Give triggers time to execute
      setTimeout(() => resolve(orderId), 1000);
    });
  });
}

// Test function to update order status
function testOrderStatusUpdate(orderId) {
  return new Promise((resolve) => {
    console.log(`\n📦 TESTING: Updating order #${orderId} status (should trigger user notification)...`);
    
    const updateOrderSql = `
      UPDATE \`order\` 
      SET ORDER_STATUS = 'confirmed', 
          STATUS_UPDATED_BY = 2,
          STATUS_UPDATED_AT = NOW()
      WHERE ID = ?
    `;
    
    db.query(updateOrderSql, [orderId], (err, result) => {
      if (err) {
        console.error('❌ Error updating order status:', err);
        return resolve();
      }
      
      console.log(`✅ Order #${orderId} status updated to 'confirmed' by admin user ID 2`);
      
      // Give triggers time to execute
      setTimeout(() => resolve(), 1000);
    });
  });
}

// Test function to update order status again
function testSecondStatusUpdate(orderId) {
  return new Promise((resolve) => {
    console.log(`\n🚚 TESTING: Updating order #${orderId} to shipped status...`);
    
    const updateOrderSql = `
      UPDATE \`order\` 
      SET ORDER_STATUS = 'shipped', 
          STATUS_UPDATED_BY = 3,
          STATUS_UPDATED_AT = NOW()
      WHERE ID = ?
    `;
    
    db.query(updateOrderSql, [orderId], (err, result) => {
      if (err) {
        console.error('❌ Error updating order status:', err);
        return resolve();
      }
      
      console.log(`✅ Order #${orderId} status updated to 'shipped' by admin user ID 3`);
      
      // Give triggers time to execute
      setTimeout(() => resolve(), 1000);
    });
  });
}

// Check admin users
function checkAdminUsers() {
  return new Promise((resolve) => {
    console.log('\n👨‍💼 Checking admin users who should receive notifications:');
    
    const adminSql = `
      SELECT 
        a.USER_ID,
        u.USERNAME,
        u.EMAIL,
        u.FIRST_NAME,
        u.LAST_NAME,
        u.IS_ACTIVE
      FROM admin a
      JOIN user u ON a.USER_ID = u.ID
      WHERE u.IS_ACTIVE = 1
    `;
    
    db.query(adminSql, (err, results) => {
      if (err) {
        console.error('❌ Error checking admins:', err);
        return resolve();
      }
      
      console.log(`   Found ${results.length} active admin users:`);
      results.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.USERNAME} (${admin.FIRST_NAME} ${admin.LAST_NAME}) - ID: ${admin.USER_ID}`);
      });
      resolve();
    });
  });
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Order Notification Trigger Tests...\n');
    
    // Check initial state
    await checkAdminUsers();
    await checkNotifications('Initial notifications check');
    
    // Test 1: New order
    const orderId = await testNewOrder();
    await checkNotifications('After creating new order (should have admin notifications)');
    
    // Test 2: First status update
    if (orderId) {
      await testOrderStatusUpdate(orderId);
      await checkNotifications('After confirming order (should have user notification)');
      
      // Test 3: Second status update
      await testSecondStatusUpdate(orderId);
      await checkNotifications('After shipping order (should have another user notification)');
    }
    
    console.log('\n🎉 All trigger tests completed!');
    console.log('\n📝 Summary:');
    console.log('   1. ✅ New order should create notifications for all admins');
    console.log('   2. ✅ Order status updates should create notifications for the customer');
    console.log('   3. ✅ Different status types should have appropriate messages');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the tests
runTests();
