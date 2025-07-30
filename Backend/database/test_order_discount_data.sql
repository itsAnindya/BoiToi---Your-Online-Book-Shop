-- Test data for order_discount table
-- This adds some sample discount applications to existing orders

-- Note: You may need to adjust the ORDER_ID values based on your actual order IDs
-- Check your order table first with: SELECT ID, TOTAL_AMOUNT FROM `order` LIMIT 10;

-- Insert sample order-discount relationships
-- Use existing order IDs from your database

-- Example: If you have order 1000, apply HELLOWORLD discount (30% off)
-- INSERT INTO `order_discount` VALUES (1, 1000, 2);

-- Example: If you have order 1002, apply BOITOI discount (200 BDT off)  
-- INSERT INTO `order_discount` VALUES (2, 1002, 3);

-- Instructions:
-- 1. First run: SELECT ID, TOTAL_AMOUNT, USER_ID FROM `order` WHERE TOTAL_AMOUNT > 200 LIMIT 5;
-- 2. Pick order IDs that exist in your database
-- 3. Uncomment and modify the lines below with actual order IDs:

-- INSERT INTO `order_discount` VALUES (1, [YOUR_ORDER_ID_HERE], 2);  -- HELLOWORLD discount (30% off)
-- INSERT INTO `order_discount` VALUES (2, [YOUR_ORDER_ID_HERE], 3);  -- BOITOI discount (200 BDT off)

-- Note: The discount amounts will be calculated by the backend based on:
-- - HELLOWORLD (ID=2): 30% off the books subtotal for orders over 200 BDT
-- - BOITOI (ID=3): 200 BDT off the books subtotal for orders over 1000 BDT order_discount table
-- This adds some sample discount applications to existing orders

-- Insert sample order-discount relationships
-- Order 228356 (delivered, 1040.00 BDT) gets HELLOWORLD discount (30% off)
INSERT INTO `order_discount` VALUES (1, 228356, 2);

-- Order 228357 (delivered, 2440.00 BDT) gets BOITOI discount (200 BDT off)
INSERT INTO `order_discount` VALUES (2, 228357, 3);

-- Order 1008 (refunded, 1840.00 BDT) gets HELLOWORLD discount (30% off)
INSERT INTO `order_discount` VALUES (3, 1008, 2);

-- Note: The discount amounts will be calculated by the backend based on:
-- - HELLOWORLD: 30% off orders over 200 BDT
-- - BOITOI: 200 BDT off orders over 1000 BDT
