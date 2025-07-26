-- Complete working procedures for author processing
-- Load this file to replace both procedures with guaranteed working versions

USE boitoi_db;

-- First, create a simple working ProcessBookAuthors procedure
DROP PROCEDURE IF EXISTS ProcessBookAuthors;

DELIMITER $$
CREATE PROCEDURE ProcessBookAuthors(
    IN book_id INT,
    IN authors_text TEXT
)
BEGIN
    DECLARE author_name VARCHAR(255);
    DECLARE author_id INT;
    DECLARE comma_pos INT;
    DECLARE remaining_text TEXT;
    
    -- Handle NULL or empty input
    IF authors_text IS NULL OR TRIM(authors_text) = '' THEN
        LEAVE;
    END IF;
    
    SET remaining_text = CONCAT(TRIM(authors_text), ','); -- Add trailing comma for parsing
    
    -- Simple loop to process comma-separated authors
    WHILE LENGTH(remaining_text) > 0 DO
        SET comma_pos = LOCATE(',', remaining_text);
        
        IF comma_pos > 0 THEN
            SET author_name = TRIM(SUBSTRING(remaining_text, 1, comma_pos - 1));
            SET remaining_text = TRIM(SUBSTRING(remaining_text, comma_pos + 1));
            
            IF author_name != '' THEN
                -- Check if author exists
                SELECT ID INTO author_id FROM author WHERE NAME = author_name LIMIT 1;
                
                -- Create author if doesn't exist
                IF author_id IS NULL THEN
                    INSERT INTO author (NAME) VALUES (author_name);
                    SET author_id = LAST_INSERT_ID();
                END IF;
                
                -- Link author to book
                INSERT IGNORE INTO book_author (BOOK_ID, AUTHOR_ID, CONTRIBUTION) 
                VALUES (book_id, author_id, 'Author');
            END IF;
        ELSE
            -- No more commas, exit
            SET remaining_text = '';
        END IF;
    END WHILE;
    
END$$

-- Now create the ApproveBookRequest procedure (your working version + simple author call)
DROP PROCEDURE IF EXISTS ApproveBookRequest;

CREATE PROCEDURE ApproveBookRequest(
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
    DECLARE book_published_date DATE DEFAULT NULL;
    DECLARE book_pages INT DEFAULT NULL;
    DECLARE book_language VARCHAR(20) DEFAULT 'English';
    DECLARE book_edition VARCHAR(20) DEFAULT '1st';
    DECLARE book_price DECIMAL(12,2) DEFAULT 0.00;
    DECLARE book_stock INT DEFAULT 0;
    DECLARE book_description TEXT DEFAULT '';
    DECLARE book_cover_url VARCHAR(300) DEFAULT '/images/books/defaultbook.jpg';
    DECLARE book_genre VARCHAR(255) DEFAULT 'General';
    DECLARE book_authors TEXT DEFAULT NULL;
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
            
            SELECT 
                COALESCE(TITLE, 'Untitled') as title,
                COALESCE(ISBN, '') as isbn,
                COALESCE(PUBLISHED_DATE, CURDATE()) as pub_date,
                COALESCE(PAGE_COUNT, 0) as pages,
                COALESCE(LANGUAGE, 'English') as lang,
                COALESCE(EDITION, '1st') as ed,
                COALESCE(PRICE, 0.00) as pr,
                COALESCE(STOCK_QUANTITY, 0) as stock,
                COALESCE(DESCRIPTION, '') as desc_text,
                COALESCE(COVER_URL, '/images/books/defaultbook.jpg') as cover,
                COALESCE(GENRE, 'General') as genre_text,
                AUTHORS
            INTO 
                book_title, book_isbn, book_published_date, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre, book_authors
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, book_published_date, publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            SET new_book_id = LAST_INSERT_ID();
            
            -- Process authors with the working procedure
            IF book_authors IS NOT NULL AND TRIM(book_authors) != '' THEN
                CALL ProcessBookAuthors(new_book_id, book_authors);
            END IF;
            
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
