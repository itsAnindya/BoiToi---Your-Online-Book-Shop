-- Comprehensive AUTO_INCREMENT Verification Script
-- Run this after applying both migration scripts to verify everything is working correctly

SET FOREIGN_KEY_CHECKS = 0;

-- ========================================================================
-- SECTION 1: VERIFY AUTO_INCREMENT IS APPLIED TO ALL EXPECTED TABLES
-- ========================================================================

SELECT 'TABLES WITH AUTO_INCREMENT (Should show all main tables)' as verification_section;
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    EXTRA,
    AUTO_INCREMENT as 'Current AUTO_INCREMENT Value'
FROM INFORMATION_SCHEMA.COLUMNS 
LEFT JOIN INFORMATION_SCHEMA.TABLES USING (TABLE_SCHEMA, TABLE_NAME)
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA LIKE '%auto_increment%'
ORDER BY TABLE_NAME;

-- ========================================================================
-- SECTION 2: IDENTIFY TABLES WITHOUT AUTO_INCREMENT 
-- (Should only be junction/bridge tables)
-- ========================================================================

SELECT 'TABLES WITHOUT AUTO_INCREMENT (Should only be junction tables)' as verification_section;
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA NOT LIKE '%auto_increment%'
ORDER BY TABLE_NAME;

-- ========================================================================
-- SECTION 3: CHECK FOR REMAINING OBSOLETE ID GENERATION FUNCTIONS
-- ========================================================================

SELECT 'CHECKING FOR OBSOLETE ID GENERATION FUNCTIONS (Should be empty)' as verification_section;
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'boitoi_db' 
    AND ROUTINE_NAME LIKE '%NextId%'
    OR ROUTINE_NAME LIKE '%GetNext%Id%';

-- ========================================================================
-- SECTION 4: VERIFY PRIMARY KEY CONSTRAINTS ARE CORRECT
-- ========================================================================

SELECT 'PRIMARY KEY VERIFICATION' as verification_section;
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    ORDINAL_POSITION,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_KEY = 'PRI'
    AND COLUMN_NAME = 'ID'
ORDER BY TABLE_NAME;

-- ========================================================================
-- SECTION 5: CHECK PROCEDURES ARE UPDATED FOR AUTO_INCREMENT
-- ========================================================================

SELECT 'STORED PROCEDURES VERIFICATION' as verification_section;
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    CREATED,
    LAST_ALTERED
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'boitoi_db' 
    AND ROUTINE_TYPE = 'PROCEDURE'
ORDER BY ROUTINE_NAME;

-- ========================================================================
-- SECTION 6: TEST AUTO_INCREMENT FUNCTIONALITY (SAFE TESTS)
-- ========================================================================

-- Test with a temporary table to ensure AUTO_INCREMENT works
CREATE TEMPORARY TABLE test_auto_increment (
    ID int NOT NULL AUTO_INCREMENT,
    test_value VARCHAR(50),
    PRIMARY KEY (ID)
);

INSERT INTO test_auto_increment (test_value) VALUES ('test1'), ('test2'), ('test3');

SELECT 'AUTO_INCREMENT TEST RESULTS' as verification_section;
SELECT * FROM test_auto_increment;

DROP TEMPORARY TABLE test_auto_increment;

-- ========================================================================
-- SECTION 7: CHECK FOREIGN KEY RELATIONSHIPS ARE INTACT
-- ========================================================================

SELECT 'FOREIGN KEY CONSTRAINTS VERIFICATION' as verification_section;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
    AND COLUMN_NAME = 'ID'
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- ========================================================================
-- SECTION 8: SUMMARY REPORT
-- ========================================================================

SELECT 'MIGRATION SUMMARY REPORT' as verification_section;

-- Count tables with AUTO_INCREMENT
SELECT 
    COUNT(*) as 'Tables with AUTO_INCREMENT',
    'Expected: ~18-20 main entity tables' as note
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA LIKE '%auto_increment%';

-- Count tables without AUTO_INCREMENT (should be junction tables only)
SELECT 
    COUNT(*) as 'Tables without AUTO_INCREMENT',
    'Should be junction/bridge tables only' as note
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA NOT LIKE '%auto_increment%';

-- Check for any remaining ID generation functions
SELECT 
    COUNT(*) as 'Obsolete ID Functions Remaining',
    'Should be 0' as note
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'boitoi_db' 
    AND (ROUTINE_NAME LIKE '%NextId%' OR ROUTINE_NAME LIKE '%GetNext%Id%');

SET FOREIGN_KEY_CHECKS = 1;

SELECT '✅ AUTO_INCREMENT MIGRATION VERIFICATION COMPLETE!' as status;
SELECT 'Review the results above to ensure everything is working correctly.' as instructions;
