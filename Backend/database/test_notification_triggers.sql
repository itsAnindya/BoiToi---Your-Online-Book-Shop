-- TEST NOTIFICATION TRIGGERS
-- Run this after setting up the triggers to test functionality

USE boitoi_db;

-- Check if triggers were created
SELECT 
    TRIGGER_NAME, 
    EVENT_MANIPULATION, 
    EVENT_OBJECT_TABLE 
FROM INFORMATION_SCHEMA.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'boitoi_db' 
AND TRIGGER_NAME IN ('notify_admins_new_request', 'notify_publisher_request_update');

-- View current notifications before test
SELECT COUNT(*) as 'Notifications Before Test' FROM notifications;

-- Test 1: Simulate a new request (this will trigger admin notifications)
-- First, let's see what publishers and admins exist
SELECT 'PUBLISHERS:' as info;
SELECT ID, NAME, EMAIL FROM publisher LIMIT 3;

SELECT 'ADMINS:' as info;
SELECT a.USER_ID, u.USERNAME FROM admin a JOIN user u ON a.USER_ID = u.ID LIMIT 3;

-- You can manually test by:
-- 1. Insert a new publisher_request
-- 2. Update an existing request status to APPROVED/REJECTED

-- View notifications after any test
SELECT 
    n.ID,
    u.USERNAME as 'Admin User',
    n.MESSAGE,
    n.TYPE,
    n.IS_READ,
    n.CREATED_AT
FROM notifications n
JOIN user u ON n.USER_ID = u.ID
WHERE n.TYPE = 'SYSTEM'
ORDER BY n.CREATED_AT DESC
LIMIT 10;
