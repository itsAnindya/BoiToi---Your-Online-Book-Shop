const mysql = require('mysql2');

console.log('Testing database connection...');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'boitoi_db'
});

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  
  console.log('✓ Connected to database');
  
  // Test simple query
  db.query('SELECT COUNT(*) as count FROM PUBLISHER_REQUEST', (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      db.end();
      return;
    }
    
    console.log('✓ Query successful:', results[0]);
    
    // Check if admin_feedback column exists
    db.query('SHOW COLUMNS FROM PUBLISHER_REQUEST LIKE "admin_feedback"', (err, results) => {
      if (err) {
        console.error('Column check failed:', err);
      } else if (results.length > 0) {
        console.log('✓ admin_feedback column exists:', results[0]);
      } else {
        console.log('❌ admin_feedback column NOT found');
      }
      
      db.end(() => {
        console.log('✓ Connection closed');
      });
    });
  });
});
