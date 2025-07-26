DELIMITER //

DROP PROCEDURE IF EXISTS ApproveBookRequest//

CREATE PROCEDURE ApproveBookRequest(
    IN p_request_id INT,
    IN p_admin_id INT,
    IN p_admin_feedback TEXT,
    OUT p_result_message VARCHAR(255),
    OUT p_new_book_id INT
)
BEGIN
    DECLARE v_publisher_id INT;
    DECLARE v_title VARCHAR(255);
    DECLARE v_isbn VARCHAR(50);
    DECLARE v_published_date DATE;
    DECLARE v_page_count INT;
    DECLARE v_language VARCHAR(50);
    DECLARE v_edition VARCHAR(100);
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_stock_quantity INT;
    DECLARE v_description TEXT;
    DECLARE v_cover_url VARCHAR(500);
    DECLARE v_genre VARCHAR(100);
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        SET p_result_message = 'Database error occurred during approval';
        SET p_new_book_id = 0;
    END;

    START TRANSACTION;

    -- Get publisher ID from request
    SELECT PUBLISHER_ID INTO v_publisher_id
    FROM PUBLISHER_REQUEST 
    WHERE ID = p_request_id AND STATUS = 'PENDING';

    IF v_publisher_id IS NULL THEN
        SET p_result_message = 'Request not found or already processed';
        SET p_new_book_id = 0;
        ROLLBACK;
    ELSE
        -- Get book details from draft
        SELECT TITLE, ISBN, PUBLISHED_DATE, PAGE_COUNT, LANGUAGE, EDITION, 
               PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE
        INTO v_title, v_isbn, v_published_date, v_page_count, v_language, 
             v_edition, v_price, v_stock_quantity, v_description, v_cover_url, v_genre
        FROM PUBLISHER_BOOK_DRAFT 
        WHERE REQUEST_ID = p_request_id;

        -- Insert book into BOOK table
        INSERT INTO BOOK (TITLE, ISBN, PUBLISHED_DATE, PAGE_COUNT, LANGUAGE, 
                         EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, 
                         GENRE, PUBLISHER_ID, ADDED_AT)
        VALUES (v_title, v_isbn, v_published_date, v_page_count, v_language,
                v_edition, v_price, v_stock_quantity, v_description, v_cover_url,
                v_genre, v_publisher_id, NOW());

        SET p_new_book_id = LAST_INSERT_ID();

        -- Update request status to APPROVED
        UPDATE PUBLISHER_REQUEST 
        SET STATUS = 'APPROVED', 
            REVIEWED_AT = NOW(), 
            REVIEWED_BY = p_admin_id,
            NOTES = CONCAT(COALESCE(NOTES, ''), ' | ', COALESCE(p_admin_feedback, 'Approved'))
        WHERE ID = p_request_id;

        SET p_result_message = 'Book approved and added to catalog successfully';
        
        COMMIT;
    END IF;

END//

DELIMITER ;
