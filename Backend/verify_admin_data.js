const db = require('./config/database');

console.log('Testing database connection and queries...');

// Test Users
db.query('SELECT COUNT(*) as total_users FROM user WHERE IS_ACTIVE = 1', (err, result) => {
  if (err) console.error('Users error:', err);
  else console.log('✅ Total Users:', result[0].total_users);
});

// Test Books
db.query('SELECT COUNT(*) as total_books FROM book WHERE SHOW_BOOK = 1', (err, result) => {
  if (err) console.error('Books error:', err);
  else console.log('✅ Total Books:', result[0].total_books);
});

// Test Orders and Revenue
db.query('SELECT COUNT(*) as total_orders, COALESCE(SUM(TOTAL_AMOUNT), 0) as revenue FROM `order`', (err, result) => {
  if (err) console.error('Orders error:', err);
  else {
    console.log('✅ Total Orders:', result[0].total_orders);
    console.log('✅ Total Revenue: ৳' + result[0].revenue.toLocaleString());
  }
});

setTimeout(() => {
  console.log('\n🎉 Database verification complete! Admin panel will show real data.');
  process.exit(0);
}, 2000);
