const db = require('./config/database');

console.log('🔍 Checking AUTO_INCREMENT status for all ID columns...\n');

// Check tables WITH AUTO_INCREMENT
const checkAutoIncrement = `
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA LIKE '%auto_increment%'
ORDER BY TABLE_NAME;
`;

// Check tables WITHOUT AUTO_INCREMENT  
const checkNoAutoIncrement = `
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA NOT LIKE '%auto_increment%'
ORDER BY TABLE_NAME;
`;

db.query(checkAutoIncrement, (err, results) => {
    if (err) {
        console.error('❌ Error checking AUTO_INCREMENT tables:', err);
        db.end();
        return;
    }
    
    console.log('✅ Tables WITH AUTO_INCREMENT:');
    console.table(results);
    
    db.query(checkNoAutoIncrement, (err, results2) => {
        if (err) {
            console.error('❌ Error checking non-AUTO_INCREMENT tables:', err);
            db.end();
            return;
        }
        
        console.log('\n🔍 Tables WITHOUT AUTO_INCREMENT:');
        if (results2.length === 0) {
            console.log('✅ All ID columns have AUTO_INCREMENT! Perfect!');
        } else {
            console.table(results2);
            console.log('\n⚠️  Some tables still need AUTO_INCREMENT');
        }
        
        console.log('\n📊 Summary:');
        console.log(`✅ Tables with AUTO_INCREMENT: ${results.length}`);
        console.log(`⚠️  Tables without AUTO_INCREMENT: ${results2.length}`);
        
        db.end();
    });
});
