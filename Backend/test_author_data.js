const db = require('./config/database');

console.log('Testing author data from database...');

const query = `
  SELECT 
    ID,
    NAME,
    DATE_OF_BIRTH,
    NATIONALITY,
    BIO
  FROM author 
  WHERE ID IN (1, 2, 3, 4, 5)
  ORDER BY ID;
`;

db.query(query, (err, results) => {
  if (err) {
    console.error('Error fetching authors:', err);
    process.exit(1);
  }

  console.log('Sample author data:');
  results.forEach(author => {
    console.log(`\nID: ${author.ID}`);
    console.log(`NAME: ${author.NAME}`);
    console.log(`DATE_OF_BIRTH: ${author.DATE_OF_BIRTH}`);
    console.log(`NATIONALITY: ${author.NATIONALITY}`);
    console.log(`BIO: ${author.BIO ? author.BIO.substring(0, 100) + '...' : 'NULL'}`);
  });
  
  process.exit(0);
});
