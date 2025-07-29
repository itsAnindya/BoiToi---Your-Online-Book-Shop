-- Address Default Constraint Script (SIMPLE & WORKING VERSION)
-- Ensures only one default address per user at the database level

-- ============================================================================
-- CLEANUP EXISTING DATA
-- ============================================================================

-- Step 1: Fix users with no default address
UPDATE user_address 
SET IS_DEFAULT = 1 
WHERE ID IN (
    SELECT * FROM (
        SELECT MIN(ua.ID) 
        FROM user_address ua
        WHERE ua.USER_ID NOT IN (
            SELECT DISTINCT USER_ID 
            FROM user_address 
            WHERE IS_DEFAULT = 1
        )
        GROUP BY ua.USER_ID
    ) AS temp
);

-- Step 2: Fix users with multiple defaults (keep the first one)
CREATE TEMPORARY TABLE temp_multiple_defaults AS
SELECT USER_ID, MIN(ID) as keep_id
FROM user_address 
WHERE IS_DEFAULT = 1
GROUP BY USER_ID
HAVING COUNT(*) > 1;

UPDATE user_address 
SET IS_DEFAULT = 0 
WHERE IS_DEFAULT = 1 
AND USER_ID IN (SELECT USER_ID FROM temp_multiple_defaults)
AND ID NOT IN (SELECT keep_id FROM temp_multiple_defaults);

DROP TEMPORARY TABLE temp_multiple_defaults;

-- ============================================================================
-- STORED PROCEDURE: Set Default Address
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
-- SIMPLE & WORKING TRIGGERS
-- ============================================================================

DELIMITER //

-- Trigger for INSERT operations
DROP TRIGGER IF EXISTS ensure_single_default_insert//
CREATE TRIGGER ensure_single_default_insert
    AFTER INSERT ON user_address
    FOR EACH ROW
BEGIN
    DECLARE user_default_count INT DEFAULT 0;
    
    -- Count defaults for this user
    SELECT COUNT(*) INTO user_default_count
    FROM user_address 
    WHERE USER_ID = NEW.USER_ID AND IS_DEFAULT = 1;
    
    -- If new address is set as default, unset others
    IF NEW.IS_DEFAULT = 1 AND user_default_count > 1 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND ID != NEW.ID 
        AND IS_DEFAULT = 1;
    END IF;
    
    -- If no default exists, make this one default
    IF user_default_count = 0 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 1 
        WHERE ID = NEW.ID;
    END IF;
END//

-- Trigger for UPDATE operations
DROP TRIGGER IF EXISTS ensure_single_default_update//
CREATE TRIGGER ensure_single_default_update
    AFTER UPDATE ON user_address
    FOR EACH ROW
BEGIN
    DECLARE user_default_count INT DEFAULT 0;
    
    -- Count defaults for this user
    SELECT COUNT(*) INTO user_default_count
    FROM user_address 
    WHERE USER_ID = NEW.USER_ID AND IS_DEFAULT = 1;
    
    -- If this address was set as default, unset others
    IF NEW.IS_DEFAULT = 1 AND OLD.IS_DEFAULT = 0 AND user_default_count > 1 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND ID != NEW.ID 
        AND IS_DEFAULT = 1;
    END IF;
    
    -- If no default exists, make the first address default
    IF user_default_count = 0 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 1 
        WHERE USER_ID = NEW.USER_ID 
        ORDER BY ID ASC 
        LIMIT 1;
    END IF;
END//

-- Trigger for DELETE operations
DROP TRIGGER IF EXISTS ensure_default_after_delete//
CREATE TRIGGER ensure_default_after_delete
    AFTER DELETE ON user_address
    FOR EACH ROW
BEGIN
    DECLARE user_default_count INT DEFAULT 0;
    
    -- Count defaults for this user after deletion
    SELECT COUNT(*) INTO user_default_count
    FROM user_address 
    WHERE USER_ID = OLD.USER_ID AND IS_DEFAULT = 1;
    
    -- If no default exists and user still has addresses, set one as default
    IF user_default_count = 0 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 1 
        WHERE USER_ID = OLD.USER_ID 
        ORDER BY ID ASC 
        LIMIT 1;
    END IF;
END//

DELIMITER ;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that every user has exactly one default address
SELECT 
    USER_ID,
    COUNT(*) as total_addresses,
    SUM(IS_DEFAULT) as default_addresses,
    CASE 
        WHEN SUM(IS_DEFAULT) = 1 THEN 'OK' 
        ELSE 'ERROR' 
    END as status
FROM user_address
GROUP BY USER_ID
ORDER BY USER_ID;
