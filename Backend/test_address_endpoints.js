// Test address management endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/user';
const TEST_USER_ID = 1; // Assuming user with ID 1 exists

async function testAddressEndpoints() {
  console.log('Testing User Address Management API...\n');

  try {
    // Test 1: Get user profile with addresses
    console.log(`1. Testing GET /api/user/${TEST_USER_ID}...`);
    const userResponse = await axios.get(`${BASE_URL}/${TEST_USER_ID}`);
    console.log(`✅ GET /api/user/${TEST_USER_ID} - Status: ${userResponse.status}`);
    console.log(`   User: ${userResponse.data.user.username}`);
    console.log(`   Addresses: ${userResponse.data.user.addresses?.length || 0}\n`);

    // Test 2: Create new address
    console.log(`2. Testing POST /api/user/${TEST_USER_ID}/address...`);
    const newAddressData = {
      address_type: 'home',
      address: 'Test Street 123',
      city: 'Test City',
      state: 'Test State',
      country: 'Bangladesh',
      zip_code: '12345',
      is_default: 0
    };

    const createResponse = await axios.post(`${BASE_URL}/${TEST_USER_ID}/address`, newAddressData);
    console.log(`✅ POST /api/user/${TEST_USER_ID}/address - Status: ${createResponse.status}`);
    console.log(`   Created address ID: ${createResponse.data.addressId}\n`);

    const newAddressId = createResponse.data.addressId;

    // Test 3: Update the created address
    console.log(`3. Testing PUT /api/user/${TEST_USER_ID}/address/${newAddressId}...`);
    const updateAddressData = {
      address: 'Updated Test Street 456',
      city: 'Updated Test City'
    };

    const updateResponse = await axios.put(`${BASE_URL}/${TEST_USER_ID}/address/${newAddressId}`, updateAddressData);
    console.log(`✅ PUT /api/user/${TEST_USER_ID}/address/${newAddressId} - Status: ${updateResponse.status}`);
    console.log(`   Address updated successfully\n`);

    // Test 4: Delete the created address
    console.log(`4. Testing DELETE /api/user/${TEST_USER_ID}/address/${newAddressId}...`);
    const deleteResponse = await axios.delete(`${BASE_URL}/${TEST_USER_ID}/address/${newAddressId}`);
    console.log(`✅ DELETE /api/user/${TEST_USER_ID}/address/${newAddressId} - Status: ${deleteResponse.status}`);
    console.log(`   Address deleted successfully\n`);

    console.log('🎉 All address management tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data}`);
      console.error(`   URL: ${error.config.url}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.error('   Make sure the server is running on port 3001\n');
  }
}

// Run the test
testAddressEndpoints();
