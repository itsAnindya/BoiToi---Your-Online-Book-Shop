-- Address Default Constraint Script (FIXED VERSION)
-- Ensures only one default address per user at the database level

-- First, clean up any existing multiple defaults (if any) - FIXED SUBQUERY ISSUE
UPDATE user_address 
SET IS_DEFAULT = 0
WHERE IS_DEFAULT = 1
AND USER_ID IN (
    SELECT USER_ID FROM (
        SELECT USER_ID
        FROM user_address
        WHERE IS_DEFAULT = 1
        GROUP BY USER_ID
        HAVING COUNT(*) > 1
    ) AS duplicate_defaults
)
AND ID NOT IN (
    SELECT min_id FROM (
        SELECT USER_ID, MIN(ID) as min_id
        FROM user_address
        WHERE IS_DEFAULT = 1
        GROUP BY USER_ID
        HAVING COUNT(*) > 1
    ) AS first_defaults
);

-- Ensure every user has at least one default address - FIXED SUBQUERY ISSUE
UPDATE user_address ua1
JOIN (
    SELECT USER_ID, MIN(ID) as first_id
    FROM user_address
    WHERE USER_ID IN (
        SELECT USER_ID
        FROM user_address
        GROUP BY USER_ID
        HAVING SUM(IS_DEFAULT) = 0
    )
    GROUP BY USER_ID
) ua2 ON ua1.USER_ID = ua2.USER_ID AND ua1.ID = ua2.first_id
SET ua1.IS_DEFAULT = 1;

-- ============================================================================
-- STORED PROCEDURE: Manage Default Address
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
    WHERE ID = p_address_id AND USER_ID = p_user_id;
    
    COMMIT;
END//

DELIMITER ;

-- ============================================================================
-- IMPROVED DATABASE TRIGGERS
-- ============================================================================

-- Create enhanced triggers to automatically handle default address logic
DELIMITER //

-- Trigger for INSERT operations (Enhanced)
DROP TRIGGER IF EXISTS ensure_single_default_insert//
CREATE TRIGGER ensure_single_default_insert
    BEFORE INSERT ON user_address
    FOR EACH ROW
BEGIN
    -- If the new address is set as default OR user has no addresses
    IF NEW.IS_DEFAULT = 1 OR 
       (SELECT COUNT(*) FROM user_address WHERE USER_ID = NEW.USER_ID) = 0 THEN
        -- Set all other addresses for this user to non-default first
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND IS_DEFAULT = 1;
        -- Ensure this new address is default
        SET NEW.IS_DEFAULT = 1;
    END IF;
END//

-- Trigger for UPDATE operations (Enhanced) - FIXED SYNTAX
DROP TRIGGER IF EXISTS ensure_single_default_update//
CREATE TRIGGER ensure_single_default_update
    BEFORE UPDATE ON user_address
    FOR EACH ROW
BEGIN
    -- If the address is being set as default
    IF NEW.IS_DEFAULT = 1 AND OLD.IS_DEFAULT != 1 THEN
        -- Set all other addresses for this user to non-default
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND ID != NEW.ID 
        AND IS_DEFAULT = 1;
    ELSEIF NEW.IS_DEFAULT = 0 AND OLD.IS_DEFAULT = 1 THEN
        -- Prevent unsetting the last default address
        IF (SELECT COUNT(*) FROM user_address WHERE USER_ID = NEW.USER_ID AND ID != NEW.ID) > 0 THEN
            -- Force another address to be default
            UPDATE user_address 
            SET IS_DEFAULT = 1 
            WHERE USER_ID = NEW.USER_ID 
            AND ID != NEW.ID 
            ORDER BY ID ASC 
            LIMIT 1;
        ELSE
            -- This is the only address, keep it as default
            SET NEW.IS_DEFAULT = 1;
        END IF;
    END IF;
END//

-- Trigger for DELETE operations (Enhanced)
DROP TRIGGER IF EXISTS ensure_default_after_delete//
CREATE TRIGGER ensure_default_after_delete
    AFTER DELETE ON user_address
    FOR EACH ROW
BEGIN
    -- If the deleted address was default and user still has addresses
    IF OLD.IS_DEFAULT = 1 THEN
        IF (SELECT COUNT(*) FROM user_address WHERE USER_ID = OLD.USER_ID) > 0 THEN
            UPDATE user_address 
            SET IS_DEFAULT = 1 
            WHERE USER_ID = OLD.USER_ID 
            ORDER BY ID ASC 
            LIMIT 1;
        END IF;
    END IF;
END//

DELIMITER ;

-- Verify the cleanup worked
SELECT 
    USER_ID,
    COUNT(*) as total_addresses,
    SUM(IS_DEFAULT) as default_addresses
FROM user_address
GROUP BY USER_ID
HAVING SUM(IS_DEFAULT) != 1;

-- If the above query returns no rows, then every user has exactly one default address
