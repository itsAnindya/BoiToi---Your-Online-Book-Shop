// Test script for Discount Management API endpoints
// Run with: node test_discount_api.js

const API_BASE_URL = 'http://localhost:3001';

async function testDiscountAPI() {
  console.log('🧪 Testing Discount Management API...\n');

  try {
    // Test 1: Get all discounts
    console.log('1. Testing GET /api/admin/discounts...');
    const getResponse = await fetch(`${API_BASE_URL}/api/admin/discounts`);
    const getData = await getResponse.json();
    console.log('✅ GET Result:', {
      success: getData.success,
      discountCount: getData.data?.discounts?.length || 0,
      message: getData.message
    });
    console.log('');

    // Test 2: Create a new discount
    console.log('2. Testing POST /api/admin/discounts (create discount)...');
    const createData = {
      code: 'TEST10',
      description: 'Test discount - 10% off',
      discountType: 'percentage',
      percentage: 0.10,
      startedAt: new Date().toISOString().slice(0, 16),
      endedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 1 week from now
      maxUsage: 100,
      minExpense: 50.00,
      adminId: 1
    };

    const createResponse = await fetch(`${API_BASE_URL}/api/admin/discounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData)
    });
    const createResult = await createResponse.json();
    console.log('✅ CREATE Result:', {
      success: createResult.success,
      discountId: createResult.data?.id,
      message: createResult.message
    });
    
    const discountId = createResult.data?.id;
    console.log('');

    if (discountId) {
      // Test 3: Update discount status
      console.log(`3. Testing PUT /api/admin/discounts/${discountId}/status (deactivate)...`);
      const statusResponse = await fetch(`${API_BASE_URL}/api/admin/discounts/${discountId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' })
      });
      const statusResult = await statusResponse.json();
      console.log('✅ STATUS UPDATE Result:', {
        success: statusResult.success,
        message: statusResult.message
      });
      console.log('');

      // Test 4: Get statistics
      console.log('4. Testing GET /api/admin/discounts/statistics...');
      const statsResponse = await fetch(`${API_BASE_URL}/api/admin/discounts/statistics`);
      const statsResult = await statsResponse.json();
      console.log('✅ STATISTICS Result:', {
        success: statsResult.success,
        totalDiscounts: statsResult.data?.totalDiscounts,
        activeDiscounts: statsResult.data?.activeDiscounts
      });
      console.log('');

      // Test 5: Delete the test discount
      console.log(`5. Testing DELETE /api/admin/discounts/${discountId}...`);
      const deleteResponse = await fetch(`${API_BASE_URL}/api/admin/discounts/${discountId}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteResponse.json();
      console.log('✅ DELETE Result:', {
        success: deleteResult.success,
        message: deleteResult.message
      });
    }

    console.log('\n🎉 All discount API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDiscountAPI();
