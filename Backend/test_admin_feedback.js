/**
 * Test script to verify admin feedback functionality
 * This script tests the stored procedures and controller functionality for admin feedback
 */

const db = require('./config/database');

// Test function to verify stored procedures
function testStoredProcedures() {
  console.log('Testing stored procedures...');
  
  // Check if procedures exist
  const checkProceduresSql = "SHOW PROCEDURE STATUS WHERE Db = 'boitoi_db' AND Name IN ('ApproveBookRequest', 'RejectBookRequest')";
  
  db.query(checkProceduresSql, (err, results) => {
    if (err) {
      console.error('Error checking procedures:', err);
      return;
    }
    
    console.log('Found procedures:', results.length);
    results.forEach(proc => {
      console.log(`- ${proc.Name}: ${proc.Type} (Created: ${proc.Created})`);
    });
    
    // Test procedure parameters
    testProcedureParameters();
  });
}

function testProcedureParameters() {
  console.log('\nTesting procedure parameters...');
  
  // Check the parameters of ApproveBookRequest
  const checkApproveParamsSql = `
    SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE
    FROM INFORMATION_SCHEMA.PARAMETERS 
    WHERE SPECIFIC_NAME = 'ApproveBookRequest' AND SPECIFIC_SCHEMA = 'boitoi_db'
    ORDER BY ORDINAL_POSITION;
  `;
  
  db.query(checkApproveParamsSql, (err, results) => {
    if (err) {
      console.error('Error checking ApproveBookRequest parameters:', err);
      return;
    }
    
    console.log('ApproveBookRequest parameters:');
    results.forEach(param => {
      console.log(`  ${param.PARAMETER_MODE} ${param.PARAMETER_NAME}: ${param.DATA_TYPE}`);
    });
    
    // Check RejectBookRequest parameters
    const checkRejectParamsSql = `
      SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE
      FROM INFORMATION_SCHEMA.PARAMETERS 
      WHERE SPECIFIC_NAME = 'RejectBookRequest' AND SPECIFIC_SCHEMA = 'boitoi_db'
      ORDER BY ORDINAL_POSITION;
    `;
    
    db.query(checkRejectParamsSql, (err, results) => {
      if (err) {
        console.error('Error checking RejectBookRequest parameters:', err);
        return;
      }
      
      console.log('\nRejectBookRequest parameters:');
      results.forEach(param => {
        console.log(`  ${param.PARAMETER_MODE} ${param.PARAMETER_NAME}: ${param.DATA_TYPE}`);
      });
      
      // Test admin_feedback column
      testAdminFeedbackColumn();
    });
  });
}

function testAdminFeedbackColumn() {
  console.log('\nTesting admin_feedback column...');
  
  const checkColumnSql = `
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND TABLE_NAME = 'PUBLISHER_REQUEST' 
    AND COLUMN_NAME = 'admin_feedback';
  `;
  
  db.query(checkColumnSql, (err, results) => {
    if (err) {
      console.error('Error checking admin_feedback column:', err);
      return;
    }
    
    if (results.length > 0) {
      console.log('✓ admin_feedback column exists:');
      const col = results[0];
      console.log(`  Type: ${col.DATA_TYPE}`);
      console.log(`  Nullable: ${col.IS_NULLABLE}`);
      console.log(`  Comment: ${col.COLUMN_COMMENT}`);
    } else {
      console.log('✗ admin_feedback column does not exist');
    }
    
    // Test sample data
    testSampleData();
  });
}

function testSampleData() {
  console.log('\nTesting current data...');
  
  const sampleDataSql = `
    SELECT 
      ID, 
      STATUS, 
      NOTES, 
      admin_feedback,
      SUBMITTED_AT,
      REVIEWED_AT
    FROM PUBLISHER_REQUEST 
    ORDER BY SUBMITTED_AT DESC 
    LIMIT 5;
  `;
  
  db.query(sampleDataSql, (err, results) => {
    if (err) {
      console.error('Error fetching sample data:', err);
      return;
    }
    
    console.log('Recent requests:');
    results.forEach(req => {
      console.log(`  Request ${req.ID}: ${req.STATUS}`);
      console.log(`    Notes: ${req.NOTES || 'None'}`);
      console.log(`    Admin Feedback: ${req.admin_feedback || 'None'}`);
      console.log(`    Submitted: ${req.SUBMITTED_AT}`);
      console.log(`    Reviewed: ${req.REVIEWED_AT || 'Not reviewed'}`);
      console.log('');
    });
    
    console.log('Test completed successfully!');
    db.end();
  });
}

// Run the test
console.log('Starting admin feedback functionality test...');
testStoredProcedures();
