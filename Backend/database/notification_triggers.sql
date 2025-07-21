-- ================================================================
-- NOTIFICATION TRIGGERS FOR BOITOI BOOK CONTRIBUTION SYSTEM
-- ================================================================
-- This script creates triggers to automatically send notifications:
-- 1. To all admins when a new book request is submitted
-- 2. To publishers when their requests are approved/rejected
--
-- Note: Since PUBLISHER table doesn't have USER_ID, we'll create a 
-- separate notification approach for publishers
-- ================================================================

USE boitoi_db;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS notify_admins_new_request;
DROP TRIGGER IF EXISTS notify_publisher_request_update;

DELIMITER $$

-- ================================================================
-- TRIGGER 1: Notify all admins when a new book request is submitted
-- ================================================================
CREATE TRIGGER notify_admins_new_request
AFTER INSERT ON publisher_request
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255) DEFAULT 'Unknown Publisher';
    DECLARE book_title VARCHAR(255) DEFAULT '';
    DECLARE notification_message TEXT;
    
    -- Get publisher name
    SELECT COALESCE(NAME, 'Unknown Publisher') INTO publisher_name
    FROM publisher
    WHERE ID = NEW.PUBLISHER_ID;
    
    -- Get book title from draft (if exists)
    SELECT COALESCE(TITLE, '') INTO book_title
    FROM publisher_book_draft
    WHERE REQUEST_ID = NEW.ID
    LIMIT 1;
    
    -- Create notification message
    IF book_title != '' THEN
        SET notification_message = CONCAT(
            'New book contribution request from "', publisher_name, '" for book: "', book_title, 
            '" (Request ID: ', NEW.ID, '). Please review and take action.'
        );
    ELSE
        SET notification_message = CONCAT(
            'New book contribution request from "', publisher_name, '" (Request ID: ', NEW.ID, 
            '). Please review and take action.'
        );
    END IF;
    
    -- Insert notification for all admin users
    INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    SELECT 
        a.USER_ID,
        notification_message,
        'SYSTEM',
        0,
        NOW()
    FROM admin a
    WHERE EXISTS (SELECT 1 FROM user u WHERE u.ID = a.USER_ID);
    
END$$

-- ================================================================
-- TRIGGER 2: Notify publishers when request status changes
-- ================================================================
CREATE TRIGGER notify_publisher_request_update
AFTER UPDATE ON publisher_request
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255) DEFAULT 'Publisher';
    DECLARE book_title VARCHAR(255) DEFAULT '';
    DECLARE admin_username VARCHAR(255) DEFAULT 'Admin';
    DECLARE notification_message TEXT;
    DECLARE publisher_email VARCHAR(255) DEFAULT NULL;
    
    -- Only process if status actually changed to APPROVED or REJECTED
    IF OLD.STATUS != NEW.STATUS AND NEW.STATUS IN ('APPROVED', 'REJECTED') THEN
        
        -- Get publisher information
        SELECT COALESCE(NAME, 'Publisher'), COALESCE(EMAIL, '') 
        INTO publisher_name, publisher_email
        FROM publisher
        WHERE ID = NEW.PUBLISHER_ID;
        
        -- Get book title from draft
        SELECT COALESCE(TITLE, 'Your book') INTO book_title
        FROM publisher_book_draft
        WHERE REQUEST_ID = NEW.ID
        LIMIT 1;
        
        -- Get admin username who reviewed
        SELECT COALESCE(u.USERNAME, 'Admin') INTO admin_username
        FROM admin a
        JOIN user u ON a.USER_ID = u.ID
        WHERE a.USER_ID = NEW.REVIEWED_BY
        LIMIT 1;
        
        -- Create appropriate notification message
        IF NEW.STATUS = 'APPROVED' THEN
            SET notification_message = CONCAT(
                'Great news! Your book contribution request for "', book_title, 
                '" has been APPROVED by ', admin_username, ' and added to the catalog. ',
                CASE 
                    WHEN NEW.ADMIN_FEEDBACK IS NOT NULL AND NEW.ADMIN_FEEDBACK != '' 
                    THEN CONCAT('Admin feedback: ', NEW.ADMIN_FEEDBACK)
                    ELSE 'Thank you for your contribution!'
                END
            );
        ELSE -- REJECTED
            SET notification_message = CONCAT(
                'Your book contribution request for "', book_title, 
                '" has been REJECTED by ', admin_username, '. ',
                CASE 
                    WHEN NEW.ADMIN_FEEDBACK IS NOT NULL AND NEW.ADMIN_FEEDBACK != '' 
                    THEN CONCAT('Reason: ', NEW.ADMIN_FEEDBACK)
                    ELSE 'Please contact support for more information.'
                END
            );
        END IF;
        
        -- Since publishers don't have USER_ID in notifications table,
        -- we'll create a special notification entry using a system approach
        -- Option 1: Create notifications for admin users to handle publisher communication
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        SELECT 
            a.USER_ID,
            CONCAT('[PUBLISHER NOTIFICATION] ', publisher_name, ' (', COALESCE(publisher_email, 'No email'), '): ', notification_message),
            'SYSTEM',
            0,
            NOW()
        FROM admin a
        WHERE EXISTS (SELECT 1 FROM user u WHERE u.ID = a.USER_ID)
        LIMIT 1; -- Only notify one admin to avoid spam
        
        -- Option 2: Log to a separate table (if you create one later)
        -- You could create a publisher_notifications table for direct publisher notifications
        
    END IF;
    
END$$

DELIMITER ;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if triggers were created successfully
SELECT 
    TRIGGER_NAME, 
    EVENT_MANIPULATION, 
    EVENT_OBJECT_TABLE, 
    TRIGGER_SCHEMA
FROM INFORMATION_SCHEMA.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'boitoi_db' 
AND TRIGGER_NAME IN ('notify_admins_new_request', 'notify_publisher_request_update');

-- ================================================================
-- OPTIONAL: Create a separate table for direct publisher notifications
-- ================================================================

-- Uncomment the following section if you want direct publisher notifications
/*
CREATE TABLE IF NOT EXISTS publisher_notifications (
    ID BIGINT NOT NULL AUTO_INCREMENT,
    PUBLISHER_ID INT NOT NULL,
    MESSAGE TEXT,
    TYPE ENUM('APPROVAL', 'REJECTION', 'SYSTEM', 'REMINDER') DEFAULT 'SYSTEM',
    IS_READ TINYINT(1) DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    REQUEST_ID INT NULL,
    PRIMARY KEY (ID),
    INDEX idx_publisher_id (PUBLISHER_ID),
    INDEX idx_created_at (CREATED_AT),
    INDEX idx_is_read (IS_READ),
    FOREIGN KEY (PUBLISHER_ID) REFERENCES publisher(ID) ON DELETE CASCADE,
    FOREIGN KEY (REQUEST_ID) REFERENCES publisher_request(ID) ON DELETE SET NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- If you create the above table, you can also add this trigger:
DELIMITER $$

CREATE TRIGGER notify_publisher_direct
AFTER UPDATE ON publisher_request
FOR EACH ROW
BEGIN
    DECLARE book_title VARCHAR(255) DEFAULT '';
    DECLARE notification_message TEXT;
    DECLARE notification_type VARCHAR(20);
    
    -- Only process if status actually changed to APPROVED or REJECTED
    IF OLD.STATUS != NEW.STATUS AND NEW.STATUS IN ('APPROVED', 'REJECTED') THEN
        
        -- Get book title from draft
        SELECT COALESCE(TITLE, 'Your book') INTO book_title
        FROM publisher_book_draft
        WHERE REQUEST_ID = NEW.ID
        LIMIT 1;
        
        -- Set notification type and message
        IF NEW.STATUS = 'APPROVED' THEN
            SET notification_type = 'APPROVAL';
            SET notification_message = CONCAT(
                'Your book "', book_title, '" has been approved and added to the catalog! ',
                CASE 
                    WHEN NEW.ADMIN_FEEDBACK IS NOT NULL AND NEW.ADMIN_FEEDBACK != '' 
                    THEN CONCAT('Admin feedback: ', NEW.ADMIN_FEEDBACK)
                    ELSE 'Thank you for your contribution!'
                END
            );
        ELSE -- REJECTED
            SET notification_type = 'REJECTION';
            SET notification_message = CONCAT(
                'Your book submission "', book_title, '" has been rejected. ',
                CASE 
                    WHEN NEW.ADMIN_FEEDBACK IS NOT NULL AND NEW.ADMIN_FEEDBACK != '' 
                    THEN CONCAT('Reason: ', NEW.ADMIN_FEEDBACK)
                    ELSE 'Please contact support for more information.'
                END
            );
        END IF;
        
        -- Insert direct publisher notification
        INSERT INTO publisher_notifications (PUBLISHER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, REQUEST_ID)
        VALUES (NEW.PUBLISHER_ID, notification_message, notification_type, 0, NOW(), NEW.ID);
        
    END IF;
    
END$$

DELIMITER ;
*/

-- ================================================================
-- SAMPLE TEST QUERIES (for verification)
-- ================================================================

-- Check recent notifications
SELECT 
    n.ID,
    n.USER_ID,
    u.USERNAME,
    n.MESSAGE,
    n.TYPE,
    n.IS_READ,
    n.CREATED_AT
FROM notifications n
JOIN user u ON n.USER_ID = u.ID
WHERE n.TYPE = 'SYSTEM'
ORDER BY n.CREATED_AT DESC
LIMIT 10;

-- Check admin users who will receive notifications
SELECT 
    a.USER_ID,
    u.USERNAME,
    u.EMAIL
FROM admin a
JOIN user u ON a.USER_ID = u.ID;

-- ================================================================
-- USAGE INSTRUCTIONS
-- ================================================================

/*
TRIGGER BEHAVIOR:

1. NEW REQUEST SUBMITTED:
   - Trigger: notify_admins_new_request
   - Action: Creates notification for ALL admin users
   - Message: "New book contribution request from [Publisher] for book: [Title] (Request ID: X)"
   - Type: SYSTEM

2. REQUEST APPROVED/REJECTED:
   - Trigger: notify_publisher_request_update
   - Action: Creates notification for admin users (as proxy for publisher communication)
   - Message: "[PUBLISHER NOTIFICATION] [Publisher]: Your book [Title] has been [APPROVED/REJECTED]"
   - Includes admin feedback if provided
   - Type: SYSTEM

TO TEST:
1. Insert a new request into publisher_request table
2. Update an existing request status from PENDING to APPROVED/REJECTED
3. Check notifications table for new entries

TO EXTEND:
- Create publisher_notifications table for direct publisher messaging
- Implement email notification system
- Add notification preferences
- Create notification cleanup procedures
*/

SELECT 'Notification triggers created successfully!' as STATUS;
