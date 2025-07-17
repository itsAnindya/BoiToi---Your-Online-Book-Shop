-- Add test publisher with password hash for testing
-- Password: "testpass123"
-- Hash generated with bcrypt rounds=10

INSERT INTO PUBLISHER (
    ID, 
    NAME, 
    EMAIL, 
    PASSWORD_HASH, 
    STATUS, 
    CREATED_AT
) VALUES (
    1000, 
    'Test Publisher', 
    'test@publisher.com', 
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWcBg/6aIDqC/4jdLDyGg5WLKDsVtu', -- password: testpass123
    'ACTIVE',
    NOW()
);

-- Add another test publisher for comprehensive testing
INSERT INTO PUBLISHER (
    ID, 
    NAME, 
    EMAIL, 
    PASSWORD_HASH, 
    STATUS, 
    CREATED_AT
) VALUES (
    1001, 
    'Demo Publisher', 
    'demo@publisher.com', 
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWcBg/6aIDqC/4jdLDyGg5WLKDsVtu', -- password: testpass123
    'ACTIVE',
    NOW()
);

-- Note: To log in as a publisher, use:
-- Username: "Test Publisher" (the NAME field)
-- Password: "testpass123"
-- 
-- OR
-- 
-- Username: "Demo Publisher" (the NAME field)  
-- Password: "testpass123"
