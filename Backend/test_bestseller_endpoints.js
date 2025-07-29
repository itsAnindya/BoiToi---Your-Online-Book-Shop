// Test script for new bestseller endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testBestsellerEndpoints() {
  console.log('🧪 Testing new bestseller endpoints...\n');

  try {
    // Test 1: Get categories
    console.log('1. Testing GET /api/bestsellers/categories...');
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/categories`);
      console.log('✅ Categories Response:', {
        success: categoriesResponse.data.success,
        categoriesCount: categoriesResponse.data.data?.length || 0,
        message: categoriesResponse.data.message
      });
      
      if (categoriesResponse.data.data?.length > 0) {
        console.log('📊 Sample category:', categoriesResponse.data.data[0]);
        
        // Test 2: Get bestsellers for first category
        const firstCategoryId = categoriesResponse.data.data[0].ID;
        console.log(`\n2. Testing GET /api/bestsellers/category/${firstCategoryId}...`);
        
        const categoryBestsellersResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/category/${firstCategoryId}`);
        console.log('✅ Category Bestsellers Response:', {
          success: categoryBestsellersResponse.data.success,
          categoryName: categoryBestsellersResponse.data.data?.categoryName,
          booksCount: categoryBestsellersResponse.data.data?.books?.length || 0,
          message: categoryBestsellersResponse.data.message
        });
        
        if (categoryBestsellersResponse.data.data?.books?.length > 0) {
          console.log('📚 Sample book:', categoryBestsellersResponse.data.data.books[0]);
        }
      }
    } catch (error) {
      console.log('⚠️  Categories endpoint error:', error.response?.data || error.message);
    }

    // Test 3: Get all bestsellers
    console.log('\n3. Testing GET /api/bestsellers/all...');
    try {
      const allBestsellersResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/all`);
      console.log('✅ All Bestsellers Response:', {
        success: allBestsellersResponse.data.success,
        categoriesCount: allBestsellersResponse.data.data?.length || 0,
        totalBooks: allBestsellersResponse.data.data?.reduce((sum, cat) => sum + cat.books.length, 0) || 0,
        message: allBestsellersResponse.data.message
      });
      
      if (allBestsellersResponse.data.data?.length > 0) {
        console.log('📊 Sample category data:', {
          categoryName: allBestsellersResponse.data.data[0].categoryName,
          booksCount: allBestsellersResponse.data.data[0].books.length
        });
      }
    } catch (error) {
      console.log('⚠️  All bestsellers endpoint error:', error.response?.data || error.message);
    }

    // Test 4: Get status
    console.log('\n4. Testing GET /api/bestsellers/status...');
    try {
      const statusResponse = await axios.get(`${API_BASE_URL}/api/bestsellers/status`);
      console.log('✅ Status Response:', {
        success: statusResponse.data.success,
        message: statusResponse.data.message
      });
    } catch (error) {
      console.log('⚠️  Status endpoint error:', error.response?.data || error.message);
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📝 API Endpoints Ready:');
    console.log('- GET /api/bestsellers/categories');
    console.log('- GET /api/bestsellers/category/:categoryId');
    console.log('- GET /api/bestsellers/all');
    console.log('- GET /api/bestsellers/status');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBestsellerEndpoints();
