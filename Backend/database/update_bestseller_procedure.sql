-- Stored Procedure to Update Category Bestseller Data
-- This procedure calculates bestsellers based on delivered orders from the past 30 days

DELIMITER $$

DROP PROCEDURE IF EXISTS UpdateCategoryBestsellers$$

CREATE PROCEDURE UpdateCategoryBestsellers()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Clear existing monthly bestseller data for current period
    DELETE FROM category_bestseller 
    WHERE PERIOD_TYPE = 'MONTHLY' 
    AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01');

    -- Insert new bestseller data
    INSERT INTO category_bestseller (PERIOD_TYPE, PERIOD_START, CATEGORY_ID, POSITION, BOOK_ID)
    SELECT 
        'MONTHLY' as PERIOD_TYPE,
        DATE_FORMAT(CURDATE(), '%Y-%m-01') as PERIOD_START,
        ranked_books.CATEGORY_ID,
        ranked_books.book_rank as POSITION,
        ranked_books.BOOK_ID
    FROM (
        SELECT 
            c.ID as CATEGORY_ID,
            b.ID as BOOK_ID,
            SUM(ob.QUANTITY) as total_sold,
            ROW_NUMBER() OVER (PARTITION BY c.ID ORDER BY SUM(ob.QUANTITY) DESC) as book_rank
        FROM `order` o
        INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
        INNER JOIN book b ON ob.BOOK_ID = b.ID
        INNER JOIN category c ON b.CATEGORY_ID = c.ID
        WHERE 
            o.ORDER_STATUS = 'delivered'
            AND o.ORDERD_AT >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND b.SHOW_BOOK = 1
            AND b.CATEGORY_ID IS NOT NULL
        GROUP BY c.ID, b.ID
        HAVING total_sold > 0
    ) ranked_books
    WHERE ranked_books.book_rank <= 10
    ORDER BY ranked_books.CATEGORY_ID, ranked_books.book_rank;

    COMMIT;

    -- Return summary information
    SELECT 
        COUNT(*) as total_bestsellers_updated,
        COUNT(DISTINCT CATEGORY_ID) as categories_with_bestsellers,
        DATE_FORMAT(CURDATE(), '%Y-%m-01') as period_start
    FROM category_bestseller 
    WHERE PERIOD_TYPE = 'MONTHLY' 
    AND PERIOD_START = DATE_FORMAT(CURDATE(), '%Y-%m-01');

END$$

DELIMITER ;

-- Test the procedure (uncomment to run)
-- CALL UpdateCategoryBestsellers();
