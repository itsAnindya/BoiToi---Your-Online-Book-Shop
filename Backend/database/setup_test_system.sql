-- Complete system test for book contribution approval system
-- This script tests the entire workflow

USE boitoi_db;

-- Create a test admin user with a known password
-- Password: admin123 (hashed with bcrypt)
INSERT INTO USER (ID, USERNAME, EMAIL, PASSWORD_HASH, CREATED_AT) 
VALUES (1001, 'testadmin', 'testadmin@boitoi.com', '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', NOW())
ON DUPLICATE KEY UPDATE 
  USERNAME = 'testadmin',
  EMAIL = 'testadmin@boitoi.com',
  PASSWORD_HASH = '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW';

-- Make this user an admin
INSERT INTO ADMIN (USER_ID) VALUES (1001)
ON DUPLICATE KEY UPDATE USER_ID = USER_ID;

-- Create a test publisher if it doesn't exist
INSERT INTO PUBLISHER (ID, NAME, EMAIL, PASSWORD_HASH, STATUS, CREATED_AT)
VALUES (1001, 'Test Publisher', 'testpub@boitoi.com', '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE NAME = 'Test Publisher';

-- Create a test book request
INSERT INTO PUBLISHER_REQUEST (ID, PUBLISHER_ID, REQUEST_TYPE, STATUS, SUBMITTED_AT, NOTES)
VALUES (1001, 1001, 'ADD_BOOK', 'PENDING', NOW(), 'Test book submission')
ON DUPLICATE KEY UPDATE STATUS = 'PENDING';

-- Create corresponding book draft
INSERT INTO PUBLISHER_BOOK_DRAFT (ID, TITLE, ISBN, PAGE_COUNT, LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE, REQUEST_ID)
VALUES (1001, 'Test Book Title', '978-1234567890', 300, 'English', '1st', 299.99, 50, 'A test book for approval system', 'https://example.com/cover.jpg', 'Fiction', 1001)
ON DUPLICATE KEY UPDATE 
  TITLE = 'Test Book Title',
  ISBN = '978-1234567890',
  PRICE = 299.99,
  STOCK_QUANTITY = 50;

-- Verify the setup
SELECT 'Test Data Created Successfully!' as status;

SELECT 'Admin User:' as info;
SELECT a.USER_ID, u.USERNAME, u.EMAIL FROM ADMIN a 
JOIN USER u ON a.USER_ID = u.ID 
WHERE u.USERNAME = 'testadmin';

SELECT 'Test Publisher:' as info;
SELECT ID, NAME, EMAIL, STATUS FROM PUBLISHER WHERE NAME = 'Test Publisher';

SELECT 'Pending Request:' as info;
SELECT REQUEST_ID, PUBLISHER_NAME, BOOK_TITLE, STATUS, SUBMITTED_AT 
FROM BookRequestView 
WHERE REQUEST_ID = 1001;

-- Test the stored procedure manually
SET @test_message = '';
SET @test_book_id = 0;

-- Note: Comment out the line below after manual testing to avoid duplicate book creation
-- CALL ApproveBookRequest(1001, 1001, @test_message, @test_book_id);

-- Check results (uncomment after running the procedure)
-- SELECT @test_message as procedure_message, @test_book_id as new_book_id;

SELECT 'Setup complete! Use these credentials:' as info;
SELECT 'Admin: username=testadmin, password=admin123' as admin_login;
SELECT 'Publisher: username=Test Publisher, password=admin123' as publisher_login;
