-- Enhanced Book Contribution System with Triggers and Procedures
-- Ensures complete automation of the book request approval process

USE boitoi_db;

-- Drop existing procedures and triggers if they exist
DROP PROCEDURE IF EXISTS ApproveBookRequest;
DROP PROCEDURE IF EXISTS RejectBookRequest;
DROP TRIGGER IF EXISTS notify_admins_on_book_request;
DROP TRIGGER IF EXISTS auto_add_book_on_approval;

-- ===========================
-- STORED PROCEDURES
-- ===========================

-- Procedure to approve book request and add to catalog
DELIMITER $$

CREATE PROCEDURE ApproveBookRequest(
    IN request_id INT,
    IN admin_id INT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT
)
BEGIN
    DECLARE publisher_id INT;
    DECLARE book_title VARCHAR(255);
    DECLARE book_isbn VARCHAR(50);
    DECLARE book_pages INT;
    DECLARE book_language VARCHAR(20);
    DECLARE book_edition VARCHAR(20);
    DECLARE book_price DECIMAL(12,2);
    DECLARE book_stock INT;
    DECLARE book_description TEXT;
    DECLARE book_cover_url VARCHAR(300);
    DECLARE book_genre VARCHAR(255);
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    DECLARE request_status VARCHAR(20);
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'Error occurred while processing request';
        SET new_book_id = 0;
    END;
    
    START TRANSACTION;
    
    -- Check if request exists and is pending
    SELECT STATUS INTO request_status
    FROM PUBLISHER_REQUEST 
    WHERE ID = request_id;
    
    IF request_status IS NULL THEN
        SET result_message = 'Request not found';
        SET new_book_id = 0;
        ROLLBACK;
    ELSEIF request_status != 'PENDING' THEN
        SET result_message = 'Request has already been processed';
        SET new_book_id = 0;
        ROLLBACK;
    ELSE
        -- Get request details
        SELECT 
            pr.PUBLISHER_ID,
            pbd.TITLE,
            pbd.ISBN,
            pbd.PAGE_COUNT,
            pbd.LANGUAGE,
            pbd.EDITION,
            pbd.PRICE,
            pbd.STOCK_QUANTITY,
            pbd.DESCRIPTION,
            pbd.COVER_URL,
            pbd.GENRE
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
        JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
        WHERE pr.ID = request_id;
        
        -- Check if we got the book details
        IF publisher_id IS NULL THEN
            SET result_message = 'Book draft not found for this request';
            SET new_book_id = 0;
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
                new_book_id, book_title, book_isbn, NOW(), publisher_id, book_pages,
                COALESCE(book_language, 'English'), COALESCE(book_edition, '1st'), 
                book_price, book_stock, book_description, book_cover_url, book_genre, 1, NOW()
            );
            
            -- Update request status
            UPDATE PUBLISHER_REQUEST
            SET STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                NOTES = CONCAT(COALESCE(NOTES, ''), ' | Approved and added to catalog with Book ID: ', new_book_id)
            WHERE ID = request_id;
            
            -- Create notification for publisher
            INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
            VALUES (
                publisher_id,
                CONCAT('Your book contribution request for "', book_title, '" has been approved and added to the catalog with ID: ', new_book_id),
                'SYSTEM',
                0,
                NOW()
            );
            
            IF exit_handler THEN
                SET result_message = 'Error occurred while processing request';
                SET new_book_id = 0;
            ELSE
                COMMIT;
                SET result_message = 'Book request approved successfully';
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;

-- Procedure to reject book request
DELIMITER $$

CREATE PROCEDURE RejectBookRequest(
    IN request_id INT,
    IN admin_id INT,
    IN rejection_reason TEXT,
    OUT result_message VARCHAR(255)
)
BEGIN
    DECLARE publisher_id INT;
    DECLARE book_title VARCHAR(255);
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    DECLARE request_status VARCHAR(20);
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'Error occurred while processing request';
    END;
    
    START TRANSACTION;
    
    -- Check if request exists and is pending
    SELECT pr.PUBLISHER_ID, pr.STATUS, pbd.TITLE
    INTO publisher_id, request_status, book_title
    FROM PUBLISHER_REQUEST pr
    LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
    WHERE pr.ID = request_id;
    
    IF publisher_id IS NULL THEN
        SET result_message = 'Request not found';
        ROLLBACK;
    ELSEIF request_status != 'PENDING' THEN
        SET result_message = 'Request has already been processed';
        ROLLBACK;
    ELSE
        -- Update request status
        UPDATE PUBLISHER_REQUEST
        SET STATUS = 'REJECTED',
            REVIEWED_AT = NOW(),
            REVIEWED_BY = admin_id,
            NOTES = CONCAT(COALESCE(NOTES, ''), ' | Rejected: ', rejection_reason)
        WHERE ID = request_id;
        
        -- Create notification for publisher
        INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        VALUES (
            publisher_id,
            CONCAT('Your book contribution request', 
                   CASE WHEN book_title IS NOT NULL THEN CONCAT(' for "', book_title, '"') ELSE '' END,
                   ' has been rejected. Reason: ', rejection_reason),
            'SYSTEM',
            0,
            NOW()
        );
        
        IF exit_handler THEN
            SET result_message = 'Error occurred while processing request';
        ELSE
            COMMIT;
            SET result_message = 'Book request rejected successfully';
        END IF;
    END IF;
END$$

DELIMITER ;

-- ===========================
-- TRIGGERS
-- ===========================

-- Trigger to automatically notify admins when a new book request is submitted
DELIMITER $$

CREATE TRIGGER notify_admins_on_book_request
AFTER INSERT ON PUBLISHER_REQUEST
FOR EACH ROW
BEGIN
    DECLARE publisher_name VARCHAR(255);
    DECLARE book_title VARCHAR(255);
    
    -- Get publisher name
    SELECT NAME INTO publisher_name
    FROM PUBLISHER
    WHERE ID = NEW.PUBLISHER_ID;
    
    -- Get book title from draft (if exists)
    SELECT TITLE INTO book_title
    FROM PUBLISHER_BOOK_DRAFT
    WHERE REQUEST_ID = NEW.ID
    LIMIT 1;
    
    -- Insert notification for all admins
    INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    SELECT 
        a.USER_ID,
        CONCAT('New book contribution request from ', COALESCE(publisher_name, 'Unknown Publisher'), 
               CASE 
                   WHEN book_title IS NOT NULL THEN CONCAT(' for book: "', book_title, '"')
                   ELSE ''
               END,
               '. Request ID: ', NEW.ID),
        'SYSTEM',
        0,
        NOW()
    FROM ADMIN a;
END$$

DELIMITER ;

-- ===========================
-- VIEWS FOR EASY ACCESS
-- ===========================

-- Drop existing view if it exists
DROP VIEW IF EXISTS BookRequestView;

-- Create comprehensive view for book requests with all relevant information
CREATE VIEW BookRequestView AS
SELECT 
    pr.ID as REQUEST_ID,
    pr.REQUEST_TYPE,
    pr.STATUS,
    pr.SUBMITTED_AT,
    pr.REVIEWED_AT,
    pr.NOTES,
    pr.REVIEWED_BY,
    p.ID as PUBLISHER_ID,
    p.NAME as PUBLISHER_NAME,
    p.EMAIL as PUBLISHER_EMAIL,
    pbd.TITLE as BOOK_TITLE,
    pbd.ISBN as BOOK_ISBN,
    pbd.PAGE_COUNT,
    pbd.LANGUAGE,
    pbd.EDITION,
    pbd.PRICE,
    pbd.STOCK_QUANTITY,
    pbd.DESCRIPTION,
    pbd.COVER_URL,
    pbd.GENRE,
    admin_user.USERNAME as REVIEWED_BY_USERNAME,
    -- Additional calculated fields
    CASE 
        WHEN pr.STATUS = 'PENDING' THEN DATEDIFF(NOW(), pr.SUBMITTED_AT)
        ELSE DATEDIFF(pr.REVIEWED_AT, pr.SUBMITTED_AT)
    END as DAYS_PENDING,
    CASE pr.STATUS
        WHEN 'PENDING' THEN 'yellow'
        WHEN 'APPROVED' THEN 'green'
        WHEN 'REJECTED' THEN 'red'
        ELSE 'gray'
    END as STATUS_COLOR
FROM PUBLISHER_REQUEST pr
JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
LEFT JOIN ADMIN admin_table ON pr.REVIEWED_BY = admin_table.USER_ID
LEFT JOIN USER admin_user ON admin_table.USER_ID = admin_user.ID;

-- ===========================
-- VERIFICATION QUERIES
-- ===========================

-- Show current state
SELECT 'Procedures Created' as STATUS;
SHOW PROCEDURE STATUS WHERE Db = 'boitoi_db' AND Name IN ('ApproveBookRequest', 'RejectBookRequest');

SELECT 'Triggers Created' as STATUS;
SHOW TRIGGERS WHERE `Table` IN ('PUBLISHER_REQUEST') AND `Trigger` = 'notify_admins_on_book_request';

SELECT 'Views Created' as STATUS;
SHOW TABLES LIKE 'BookRequestView';

-- Test data verification
SELECT 'Current Requests' as STATUS;
SELECT REQUEST_ID, PUBLISHER_NAME, BOOK_TITLE, STATUS, SUBMITTED_AT 
FROM BookRequestView 
ORDER BY SUBMITTED_AT DESC 
LIMIT 5;
