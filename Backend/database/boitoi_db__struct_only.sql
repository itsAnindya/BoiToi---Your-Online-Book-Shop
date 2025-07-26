/*
 Navicat Premium Dump SQL

 Source Server         : BoiToi Database
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : boitoi_db

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 27/07/2025 02:26:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `USER_ID` int NOT NULL,
  PRIMARY KEY (`USER_ID`) USING BTREE,
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for admin_permission
-- ----------------------------
DROP TABLE IF EXISTS `admin_permission`;
CREATE TABLE `admin_permission`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ADMIN_USER_ID` int NULL DEFAULT NULL,
  `PERMISSION_ID` int NULL DEFAULT NULL,
  `GRANTED_AT` timestamp NULL DEFAULT (now()),
  `GRANTED_BY` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ADMIN_USER_ID`(`ADMIN_USER_ID` ASC) USING BTREE,
  INDEX `PERMISSION_ID`(`PERMISSION_ID` ASC) USING BTREE,
  INDEX `permitted_by`(`GRANTED_BY` ASC) USING BTREE,
  CONSTRAINT `admin_permission_ibfk_1` FOREIGN KEY (`ADMIN_USER_ID`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `admin_permission_ibfk_2` FOREIGN KEY (`PERMISSION_ID`) REFERENCES `permission` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `permitted_by` FOREIGN KEY (`GRANTED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for author
-- ----------------------------
DROP TABLE IF EXISTS `author`;
CREATE TABLE `author`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BIO` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `DATE_OF_BIRTH` date NULL DEFAULT NULL,
  `NATIONALITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WEBSITE` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHOTO_URL` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 477 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ISBN` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PUBLISHED_DATE` date NULL DEFAULT NULL,
  `PUBLISHER_ID` int NULL DEFAULT NULL,
  `PAGE_COUNT` int NULL DEFAULT NULL,
  `LANGUAGE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'English' COMMENT 'ISO 639-1 language code recommended',
  `EDITION` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '1st' COMMENT 'Edition description',
  `PRICE` decimal(12, 2) NULL DEFAULT NULL,
  `STOCK_QUANTITY` int NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `SHOW_BOOK` tinyint(1) NULL DEFAULT 1,
  `COVER_URL` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ADDED_AT` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `GENRE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CATEGORY_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `ISBN`(`ISBN` ASC) USING BTREE,
  INDEX `PUBLISHER_ID`(`PUBLISHER_ID` ASC) USING BTREE,
  INDEX `idx_book_title`(`TITLE` ASC) USING BTREE,
  INDEX `idx_book_isbn`(`ISBN` ASC) USING BTREE,
  INDEX `fk_book_category`(`CATEGORY_ID` ASC) USING BTREE,
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `publisher` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_book_category` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 433 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for book_author
-- ----------------------------
DROP TABLE IF EXISTS `book_author`;
CREATE TABLE `book_author`  (
  `BOOK_ID` int NOT NULL,
  `AUTHOR_ID` int NOT NULL,
  `CONTRIBUTION` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`BOOK_ID`, `AUTHOR_ID`) USING BTREE,
  INDEX `AUTHOR_ID`(`AUTHOR_ID` ASC) USING BTREE,
  CONSTRAINT `book_author_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `book_author_ibfk_2` FOREIGN KEY (`AUTHOR_ID`) REFERENCES `author` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for book_category
-- ----------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category`  (
  `BOOK_ID` int NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  PRIMARY KEY (`BOOK_ID`, `CATEGORY_ID`) USING BTREE,
  INDEX `CATEGORY_ID`(`CATEGORY_ID` ASC) USING BTREE,
  CONSTRAINT `book_category_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `book_category_ibfk_2` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `ID` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `QUANTITY` int NULL DEFAULT NULL,
  `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `PARENT_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PARENT_ID`(`PARENT_ID` ASC) USING BTREE,
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`PARENT_ID`) REFERENCES `category` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 264 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for category_bestseller
-- ----------------------------
DROP TABLE IF EXISTS `category_bestseller`;
CREATE TABLE `category_bestseller`  (
  `PERIOD_TYPE` enum('DAILY','WEEKLY','MONTHLY','YEARLY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'MONTHLY',
  `PERIOD_START` date NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `POSITION` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`PERIOD_TYPE`, `PERIOD_START`, `CATEGORY_ID`, `POSITION`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  INDEX `CATEGORY_ID`(`CATEGORY_ID` ASC) USING BTREE,
  CONSTRAINT `category_bestseller_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `category_bestseller_ibfk_2` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for discount
-- ----------------------------
DROP TABLE IF EXISTS `discount`;
CREATE TABLE `discount`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CODE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `DISCOUNT_TYPE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PERCENTAGE` decimal(3, 2) NULL DEFAULT NULL,
  `VALUE` decimal(12, 2) NULL DEFAULT NULL,
  `START_DATE` date NULL DEFAULT NULL,
  `END_DATE` date NULL DEFAULT NULL,
  `MAX_USAGE` int NULL DEFAULT NULL,
  `TIMES_USED` int NULL DEFAULT NULL,
  `ADDED_AT` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `ADDED_BY` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `DISCOUNT_ADMIN`(`ADDED_BY` ASC) USING BTREE,
  CONSTRAINT `DISCOUNT_ADMIN` FOREIGN KEY (`ADDED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for favourite
-- ----------------------------
DROP TABLE IF EXISTS `favourite`;
CREATE TABLE `favourite`  (
  `USER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`, `BOOK_ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `favourite_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `favourite_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for inventory_log
-- ----------------------------
DROP TABLE IF EXISTS `inventory_log`;
CREATE TABLE `inventory_log`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `BOOK_ID` int NULL DEFAULT NULL,
  `CHANGE_TYPE` enum('ADDED','REMOVED','RETURNED','DAMAGED','ADJUSTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QUANTITY_CHANGED` int NULL DEFAULT NULL,
  `CHANGED_AT` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `COMMENT` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `inventory_log_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `MESSAGE` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `TYPE` enum('ORDER','PAYMENT','PROMOTION','SYSTEM','DELIVERY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IS_READ` tinyint(1) NULL DEFAULT 0,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `URL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `notification_recipient`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `notification_recipient` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 214 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `ORDERD_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `SHIPPING_ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ORDER_STATUS` enum('pending','confirmed','processing','shipped','delivered','cancelled','returned','refunded','on_hold') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SHIPPING_FEE` decimal(12, 2) NULL DEFAULT 40.00,
  `TOTAL_AMOUNT` decimal(12, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_order_user_id`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1005 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for order_book
-- ----------------------------
DROP TABLE IF EXISTS `order_book`;
CREATE TABLE `order_book`  (
  `ORDER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `QUANTITY` int NULL DEFAULT NULL,
  PRIMARY KEY (`ORDER_ID`, `BOOK_ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `order_book_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_book_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for order_discount
-- ----------------------------
DROP TABLE IF EXISTS `order_discount`;
CREATE TABLE `order_discount`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ORDER_ID` int NULL DEFAULT NULL,
  `DISCOUNT_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  INDEX `DISCOUNT_ID`(`DISCOUNT_ID` ASC) USING BTREE,
  CONSTRAINT `order_discount_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_discount_ibfk_2` FOREIGN KEY (`DISCOUNT_ID`) REFERENCES `discount` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for payment
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ORDER_ID` int NULL DEFAULT NULL,
  `PAYMENT_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `PAYMENT_METHOD` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `AMOUNT` decimal(12, 0) NULL DEFAULT NULL,
  `PAYMENT_STATUS` enum('unpaid','pending','processing','paid','refunded','partially_refunded','failed','cancelled','chargeback') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unpaid',
  `TRANSACTION_ID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for publisher
-- ----------------------------
DROP TABLE IF EXISTS `publisher`;
CREATE TABLE `publisher`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `CITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `COUNTRY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `EMAIL` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WEBSITE` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PASSWORD_HASH` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `STATUS` enum('ACTIVE','INACTIVE','BANNED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1002 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for publisher_book_draft
-- ----------------------------
DROP TABLE IF EXISTS `publisher_book_draft`;
CREATE TABLE `publisher_book_draft`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ISBN` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PAGE_COUNT` int NULL DEFAULT NULL,
  `LANGUAGE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'English' COMMENT 'ISO 639-1 language code recommended',
  `EDITION` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '1st' COMMENT 'Edition description',
  `PRICE` decimal(12, 2) NULL DEFAULT NULL,
  `STOCK_QUANTITY` int NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `COVER_URL` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `GENRE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `AUTHORS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `CATEGORY_ID` int NULL DEFAULT NULL,
  `REQUEST_ID` int NULL DEFAULT NULL,
  `PUBLISHED_DATE` date NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_book_title`(`TITLE` ASC) USING BTREE,
  INDEX `idx_book_isbn`(`ISBN` ASC) USING BTREE,
  INDEX `REQUEST_ID`(`REQUEST_ID` ASC) USING BTREE,
  INDEX `fk_publisher_book_draft_category`(`CATEGORY_ID` ASC) USING BTREE,
  CONSTRAINT `fk_publisher_book_draft_category` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `publisher_book_draft_ibfk_1` FOREIGN KEY (`REQUEST_ID`) REFERENCES `publisher_request` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2016 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for publisher_request
-- ----------------------------
DROP TABLE IF EXISTS `publisher_request`;
CREATE TABLE `publisher_request`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `PUBLISHER_ID` int NULL DEFAULT NULL,
  `REQUEST_TYPE` enum('ADD_BOOK','UPDATE_BOOK','REMOVE_BOOK') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATUS` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING',
  `SUBMITTED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `REVIEWED_AT` timestamp NULL DEFAULT NULL,
  `REVIEWED_BY` int NULL DEFAULT NULL,
  `NOTES` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ADMIN_FEEDBACK` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PUBLISHER_ID`(`PUBLISHER_ID` ASC) USING BTREE,
  INDEX `REVIEWED_BY`(`REVIEWED_BY` ASC) USING BTREE,
  CONSTRAINT `publisher_request_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `publisher` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `publisher_request_ibfk_2` FOREIGN KEY (`REVIEWED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2014 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for return_request
-- ----------------------------
DROP TABLE IF EXISTS `return_request`;
CREATE TABLE `return_request`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ORDER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `REQUEST_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `STATUS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `REASON` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `return_request_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `return_request_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `return_request_ibfk_3` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `RATING` int NULL DEFAULT NULL,
  `COMMENT` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `POSTED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IS_VERIFIED_PURCHASER` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_review_user_id`(`USER_ID` ASC) USING BTREE,
  INDEX `idx_review_book_id`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for review_reaction
-- ----------------------------
DROP TABLE IF EXISTS `review_reaction`;
CREATE TABLE `review_reaction`  (
  `REVIEW_ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `REACTION_TYPE` enum('like','dislike') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`REVIEW_ID`, `USER_ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `review_reaction_ibfk_1` FOREIGN KEY (`REVIEW_ID`) REFERENCES `review` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `review_reaction_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for search_log
-- ----------------------------
DROP TABLE IF EXISTS `search_log`;
CREATE TABLE `search_log`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `SEARCH_QUERY` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `SEARCH_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `search_log_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for shipping
-- ----------------------------
DROP TABLE IF EXISTS `shipping`;
CREATE TABLE `shipping`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ORDER_ID` int NULL DEFAULT NULL,
  `SHIPPING_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `ESTIMATED_DELIVERY` date NULL DEFAULT NULL,
  `SHIPPING_STATUS` enum('label_created','not_shipped','in_transit','out_for_delivery','shipped','delivered','returned','failed_delivery','cancelled','lost','damaged') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TRACKING_NUMBER` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `EMAIL` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PASSWORD_HASH` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FIRST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `LAST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CREATED_AT` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `LAST_ACTIVE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `IS_ACTIVE` tinyint(1) NULL DEFAULT 0,
  `GENDER` enum('UNSPECIFIED','MALE','FEMALE','NON-BINARY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNSPECIFIED',
  `BIRTHDAY` date NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `USERNAME`(`USERNAME` ASC) USING BTREE,
  UNIQUE INDEX `EMAIL`(`EMAIL` ASC) USING BTREE,
  INDEX `idx_user_email`(`EMAIL` ASC) USING BTREE,
  INDEX `idx_user_username`(`USERNAME` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1002 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user_address
-- ----------------------------
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `ADDRESS_TYPE` enum('home','office') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'home',
  `ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `CITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `COUNTRY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ZIP_CODE` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IS_DEFAULT` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `ADDED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Procedure structure for ApproveBookRequest
-- ----------------------------
DROP PROCEDURE IF EXISTS `ApproveBookRequest`;
delimiter ;;
CREATE PROCEDURE `ApproveBookRequest`(IN request_id INT,
    IN admin_id INT,
    IN admin_feedback_text TEXT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT)
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT NULL;
    DECLARE book_isbn VARCHAR(50) DEFAULT NULL;
    DECLARE book_pages INT DEFAULT NULL;
    DECLARE book_language VARCHAR(20) DEFAULT 'English';
    DECLARE book_edition VARCHAR(20) DEFAULT '1st';
    DECLARE book_price DECIMAL(12,2) DEFAULT 0.00;
    DECLARE book_stock INT DEFAULT 0;
    DECLARE book_description TEXT DEFAULT '';
    DECLARE book_cover_url VARCHAR(300) DEFAULT '/images/books/defaultbook.jpg';
    DECLARE book_genre VARCHAR(255) DEFAULT 'General';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'SQL Error occurred while processing request';
        SET new_book_id = 0;
    END;
    
    SET result_message = '';
    SET new_book_id = 0;
    
    START TRANSACTION;
    
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request already processed with status: ', request_status);
            ROLLBACK;
        ELSE
            SELECT pr.PUBLISHER_ID INTO publisher_id
            FROM PUBLISHER_REQUEST pr
            WHERE pr.ID = request_id;
            
            
            SELECT 
                COALESCE(TITLE, 'Untitled') as title,
                COALESCE(ISBN, '') as isbn,
                COALESCE(PAGE_COUNT, 0) as pages,
                COALESCE(LANGUAGE, 'English') as lang,
                COALESCE(EDITION, '1st') as ed,
                COALESCE(PRICE, 0.00) as pr,
                COALESCE(STOCK_QUANTITY, 0) as stock,
                COALESCE(DESCRIPTION, '') as desc_text,
                COALESCE(COVER_URL, '/images/books/defaultbook.jpg') as cover,
                COALESCE(GENRE, 'General') as genre_text
            INTO 
                book_title, book_isbn, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, CURDATE(), publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            
            SET new_book_id = LAST_INSERT_ID();
            
            
            CALL ProcessBookAuthors(new_book_id, (
                SELECT AUTHORS FROM PUBLISHER_BOOK_DRAFT WHERE REQUEST_ID = request_id
            ));
            
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                admin_feedback = admin_feedback_text
            WHERE ID = request_id;
            
            SET result_message = CONCAT('Book approved successfully with ID: ', new_book_id);
        END IF;
    END IF;
    
    IF exit_handler = FALSE THEN
        COMMIT;
    END IF;
    
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for ApproveBookRequestSimple
-- ----------------------------
DROP PROCEDURE IF EXISTS `ApproveBookRequestSimple`;
delimiter ;;
CREATE PROCEDURE `ApproveBookRequestSimple`(IN request_id INT,
    IN admin_id INT,
    IN admin_feedback_text TEXT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT)
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT NULL;
    DECLARE book_isbn VARCHAR(50) DEFAULT NULL;
    DECLARE book_pages INT DEFAULT NULL;
    DECLARE book_language VARCHAR(20) DEFAULT 'English';
    DECLARE book_edition VARCHAR(20) DEFAULT '1st';
    DECLARE book_price DECIMAL(12,2) DEFAULT 0.00;
    DECLARE book_stock INT DEFAULT 0;
    DECLARE book_description TEXT DEFAULT '';
    DECLARE book_cover_url VARCHAR(300) DEFAULT '/images/books/defaultbook.jpg';
    DECLARE book_genre VARCHAR(255) DEFAULT 'General';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    
    SET result_message = '';
    SET new_book_id = 0;
    
    START TRANSACTION;
    
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request already processed with status: ', request_status);
            ROLLBACK;
        ELSE
            SELECT pr.PUBLISHER_ID INTO publisher_id
            FROM PUBLISHER_REQUEST pr
            WHERE pr.ID = request_id;
            
            SELECT 
                COALESCE(TITLE, 'Untitled') as title,
                COALESCE(ISBN, '') as isbn,
                COALESCE(PAGE_COUNT, 0) as pages,
                COALESCE(LANGUAGE, 'English') as lang,
                COALESCE(EDITION, '1st') as ed,
                COALESCE(PRICE, 0.00) as pr,
                COALESCE(STOCK_QUANTITY, 0) as stock,
                COALESCE(DESCRIPTION, '') as desc_text,
                COALESCE(COVER_URL, '/images/books/defaultbook.jpg') as cover,
                COALESCE(GENRE, 'General') as genre_text
            INTO 
                book_title, book_isbn, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, CURDATE(), publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            
            SET new_book_id = LAST_INSERT_ID();
            
            
            
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                admin_feedback = admin_feedback_text
            WHERE ID = request_id;
            
            SET result_message = CONCAT('Book approved successfully with ID: ', new_book_id);
        END IF;
    END IF;
    
    COMMIT;
    
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for ProcessBookAuthors
-- ----------------------------
DROP PROCEDURE IF EXISTS `ProcessBookAuthors`;
delimiter ;;
CREATE PROCEDURE `ProcessBookAuthors`(IN book_id INT,
    IN authors_text TEXT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE author_name VARCHAR(255);
    DECLARE author_id INT;
    DECLARE authors_cursor CURSOR FOR 
        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(authors_text, ',', numbers.n), ',', -1)) as author
        FROM (
            SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
            UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers
        WHERE numbers.n <= 1 + (LENGTH(authors_text) - LENGTH(REPLACE(authors_text, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(authors_text, ',', numbers.n), ',', -1)) != '';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    IF authors_text IS NOT NULL AND TRIM(authors_text) != '' THEN
        OPEN authors_cursor;
        
        read_loop: LOOP
            FETCH authors_cursor INTO author_name;
            IF done THEN
                LEAVE read_loop;
            END IF;
            
            SET author_name = TRIM(author_name);
            
            IF author_name != '' THEN
                SELECT ID INTO author_id FROM author WHERE NAME = author_name LIMIT 1;
                
                IF author_id IS NULL THEN
                    -- Use AUTO_INCREMENT for new author ID
                    INSERT INTO author (NAME) VALUES (author_name);
                    SET author_id = LAST_INSERT_ID();
                END IF;
                
                INSERT IGNORE INTO book_author (BOOK_ID, AUTHOR_ID, CONTRIBUTION) 
                VALUES (book_id, author_id, 'Author');
            END IF;
        END LOOP;
        
        CLOSE authors_cursor;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for RejectBookRequest
-- ----------------------------
DROP PROCEDURE IF EXISTS `RejectBookRequest`;
delimiter ;;
CREATE PROCEDURE `RejectBookRequest`(IN request_id INT,
    IN admin_id INT,
    IN rejection_reason TEXT,
    OUT result_message VARCHAR(255))
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT '';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    DECLARE exit_handler BOOLEAN DEFAULT FALSE;
    
    
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET exit_handler = TRUE;
        ROLLBACK;
        SET result_message = 'SQL Error occurred while processing request';
    END;
    
    
    SET result_message = '';
    
    START TRANSACTION;
    
    
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request already processed with status: ', request_status);
            ROLLBACK;
        ELSE
            
            SELECT COALESCE(pbd.TITLE, 'Unknown Title') INTO book_title
            FROM PUBLISHER_REQUEST pr
            LEFT JOIN PUBLISHER_BOOK_DRAFT pbd ON pr.ID = pbd.REQUEST_ID
            WHERE pr.ID = request_id;
            
            
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'REJECTED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                ADMIN_FEEDBACK = rejection_reason,
                NOTES = CONCAT('Rejected: ', rejection_reason)
            WHERE ID = request_id;
            
            SET result_message = CONCAT('Book request for "', book_title, '" rejected successfully');
        END IF;
    END IF;
    
    IF exit_handler = FALSE THEN
        COMMIT;
    END IF;
    
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for TestApproveBookRequest
-- ----------------------------
DROP PROCEDURE IF EXISTS `TestApproveBookRequest`;
delimiter ;;
CREATE PROCEDURE `TestApproveBookRequest`(IN request_id INT,
    IN admin_id INT,
    IN admin_feedback_text TEXT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT)
BEGIN
    DECLARE publisher_id INT DEFAULT NULL;
    DECLARE book_title VARCHAR(255) DEFAULT NULL;
    DECLARE book_isbn VARCHAR(50) DEFAULT NULL;
    DECLARE book_published_date DATE DEFAULT NULL;
    DECLARE book_pages INT DEFAULT NULL;
    DECLARE book_language VARCHAR(20) DEFAULT 'English';
    DECLARE book_edition VARCHAR(20) DEFAULT '1st';
    DECLARE book_price DECIMAL(12,2) DEFAULT 0.00;
    DECLARE book_stock INT DEFAULT 0;
    DECLARE book_description TEXT DEFAULT '';
    DECLARE book_cover_url VARCHAR(300) DEFAULT '/images/books/defaultbook.jpg';
    DECLARE book_genre VARCHAR(255) DEFAULT 'General';
    DECLARE request_status VARCHAR(20) DEFAULT NULL;
    
    SET result_message = '';
    SET new_book_id = 0;
    
    START TRANSACTION;
    
    
    IF NOT EXISTS (SELECT 1 FROM ADMIN WHERE USER_ID = admin_id) THEN
        SET result_message = 'Admin not found';
        ROLLBACK;
    ELSE
        
        SELECT STATUS INTO request_status
        FROM PUBLISHER_REQUEST 
        WHERE ID = request_id;
        
        IF request_status IS NULL THEN
            SET result_message = 'Request not found';
            ROLLBACK;
        ELSEIF request_status != 'PENDING' THEN
            SET result_message = CONCAT('Request already processed with status: ', request_status);
            ROLLBACK;
        ELSE
            
            SELECT pr.PUBLISHER_ID INTO publisher_id
            FROM PUBLISHER_REQUEST pr
            WHERE pr.ID = request_id;
            
            
            SELECT 
                COALESCE(TITLE, 'Untitled') as title,
                COALESCE(ISBN, '') as isbn,
                COALESCE(PUBLISHED_DATE, CURDATE()) as pub_date,
                COALESCE(PAGE_COUNT, 0) as pages,
                COALESCE(LANGUAGE, 'English') as lang,
                COALESCE(EDITION, '1st') as ed,
                COALESCE(PRICE, 0.00) as pr,
                COALESCE(STOCK_QUANTITY, 0) as stock,
                COALESCE(DESCRIPTION, '') as desc_text,
                COALESCE(COVER_URL, '/images/books/defaultbook.jpg') as cover,
                COALESCE(GENRE, 'General') as genre_text
            INTO 
                book_title, book_isbn, book_published_date, book_pages, 
                book_language, book_edition, book_price, book_stock, 
                book_description, book_cover_url, book_genre
            FROM PUBLISHER_BOOK_DRAFT 
            WHERE REQUEST_ID = request_id;
            
            
            INSERT INTO BOOK (
                TITLE, ISBN, PUBLISHED_DATE, PUBLISHER_ID, PAGE_COUNT, 
                LANGUAGE, EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, 
                COVER_URL, GENRE, ADDED_AT, SHOW_BOOK
            ) VALUES (
                book_title, book_isbn, book_published_date, publisher_id, book_pages,
                book_language, book_edition, book_price, book_stock, book_description,
                book_cover_url, book_genre, NOW(), 1
            );
            
            SET new_book_id = LAST_INSERT_ID();
            
            
            UPDATE PUBLISHER_REQUEST 
            SET STATUS = 'APPROVED',
                REVIEWED_AT = NOW(),
                REVIEWED_BY = admin_id,
                admin_feedback = admin_feedback_text
            WHERE ID = request_id;
            
            SET result_message = CONCAT('Book approved successfully with ID: ', new_book_id);
        END IF;
    END IF;
    
    COMMIT;
    
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for TestApproveSimple
-- ----------------------------
DROP PROCEDURE IF EXISTS `TestApproveSimple`;
delimiter ;;
CREATE PROCEDURE `TestApproveSimple`(IN request_id INT,
    OUT result_message VARCHAR(255),
    OUT new_book_id INT)
BEGIN
    DECLARE publisher_id INT;
    DECLARE book_title VARCHAR(255);
    DECLARE book_price DECIMAL(12,2);
    DECLARE book_stock INT;
    
    SELECT pr.PUBLISHER_ID INTO publisher_id
    FROM PUBLISHER_REQUEST pr WHERE pr.ID = request_id;
    
    SELECT TITLE, PRICE, STOCK_QUANTITY
    INTO book_title, book_price, book_stock
    FROM PUBLISHER_BOOK_DRAFT WHERE REQUEST_ID = request_id;
    
    INSERT INTO BOOK (TITLE, PRICE, STOCK_QUANTITY, PUBLISHER_ID, ADDED_AT, SHOW_BOOK)
    VALUES (book_title, book_price, book_stock, publisher_id, NOW(), 1);
    
    SET new_book_id = LAST_INSERT_ID();
    SET result_message = CONCAT('Simple test: ', book_title, ', ID: ', new_book_id);
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table publisher_request
-- ----------------------------
DROP TRIGGER IF EXISTS `notify_admins_new_request`;
delimiter ;;
CREATE TRIGGER `notify_admins_new_request` AFTER INSERT ON `publisher_request` FOR EACH ROW BEGIN
    DECLARE publisher_name VARCHAR(255) DEFAULT 'Unknown Publisher';
    DECLARE book_title VARCHAR(255) DEFAULT '';
    
    SELECT COALESCE(NAME, 'Unknown Publisher') INTO publisher_name
    FROM publisher WHERE ID = NEW.PUBLISHER_ID;
    
    SELECT COALESCE(TITLE, '') INTO book_title
    FROM publisher_book_draft WHERE REQUEST_ID = NEW.ID LIMIT 1;
    
    INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
    SELECT 
        a.USER_ID,
        CONCAT('New book request from "', publisher_name, '" for "', book_title, '" (ID: ', NEW.ID, ')'),
        'SYSTEM',
        0,
        NOW()
    FROM admin a;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table publisher_request
-- ----------------------------
DROP TRIGGER IF EXISTS `notify_publisher_request_update`;
delimiter ;;
CREATE TRIGGER `notify_publisher_request_update` AFTER UPDATE ON `publisher_request` FOR EACH ROW BEGIN
    DECLARE publisher_name VARCHAR(255);
    DECLARE book_title VARCHAR(255);
    
    IF OLD.STATUS != NEW.STATUS AND NEW.STATUS IN ('APPROVED', 'REJECTED') THEN
        
        SELECT COALESCE(NAME, 'Publisher') INTO publisher_name
        FROM publisher WHERE ID = NEW.PUBLISHER_ID;
        
        SELECT COALESCE(TITLE, 'Book') INTO book_title
        FROM publisher_book_draft WHERE REQUEST_ID = NEW.ID LIMIT 1;
        
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        SELECT 
            a.USER_ID,
            CONCAT('[PUBLISHER: ', publisher_name, '] Book "', book_title, '" ', NEW.STATUS, 
                   CASE WHEN NEW.ADMIN_FEEDBACK IS NOT NULL 
                        THEN CONCAT(' - ', NEW.ADMIN_FEEDBACK) 
                        ELSE '' END),
            'SYSTEM',
            0,
            NOW()
        FROM admin a LIMIT 1;
        
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
