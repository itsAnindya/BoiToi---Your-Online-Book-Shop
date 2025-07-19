const db = require('./config/database');

console.log('🔍 Testing the exact query used in adminBookRequestController...');

const sql = `
  SELECT 
    pr.ID,
    pr.PUBLISHER_ID,
    pr.REQUEST_TYPE,
    pr.STATUS,
    pr.SUBMITTED_AT,
    pr.REVIEWED_AT,
    pr.NOTES,
    pr.REVIEWED_BY,
    p.NAME as PUBLISHER_NAME,
    p.EMAIL as PUBLISHER_EMAIL,
    pbd.TITLE,
    pbd.ISBN,
    pbd.PAGE_COUNT,
    pbd.LANGUAGE,
    pbd.EDITION,
    pbd.PRICE,
    pbd.STOCK_QUANTITY,
    pbd.DESCRIPTION,
    pbd.COVER_URL,
    pbd.GENRE,
    admin_user.USERNAME as REVIEWED_BY_USERNAME
  FROM PUBLISHER_REQUEST pr
  JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
  LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
  LEFT JOIN ADMIN admin_table ON pr.REVIEWED_BY = admin_table.USER_ID
  LEFT JOIN USER admin_user ON admin_table.USER_ID = admin_user.ID
  ORDER BY pr.SUBMITTED_AT DESC
`;

console.log('📝 Executing query...');

db.query(sql, (err, results) => {
  if (err) {
    console.error('❌ Database error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }

  console.log('✅ Query successful!');
  console.log(`📊 Found ${results.length} records`);
  
  if (results.length > 0) {
    console.log('📋 First record:');
    console.log(JSON.stringify(results[0], null, 2));
    
    console.log('\n🔍 All records summary:');
    results.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.ID}, Title: ${record.TITLE}, Status: ${record.STATUS}, Publisher: ${record.PUBLISHER_NAME}`);
    });
  } else {
    console.log('📭 No records found');
  }
  
  process.exit(0);
});
