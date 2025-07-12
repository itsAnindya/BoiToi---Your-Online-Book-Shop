-- Cart table schema update for BoiToi database
-- This script modifies the cart table to use AUTO_INCREMENT for the ID field

-- First, drop the existing cart table if it exists
DROP TABLE IF EXISTS `cart`;

-- Recreate the cart table with AUTO_INCREMENT ID
CREATE TABLE `cart` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `QUANTITY` int NOT NULL DEFAULT 1,
  `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE KEY `unique_user_book` (`USER_ID`, `BOOK_ID`),
  INDEX `USER_ID` (`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID` (`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- Add some sample cart data for testing (optional)
-- INSERT INTO `cart` (`USER_ID`, `BOOK_ID`, `QUANTITY`) VALUES 
-- (1, 100, 2),
-- (1, 101, 1),
-- (2, 102, 3);

-- Note: The unique constraint on (USER_ID, BOOK_ID) ensures that each user can only have one entry per book
-- If they try to add the same book again, the quantity will be updated instead of creating a duplicate entry
