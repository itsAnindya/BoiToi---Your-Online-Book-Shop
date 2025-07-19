const db = require('./config/database');

db.query('SELECT pr.ID, pr.STATUS, pbd.TITLE FROM PUBLISHER_REQUEST pr LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID ORDER BY pr.SUBMITTED_AT DESC', (err, results) => {
  if(err) {
    console.error('Error:', err.message);
  } else {
    console.log('Current book requests:');
    results.forEach(r => console.log(`ID: ${r.ID}, Status: ${r.STATUS}, Title: ${r.TITLE || 'N/A'}`));
  }
  process.exit(0);
});
