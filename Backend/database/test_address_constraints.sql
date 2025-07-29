-- Test Address Default Constraint System
-- This script tests the enhanced address management system

-- Test 1: Insert multiple addresses for the same user
INSERT INTO user_address (USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT) 
VALUES 
(6, 'home', 'Test Address 1', 'Dhaka', 'Dhaka', 'Bangladesh', '1000', 1),
(6, 'office', 'Test Address 2', 'Dhaka', 'Dhaka', 'Bangladesh', '1000', 1);

-- Verify only one default exists for user 6
SELECT USER_ID, ID, ADDRESS_TYPE, IS_DEFAULT, ADDRESS 
FROM user_address 
WHERE USER_ID = 6 
ORDER BY ID;

-- Test 2: Update an address to set it as default
UPDATE user_address 
SET IS_DEFAULT = 1 
WHERE USER_ID = 6 AND ADDRESS_TYPE = 'office';

-- Verify only the office address is now default
SELECT USER_ID, ID, ADDRESS_TYPE, IS_DEFAULT, ADDRESS 
FROM user_address 
WHERE USER_ID = 6 
ORDER BY ID;

-- Test 3: Try to unset all defaults (should auto-set one as default)
UPDATE user_address 
SET IS_DEFAULT = 0 
WHERE USER_ID = 6;

-- Verify that one address was automatically set as default
SELECT USER_ID, ID, ADDRESS_TYPE, IS_DEFAULT, ADDRESS 
FROM user_address 
WHERE USER_ID = 6 
ORDER BY ID;

-- Test 4: Test stored procedure
CALL SetDefaultAddress(6, (SELECT ID FROM user_address WHERE USER_ID = 6 AND ADDRESS_TYPE = 'home' LIMIT 1));

-- Verify the home address is now default
SELECT USER_ID, ID, ADDRESS_TYPE, IS_DEFAULT, ADDRESS 
FROM user_address 
WHERE USER_ID = 6 
ORDER BY ID;

-- Final verification: Check all users have exactly one default
SELECT 
    USER_ID,
    COUNT(*) as total_addresses,
    SUM(IS_DEFAULT) as default_addresses,
    CASE 
        WHEN SUM(IS_DEFAULT) = 1 THEN 'CORRECT' 
        ELSE 'ERROR' 
    END as status
FROM user_address
GROUP BY USER_ID
ORDER BY USER_ID;

-- Clean up test data
DELETE FROM user_address WHERE USER_ID = 6 AND ADDRESS LIKE 'Test Address%';
