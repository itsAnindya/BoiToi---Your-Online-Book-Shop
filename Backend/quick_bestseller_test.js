// Quick test of our new bestseller service
const BestsellerService = require('./services/bestsellerService');

async function quickTest() {
  console.log('🧪 Testing BestsellerService...\n');

  try {
    // Test the update method
    console.log('1. Testing update...');
    const updateResult = await BestsellerService.updateCategoryBestsellersSQL();
    console.log('✅ Update Result:', updateResult);

    // Test getting bestsellers
    console.log('\n2. Testing get bestsellers...');
    const bestsellers = await BestsellerService.getBestsellersByCategory(null, 10);
    console.log('✅ Bestsellers Result:', {
      success: bestsellers.success,
      categoriesCount: bestsellers.data.length,
      message: bestsellers.message
    });

    // Show sample data
    if (bestsellers.data.length > 0) {
      console.log('\n📊 Sample Data:');
      bestsellers.data.slice(0, 2).forEach(category => {
        console.log(`Category: ${category.categoryName} (${category.books.length} books)`);
        category.books.slice(0, 3).forEach(book => {
          console.log(`  - #${book.position}: ${book.title} by ${book.authors}`);
        });
      });
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  process.exit(0);
}

quickTest();
