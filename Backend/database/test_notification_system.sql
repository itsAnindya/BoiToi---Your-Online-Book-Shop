-- NOTIFICATION SYSTEM TEST QUERIES
-- Use these queries to test the notification system functionality

USE boitoi_db;

-- 1. Check if notifications table exists and has correct structure
DESCRIBE notifications;

-- 2. Check existing notifications
SELECT 
    ID, USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT 
FROM notifications 
ORDER BY CREATED_AT DESC 
LIMIT 10;

-- 3. Create test notifications for a user (replace USER_ID with actual user ID)
INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT) VALUES
(1, 'Welcome to BoiToi! Your account has been successfully created.', 'SYSTEM', 0, NOW()),
(1, 'Your book order #12345 has been confirmed and is being processed.', 'ORDER', 0, NOW()),
(1, 'Payment of $29.99 has been successfully processed for your order.', 'PAYMENT', 0, NOW()),
(1, 'Special offer: 20% off on all fiction books this weekend!', 'PROMOTION', 0, NOW()),
(1, 'Your order has been shipped and is on its way to you.', 'DELIVERY', 0, NOW());

-- 4. Check unread notification count for a user
SELECT COUNT(*) as unread_count 
FROM notifications 
WHERE USER_ID = 1 AND IS_READ = 0;

-- 5. Mark specific notification as read
UPDATE notifications 
SET IS_READ = 1 
WHERE ID = 1 AND USER_ID = 1;

-- 6. Mark all notifications as read for a user
UPDATE notifications 
SET IS_READ = 1 
WHERE USER_ID = 1 AND IS_READ = 0;

-- 7. Delete a specific notification
DELETE FROM notifications 
WHERE ID = 1 AND USER_ID = 1;

-- 8. Get notifications with pagination (LIMIT and OFFSET)
SELECT 
    ID, MESSAGE, TYPE, IS_READ, CREATED_AT 
FROM notifications 
WHERE USER_ID = 1 
ORDER BY CREATED_AT DESC 
LIMIT 5 OFFSET 0;

-- 9. Create broadcast notification for all admin users
INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
SELECT 
    a.USER_ID,
    'System maintenance scheduled for tonight at 2 AM. Expected downtime: 30 minutes.',
    'SYSTEM',
    0,
    NOW()
FROM admin a
JOIN user u ON a.USER_ID = u.ID;

-- 10. Get notification statistics
SELECT 
    TYPE,
    COUNT(*) as total_count,
    SUM(CASE WHEN IS_READ = 0 THEN 1 ELSE 0 END) as unread_count,
    SUM(CASE WHEN IS_READ = 1 THEN 1 ELSE 0 END) as read_count
FROM notifications 
WHERE USER_ID = 1
GROUP BY TYPE;

-- 11. Clean up test notifications (if needed)
-- DELETE FROM notifications WHERE MESSAGE LIKE '%test%' OR MESSAGE LIKE '%Test%';

-- 12. Check recent notifications with user information
SELECT 
    n.ID,
    n.MESSAGE,
    n.TYPE,
    n.IS_READ,
    n.CREATED_AT,
    u.USERNAME,
    u.EMAIL
FROM notifications n
JOIN user u ON n.USER_ID = u.ID
ORDER BY n.CREATED_AT DESC
LIMIT 10;
