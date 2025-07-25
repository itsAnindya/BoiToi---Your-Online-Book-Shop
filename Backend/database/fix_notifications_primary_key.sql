-- FIX NOTIFICATIONS TABLE PRIMARY KEY ISSUE
-- The current schema has PRIMARY KEY (`ID` DESC) which is incorrect
-- This script fixes it to use proper ASC ordering

USE boitoi_db;

-- Drop and recreate the notifications table with correct primary key
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `MESSAGE` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `TYPE` enum('ORDER','PAYMENT','PROMOTION','SYSTEM','DELIVERY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IS_READ` tinyint(1) NULL DEFAULT 0,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `notification_recipient`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `notification_recipient` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- Note: This will remove any existing notifications. 
-- If you want to preserve data, use ALTER TABLE instead:
-- ALTER TABLE `notifications` DROP PRIMARY KEY, ADD PRIMARY KEY (`ID` ASC);
