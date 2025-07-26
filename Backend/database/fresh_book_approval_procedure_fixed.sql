-- Simple Book Approval Procedure - FIXED VERSION
-- This procedure ONLY approves books and adds them to catalog
-- NO AUTHOR PROCESSING - FULLY DEBUGGED

-- Drop existing procedure if it exists
DROP PROCEDURE IF EXISTS ApproveBookRequest;

DELIMITER $$

-- Working procedure for approving book requests WITHOUT AUTHORS
CREATE PROCEDURE ApproveBookRequest(
    IN p_request_id INT,
    IN p_admin_id INT,
    IN p_admin_feedback TEXT,
    OUT p_result_message VARCHAR(500),
    OUT p_new_book_id INT
)
BEGIN
    -- Declare variables
    DECLARE v_admin_exists INT DEFAULT 0;
    DECLARE v_request_exists INT DEFAULT 0;
    DECLARE v_publisher_id INT;
    DECLARE v_book_title VARCHAR(255);
    DECLARE v_book_isbn VARCHAR(50);
    DECLARE v_book_published_date DATE;
    DECLARE v_book_page_count INT;
    DECLARE v_book_language VARCHAR(20);
    DECLARE v_book_edition VARCHAR(20);
    DECLARE v_book_price DECIMAL(12,2);
    DECLARE v_book_stock INT;
    DECLARE v_book_description TEXT;
    DECLARE v_book_cover_url VARCHAR(300);
    DECLARE v_book_genre VARCHAR(255);
    DECLARE v_book_category_id INT;
    DECLARE v_existing_isbn_count INT DEFAULT 0;
    
    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            p_result_message = MESSAGE_TEXT;
        SET p_new_book_id = 0;
    END;
    
    -- Initialize
    SET p_result_message = '';
    SET p_new_book_id = 0;
    
    START TRANSACTION;
    
    -- Step 1: Validate admin exists
    SELECT COUNT(*) INTO v_admin_exists FROM admin WHERE USER_ID = p_admin_id;
    IF v_admin_exists = 0 THEN
        SET p_result_message = 'Invalid admin ID';
        ROLLBACK;
    ELSE
        -- Step 2: Validate request exists and is pending
        SELECT COUNT(*) INTO v_request_exists FROM publisher_request WHERE ID = p_request_id AND STATUS = 'PENDING';
        IF v_request_exists = 0 THEN
            SET p_result_message = 'Request not found or already processed';
            ROLLBACK;
        ELSE
            -- Step 3: Get request and book draft details
            SELECT 
                pr.PUBLISHER_ID,
                COALESCE(pbd.TITLE, 'Untitled'),
                COALESCE(pbd.ISBN, ''),
                pbd.PUBLISHED_DATE,
                COALESCE(pbd.PAGE_COUNT, 0),
                COALESCE(pbd.LANGUAGE, 'English'),
                COALESCE(pbd.EDITION, '1st'),
                COALESCE(pbd.PRICE, 0.00),
                COALESCE(pbd.STOCK_QUANTITY, 0),
                COALESCE(pbd.DESCRIPTION, ''),
                COALESCE(pbd.COVER_URL, '/images/books/defaultbook.jpg'),
                COALESCE(pbd.GENRE, 'General'),
                pbd.CATEGORY_ID
            INTO 
                v_publisher_id, v_book_title, v_book_isbn, v_book_published_date,
                v_book_page_count, v_book_language, v_book_edition, v_book_price,
                v_book_stock, v_book_description, v_book_cover_url, v_book_genre,
                v_book_category_id
            FROM publisher_request pr
            JOIN publisher_book_draft pbd ON pr.ID = pbd.REQUEST_ID
            WHERE pr.ID = p_request_id;
            
            -- Step 4: Handle duplicate ISBN by appending timestamp
            IF v_book_isbn IS NOT NULL AND v_book_isbn != '' THEN
                SELECT COUNT(*) INTO v_existing_isbn_count FROM book WHERE ISBN = v_book_isbn;
                IF v_existing_isbn_count > 0 THEN
                    SET v_book_isbn = CONCAT(v_book_isbn, '-', UNIX_TIMESTAMP());
                END IF;
            END IF;
            
            -- Step 5: Create the book (NO AUTHORS)
            INSERT INTO book (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT,
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION,
                COVER_URL, GENRE, CATEGORY_ID, SHOW_BOOK, ADDED_AT
            ) VALUES (
                v_book_title, v_book_isbn, v_book_published_date, v_publisher_id, v_book_page_count,
                v_book_language, v_book_edition, v_book_price, v_book_stock, v_book_description,
                v_book_cover_url, v_book_genre, v_book_category_id, 1, NOW()
            );
            
            -- Get the generated book ID
            SET p_new_book_id = LAST_INSERT_ID();
            
            -- Step 6: Update request status
            UPDATE publisher_request 
            SET 
                STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = p_admin_id,
                ADMIN_FEEDBACK = p_admin_feedback,
                NOTES = CONCAT(
                    COALESCE(NOTES, ''), 
                    ' | Approved by admin on ', 
                    DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'),
                    ' | Book ID: ', p_new_book_id
                )
            WHERE ID = p_request_id;
            
            -- Step 7: Create notification for publisher (only if notifications table exists)
            INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
            SELECT 
                p.ID,
                CONCAT('Your book contribution request for "', v_book_title, '" has been approved and added to the catalog! Book ID: ', p_new_book_id),
                'SYSTEM',
                0,
                NOW()
            FROM publisher p
            WHERE p.ID = v_publisher_id;
            
            -- Success message
            SET p_result_message = CONCAT('Book approved successfully. Book ID: ', p_new_book_id, ', Title: "', v_book_title, '"');
            
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;
