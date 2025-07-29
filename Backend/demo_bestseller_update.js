// Test and Demo for Category Bestseller System
// Run with: node demo_bestseller_update.js

const db = require('./config/database');

// Function to test the raw SQL query logic
async function testBestsellerQuery() {
  console.log('🔍 Testing Bestseller Query Logic\n');

  return new Promise((resolve, reject) => {
    // Test the core query that calculates bestsellers
    const testQuery = `
      SELECT 
          c.ID as CATEGORY_ID,
          c.NAME as CATEGORY_NAME,
          b.ID as BOOK_ID,
          b.TITLE,
          SUM(ob.QUANTITY) as total_sold,
          ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY SUM(ob.QUANTITY) DESC) as book_rank
      FROM \`order\` o
      INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
      INNER JOIN book b ON ob.BOOK_ID = b.ID
      INNER JOIN category c ON b.CATEGORY_ID = c.ID
      WHERE 
          o.ORDER_STATUS = 'delivered'
          AND o.ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          AND b.SHOW_BOOK = 1
          AND b.CATEGORY_ID IS NOT NULL
      GROUP BY c.ID, c.NAME, b.ID, b.TITLE
      HAVING total_sold > 0
      ORDER BY c.ID, book_rank
      LIMIT 50
    `;

    db.query(testQuery, (err, results) => {
      if (err) {
        console.error('❌ Query test failed:', err);
        reject(err);
        return;
      }

      console.log(`✅ Query returned ${results.length} results`);
      
      if (results.length > 0) {
        console.log('\n📊 Sample Results:');
        const sampleResults = results.slice(0, 5);
        sampleResults.forEach(row => {
          console.log(`- Category: ${row.CATEGORY_NAME} | Book: ${row.TITLE} | Rank: ${row.book_rank} | Sold: ${row.total_sold}`);
        });

        // Group by category to show structure
        const categories = {};
        results.forEach(row => {
          if (!categories[row.CATEGORY_ID]) {
            categories[row.CATEGORY_ID] = {
              name: row.CATEGORY_NAME,
              books: 0
            };
          }
          if (row.book_rank <= 10) {
            categories[row.CATEGORY_ID].books++;
          }
        });

        console.log('\n📈 Categories with bestsellers:');
        Object.values(categories).forEach(cat => {
          console.log(`- ${cat.name}: ${cat.books} bestseller books`);
        });
      } else {
        console.log('⚠️  No delivered orders in the last 30 days');
        console.log('💡 This might be because:');
        console.log('   - No orders have status "delivered"');
        console.log('   - No orders in the last 30 days');
        console.log('   - Books don\'t have category assignments');
      }

      resolve(results);
    });
  });
}

// Function to check current bestseller table status
async function checkCurrentBestsellers() {
  console.log('\n📋 Checking Current Bestseller Table\n');

  return new Promise((resolve, reject) => {
    const statusQuery = `
      SELECT 
          PERIOD_TYPE,
          PERIOD_START,
          COUNT(*) as total_entries,
          COUNT(DISTINCT CATEGORY_ID) as categories_count,
          MIN(POSITION) as min_position,
          MAX(POSITION) as max_position
      FROM category_bestseller 
      GROUP BY PERIOD_TYPE, PERIOD_START
      ORDER BY PERIOD_START DESC
      LIMIT 5
    `;

    db.query(statusQuery, (err, results) => {
      if (err) {
        console.error('❌ Status check failed:', err);
        reject(err);
        return;
      }

      if (results.length > 0) {
        console.log('✅ Current bestseller data:');
        results.forEach(row => {
          console.log(`- ${row.PERIOD_TYPE} ${row.PERIOD_START}: ${row.total_entries} entries across ${row.categories_count} categories`);
        });
      } else {
        console.log('⚠️  No bestseller data found in table');
      }

      resolve(results);
    });
  });
}

// Function to demonstrate the update process
async function demonstrateUpdate() {
  console.log('\n🔄 Demonstrating Bestseller Update Process\n');

  return new Promise((resolve, reject) => {
    console.log('Step 1: Clear existing monthly data for current period...');
    
    const clearSql = `
      DELETE FROM category_bestseller 
      WHERE PERIOD_TYPE = 'MONTHLY' 
      AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `;

    db.query(clearSql, (clearErr, clearResult) => {
      if (clearErr) {
        console.error('❌ Clear step failed:', clearErr);
        reject(clearErr);
        return;
      }

      console.log(`✅ Cleared ${clearResult.affectedRows} existing records`);
      console.log('Step 2: Insert new bestseller data...');

      const insertSql = `
        INSERT INTO category_bestseller (PERIOD_TYPE, PERIOD_START, CATEGORY_ID, POSITION, BOOK_ID)
        SELECT 
            'MONTHLY' as PERIOD_TYPE,
            DATE_FORMAT(CURDATE(), '%Y-%m-01') as PERIOD_START,
            ranked_books.CATEGORY_ID,
            ranked_books.book_rank as POSITION,
            ranked_books.BOOK_ID
        FROM (
            SELECT 
                c.ID as CATEGORY_ID,
                b.ID as BOOK_ID,
                SUM(ob.QUANTITY) as total_sold,
                ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY SUM(ob.QUANTITY) DESC) as book_rank
            FROM \`order\` o
            INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
            INNER JOIN book b ON ob.BOOK_ID = b.ID
            INNER JOIN category c ON b.CATEGORY_ID = c.ID
            WHERE 
                o.ORDER_STATUS = 'delivered'
                AND o.ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                AND b.SHOW_BOOK = 1
                AND b.CATEGORY_ID IS NOT NULL
            GROUP BY c.ID, b.ID
            HAVING total_sold > 0
        ) ranked_books
        WHERE ranked_books.book_rank <= 10
        ORDER BY ranked_books.CATEGORY_ID, ranked_books.book_rank
      `;

      db.query(insertSql, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('❌ Insert step failed:', insertErr);
          reject(insertErr);
          return;
        }

        console.log(`✅ Inserted ${insertResult.affectedRows} new bestseller records`);
        console.log('Step 3: Verify the update...');

        const verifySql = `
          SELECT 
              COUNT(*) as total_bestsellers,
              COUNT(DISTINCT CATEGORY_ID) as categories_with_bestsellers,
              DATE_FORMAT(CURDATE(), '%Y-%m-01') as period_start
          FROM category_bestseller 
          WHERE PERIOD_TYPE = 'MONTHLY' 
          AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01')
        `;

        db.query(verifySql, (verifyErr, verifyResult) => {
          if (verifyErr) {
            console.error('❌ Verification failed:', verifyErr);
            reject(verifyErr);
            return;
          }

          const summary = verifyResult[0];
          console.log('✅ Update completed successfully!');
          console.log(`📊 Summary: ${summary.total_bestsellers} bestsellers across ${summary.categories_with_bestsellers} categories`);
          console.log(`📅 Period: ${summary.period_start}`);

          resolve(summary);
        });
      });
    });
  });
}

// Main execution
async function runDemo() {
  console.log('🎯 Category Bestseller System Demo\n');
  console.log('This demo will:');
  console.log('1. Test the bestseller calculation query');
  console.log('2. Check current bestseller table status');
  console.log('3. Demonstrate the update process');
  console.log('4. Show how to use this in production\n');

  try {
    await testBestsellerQuery();
    await checkCurrentBestsellers();
    await demonstrateUpdate();

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📝 Implementation Notes:');
    console.log('1. The system updates bestsellers based on delivered orders from the last 30 days');
    console.log('2. Only books with assigned categories are included');
    console.log('3. Top 10 books per category are stored');
    console.log('4. Use the BestsellerService for production updates');
    console.log('5. Set up the scheduler for automatic daily updates');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }

  process.exit(0);
}

runDemo();
