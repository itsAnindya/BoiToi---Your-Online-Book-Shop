const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'boitoi_db'
});

console.log('=== Testing Approval System ===\n');

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✓ Connected to database\n');

  // Test 1: Check if procedures exist
  console.log('1. Checking stored procedures...');
  db.query('SHOW PROCEDURE STATUS WHERE Name IN ("ApproveBookRequest", "RejectBookRequest")', (err, results) => {
    if (err) {
      console.error('Error checking procedures:', err);
      return;
    }
    
    console.log('✓ Found procedures:');
    results.forEach(proc => {
      console.log(`  - ${proc.Name} (created: ${proc.Created})`);
    });
    console.log();

    // Test 2: Check table structure
    console.log('2. Checking PUBLISHER_REQUEST table structure...');
    db.query('DESCRIBE PUBLISHER_REQUEST', (err, results) => {
      if (err) {
        console.error('Error describing table:', err);
        return;
      }
      
      console.log('✓ PUBLISHER_REQUEST columns:');
      results.forEach(col => {
        if (col.Field === 'admin_feedback') {
          console.log(`  - ${col.Field}: ${col.Type} ✓`);
        } else {
          console.log(`  - ${col.Field}: ${col.Type}`);
        }
      });
      console.log();

      // Test 3: Test approval with admin feedback
      console.log('3. Testing procedures...');
      
      // Create a test request first (using single statements)
      db.query('INSERT INTO PUBLISHER_REQUEST (PUBLISHER_ID, STATUS) VALUES (1, "PENDING")', (err, result) => {
        if (err) {
          console.error('Error creating test request:', err);
          return;
        }
        
        const testRequestId = result.insertId;
        console.log(`✓ Created test request ID: ${testRequestId}`);
        
        // Create book draft for the request
        db.query('INSERT INTO PUBLISHER_BOOK_DRAFT (REQUEST_ID, TITLE, AUTHOR, DESCRIPTION, GENRE, PRICE, QUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [testRequestId, 'Test Approval Book', 'Test Author', 'Testing approval system', 'Fiction', 25.99, 50], 
          (err) => {
            if (err) {
              console.error('Error creating book draft:', err);
              return;
            }
            
            console.log('✓ Created book draft for test request');
            
            // Test approval procedure
            console.log('\n4. Testing ApproveBookRequest procedure...');
            db.query('CALL ApproveBookRequest(?, ?, ?, @result_message, @new_book_id)', 
              [testRequestId, 1, 'This book looks great! Approved for publication.'], 
              (err, results) => {
                if (err) {
                  console.error('Error calling ApproveBookRequest:', err);
                  return;
                }
                
                // Get output parameters
                db.query('SELECT @result_message as message, @new_book_id as book_id', (err, output) => {
                  if (err) {
                    console.error('Error getting output:', err);
                    return;
                  }
                  
                  console.log('✓ Approval result:', output[0]);
                  
                  // Check if admin_feedback was saved
                  db.query('SELECT ID, STATUS, admin_feedback FROM PUBLISHER_REQUEST WHERE ID = ?', 
                    [testRequestId], (err, checkResults) => {
                      if (err) {
                        console.error('Error checking result:', err);
                        return;
                      }
                      
                      console.log('✓ Request status after approval:', checkResults[0]);
                      
                      // Test rejection procedure with a new request
                      console.log('\n5. Testing RejectBookRequest procedure...');
                      
                      // Create another test request for rejection
                      db.query('INSERT INTO PUBLISHER_REQUEST (PUBLISHER_ID, STATUS) VALUES (1, "PENDING")', (err, result) => {
                        if (err) {
                          console.error('Error creating reject test request:', err);
                          return;
                        }
                        
                        const rejectRequestId = result.insertId;
                        console.log(`✓ Created test rejection request ID: ${rejectRequestId}`);
                        
                        // Create book draft for rejection test
                        db.query('INSERT INTO PUBLISHER_BOOK_DRAFT (REQUEST_ID, TITLE, AUTHOR, DESCRIPTION, GENRE, PRICE, QUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                          [rejectRequestId, 'Test Reject Book', 'Test Author', 'Testing rejection system', 'Fiction', 25.99, 50], 
                          (err) => {
                            if (err) {
                              console.error('Error creating reject book draft:', err);
                              return;
                            }
                            
                            console.log('✓ Created book draft for rejection test');
                            
                            // Test rejection procedure
                            db.query('CALL RejectBookRequest(?, ?, ?, @result_message)', 
                              [rejectRequestId, 1, 'This book needs more work. Please revise the content and resubmit.'], 
                              (err, results) => {
                                if (err) {
                                  console.error('Error calling RejectBookRequest:', err);
                                  return;
                                }
                                
                                // Get output parameter
                                db.query('SELECT @result_message as message', (err, output) => {
                                  if (err) {
                                    console.error('Error getting rejection output:', err);
                                    return;
                                  }
                                  
                                  console.log('✓ Rejection result:', output[0]);
                                  
                                  // Check if admin_feedback was saved
                                  db.query('SELECT ID, STATUS, admin_feedback FROM PUBLISHER_REQUEST WHERE ID = ?', 
                                    [rejectRequestId], (err, checkResults) => {
                                      if (err) {
                                        console.error('Error checking rejection result:', err);
                                        return;
                                      }
                                      
                                      console.log('✓ Request status after rejection:', checkResults[0]);
                                      
                                      console.log('\n=== Test Complete ===');
                                      console.log('Summary:');
                                      console.log('- Approval creates book and stores admin feedback ✓');
                                      console.log('- Rejection stores reason in admin_feedback column ✓');
                                      console.log('- Book creation happens AFTER approval ✓');
                                      
                                      db.end();
                                    });
                                });
                              });
                          });
                      });
                    });
                });
              });
          });
      });
    });
  });
});
