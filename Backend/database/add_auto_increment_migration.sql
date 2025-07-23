-- BoiToi Database AUTO_INCREMENT Migration Script
-- This script adds AUTO_INCREMENT to existing tables without dropping them
-- Safer for production environments with existing data

SET FOREIGN_KEY_CHECKS = 0;

-- Add AUTO_INCREMENT to existing tables
-- Note: MySQL will start AUTO_INCREMENT from MAX(ID) + 1 automatically

ALTER TABLE `author` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `book` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `category` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `discount` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `inventory_log` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `order` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `order_discount` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `payment` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `permission` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `publisher` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `publisher_request` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `return_request` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `review` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `search_log` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `shipping` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `user` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_address` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `wishlist` MODIFY `ID` int NOT NULL AUTO_INCREMENT;

-- Fix notifications table primary key ordering issue (was DESC, should be ASC)
ALTER TABLE `notifications` MODIFY `ID` bigint NOT NULL AUTO_INCREMENT, DROP PRIMARY KEY, ADD PRIMARY KEY (`ID`);

-- Update some timestamp defaults to use CURRENT_TIMESTAMP
ALTER TABLE `cart` MODIFY `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `favourite` MODIFY `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `inventory_log` MODIFY `CHANGED_AT` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `notifications` MODIFY `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `order` MODIFY `ORDERD_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `payment` MODIFY `PAYMENT_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `publisher` MODIFY `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `publisher_request` MODIFY `SUBMITTED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `return_request` MODIFY `REQUEST_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `review` MODIFY `POSTED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `search_log` MODIFY `SEARCH_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `shipping` MODIFY `SHIPPING_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `user` MODIFY `CREATED_AT` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `user` MODIFY `LAST_ACTIVE` datetime NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `wishlist` MODIFY `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP;

-- Update the ApproveBookRequest procedure to work with AUTO_INCREMENT
DROP PROCEDURE IF EXISTS `ApproveBookRequest`;
DELIMITER ;;
CREATE PROCEDURE `ApproveBookRequest`(IN request_id INT,
    IN admin_id INT,
    IN admin_feedback_text TEXT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT)
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
                COALESCE(GENRE, 'General') as genre_text
            INTO 
                book_title, book_isbn, book_published_date, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            -- Let AUTO_INCREMENT handle the ID automatically
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, book_published_date, publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            -- Get the auto-generated ID
            SET new_book_id = LAST_INSERT_ID();
            
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
    
END
;;
DELIMITER ;

-- Update ProcessBookAuthors procedure to use AUTO_INCREMENT
DROP PROCEDURE IF EXISTS `ProcessBookAuthors`;
DELIMITER ;;
CREATE PROCEDURE `ProcessBookAuthors`(IN book_id INT,
    IN authors_text TEXT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE author_name VARCHAR(255);
    DECLARE author_id INT;
    DECLARE authors_cursor CURSOR FOR 
        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(authors_text, ',', numbers.n), ',', -1)) as author
        FROM (
            SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
            UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers
        WHERE numbers.n <= 1 + (LENGTH(authors_text) - LENGTH(REPLACE(authors_text, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(authors_text, ',', numbers.n), ',', -1)) != '';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    IF authors_text IS NOT NULL AND TRIM(authors_text) != '' THEN
        OPEN authors_cursor;
        
        read_loop: LOOP
            FETCH authors_cursor INTO author_name;
            IF done THEN
                LEAVE read_loop;
            END IF;
            
            SET author_name = TRIM(author_name);
            
            IF author_name != '' THEN
                SELECT ID INTO author_id FROM author WHERE NAME = author_name LIMIT 1;
                
                IF author_id IS NULL THEN
                    -- Use AUTO_INCREMENT for new author ID
                    INSERT INTO author (NAME) VALUES (author_name);
                    SET author_id = LAST_INSERT_ID();
                END IF;
                
                INSERT IGNORE INTO book_author (BOOK_ID, AUTHOR_ID, CONTRIBUTION) 
                VALUES (book_id, author_id, 'Author');
            END IF;
        END LOOP;
        
        CLOSE authors_cursor;
    END IF;
END
;;
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- Display completion message
SELECT 'AUTO_INCREMENT migration completed successfully!' as status;
