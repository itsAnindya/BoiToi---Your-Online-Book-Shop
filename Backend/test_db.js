const db = require('./config/database');

// Test the database connection and queries
console.log('Testing database connection and queries...');

// Test 1: Basic connection
console.log('\n=== Test 1: Database Connection ===');

// Test 2: Fetch pending requests (same query as controller)
console.log('\n=== Test 2: Fetch Pending Requests ===');
const pendingRequestsQuery = `
  SELECT 
    pr.ID,
    pr.PUBLISHER_ID,
    pr.REQUEST_TYPE,
    pr.STATUS,
    pr.SUBMITTED_AT,
    pr.REVIEWED_AT,
    pr.NOTES,
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
    pbd.GENRE
  FROM PUBLISHER_REQUEST pr
  JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
  LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
  WHERE pr.STATUS = 'PENDING'
  ORDER BY pr.SUBMITTED_AT ASC
`;

db.query(pendingRequestsQuery, (err, results) => {
  if (err) {
    console.error('❌ Error fetching pending requests:', err);
  } else {
    console.log('✅ Pending requests fetched successfully:', results.length, 'found');
    if (results.length > 0) {
      console.log('Sample request:', {
        id: results[0].ID,
        title: results[0].TITLE,
        publisher: results[0].PUBLISHER_NAME,
        status: results[0].STATUS
      });
    }
  }
  
  // Test 3: Fetch all requests
  console.log('\n=== Test 3: Fetch All Requests ===');
  const allRequestsQuery = `
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
  
  db.query(allRequestsQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching all requests:', err);
    } else {
      console.log('✅ All requests fetched successfully:', results.length, 'found');
      console.log('Status breakdown:');
      const statusCounts = {};
      results.forEach(r => {
        statusCounts[r.STATUS] = (statusCounts[r.STATUS] || 0) + 1;
      });
      console.log(statusCounts);
    }
    
    console.log('\n=== Database Tests Complete ===');
    process.exit(0);
  });
});
