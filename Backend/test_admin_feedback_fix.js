// Test script to verify admin feedback storage in rejection flow
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'boitoi_db'
});

// Test function
async function testAdminFeedbackStorage() {
    console.log('=== Testing Admin Feedback Storage ===\n');
    
    try {
        // First, let's check if we have any pending requests
        const pendingRequests = await new Promise((resolve, reject) => {
            db.query('SELECT ID, STATUS FROM PUBLISHER_REQUEST WHERE STATUS = "PENDING" LIMIT 1', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        
        if (pendingRequests.length === 0) {
            console.log('No pending requests found. Creating a test request...');
            
            // Create a test request
            await new Promise((resolve, reject) => {
                const insertSql = `
                    INSERT INTO PUBLISHER_REQUEST (PUBLISHER_ID, REQUEST_TYPE, STATUS, SUBMITTED_AT, NOTES)
                    VALUES (1, 'ADD_BOOK', 'PENDING', NOW(), 'Test request for admin feedback')
                `;
                db.query(insertSql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            
            // Create corresponding book draft
            const requestId = await new Promise((resolve, reject) => {
                db.query('SELECT LAST_INSERT_ID() as id', (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].id);
                });
            });
            
            await new Promise((resolve, reject) => {
                const draftSql = `
                    INSERT INTO PUBLISHER_BOOK_DRAFT (REQUEST_ID, TITLE, ISBN, PRICE, DESCRIPTION)
                    VALUES (?, 'Test Book for Admin Feedback', 'TEST123456789', 29.99, 'Test book description')
                `;
                db.query(draftSql, [requestId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            
            console.log(`Created test request with ID: ${requestId}\n`);
        }
        
        // Get a pending request to test with
        const testRequest = await new Promise((resolve, reject) => {
            db.query('SELECT ID FROM PUBLISHER_REQUEST WHERE STATUS = "PENDING" LIMIT 1', (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
        
        const requestId = testRequest.ID;
        const adminId = 2; // Assuming admin with ID 2 exists
        const rejectionReason = 'Book does not meet quality standards. Please revise content and resubmit.';
        
        console.log(`Testing rejection with request ID: ${requestId}`);
        console.log(`Rejection reason: "${rejectionReason}"\n`);
        
        // Test the RejectBookRequest procedure
        await new Promise((resolve, reject) => {
            const sql = 'CALL RejectBookRequest(?, ?, ?, @result_message)';
            db.query(sql, [requestId, adminId, rejectionReason], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        
        // Get the result message
        const resultMessage = await new Promise((resolve, reject) => {
            db.query('SELECT @result_message as message', (err, results) => {
                if (err) reject(err);
                else resolve(results[0].message);
            });
        });
        
        console.log(`Procedure result: ${resultMessage}\n`);
        
        // Check the database to see where the feedback was stored
        const requestData = await new Promise((resolve, reject) => {
            const sql = `
                SELECT ID, STATUS, NOTES, admin_feedback, REVIEWED_BY, REVIEWED_AT
                FROM PUBLISHER_REQUEST 
                WHERE ID = ?
            `;
            db.query(sql, [requestId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
        
        console.log('=== DATABASE STORAGE VERIFICATION ===');
        console.log(`Request ID: ${requestData.ID}`);
        console.log(`Status: ${requestData.STATUS}`);
        console.log(`NOTES field: "${requestData.NOTES}"`);
        console.log(`ADMIN_FEEDBACK field: "${requestData.admin_feedback}"`);
        console.log(`Reviewed by: ${requestData.REVIEWED_BY}`);
        console.log(`Reviewed at: ${requestData.REVIEWED_AT}`);
        
        // Verify the fix
        if (requestData.admin_feedback === rejectionReason) {
            console.log('\n✅ SUCCESS: Rejection reason is correctly stored in admin_feedback column!');
        } else {
            console.log('\n❌ ISSUE: Rejection reason is not stored in admin_feedback column');
            console.log(`Expected: "${rejectionReason}"`);
            console.log(`Got: "${requestData.admin_feedback}"`);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        db.end();
    }
}

// Run the test
testAdminFeedbackStorage();
