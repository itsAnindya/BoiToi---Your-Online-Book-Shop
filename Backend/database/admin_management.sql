-- Admin Management Triggers and Procedures for BoiToi Database
-- This file contains PL/SQL triggers and procedures for admin management

-- ==============================================================================
-- Admin Audit Log Table
-- ==============================================================================
-- First, create a table to log admin privilege changes
CREATE TABLE IF NOT EXISTS admin_audit_log (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID INT NOT NULL,
    ACTION ENUM('GRANTED', 'REVOKED') NOT NULL,
    GRANTED_BY INT,
    TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP,
    NOTES TEXT,
    FOREIGN KEY (USER_ID) REFERENCES user(ID),
    FOREIGN KEY (GRANTED_BY) REFERENCES user(ID)
);

-- ==============================================================================
-- Trigger: Log Admin Privilege Grant
-- ==============================================================================
-- Note: MySQL doesn't support full PL/SQL syntax, but we can create triggers
-- This trigger logs when admin privileges are granted

DELIMITER $$

CREATE TRIGGER admin_privilege_granted
    AFTER INSERT ON admin
    FOR EACH ROW
BEGIN
    INSERT INTO admin_audit_log (USER_ID, ACTION, NOTES)
    VALUES (NEW.USER_ID, 'GRANTED', CONCAT('Admin privileges granted to user ID: ', NEW.USER_ID));
    
    -- Update user's last_active timestamp when they become admin
    UPDATE user 
    SET LAST_ACTIVE = NOW() 
    WHERE ID = NEW.USER_ID;
END$$

DELIMITER ;

-- ==============================================================================
-- Trigger: Log Admin Privilege Revocation
-- ==============================================================================
-- This trigger logs when admin privileges are revoked

DELIMITER $$

CREATE TRIGGER admin_privilege_revoked
    AFTER DELETE ON admin
    FOR EACH ROW
BEGIN
    INSERT INTO admin_audit_log (USER_ID, ACTION, NOTES)
    VALUES (OLD.USER_ID, 'REVOKED', CONCAT('Admin privileges revoked from user ID: ', OLD.USER_ID));
END$$

DELIMITER ;

-- ==============================================================================
-- Stored Procedure: Grant Admin Privileges
-- ==============================================================================
-- Procedure to safely grant admin privileges with logging

DELIMITER $$

CREATE PROCEDURE GrantAdminPrivileges(
    IN target_user_id INT,
    IN granting_user_id INT,
    IN admin_notes TEXT
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE already_admin INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM user WHERE ID = target_user_id AND IS_ACTIVE = 1;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist or is inactive';
    END IF;
    
    -- Check if user is already admin
    SELECT COUNT(*) INTO already_admin FROM admin WHERE USER_ID = target_user_id;
    
    IF already_admin > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is already an administrator';
    END IF;
    
    -- Grant admin privileges
    INSERT INTO admin (USER_ID) VALUES (target_user_id);
    
    -- Log the action with details
    INSERT INTO admin_audit_log (USER_ID, ACTION, GRANTED_BY, NOTES)
    VALUES (target_user_id, 'GRANTED', granting_user_id, 
            COALESCE(admin_notes, CONCAT('Admin privileges granted by user ID: ', granting_user_id)));
    
    COMMIT;
    
    SELECT CONCAT('Admin privileges successfully granted to user ID: ', target_user_id) AS result;
END$$

DELIMITER ;

-- ==============================================================================
-- Stored Procedure: Revoke Admin Privileges
-- ==============================================================================
-- Procedure to safely revoke admin privileges with logging

DELIMITER $$

CREATE PROCEDURE RevokeAdminPrivileges(
    IN target_user_id INT,
    IN revoking_user_id INT,
    IN admin_notes TEXT
)
BEGIN
    DECLARE is_admin INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if user is admin
    SELECT COUNT(*) INTO is_admin FROM admin WHERE USER_ID = target_user_id;
    
    IF is_admin = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not an administrator';
    END IF;
    
    -- Prevent self-revocation (optional safety measure)
    IF target_user_id = revoking_user_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot revoke your own admin privileges';
    END IF;
    
    -- Log the action before deletion
    INSERT INTO admin_audit_log (USER_ID, ACTION, GRANTED_BY, NOTES)
    VALUES (target_user_id, 'REVOKED', revoking_user_id, 
            COALESCE(admin_notes, CONCAT('Admin privileges revoked by user ID: ', revoking_user_id)));
    
    -- Revoke admin privileges
    DELETE FROM admin WHERE USER_ID = target_user_id;
    
    COMMIT;
    
    SELECT CONCAT('Admin privileges successfully revoked from user ID: ', target_user_id) AS result;
END$$

DELIMITER ;

-- ==============================================================================
-- Function: Check Admin Status
-- ==============================================================================
-- Function to check if a user is an admin

DELIMITER $$

CREATE FUNCTION IsUserAdmin(user_id INT) 
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE admin_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO admin_count 
    FROM admin 
    WHERE USER_ID = user_id;
    
    RETURN admin_count > 0;
END$$

DELIMITER ;

-- ==============================================================================
-- View: Admin Users with Details
-- ==============================================================================
-- View to easily get admin user information

CREATE VIEW admin_users_view AS
SELECT 
    u.ID as user_id,
    u.USERNAME,
    u.EMAIL,
    u.FIRST_NAME,
    u.LAST_NAME,
    u.CREATED_AT as user_created,
    u.LAST_ACTIVE,
    u.IS_ACTIVE,
    'admin' as role
FROM user u
INNER JOIN admin a ON u.ID = a.USER_ID
WHERE u.IS_ACTIVE = 1
ORDER BY u.USERNAME;

-- ==============================================================================
-- Usage Examples
-- ==============================================================================

-- Example 1: Grant admin privileges
-- CALL GrantAdminPrivileges(123, 1, 'Promoted to admin for excellent performance');

-- Example 2: Revoke admin privileges  
-- CALL RevokeAdminPrivileges(123, 1, 'Admin role no longer needed');

-- Example 3: Check if user is admin
-- SELECT IsUserAdmin(123) as is_admin;

-- Example 4: View all admins
-- SELECT * FROM admin_users_view;

-- Example 5: View admin audit log
-- SELECT * FROM admin_audit_log ORDER BY TIMESTAMP DESC LIMIT 10;

-- ==============================================================================
-- Cleanup Commands (use with caution)
-- ==============================================================================

-- To drop triggers:
-- DROP TRIGGER IF EXISTS admin_privilege_granted;
-- DROP TRIGGER IF EXISTS admin_privilege_revoked;

-- To drop procedures:
-- DROP PROCEDURE IF EXISTS GrantAdminPrivileges;
-- DROP PROCEDURE IF EXISTS RevokeAdminPrivileges;

-- To drop function:
-- DROP FUNCTION IF EXISTS IsUserAdmin;

-- To drop view:
-- DROP VIEW IF EXISTS admin_users_view;

-- To drop audit table:
-- DROP TABLE IF EXISTS admin_audit_log;
