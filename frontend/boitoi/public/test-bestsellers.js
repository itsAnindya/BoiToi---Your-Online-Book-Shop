// Simple frontend test for bestsellers page
// Run this in browser console when on bestsellers page

async function testFrontendBestsellerAPI() {
  const API_BASE_URL = 'http://localhost:3001';
  
  console.log('🧪 Testing frontend bestseller integration...\n');

  try {
    // Test categories endpoint
    console.log('1. Testing categories...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/api/bestsellers/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories:', categoriesData);

    if (categoriesData.success && categoriesData.data.length > 0) {
      const firstCategory = categoriesData.data[0];
      console.log(`\n2. Testing bestsellers for category: ${firstCategory.NAME}...`);
      
      const bestsellersResponse = await fetch(`${API_BASE_URL}/api/bestsellers/category/${firstCategory.ID}`);
      const bestsellersData = await bestsellersResponse.json();
      console.log('✅ Bestsellers:', bestsellersData);
      
      if (bestsellersData.success && bestsellersData.data.books.length > 0) {
        console.log('\n📚 Sample bestseller book:');
        const sampleBook = bestsellersData.data.books[0];
        console.log({
          position: sampleBook.position,
          title: sampleBook.TITLE,
          authors: sampleBook.AUTHORS,
          rating: sampleBook.AVERAGE_RATING,
          reviews: sampleBook.REVIEW_COUNT,
          price: sampleBook.PRICE
        });
      }
    }

    console.log('\n🎉 Frontend integration test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Auto-run test
testFrontendBestsellerAPI();
