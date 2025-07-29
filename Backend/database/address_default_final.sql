-- Address Default Constraint Script (FINAL WORKING VERSION)
-- Simple approach that works with MySQL limitations

-- ============================================================================
-- CLEANUP EXISTING DATA (Manual cleanup)
-- ============================================================================

-- Fix users with no default address (set their first address as default)
UPDATE user_address ua1
SET IS_DEFAULT = 1
WHERE ua1.ID = (
    SELECT min_id FROM (
        SELECT MIN(ua2.ID) as min_id
        FROM user_address ua2
        WHERE ua2.USER_ID = ua1.USER_ID
        AND ua1.USER_ID NOT IN (
            SELECT DISTINCT USER_ID FROM user_address WHERE IS_DEFAULT = 1
        )
    ) as temp
);

-- ============================================================================
-- STORED PROCEDURE: Set Default Address (This works!)
-- ============================================================================
DELIMITER //

DROP PROCEDURE IF EXISTS SetDefaultAddress//
CREATE PROCEDURE SetDefaultAddress(
    IN p_user_id INT,
    IN p_address_id INT
)
BEGIN
    DECLARE address_exists INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Check if the address exists and belongs to the user
    SELECT COUNT(*) INTO address_exists 
    FROM user_address 
    WHERE ID = p_address_id AND USER_ID = p_user_id;
    
    IF address_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Address not found or does not belong to user';
    END IF;
    
    -- Set all addresses for this user to non-default
    UPDATE user_address 
    SET IS_DEFAULT = 0 
    WHERE USER_ID = p_user_id;
    
    -- Set the specified address as default
    UPDATE user_address 
    SET IS_DEFAULT = 1 
    WHERE ID = p_address_id;
    
    COMMIT;
END//

DELIMITER ;

-- ============================================================================
-- APPLICATION-LEVEL SOLUTION (Recommended)
-- ============================================================================
-- Instead of complex triggers, handle this in application code:
-- 1. When inserting/updating with IS_DEFAULT=1, first set all others to 0
-- 2. Ensure every user always has exactly one default
-- 3. Use the stored procedure for explicit default setting

-- Verification query - run this to check status
SELECT 
    USER_ID,
    COUNT(*) as total_addresses,
    SUM(IS_DEFAULT) as default_addresses,
    CASE 
        WHEN SUM(IS_DEFAULT) = 1 THEN 'OK' 
        WHEN SUM(IS_DEFAULT) = 0 THEN 'NO DEFAULT' 
        ELSE 'MULTIPLE DEFAULTS' 
    END as status
FROM user_address
GROUP BY USER_ID
ORDER BY USER_ID;
