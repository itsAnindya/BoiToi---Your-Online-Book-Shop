-- Create admin user for testing book approval system
-- This script creates a test admin user and ensures the system can process requests

USE boitoi_db;

-- First, let's check existing users and admins
SELECT 'Current Users:' as info;
SELECT ID, USERNAME, EMAIL, CREATED_AT FROM USER;

SELECT 'Current Admins:' as info;
SELECT a.USER_ID, u.USERNAME, u.EMAIL FROM ADMIN a JOIN USER u ON a.USER_ID = u.ID;

-- Check existing book requests
SELECT 'Current Book Requests:' as info;
SELECT REQUEST_ID, PUBLISHER_NAME, BOOK_TITLE, STATUS, SUBMITTED_AT FROM BookRequestView;

-- Create admin user if doesn't exist
-- First create a regular user
INSERT IGNORE INTO USER (ID, USERNAME, EMAIL, PASSWORD_HASH, CREATED_AT) 
VALUES (999, 'admin', 'admin@boitoi.com', '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', NOW())
ON DUPLICATE KEY UPDATE USERNAME = USERNAME;

-- Make this user an admin
INSERT IGNORE INTO ADMIN (USER_ID) VALUES (999);

-- Verify the admin was created
SELECT 'Verification - Admin created:' as info;
SELECT a.USER_ID, u.USERNAME, u.EMAIL FROM ADMIN a JOIN USER u ON a.USER_ID = u.ID WHERE a.USER_ID = 999;

-- Test the stored procedure manually with a simple test
-- Note: The password hash above is for password "admin123"
SELECT 'Setup completed. You can now log in with username: admin, password: admin123' as message;
