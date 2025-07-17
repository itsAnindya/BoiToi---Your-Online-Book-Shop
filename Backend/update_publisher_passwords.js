const bcrypt = require('bcrypt');
const db = require('./config/database');

/**
 * Script to update publisher passwords
 * Sets all publishers to have the same password: 123456
 * Uses bcrypt with 10 rounds (same as user authentication)
 */

const updatePublisherPasswords = async () => {
  try {
    // Generate password hash for '123456'
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Generated password hash:', hashedPassword);
    
    // Update all publishers without password hashes
    const updateQuery = `
      UPDATE PUBLISHER 
      SET PASSWORD_HASH = ?, STATUS = 'ACTIVE'
      WHERE PASSWORD_HASH IS NULL OR PASSWORD_HASH = ''
    `;
    
    db.query(updateQuery, [hashedPassword], (err, result) => {
      if (err) {
        console.error('Error updating publishers:', err);
        return;
      }
      
      console.log(`Updated ${result.affectedRows} publishers with password hashes`);
      
      // Show all publishers
      const selectQuery = `
        SELECT ID, NAME, EMAIL, STATUS, 
               CASE 
                 WHEN PASSWORD_HASH IS NOT NULL THEN 'YES' 
                 ELSE 'NO' 
               END as HAS_PASSWORD
        FROM PUBLISHER 
        ORDER BY NAME
      `;
      
      db.query(selectQuery, (err, results) => {
        if (err) {
          console.error('Error fetching publishers:', err);
          return;
        }
        
        console.log('\nAll publishers:');
        console.table(results);
        
        console.log('\nPublisher login credentials:');
        console.log('Username: [Publisher Name from database]');
        console.log('Password: 123456');
        
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the update
updatePublisherPasswords();
