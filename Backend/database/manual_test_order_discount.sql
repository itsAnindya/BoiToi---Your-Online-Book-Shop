-- Manual SQL script to add test order_discount records for testing admin frontend

-- Check what orders exist
SELECT 'Current orders:' as info;
SELECT ID, USER_ID, TOTAL_AMOUNT, ORDER_STATUS FROM `order` ORDER BY ID DESC LIMIT 5;

-- Check what discounts exist  
SELECT 'Current discounts:' as info;
SELECT ID, CODE, DISCOUNT_TYPE, PERCENTAGE, VALUE, DESCRIPTION FROM discount;

-- Check if order_discount table exists and current records
SELECT 'Current order_discount records:' as info;
SELECT * FROM order_discount;

-- Add test records (adjust IDs based on what exists)
-- Make sure to use existing order IDs and discount IDs

-- Example: Add HELLOWORLD discount (ID 2) to order 228356
-- INSERT INTO order_discount (ORDER_ID, DISCOUNT_ID) VALUES (228356, 2);

-- Example: Add BOITOI discount (ID 3) to order 228357  
-- INSERT INTO order_discount (ORDER_ID, DISCOUNT_ID) VALUES (228357, 3);

-- Verify the records were added
-- SELECT 'Verification - order_discount with details:' as info;
-- SELECT od.*, d.CODE, d.DISCOUNT_TYPE, d.PERCENTAGE, d.VALUE, o.TOTAL_AMOUNT
-- FROM order_discount od 
-- JOIN discount d ON od.DISCOUNT_ID = d.ID 
-- JOIN `order` o ON od.ORDER_ID = o.ID;
