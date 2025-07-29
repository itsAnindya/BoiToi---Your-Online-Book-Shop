const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

const testBestsellerSystem = async () => {
  console.log('🧪 Testing Category Bestseller System...\n');
  
  try {
    // Test 1: Check current status
    console.log('1. Testing GET /api/bestsellers/status...');
    const statusResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/status`);
    console.log('✅ Status Response:', statusResponse.data);
    console.log('');
    
    // Test 2: Trigger manual update
    console.log('2. Testing POST /api/bestsellers/update...');
    const updateResponse = await axios.post(`${API_BASE_URL}/api/bestsellers/update`, {
      userRole: 'admin', // Required for admin check
      trigger: 'test'
    });
    console.log('✅ Update Response:', updateResponse.data);
    console.log('');
    
    // Test 3: Check status after update
    console.log('3. Testing status after update...');
    const statusAfterResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/status`);
    console.log('✅ Status After Update:', statusAfterResponse.data);
    console.log('');
    
    // Test 4: Verify bestsellers data exists
    console.log('4. Testing if bestsellers are being used by existing endpoint...');
    const booksResponse = await axios.get(`${API_BASE_URL}/api/books/categories`);
    console.log('✅ Categories with books response length:', booksResponse.data.length);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

// Run the test
testBestsellerSystem();
