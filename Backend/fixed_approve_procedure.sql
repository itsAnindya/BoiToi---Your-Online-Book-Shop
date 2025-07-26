-- Fixed ApproveBookRequest procedure - remove PUBLISHED_DATE reference
USE boitoi_db;

DROP PROCEDURE IF EXISTS ApproveBookRequest;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ApproveBookRequest`(
    IN request_id INT,
    IN admin_id INT,
    IN admin_feedback_text TEXT,
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
    
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'SQL Error occurred while processing request';
        SET new_book_id = 0;
    END;
    
    SET result_message = '';
    SET new_book_id = 0;
    
    START TRANSACTION;
    
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request already processed with status: ', request_status);
            ROLLBACK;
        ELSE
            SELECT pr.PUBLISHER_ID INTO publisher_id
            FROM PUBLISHER_REQUEST pr
            WHERE pr.ID = request_id;
            
            -- Fixed: Removed PUBLISHED_DATE reference since it doesn't exist in PUBLISHER_BOOK_DRAFT
            SELECT 
                COALESCE(TITLE, 'Untitled') as title,
                COALESCE(ISBN, '') as isbn,
                COALESCE(PAGE_COUNT, 0) as pages,
                COALESCE(LANGUAGE, 'English') as lang,
                COALESCE(EDITION, '1st') as ed,
                COALESCE(PRICE, 0.00) as pr,
                COALESCE(STOCK_QUANTITY, 0) as stock,
                COALESCE(DESCRIPTION, '') as desc_text,
                COALESCE(COVER_URL, '/images/books/defaultbook.jpg') as cover,
                COALESCE(GENRE, 'General') as genre_text
            INTO 
                book_title, book_isbn, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            -- Insert book using current date as published date
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, CURDATE(), publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            -- Get the auto-generated ID
            SET new_book_id = LAST_INSERT_ID();
            
            -- Process authors after book creation
            CALL ProcessBookAuthors(new_book_id, (
                SELECT AUTHORS FROM PUBLISHER_BOOK_DRAFT WHERE REQUEST_ID = request_id
            ));
            
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                admin_feedback = admin_feedback_text
            WHERE ID = request_id;
            
            SET result_message = CONCAT('Book approved successfully with ID: ', new_book_id);
        END IF;
    END IF;
    
    IF exit_handler = FALSE THEN
        COMMIT;
    END IF;
    
END$$

DELIMITER ;
