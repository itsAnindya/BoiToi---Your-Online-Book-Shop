-- Working Book Approval Procedure
-- Simplified but complete version

DELIMITER $$

CREATE PROCEDURE ApproveBookRequest(
    IN p_request_id INT,
    IN p_admin_id INT,
    IN p_admin_feedback TEXT,
    OUT p_result_message VARCHAR(500),
    OUT p_new_book_id INT
)
BEGIN
    -- Declare all variables
    DECLARE v_request_exists INT DEFAULT 0;
    DECLARE v_admin_exists INT DEFAULT 0;
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
    DECLARE v_book_authors TEXT;
    DECLARE v_book_category_id INT;
    
    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            p_result_message = MESSAGE_TEXT;
        SET p_result_message = CONCAT('SQL Error: ', p_result_message);
        SET p_new_book_id = 0;
    END;
    
    -- Initialize
    SET p_result_message = '';
    SET p_new_book_id = 0;
    
    START TRANSACTION;
    
    -- Validate admin exists
    SELECT COUNT(*) INTO v_admin_exists 
    FROM admin 
    WHERE USER_ID = p_admin_id;
    
    IF v_admin_exists = 0 THEN
        SET p_result_message = 'Invalid admin ID. Admin not found.';
        ROLLBACK;
        LEAVE;
    END IF;
    
    -- Validate request exists and is pending
    SELECT COUNT(*) INTO v_request_exists
    FROM publisher_request pr
    WHERE pr.ID = p_request_id AND pr.STATUS = 'PENDING';
    
    IF v_request_exists = 0 THEN
        SET p_result_message = 'Request not found or already processed.';
        ROLLBACK;
        LEAVE;
    END IF;
    
    -- Get request and book draft details
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
        pbd.AUTHORS,
        pbd.CATEGORY_ID
    INTO 
        v_publisher_id, v_book_title, v_book_isbn, v_book_published_date,
        v_book_page_count, v_book_language, v_book_edition, v_book_price,
        v_book_stock, v_book_description, v_book_cover_url, v_book_genre,
        v_book_authors, v_book_category_id
    FROM publisher_request pr
    JOIN publisher_book_draft pbd ON pr.ID = pbd.REQUEST_ID
    WHERE pr.ID = p_request_id;
    
    -- Create the book
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
    
    -- Process authors if they exist
    IF v_book_authors IS NOT NULL AND TRIM(v_book_authors) != '' THEN
        CALL ProcessBookAuthors(p_new_book_id, v_book_authors);
    END IF;
    
    -- Update request status
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
    
    -- Create notification for publisher
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
    
END$$

-- Helper procedure for processing authors
CREATE PROCEDURE ProcessBookAuthors(
    IN p_book_id INT,
    IN p_authors_text TEXT
)
BEGIN
    DECLARE v_author_name VARCHAR(255);
    DECLARE v_author_id INT;
    DECLARE v_remaining_text TEXT;
    DECLARE v_comma_pos INT;
    
    -- Error handler for author processing
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Log error but continue processing other authors
        GET DIAGNOSTICS CONDITION 1
            @error_message = MESSAGE_TEXT;
    END;
    
    -- Clean and prepare the authors text
    SET v_remaining_text = TRIM(p_authors_text);
    
    -- Add a trailing comma to make parsing easier
    IF v_remaining_text != '' THEN
        SET v_remaining_text = CONCAT(v_remaining_text, ',');
    END IF;
    
    -- Process each author
    WHILE LENGTH(v_remaining_text) > 0 DO
        SET v_comma_pos = LOCATE(',', v_remaining_text);
        
        IF v_comma_pos > 0 THEN
            -- Extract author name
            SET v_author_name = TRIM(SUBSTRING(v_remaining_text, 1, v_comma_pos - 1));
            SET v_remaining_text = TRIM(SUBSTRING(v_remaining_text, v_comma_pos + 1));
            
            -- Process this author if name is not empty
            IF v_author_name != '' THEN
                -- Check if author already exists
                SELECT ID INTO v_author_id 
                FROM author 
                WHERE NAME = v_author_name 
                LIMIT 1;
                
                -- If author doesn't exist, create them
                IF v_author_id IS NULL THEN
                    INSERT INTO author (NAME) VALUES (v_author_name);
                    SET v_author_id = LAST_INSERT_ID();
                END IF;
                
                -- Link author to book (INSERT IGNORE prevents duplicates)
                INSERT IGNORE INTO book_author (BOOK_ID, AUTHOR_ID, CONTRIBUTION)
                VALUES (p_book_id, v_author_id, 'Author');
                
                -- Reset for next iteration
                SET v_author_id = NULL;
            END IF;
        ELSE
            -- No more commas, exit loop
            SET v_remaining_text = '';
        END IF;
    END WHILE;
    
END$$

DELIMITER ;
