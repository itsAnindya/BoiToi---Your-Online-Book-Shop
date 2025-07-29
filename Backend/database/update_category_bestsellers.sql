-- Category Bestseller Update Query
-- This query calculates the top 10 books per category based on sales from the last 30 days

-- Step 1: Calculate book sales per category from the last 30 days
WITH book_category_sales AS (
    SELECT 
        bc.CATEGORY_ID,
        bc.BOOK_ID,
        SUM(ob.QUANTITY) as total_quantity_sold,
        COUNT(DISTINCT o.ID) as total_orders
    FROM `order` o
    INNER JOIN order_book ob ON o.ID = ob.ORDER_ID
    INNER JOIN book b ON ob.BOOK_ID = b.ID
    INNER JOIN book_category bc ON b.ID = bc.BOOK_ID
    WHERE 
        o.ORDER_STATUS = 'delivered'
        AND o.ORDERD_AT >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND b.SHOW_BOOK = 1  -- Only show visible books
    GROUP BY bc.CATEGORY_ID, bc.BOOK_ID
),

-- Step 2: Rank books within each category
ranked_bestsellers AS (
    SELECT 
        CATEGORY_ID,
        BOOK_ID,
        total_quantity_sold,
        total_orders,
        ROW_NUMBER() OVER (
            PARTITION BY CATEGORY_ID 
            ORDER BY total_quantity_sold DESC, total_orders DESC, BOOK_ID ASC
        ) as book_rank
    FROM book_category_sales
)

-- Step 3: Select top 10 per category
SELECT 
    'MONTHLY' as PERIOD_TYPE,
    DATE_FORMAT(NOW(), '%Y-%m-01') as PERIOD_START,
    CATEGORY_ID,
    book_rank as POSITION,
    BOOK_ID,
    total_quantity_sold,
    total_orders
FROM ranked_bestsellers 
WHERE book_rank <= 10
ORDER BY CATEGORY_ID, book_rank;
