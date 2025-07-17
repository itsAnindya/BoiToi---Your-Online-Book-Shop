-- Trigger to notify admins when a new book contribution request is submitted
-- This trigger will create a notification for all admin users

DELIMITER $$

CREATE TRIGGER notify_admin_on_book_request
AFTER INSERT ON PUBLISHER_REQUEST
FOR EACH ROW
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE admin_id INT;
  DECLARE publisher_name VARCHAR(50);
  DECLARE notification_message TEXT;
  
  -- Cursor to get all admin user IDs
  DECLARE admin_cursor CURSOR FOR 
    SELECT USER_ID FROM ADMIN;
  
  -- Declare continue handler
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  -- Get publisher name
  SELECT NAME INTO publisher_name 
  FROM PUBLISHER 
  WHERE ID = NEW.PUBLISHER_ID;
  
  -- Create notification message
  SET notification_message = CONCAT('New book contribution request from publisher "', publisher_name, '" - Request ID: ', NEW.ID);
  
  -- Open cursor
  OPEN admin_cursor;
  
  -- Loop through all admins
  admin_loop: LOOP
    FETCH admin_cursor INTO admin_id;
    
    IF done THEN
      LEAVE admin_loop;
    END IF;
    
    -- Insert notification for this admin
    INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    VALUES (admin_id, notification_message, 'SYSTEM', 0, NOW());
  END LOOP;
  
  -- Close cursor
  CLOSE admin_cursor;
END$$

DELIMITER ;

-- Create procedure to handle book request approval
DELIMITER $$

CREATE PROCEDURE approve_book_request(
  IN request_id INT,
  IN admin_id INT,
  IN approval_notes TEXT
)
BEGIN
  DECLARE publisher_id INT;
  DECLARE book_title VARCHAR(255);
  DECLARE book_isbn VARCHAR(50);
  DECLARE book_published_date DATE;
  DECLARE book_page_count INT;
  DECLARE book_language VARCHAR(20);
  DECLARE book_edition VARCHAR(20);
  DECLARE book_price DECIMAL(12,2);
  DECLARE book_stock_quantity INT;
  DECLARE book_description TEXT;
  DECLARE book_cover_url VARCHAR(300);
  DECLARE book_genre VARCHAR(255);
  DECLARE new_book_id INT;
  
  -- Error handler
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  -- Start transaction
  START TRANSACTION;
  
  -- Get publisher ID from request
  SELECT PUBLISHER_ID INTO publisher_id
  FROM PUBLISHER_REQUEST
  WHERE ID = request_id;
  
  -- Get book details from draft
  SELECT 
    TITLE, ISBN, PAGE_COUNT, LANGUAGE, EDITION, PRICE, 
    STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE
  INTO 
    book_title, book_isbn, book_page_count, book_language, book_edition, 
    book_price, book_stock_quantity, book_description, book_cover_url, book_genre
  FROM PUBLISHER_BOOK_DRAFT
  WHERE REQUEST_ID = request_id;
  
  -- Get next book ID
  SELECT COALESCE(MAX(ID), 0) + 1 INTO new_book_id FROM BOOK;
  
  -- Insert new book
  INSERT INTO BOOK (
    ID, TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, LANGUAGE, 
    EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, SHOW_BOOK, COVER_URL, 
    ADDED_AT, GENRE
  ) VALUES (
    new_book_id, book_title, book_isbn, CURDATE(), publisher_id, book_page_count, 
    book_language, book_edition, book_price, book_stock_quantity, book_description, 
    1, book_cover_url, NOW(), book_genre
  );
  
  -- Update request status
  UPDATE PUBLISHER_REQUEST 
  SET STATUS = 'APPROVED', REVIEWED_AT = NOW(), REVIEWED_BY = admin_id, NOTES = approval_notes
  WHERE ID = request_id;
  
  -- Notify publisher about approval
  INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
  VALUES (
    publisher_id, 
    CONCAT('Your book contribution request for "', book_title, '" has been approved and added to the catalog.'), 
    'SYSTEM', 
    0, 
    NOW()
  );
  
  -- Commit transaction
  COMMIT;
  
  -- Return the new book ID
  SELECT new_book_id as book_id;
END$$

DELIMITER ;

-- Create procedure to handle book request rejection
DELIMITER $$

CREATE PROCEDURE reject_book_request(
  IN request_id INT,
  IN admin_id INT,
  IN rejection_notes TEXT
)
BEGIN
  DECLARE publisher_id INT;
  DECLARE book_title VARCHAR(255);
  
  -- Get publisher ID and book title
  SELECT pr.PUBLISHER_ID, pbd.TITLE
  INTO publisher_id, book_title
  FROM PUBLISHER_REQUEST pr
  JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
  WHERE pr.ID = request_id;
  
  -- Update request status
  UPDATE PUBLISHER_REQUEST 
  SET STATUS = 'REJECTED', REVIEWED_AT = NOW(), REVIEWED_BY = admin_id, NOTES = rejection_notes
  WHERE ID = request_id;
  
  -- Notify publisher about rejection
  INSERT INTO NOTIFICATIONS (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
  VALUES (
    publisher_id, 
    CONCAT('Your book contribution request for "', book_title, '" has been rejected. Reason: ', rejection_notes), 
    'SYSTEM', 
    0, 
    NOW()
  );
END$$

DELIMITER ;
