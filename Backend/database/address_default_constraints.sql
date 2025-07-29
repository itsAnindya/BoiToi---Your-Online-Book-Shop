-- Address Default Constraint Script
-- Ensures only one default address per user at the database level

-- First, clean up any existing multiple defaults (if any)
UPDATE user_address ua1
SET IS_DEFAULT = 0
WHERE IS_DEFAULT = 1
AND EXISTS (
    SELECT 1 FROM (
        SELECT USER_ID, MIN(ID) as min_id
        FROM user_address
        WHERE IS_DEFAULT = 1
        GROUP BY USER_ID
        HAVING COUNT(*) > 1
    ) ua2
    WHERE ua1.USER_ID = ua2.USER_ID
    AND ua1.ID != ua2.min_id
);

-- Ensure every user has at least one default address
UPDATE user_address ua1
SET IS_DEFAULT = 1
WHERE USER_ID IN (
    SELECT USER_ID
    FROM (
        SELECT USER_ID
        FROM user_address
        GROUP BY USER_ID
        HAVING SUM(IS_DEFAULT) = 0
    ) users_without_default
)
AND ID = (
    SELECT MIN(ID)
    FROM user_address ua2
    WHERE ua2.USER_ID = ua1.USER_ID
);

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

-- Create a trigger to automatically handle default address logic
-- This trigger ensures only one default address per user

DELIMITER //

-- Trigger for INSERT operations
DROP TRIGGER IF EXISTS ensure_single_default_insert//
CREATE TRIGGER ensure_single_default_insert
    AFTER INSERT ON user_address
    FOR EACH ROW
BEGIN
    -- If the new address is set as default
    IF NEW.IS_DEFAULT = 1 THEN
        -- Set all other addresses for this user to non-default
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND ID != NEW.ID 
        AND IS_DEFAULT = 1;
    ELSE
        -- If no address is default for this user, make this one default
        IF (SELECT COUNT(*) FROM user_address WHERE USER_ID = NEW.USER_ID AND IS_DEFAULT = 1) = 0 THEN
            UPDATE user_address 
            SET IS_DEFAULT = 1 
            WHERE ID = NEW.ID;
        END IF;
    END IF;
END//

-- Trigger for UPDATE operations
DROP TRIGGER IF EXISTS ensure_single_default_update//
CREATE TRIGGER ensure_single_default_update
    AFTER UPDATE ON user_address
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
    ELSIF NEW.IS_DEFAULT = 0 AND OLD.IS_DEFAULT = 1 THEN
        -- If this was the default and is being unset, set another as default
        IF (SELECT COUNT(*) FROM user_address WHERE USER_ID = NEW.USER_ID AND IS_DEFAULT = 1) = 0 THEN
            UPDATE user_address 
            SET IS_DEFAULT = 1 
            WHERE USER_ID = NEW.USER_ID 
            AND ID != NEW.ID 
            ORDER BY ID ASC 
            LIMIT 1;
        END IF;
    END IF;
END//

-- Trigger for DELETE operations
DROP TRIGGER IF EXISTS ensure_default_after_delete//
CREATE TRIGGER ensure_default_after_delete
    AFTER DELETE ON user_address
    FOR EACH ROW
BEGIN
    -- If the deleted address was default, set another as default
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
