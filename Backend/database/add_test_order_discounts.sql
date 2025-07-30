-- Insert test order_discount data to demonstrate the discount functionality in admin order management

-- First, let's see what orders and discounts exist
-- SELECT * FROM `order` LIMIT 5;
-- SELECT * FROM `discount`;

-- Add discount to order 228356 (HELLOWORLD discount - 30% off)
INSERT INTO `order_discount` (ID, ORDER_ID, DISCOUNT_ID) VALUES (1, 228356, 2);

-- Add discount to order 228357 (BOITOI discount - 200 BDT off)  
INSERT INTO `order_discount` (ID, ORDER_ID, DISCOUNT_ID) VALUES (2, 228357, 3);

-- Add discount to order 1008 (HELLOWORLD discount - 30% off)
INSERT INTO `order_discount` (ID, ORDER_ID, DISCOUNT_ID) VALUES (3, 1008, 2);

-- Note: These will now show discounts in the admin order management view
-- - Order 228356: Should show 30% discount with code "HELLOWORLD"
-- - Order 228357: Should show 200 BDT fixed discount with code "BOITOI"  
-- - Order 1008: Should show 30% discount with code "HELLOWORLD"
