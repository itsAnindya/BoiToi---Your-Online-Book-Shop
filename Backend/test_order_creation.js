const axios = require('axios');

async function testOrderCreation() {
  try {
    console.log('Testing order creation...');
    
    const orderData = {
      user_id: 1,
      shipping_address: '123 Test Street, Dhaka, Bangladesh',
      phone_number: '+8801234567890',
      payment_method: 'cash_on_delivery',
      total_amount: 500.00,
      shipping_fee: 40.00,
      items: [
        {
          book_id: 201,
          quantity: 1,
          price: 460.00
        }
      ]
    };

    const response = await axios.post('http://localhost:3001/api/orders/create', orderData);
    
    console.log('Order creation successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Order creation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Wait a moment for server to start, then test
setTimeout(testOrderCreation, 2000);
