// Quick test to check if server is running and endpoints respond
const axios = require('axios');

async function quickTest() {
  console.log('Quick endpoint tests...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log(`✅ Health check - Status: ${healthResponse.status}\n`);

    // Test 2: User endpoint
    console.log('2. Testing user endpoint...');
    const userResponse = await axios.get('http://localhost:3001/api/user/1');
    console.log(`✅ User endpoint - Status: ${userResponse.status}`);
    console.log(`   User: ${userResponse.data.user.username}\n`);

    // Test 3: Order creation (simple)
    console.log('3. Testing order creation endpoint...');
    const orderData = {
      user_id: 1,
      shipping_address: '123 Test Street',
      phone_number: '01234567890',
      payment_method: 'cash_on_delivery',
      total_amount: 100,
      shipping_fee: 40,
      items: [{book_id: 201, quantity: 1, price: 60}]
    };

    const orderResponse = await axios.post('http://localhost:3001/api/orders/create', orderData);
    console.log(`✅ Order creation - Status: ${orderResponse.status}`);
    console.log(`   Order ID: ${orderResponse.data.orderId}\n`);

    console.log('🎉 All quick tests passed!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data}`);
      console.error(`   URL: ${error.config.url}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

quickTest();
