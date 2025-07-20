/**
 * Test script to manually test admin feedback storage
 * This will directly call the stored procedure to test if it works
 */

const db = require('./config/database');

// Test function to manually test admin feedback
function testAdminFeedbackStorage() {
  console.log('Testing direct admin feedback storage...');
  
  // First, let's see if there are any pending requests
  const getPendingSql = `
    SELECT pr.ID, pbd.TITLE 
    FROM PUBLISHER_REQUEST pr
    LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
    WHERE pr.STATUS = 'PENDING'
    LIMIT 1;
  `;
  
  db.query(getPendingSql, (err, results) => {
    if (err) {
      console.error('Error getting pending requests:', err);
      return;
    }
    
    if (results.length === 0) {
      console.log('No pending requests found to test with.');
      console.log('Creating a test rejection on an existing request...');
      testRejectionDirectly();
    } else {
      const request = results[0];
      console.log(`Found pending request: ${request.ID} - ${request.TITLE}`);
      console.log('Testing approval with admin feedback...');
      
      // Test approval with admin feedback
      const testApprovalSql = 'CALL ApproveBookRequest(?, ?, ?, @result_message, @new_book_id)';
      const testFeedback = `Test admin feedback for request ${request.ID} - Approved after thorough review`;
      
      db.query(testApprovalSql, [request.ID, 1001, testFeedback], (err, results) => {
        if (err) {
          console.error('Error calling ApproveBookRequest:', err);
          return;
        }
        
        console.log('Stored procedure executed successfully');
        
        // Get the output parameters
        db.query('SELECT @result_message as message, @new_book_id as book_id', (err, outputResults) => {
          if (err) {
            console.error('Error getting output:', err);
            return;
          }
          
          console.log('Procedure output:', outputResults[0]);
          
          // Check if admin_feedback was saved
          const checkFeedbackSql = `
            SELECT ID, STATUS, admin_feedback, NOTES, REVIEWED_AT
            FROM PUBLISHER_REQUEST 
            WHERE ID = ?;
          `;
          
          db.query(checkFeedbackSql, [request.ID], (err, feedbackResults) => {
            if (err) {
              console.error('Error checking feedback:', err);
              return;
            }
            
            console.log('\\nRequest after approval:');
            const req = feedbackResults[0];
            console.log(`  ID: ${req.ID}`);
            console.log(`  Status: ${req.STATUS}`);
            console.log(`  Admin Feedback: ${req.admin_feedback || 'NULL'}`);
            console.log(`  Notes: ${req.NOTES || 'NULL'}`);
            console.log(`  Reviewed At: ${req.REVIEWED_AT}`);
            
            if (req.admin_feedback === testFeedback) {
              console.log('\\n✅ SUCCESS: Admin feedback was correctly saved!');
            } else {
              console.log('\\n❌ FAILURE: Admin feedback was not saved correctly');
              console.log(`Expected: "${testFeedback}"`);
              console.log(`Got: "${req.admin_feedback}"`);
            }
            
            db.end();
          });
        });
      });
    }
  });
}

function testRejectionDirectly() {
  // Find any request that we can reject (not already rejected)
  const getTestRequestSql = `
    SELECT pr.ID, pbd.TITLE 
    FROM PUBLISHER_REQUEST pr
    LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
    WHERE pr.STATUS IN ('PENDING', 'APPROVED')
    LIMIT 1;
  `;
  
  db.query(getTestRequestSql, (err, results) => {
    if (err) {
      console.error('Error getting test request:', err);
      db.end();
      return;
    }
    
    if (results.length === 0) {
      console.log('No requests available for testing rejection.');
      db.end();
      return;
    }
    
    const request = results[0];
    console.log(`Testing rejection on request: ${request.ID} - ${request.TITLE}`);
    
    // Test rejection with admin feedback
    const testRejectionSql = 'CALL RejectBookRequest(?, ?, ?, ?, @result_message)';
    const testReason = 'Test rejection reason';
    const testFeedback = `Test admin feedback for rejection of request ${request.ID} - Detailed feedback about quality issues`;
    
    db.query(testRejectionSql, [request.ID, 1001, testReason, testFeedback], (err, results) => {
      if (err) {
        console.error('Error calling RejectBookRequest:', err);
        db.end();
        return;
      }
      
      console.log('Rejection procedure executed successfully');
      
      // Get the output parameter
      db.query('SELECT @result_message as message', (err, outputResults) => {
        if (err) {
          console.error('Error getting output:', err);
          db.end();
          return;
        }
        
        console.log('Procedure output:', outputResults[0]);
        
        // Check if admin_feedback was saved
        const checkFeedbackSql = `
          SELECT ID, STATUS, admin_feedback, NOTES, REVIEWED_AT
          FROM PUBLISHER_REQUEST 
          WHERE ID = ?;
        `;
        
        db.query(checkFeedbackSql, [request.ID], (err, feedbackResults) => {
          if (err) {
            console.error('Error checking feedback:', err);
            db.end();
            return;
          }
          
          console.log('\\nRequest after rejection:');
          const req = feedbackResults[0];
          console.log(`  ID: ${req.ID}`);
          console.log(`  Status: ${req.STATUS}`);
          console.log(`  Admin Feedback: ${req.admin_feedback || 'NULL'}`);
          console.log(`  Notes: ${req.NOTES || 'NULL'}`);
          console.log(`  Reviewed At: ${req.REVIEWED_AT}`);
          
          if (req.admin_feedback === testFeedback) {
            console.log('\\n✅ SUCCESS: Admin feedback was correctly saved!');
          } else {
            console.log('\\n❌ FAILURE: Admin feedback was not saved correctly');
            console.log(`Expected: "${testFeedback}"`);
            console.log(`Got: "${req.admin_feedback}"`);
          }
          
          db.end();
        });
      });
    });
  });
}

// Run the test
console.log('Starting direct admin feedback storage test...');
testAdminFeedbackStorage();
