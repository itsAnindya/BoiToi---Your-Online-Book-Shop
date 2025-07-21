-- SIMPLE NOTIFICATION TRIGGERS SETUP
-- Execute this script in your MySQL database

USE boitoi_db;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS notify_admins_new_request;
DROP TRIGGER IF EXISTS notify_publisher_request_update;

DELIMITER $$

-- Trigger 1: Notify admins on new requests
CREATE TRIGGER notify_admins_new_request
AFTER INSERT ON publisher_request
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255) DEFAULT 'Unknown Publisher';
    DECLARE book_title VARCHAR(255) DEFAULT '';
    
    SELECT COALESCE(NAME, 'Unknown Publisher') INTO publisher_name
    FROM publisher WHERE ID = NEW.PUBLISHER_ID;
    
    SELECT COALESCE(TITLE, '') INTO book_title
    FROM publisher_book_draft WHERE REQUEST_ID = NEW.ID LIMIT 1;
    
    INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    SELECT 
        a.USER_ID,
        CONCAT('New book request from "', publisher_name, '" for "', book_title, '" (ID: ', NEW.ID, ')'),
        'SYSTEM',
        0,
        NOW()
    FROM admin a;
END$$

-- Trigger 2: Notify on approval/rejection
CREATE TRIGGER notify_publisher_request_update
AFTER UPDATE ON publisher_request
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255);
    DECLARE book_title VARCHAR(255);
    
    IF OLD.STATUS != NEW.STATUS AND NEW.STATUS IN ('APPROVED', 'REJECTED') THEN
        
        SELECT COALESCE(NAME, 'Publisher') INTO publisher_name
        FROM publisher WHERE ID = NEW.PUBLISHER_ID;
        
        SELECT COALESCE(TITLE, 'Book') INTO book_title
        FROM publisher_book_draft WHERE REQUEST_ID = NEW.ID LIMIT 1;
        
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        SELECT 
            a.USER_ID,
            CONCAT('[PUBLISHER: ', publisher_name, '] Book "', book_title, '" ', NEW.STATUS, 
                   CASE WHEN NEW.ADMIN_FEEDBACK IS NOT NULL 
                        THEN CONCAT(' - ', NEW.ADMIN_FEEDBACK) 
                        ELSE '' END),
            'SYSTEM',
            0,
            NOW()
        FROM admin a LIMIT 1;
        
    END IF;
END$$

DELIMITER ;
