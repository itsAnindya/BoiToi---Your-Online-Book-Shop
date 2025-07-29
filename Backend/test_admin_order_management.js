// Simple test for admin order management functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/admin';

async function testAdminOrderManagement() {
  console.log('Testing Admin Order Management API...\n');

  try {
    // Test 1: Get all orders
    console.log('1. Testing GET /orders...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders`);
    console.log(`✅ GET /orders - Status: ${ordersResponse.status}`);
    console.log(`   Found ${ordersResponse.data.orders.length} orders`);
    console.log(`   Total: ${ordersResponse.data.total}\n`);

    // Test 2: Get order statistics
    console.log('2. Testing GET /orders/statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/orders/statistics`);
    console.log(`✅ GET /orders/statistics - Status: ${statsResponse.status}`);
    console.log(`   Statistics:`, statsResponse.data);
    console.log();

    // Test 3: Get orders with filtering
    console.log('3. Testing GET /orders with filters...');
    const filteredResponse = await axios.get(`${BASE_URL}/orders?status=pending&limit=10`);
    console.log(`✅ GET /orders (filtered) - Status: ${filteredResponse.status}`);
    console.log(`   Filtered orders: ${filteredResponse.data.orders.length}\n`);

    // Test 4: Get specific order details (if orders exist)
    if (ordersResponse.data.orders.length > 0) {
      const firstOrderId = ordersResponse.data.orders[0].id;
      console.log(`4. Testing GET /orders/${firstOrderId}...`);
      const orderDetailResponse = await axios.get(`${BASE_URL}/orders/${firstOrderId}`);
      console.log(`✅ GET /orders/${firstOrderId} - Status: ${orderDetailResponse.status}`);
      console.log(`   Order details loaded for Order ID: ${firstOrderId}\n`);

      // Test 5: Update order status (if orders exist)
      console.log(`5. Testing PUT /orders/${firstOrderId}/status...`);
      const updateResponse = await axios.put(`${BASE_URL}/orders/${firstOrderId}/status`, {
        admin_id: 1, // Assuming admin user with ID 1 exists
        order_status: 'confirmed'
      });
      console.log(`✅ PUT /orders/${firstOrderId}/status - Status: ${updateResponse.status}`);
      console.log(`   Status updated successfully\n`);
    } else {
      console.log('⚠️  No orders found to test detail and update endpoints\n');
    }

    console.log('🎉 All admin order management tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.error('   Make sure the server is running on port 3001\n');
  }
}

// Run the test
testAdminOrderManagement();
