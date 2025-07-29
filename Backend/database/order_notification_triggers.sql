-- ================================================================
-- ORDER NOTIFICATION TRIGGERS FOR BOITOI BOOKSTORE
-- ================================================================
-- This script creates triggers to automatically send notifications:
-- 1. To all admins when a new order is placed
-- 2. To customers when admins update their order status
-- ================================================================

USE boitoi_db;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS notify_admins_new_order;
DROP TRIGGER IF EXISTS notify_user_order_update;

DELIMITER $$

-- ================================================================
-- TRIGGER 1: Notify all admins when a new order is placed
-- ================================================================
CREATE TRIGGER notify_admins_new_order
AFTER INSERT ON `order`
FOR EACH ROW
BEGIN
    DECLARE customer_name VARCHAR(100) DEFAULT 'Customer';
    DECLARE customer_email VARCHAR(50) DEFAULT '';
    DECLARE notification_message TEXT;
    
    -- Get customer information
    SELECT COALESCE(CONCAT(FIRST_NAME, ' ', LAST_NAME), USERNAME, 'Customer'),
           COALESCE(EMAIL, '')
    INTO customer_name, customer_email
    FROM user
    WHERE ID = NEW.USER_ID;
    
    -- Create notification message
    SET notification_message = CONCAT(
        'New order #', NEW.ID, ' placed by ', customer_name,
        CASE 
            WHEN customer_email != '' THEN CONCAT(' (', customer_email, ')')
            ELSE ''
        END,
        '. Total amount: $', COALESCE(NEW.TOTAL_AMOUNT, 0),
        '. Status: ', COALESCE(NEW.ORDER_STATUS, 'pending')
    );
    
    -- Insert notification for all admin users
    INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
    SELECT 
        a.USER_ID,
        notification_message,
        'ORDER',
        0,
        NOW(),
        CONCAT('/admin/orders/', NEW.ID)
    FROM admin a
    WHERE EXISTS (SELECT 1 FROM user u WHERE u.ID = a.USER_ID AND u.IS_ACTIVE = 1);
    
END$$

-- ================================================================
-- TRIGGER 2: Notify customer when admin updates order status
-- ================================================================
CREATE TRIGGER notify_user_order_update
AFTER UPDATE ON `order`
FOR EACH ROW
BEGIN
    DECLARE admin_name VARCHAR(100) DEFAULT 'Admin';
    DECLARE notification_message TEXT;
    DECLARE status_display VARCHAR(50);
    
    -- Only process if status actually changed and was updated by an admin
    IF (OLD.ORDER_STATUS != NEW.ORDER_STATUS OR OLD.ORDER_STATUS IS NULL) 
       AND NEW.STATUS_UPDATED_BY IS NOT NULL THEN
        
        -- Get admin name who updated the status
        SELECT COALESCE(CONCAT(u.FIRST_NAME, ' ', u.LAST_NAME), u.USERNAME, 'Admin')
        INTO admin_name
        FROM admin a
        JOIN user u ON a.USER_ID = u.ID
        WHERE a.USER_ID = NEW.STATUS_UPDATED_BY;
        
        -- Convert status to user-friendly display
        SET status_display = CASE NEW.ORDER_STATUS
            WHEN 'pending' THEN 'Pending Review'
            WHEN 'confirmed' THEN 'Confirmed'
            WHEN 'processing' THEN 'Being Processed'
            WHEN 'shipped' THEN 'Shipped'
            WHEN 'delivered' THEN 'Delivered'
            WHEN 'cancelled' THEN 'Cancelled'
            WHEN 'returned' THEN 'Returned'
            WHEN 'refunded' THEN 'Refunded'
            WHEN 'on_hold' THEN 'On Hold'
            ELSE NEW.ORDER_STATUS
        END;
        
        -- Create appropriate notification message based on status
        SET notification_message = CASE NEW.ORDER_STATUS
            WHEN 'confirmed' THEN CONCAT(
                'Great news! Your order #', NEW.ID, ' has been confirmed by ', admin_name, 
                ' and is now being prepared for shipping.'
            )
            WHEN 'processing' THEN CONCAT(
                'Your order #', NEW.ID, ' is now being processed. We''ll notify you when it ships!'
            )
            WHEN 'shipped' THEN CONCAT(
                'Exciting news! Your order #', NEW.ID, ' has been shipped and is on its way to you. ',
                'You should receive it soon!'
            )
            WHEN 'delivered' THEN CONCAT(
                'Your order #', NEW.ID, ' has been delivered! We hope you enjoy your books. ',
                'Thank you for choosing BoiToi!'
            )
            WHEN 'cancelled' THEN CONCAT(
                'Your order #', NEW.ID, ' has been cancelled by ', admin_name, '. ',
                'If you have any questions, please contact our support team.'
            )
            WHEN 'returned' THEN CONCAT(
                'Your return request for order #', NEW.ID, ' has been processed. ',
                'Thank you for your patience.'
            )
            WHEN 'refunded' THEN CONCAT(
                'Your refund for order #', NEW.ID, ' has been processed. ',
                'The amount will be credited to your original payment method within 3-5 business days.'
            )
            WHEN 'on_hold' THEN CONCAT(
                'Your order #', NEW.ID, ' has been placed on hold by ', admin_name, '. ',
                'Our team will contact you soon with more information.'
            )
            ELSE CONCAT(
                'Your order #', NEW.ID, ' status has been updated to: ', status_display, ' by ', admin_name
            )
        END;
        
        -- Insert notification for the customer
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
        VALUES (
            NEW.USER_ID,
            notification_message,
            'ORDER',
            0,
            NOW(),
            CONCAT('/orders/', NEW.ID)
        );
        
    END IF;
    
END$$

DELIMITER ;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if triggers were created successfully
SELECT 
    TRIGGER_NAME, 
    EVENT_MANIPULATION, 
    EVENT_OBJECT_TABLE, 
    TRIGGER_SCHEMA,
    DEFINER
FROM INFORMATION_SCHEMA.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'boitoi_db' 
AND TRIGGER_NAME IN ('notify_admins_new_order', 'notify_user_order_update');

-- ================================================================
-- OPTIONAL: Helper procedure to manually create order notifications
-- ================================================================

DELIMITER $$

-- Procedure to manually trigger order notifications (for testing or manual execution)
CREATE PROCEDURE TriggerOrderNotification(
    IN order_id INT,
    IN notification_type ENUM('NEW_ORDER', 'STATUS_UPDATE')
)
BEGIN
    DECLARE order_user_id INT;
    DECLARE order_status VARCHAR(50);
    DECLARE order_amount DECIMAL(12,2);
    DECLARE updated_by_admin INT;
    
    -- Get order information
    SELECT USER_ID, ORDER_STATUS, TOTAL_AMOUNT, STATUS_UPDATED_BY
    INTO order_user_id, order_status, order_amount, updated_by_admin
    FROM `order`
    WHERE ID = order_id;
    
    IF order_user_id IS NOT NULL THEN
        IF notification_type = 'NEW_ORDER' THEN
            -- Simulate new order notification
            INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
            SELECT 
                a.USER_ID,
                CONCAT('New order #', order_id, ' requires attention. Amount: $', COALESCE(order_amount, 0)),
                'ORDER',
                0,
                NOW(),
                CONCAT('/admin/orders/', order_id)
            FROM admin a;
            
        ELSEIF notification_type = 'STATUS_UPDATE' THEN
            -- Simulate status update notification
            INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
            VALUES (
                order_user_id,
                CONCAT('Your order #', order_id, ' status has been updated to: ', order_status),
                'ORDER',
                0,
                NOW(),
                CONCAT('/orders/', order_id)
            );
        END IF;
    END IF;
    
END$$

DELIMITER ;

-- ================================================================
-- TEST QUERIES (for verification after implementing)
-- ================================================================

-- Check recent order-related notifications
SELECT 
    n.ID,
    n.USER_ID,
    u.USERNAME,
    n.MESSAGE,
    n.TYPE,
    n.IS_READ,
    n.CREATED_AT,
    n.URL
FROM notifications n
JOIN user u ON n.USER_ID = u.ID
WHERE n.TYPE = 'ORDER'
ORDER BY n.CREATED_AT DESC
LIMIT 10;

-- Check admin users who will receive new order notifications
SELECT 
    a.USER_ID,
    u.USERNAME,
    u.EMAIL,
    u.FIRST_NAME,
    u.LAST_NAME
FROM admin a
JOIN user u ON a.USER_ID = u.ID
WHERE u.IS_ACTIVE = 1;

-- Check recent orders
SELECT 
    o.ID,
    o.USER_ID,
    u.USERNAME,
    o.ORDER_STATUS,
    o.TOTAL_AMOUNT,
    o.ORDERD_AT,
    o.STATUS_UPDATED_BY,
    o.STATUS_UPDATED_AT
FROM `order` o
JOIN user u ON o.USER_ID = u.ID
ORDER BY o.ORDERD_AT DESC
LIMIT 5;

-- ================================================================
-- USAGE INSTRUCTIONS
-- ================================================================

/*
TRIGGER BEHAVIOR:

1. NEW ORDER PLACED:
   - Trigger: notify_admins_new_order
   - Action: Creates notification for ALL admin users
   - Message: "New order #[ID] placed by [Customer Name] ([email]). Total amount: $[amount]. Status: [status]"
   - Type: ORDER
   - URL: /admin/orders/[order_id]

2. ORDER STATUS UPDATED BY ADMIN:
   - Trigger: notify_user_order_update
   - Action: Creates notification for the customer who placed the order
   - Message: Varies based on status (confirmed, shipped, delivered, etc.)
   - Type: ORDER
   - URL: /orders/[order_id]
   - Only triggers when status actually changes AND was updated by an admin

TESTING:
1. Place a new order through the checkout system
2. Update an order status through admin panel
3. Check notifications table for new entries
4. Use the helper procedure for manual testing:
   CALL TriggerOrderNotification(order_id, 'NEW_ORDER');
   CALL TriggerOrderNotification(order_id, 'STATUS_UPDATE');

EXTENDING:
- Add email notifications by integrating with email service
- Add push notifications for mobile apps
- Create notification preferences for users
- Add order item details in notifications
- Implement notification cleanup procedures
*/

SELECT 'Order notification triggers created successfully!' as STATUS;
