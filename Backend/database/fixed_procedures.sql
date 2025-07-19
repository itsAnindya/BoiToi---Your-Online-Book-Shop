-- Fixed Book Contribution System Procedures
-- This version addresses all syntax and logical issues

USE boitoi_db;

-- Drop existing procedures and triggers if they exist
DROP PROCEDURE IF EXISTS ApproveBookRequest;
DROP PROCEDURE IF EXISTS RejectBookRequest;
DROP TRIGGER IF EXISTS notify_admins_on_book_request;

-- ===========================
-- STORED PROCEDURE: APPROVE BOOK REQUEST
-- ===========================

DELIMITER $$

CREATE PROCEDURE ApproveBookRequest(
    IN request_id INT,
    IN admin_id INT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT
)
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT NULL;
    DECLARE book_isbn VARCHAR(50) DEFAULT NULL;
    DECLARE book_pages INT DEFAULT NULL;
    DECLARE book_language VARCHAR(20) DEFAULT 'English';
    DECLARE book_edition VARCHAR(20) DEFAULT '1st';
    DECLARE book_price DECIMAL(12,2) DEFAULT 0.00;
    DECLARE book_stock INT DEFAULT 0;
    DECLARE book_description TEXT DEFAULT '';
    DECLARE book_cover_url VARCHAR(300) DEFAULT '/images/books/defaultbook.jpg';
    DECLARE book_genre VARCHAR(255) DEFAULT 'General';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'SQL Error occurred while processing request';
        SET new_book_id = 0;
    END;
    
    -- Initialize output parameters
    SET result_message = '';
    SET new_book_id = 0;
    
    START TRANSACTION;
    
    -- Check if admin exists
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        -- Check if request exists and is pending
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request has already been ', request_status);
            ROLLBACK;
        ELSE
            -- Get request details
            SELECT 
                pr.PUBLISHER_ID,
                COALESCE(pbd.TITLE, 'Unknown Title'),
                COALESCE(pbd.ISBN, ''),
                COALESCE(pbd.PAGE_COUNT, 0),
                COALESCE(pbd.LANGUAGE, 'English'),
                COALESCE(pbd.EDITION, '1st'),
                COALESCE(pbd.PRICE, 0.00),
                COALESCE(pbd.STOCK_QUANTITY, 0),
                COALESCE(pbd.DESCRIPTION, ''),
                COALESCE(pbd.COVER_URL, '/images/books/defaultbook.jpg'),
                COALESCE(pbd.GENRE, 'General')
            INTO 
                publisher_id,
                book_title,
                book_isbn,
                book_pages,
                book_language,
                book_edition,
                book_price,
                book_stock,
                book_description,
                book_cover_url,
                book_genre
            FROM PUBLISHER_REQUEST pr
            LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
            WHERE pr.ID = request_id;
            
            -- Check if we got the basic details
            IF publisher_id IS NULL THEN
                SET result_message = 'Publisher information not found for this request';
                ROLLBACK;
            ELSE
                -- Get next book ID
                SELECT COALESCE(MAX(ID), 0) + 1 INTO new_book_id FROM BOOK;
                
                -- Insert new book
                INSERT INTO BOOK (
                    ID, TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                    LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                    COVER_URL, GENRE, SHOW_BOOK, ADDED_AT
                ) VALUES (
                    new_book_id, book_title, book_isbn, CURDATE(), publisher_id, book_pages,
                    book_language, book_edition, book_price, book_stock, book_description, 
                    book_cover_url, book_genre, 1, NOW()
                );
                
                -- Update request status
                UPDATE PUBLISHER_REQUEST
                SET STATUS = 'APPROVED',
                    REVIEWED_AT = NOW(),
                    REVIEWED_BY = admin_id,
                    NOTES = CONCAT(COALESCE(NOTES, ''), ' | Approved and added to catalog with Book ID: ', new_book_id)
                WHERE ID = request_id;
                
                -- Create notification for publisher (optional, only if NOTIFICATIONS table exists)
                INSERT IGNORE INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
                VALUES (
                    publisher_id,
                    CONCAT('Your book contribution request for "', book_title, '" has been approved and added to the catalog with ID: ', new_book_id),
                    'SYSTEM',
                    0,
                    NOW()
                );
                
                -- Check if everything went well
                IF exit_handler = TRUE THEN
                    SET result_message = 'Error occurred while processing request';
                    SET new_book_id = 0;
                    ROLLBACK;
                ELSE
                    COMMIT;
                    SET result_message = CONCAT('Book "', book_title, '" approved successfully with ID: ', new_book_id);
                END IF;
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ===========================
-- STORED PROCEDURE: REJECT BOOK REQUEST
-- ===========================

DELIMITER $$

CREATE PROCEDURE RejectBookRequest(
    IN request_id INT,
    IN admin_id INT,
    IN rejection_reason TEXT,
    OUT result_message VARCHAR(255)
)
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT '';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'SQL Error occurred while processing request';
    END;
    
    -- Initialize output parameter
    SET result_message = '';
    
    START TRANSACTION;
    
    -- Check if admin exists
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        -- Check if request exists and get details
        SELECT 
            pr.PUBLISHER_ID, 
            pr.STATUS, 
            COALESCE(pbd.TITLE, 'Unknown Title')
        INTO 
            publisher_id, 
            request_status, 
            book_title
        FROM PUBLISHER_REQUEST pr
        LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
        WHERE pr.ID = request_id;
        
        IF publisher_id IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request has already been ', request_status);
            ROLLBACK;
        ELSE
            -- Update request status
            UPDATE PUBLISHER_REQUEST
            SET STATUS = 'REJECTED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                NOTES = CONCAT(COALESCE(NOTES, ''), ' | Rejected: ', COALESCE(rejection_reason, 'No reason provided'))
            WHERE ID = request_id;
            
            -- Create notification for publisher (optional, only if NOTIFICATIONS table exists)
            INSERT IGNORE INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
            VALUES (
                publisher_id,
                CONCAT('Your book contribution request for "', book_title, '" has been rejected. Reason: ', COALESCE(rejection_reason, 'No reason provided')),
                'SYSTEM',
                0,
                NOW()
            );
            
            -- Check if everything went well
            IF exit_handler = TRUE THEN
                SET result_message = 'Error occurred while processing request';
                ROLLBACK;
            ELSE
                COMMIT;
                SET result_message = CONCAT('Book request for "', book_title, '" rejected successfully');
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ===========================
-- TRIGGER: NOTIFY ADMINS ON NEW REQUEST
-- ===========================

DELIMITER $$

CREATE TRIGGER notify_admins_on_book_request
AFTER INSERT ON PUBLISHER_REQUEST
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255) DEFAULT 'Unknown Publisher';
    DECLARE notification_message TEXT;
    
    -- Get publisher name
    SELECT COALESCE(NAME, 'Unknown Publisher') INTO publisher_name
    FROM PUBLISHER
    WHERE ID = NEW.PUBLISHER_ID;
    
    -- Create notification message
    SET notification_message = CONCAT('New book contribution request from publisher "', publisher_name, '" - Request ID: ', NEW.ID);
    
    -- Insert notification for all admins (only if NOTIFICATIONS table exists)
    INSERT IGNORE INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    SELECT 
        a.USER_ID,
        notification_message,
        'SYSTEM',
        0,
        NOW()
    FROM ADMIN a;
END$$

DELIMITER ;

-- ===========================
-- VERIFICATION AND TEST
-- ===========================

-- Check if procedures were created successfully
SELECT 'Procedures created successfully!' as status;

SHOW PROCEDURE STATUS WHERE Db = 'boitoi_db' AND Name IN ('ApproveBookRequest', 'RejectBookRequest');

-- Check if trigger was created
SHOW TRIGGERS WHERE `Table` = 'PUBLISHER_REQUEST' AND Trigger = 'notify_admins_on_book_request';

-- Test the procedures with sample data
SELECT 'Ready to test procedures!' as message;
