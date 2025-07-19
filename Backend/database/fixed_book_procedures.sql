-- Fixed Book Contribution System - No Views, Direct Table Access
-- Simplified procedures that work directly with PUBLISHER_REQUEST and PUBLISHER_BOOK_DRAFT

USE boitoi_db;

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS ApproveBookRequest;
DROP PROCEDURE IF EXISTS RejectBookRequest;

-- ===========================
-- SIMPLIFIED STORED PROCEDURES
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
    DECLARE request_status VARCHAR(20);
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'Database error occurred while processing request';
        SET new_book_id = 0;
    END;
    
    START TRANSACTION;
    
    -- Check if request exists and is pending
    SELECT pr.STATUS, pr.PUBLISHER_ID
    INTO request_status, publisher_id
    FROM PUBLISHER_REQUEST pr 
    WHERE pr.ID = request_id;
    
    IF publisher_id IS NULL THEN
        SET result_message = 'Request not found';
        SET new_book_id = 0;
        ROLLBACK;
    ELSEIF request_status != 'PENDING' THEN
        SET result_message = CONCAT('Request has already been processed with status: ', request_status);
        SET new_book_id = 0;
        ROLLBACK;
    ELSE
        -- Get book details from draft
        SELECT 
            TITLE,
            ISBN,
            PAGE_COUNT,
            LANGUAGE,
            EDITION,
            PRICE,
            STOCK_QUANTITY,
            DESCRIPTION,
            COVER_URL,
            GENRE
        INTO 
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
        FROM PUBLISHER_BOOK_DRAFT 
        WHERE REQUEST_ID = request_id;
        
        -- Check if we got the book details
        IF book_title IS NULL THEN
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
                new_book_id, 
                book_title, 
                book_isbn, 
                NOW(), 
                publisher_id, 
                book_pages,
                COALESCE(book_language, 'English'), 
                COALESCE(book_edition, '1st'), 
                book_price, 
                book_stock, 
                book_description, 
                book_cover_url, 
                book_genre, 
                1, 
                NOW()
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
                ROLLBACK;
            ELSE
                COMMIT;
                SET result_message = CONCAT('Book "', book_title, '" approved successfully and added with ID: ', new_book_id);
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
    DECLARE request_status VARCHAR(20);
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    -- Exception handling
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'Database error occurred while processing request';
    END;
    
    START TRANSACTION;
    
    -- Check if request exists and get details
    SELECT 
        pr.PUBLISHER_ID, 
        pr.STATUS, 
        pbd.TITLE
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
        SET result_message = CONCAT('Request has already been processed with status: ', request_status);
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
            ROLLBACK;
        ELSE
            COMMIT;
            SET result_message = CONCAT('Book request', 
                                      CASE WHEN book_title IS NOT NULL THEN CONCAT(' for "', book_title, '"') ELSE '' END,
                                      ' rejected successfully');
        END IF;
    END IF;
END$$

DELIMITER ;

-- ===========================
-- DROP THE VIEW (We don't need it)
-- ===========================
DROP VIEW IF EXISTS BookRequestView;

-- ===========================
-- VERIFICATION
-- ===========================
SELECT 'Fixed Procedures Created Successfully' as STATUS;

-- Test the procedures exist
SHOW PROCEDURE STATUS WHERE Db = 'boitoi_db' AND Name IN ('ApproveBookRequest', 'RejectBookRequest');

-- Show current requests using direct table access
SELECT 
    pr.ID as REQUEST_ID,
    pr.STATUS,
    pr.SUBMITTED_AT,
    p.NAME as PUBLISHER_NAME,
    pbd.TITLE as BOOK_TITLE
FROM PUBLISHER_REQUEST pr
JOIN PUBLISHER p ON pr.PUBLISHER_ID = p.ID
LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
ORDER BY pr.SUBMITTED_AT DESC 
LIMIT 5;
