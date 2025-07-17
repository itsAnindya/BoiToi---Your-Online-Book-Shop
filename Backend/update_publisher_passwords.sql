-- Update publishers with password hashes
-- Password: 123456 (hashed with bcrypt, 10 rounds)
-- This matches the password used for regular users for consistency

UPDATE PUBLISHER 
SET PASSWORD_HASH = '$2b$10$hK3uTMT4qSjsJGxS0aGaYe2M9cclRJaPsyR6D90e5QHS8HwpEU6I6'
WHERE PASSWORD_HASH IS NULL OR PASSWORD_HASH = '';

-- Set STATUS to ACTIVE for all publishers (if not already set)
UPDATE PUBLISHER 
SET STATUS = 'ACTIVE'
WHERE STATUS IS NULL OR STATUS = '';

-- Show all publishers after update
SELECT ID, NAME, EMAIL, STATUS, 
       CASE 
         WHEN PASSWORD_HASH IS NOT NULL THEN 'YES' 
         ELSE 'NO' 
       END as HAS_PASSWORD
FROM PUBLISHER 
ORDER BY NAME;
