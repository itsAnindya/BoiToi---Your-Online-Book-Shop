const db = require('./config/database');

const testBestsellerSQL = () => {
  console.log('🧪 Testing Bestseller SQL Query...\n');
  
  // Test the main query
  const testQuery = `
    WITH book_category_sales AS (
        SELECT 
            bc.CATEGORY_ID,
            bc.BOOK_ID,
            SUM(ob.QUANTITY) as total_quantity_sold,
            COUNT(DISTINCT o.ID) as total_orders
        FROM \`order\` o
        INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
        INNER JOIN book b ON ob.BOOK_ID = b.ID
        INNER JOIN book_category bc ON b.ID = bc.BOOK_ID
        WHERE 
            o.ORDER_STATUS = 'delivered'
            AND o.ORDERD_AT >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND b.SHOW_BOOK = 1
        GROUP BY bc.CATEGORY_ID, bc.BOOK_ID
    ),
    ranked_bestsellers AS (
        SELECT 
            CATEGORY_ID,
            BOOK_ID,
            total_quantity_sold,
            total_orders,
            ROW_NUMBER() OVER (
                PARTITION BY CATEGORY_ID 
                ORDER BY total_quantity_sold DESC, total_orders DESC, BOOK_ID ASC
            ) as book_rank
        FROM book_category_sales
    )
    SELECT 
        'MONTHLY' as PERIOD_TYPE,
        DATE_FORMAT(NOW(), '%Y-%m-01') as PERIOD_START,
        CATEGORY_ID,
        book_rank as POSITION,
        BOOK_ID,
        total_quantity_sold,
        total_orders
    FROM ranked_bestsellers 
    WHERE book_rank <= 10
    ORDER BY CATEGORY_ID, book_rank
    LIMIT 20
  `;
  
  db.query(testQuery, (err, results) => {
    if (err) {
      console.error('❌ SQL Query Error:', err);
      return;
    }
    
    console.log('✅ SQL Query Results:');
    console.log(`Found ${results.length} potential bestseller entries`);
    
    if (results.length > 0) {
      console.log('\nSample Results:');
      results.slice(0, 5).forEach((row, index) => {
        console.log(`${index + 1}. Category: ${row.CATEGORY_ID}, Book: ${row.BOOK_ID}, Position: ${row.POSITION}, Sales: ${row.total_quantity_sold}`);
      });
      
      // Group by category
      const categories = [...new Set(results.map(r => r.CATEGORY_ID))];
      console.log(`\nCategories with bestsellers: ${categories.join(', ')}`);
    } else {
      console.log('No bestseller data found. This might be because:');
      console.log('1. No delivered orders in the last 30 days');
      console.log('2. No orders exist in the database');
      console.log('3. Books are not properly categorized');
    }
    
    // Test if orders exist at all
    db.query('SELECT COUNT(*) as total_orders FROM `order`', (err2, orderCount) => {
      if (!err2) {
        console.log(`\nTotal orders in database: ${orderCount[0].total_orders}`);
      }
      
      // Test if delivered orders exist
      db.query('SELECT COUNT(*) as delivered_orders FROM `order` WHERE ORDER_STATUS = "delivered"', (err3, deliveredCount) => {
        if (!err3) {
          console.log(`Delivered orders: ${deliveredCount[0].delivered_orders}`);
        }
        
        process.exit(0);
      });
    });
  });
};

// Run the test
testBestsellerSQL();
