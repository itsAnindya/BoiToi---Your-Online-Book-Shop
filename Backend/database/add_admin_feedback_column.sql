-- Add admin_feedback column to PUBLISHER_REQUEST table
-- This column will store detailed feedback from admin during approval/rejection

USE boitoi_db;

-- Add the admin_feedback column to store admin's detailed feedback
ALTER TABLE `publisher_request` 
ADD COLUMN `admin_feedback` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL 
COMMENT 'Detailed feedback from admin during approval/rejection process' 
AFTER `NOTES`;

-- Verify the column was added
DESCRIBE `publisher_request`;

-- Show the updated table structure
SHOW CREATE TABLE `publisher_request`;
