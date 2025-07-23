-- Cleanup script after AUTO_INCREMENT migration
-- Run this to fix remaining issues

SET FOREIGN_KEY_CHECKS = 0;

-- Fix admin_permission PRIMARY KEY (remove DESC ordering)
ALTER TABLE `admin_permission` DROP PRIMARY KEY, ADD PRIMARY KEY (`ID`);

-- Drop obsolete ID generation functions since AUTO_INCREMENT handles this now
DROP FUNCTION IF EXISTS `GetNextAuthorId`;
DROP FUNCTION IF EXISTS `GetNextBookId`;
DROP FUNCTION IF EXISTS `GetNextCategoryId`;
DROP FUNCTION IF EXISTS `GetNextPublisherBookDraftId`;

SET FOREIGN_KEY_CHECKS = 1;

-- Verification: Check if all ID columns have AUTO_INCREMENT
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA LIKE '%auto_increment%'
ORDER BY TABLE_NAME;

-- Show any ID columns that DON'T have AUTO_INCREMENT (should be empty or only junction tables)
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'boitoi_db' 
    AND COLUMN_NAME = 'ID' 
    AND EXTRA NOT LIKE '%auto_increment%'
ORDER BY TABLE_NAME;
