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

 Date: 09/05/2025 14:40:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity_log
-- ----------------------------
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `ACTION_TYPE` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ACTION_TIME` datetime NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_log
-- ----------------------------

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `USER_ID` int NOT NULL,
  PRIMARY KEY (`USER_ID`) USING BTREE,
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------

-- ----------------------------
-- Table structure for admin_permission
-- ----------------------------
DROP TABLE IF EXISTS `admin_permission`;
CREATE TABLE `admin_permission`  (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ADMIN_USER_ID` int NULL DEFAULT NULL,
  `PERMISSION_ID` int NULL DEFAULT NULL,
  `GRANTED_AT` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ADMIN_USER_ID`(`ADMIN_USER_ID` ASC) USING BTREE,
  INDEX `PERMISSION_ID`(`PERMISSION_ID` ASC) USING BTREE,
  CONSTRAINT `admin_permission_ibfk_1` FOREIGN KEY (`ADMIN_USER_ID`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `admin_permission_ibfk_2` FOREIGN KEY (`PERMISSION_ID`) REFERENCES `permission` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_permission
-- ----------------------------

-- ----------------------------
-- Table structure for author
-- ----------------------------
DROP TABLE IF EXISTS `author`;
CREATE TABLE `author`  (
  `ID` int NOT NULL,
  `FIRST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `LAST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BIO` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `DATE_OF_BIRTH` date NULL DEFAULT NULL,
  `NATIONALITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WEBSITE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHOTO_URL` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of author
-- ----------------------------

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `ID` int NOT NULL,
  `TITLE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ISBN` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PUBLISHED_DATE` date NULL DEFAULT NULL,
  `PUBLISHER_ID` int NULL DEFAULT NULL,
  `PRICE` decimal(10, 0) NULL DEFAULT NULL,
  `STOCK_QUANTITY` int NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `COVER_URL` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PUBLISHER_ID`(`PUBLISHER_ID` ASC) USING BTREE,
  INDEX `idx_book_title`(`TITLE` ASC) USING BTREE,
  INDEX `idx_book_isbn`(`ISBN` ASC) USING BTREE,
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `publisher` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book
-- ----------------------------

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_author
-- ----------------------------

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_category
-- ----------------------------

-- ----------------------------
-- Table structure for book_edition
-- ----------------------------
DROP TABLE IF EXISTS `book_edition`;
CREATE TABLE `book_edition`  (
  `ID` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `FORMAT_ID` int NULL DEFAULT NULL,
  `ISBN` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PRICE` decimal(10, 0) NULL DEFAULT NULL,
  `STOCK_QUANTITY` int NULL DEFAULT NULL,
  `IS_EBOOK` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  INDEX `FORMAT_ID`(`FORMAT_ID` ASC) USING BTREE,
  CONSTRAINT `book_edition_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `book_edition_ibfk_2` FOREIGN KEY (`FORMAT_ID`) REFERENCES `book_format` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_edition
-- ----------------------------

-- ----------------------------
-- Table structure for book_format
-- ----------------------------
DROP TABLE IF EXISTS `book_format`;
CREATE TABLE `book_format`  (
  `ID` int NOT NULL,
  `FORMAT_TYPE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_format
-- ----------------------------

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `QUANTITY` int NULL DEFAULT NULL,
  `ADDED_DATE` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `ID` int NOT NULL,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `PARENT_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PARENT_ID`(`PARENT_ID` ASC) USING BTREE,
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`PARENT_ID`) REFERENCES `category` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------

-- ----------------------------
-- Table structure for discount
-- ----------------------------
DROP TABLE IF EXISTS `discount`;
CREATE TABLE `discount`  (
  `ID` int NOT NULL,
  `CODE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `DISCOUNT_TYPE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `VALUE` decimal(10, 0) NULL DEFAULT NULL,
  `START_DATE` date NULL DEFAULT NULL,
  `END_DATE` date NULL DEFAULT NULL,
  `MAX_USAGE` int NULL DEFAULT NULL,
  `TIMES_USED` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of discount
-- ----------------------------

-- ----------------------------
-- Table structure for ebook_file
-- ----------------------------
DROP TABLE IF EXISTS `ebook_file`;
CREATE TABLE `ebook_file`  (
  `ID` int NOT NULL,
  `BOOK_EDITION_ID` int NULL DEFAULT NULL,
  `FILE_URL` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FILE_TYPE` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FILE_SIZE_MB` decimal(6, 2) NULL DEFAULT NULL,
  `DRM_ENABLED` tinyint(1) NULL DEFAULT NULL,
  `UPLOADED_AT` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `BOOK_EDITION_ID`(`BOOK_EDITION_ID` ASC) USING BTREE,
  CONSTRAINT `ebook_file_ibfk_1` FOREIGN KEY (`BOOK_EDITION_ID`) REFERENCES `book_edition` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ebook_file
-- ----------------------------

-- ----------------------------
-- Table structure for inventory_log
-- ----------------------------
DROP TABLE IF EXISTS `inventory_log`;
CREATE TABLE `inventory_log`  (
  `ID` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `CHANGE_TYPE` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QUANTITY_CHANGED` int NULL DEFAULT NULL,
  `CHANGE_DATE` datetime NULL DEFAULT NULL,
  `COMMENT` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `inventory_log_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of inventory_log
-- ----------------------------

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `ORDER_DATE` datetime NULL DEFAULT NULL,
  `SHIPPING_ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ORDER_STATUS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TOTAL_AMOUNT` decimal(10, 0) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_order_user_id`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order
-- ----------------------------

-- ----------------------------
-- Table structure for order_book
-- ----------------------------
DROP TABLE IF EXISTS `order_book`;
CREATE TABLE `order_book`  (
  `ORDER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `QUANTITY` int NULL DEFAULT NULL,
  `PRICE` decimal(10, 0) NULL DEFAULT NULL,
  PRIMARY KEY (`ORDER_ID`, `BOOK_ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `order_book_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_book_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_book
-- ----------------------------

-- ----------------------------
-- Table structure for order_discount
-- ----------------------------
DROP TABLE IF EXISTS `order_discount`;
CREATE TABLE `order_discount`  (
  `ID` int NOT NULL,
  `ORDER_ID` int NULL DEFAULT NULL,
  `DISCOUNT_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  INDEX `DISCOUNT_ID`(`DISCOUNT_ID` ASC) USING BTREE,
  CONSTRAINT `order_discount_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_discount_ibfk_2` FOREIGN KEY (`DISCOUNT_ID`) REFERENCES `discount` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_discount
-- ----------------------------

-- ----------------------------
-- Table structure for page_view
-- ----------------------------
DROP TABLE IF EXISTS `page_view`;
CREATE TABLE `page_view`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `PAGE_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `VIEW_DATE` datetime NULL DEFAULT NULL,
  `DEVICE_TYPE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SESSION_ID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `page_view_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of page_view
-- ----------------------------

-- ----------------------------
-- Table structure for payment
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment`  (
  `ID` int NOT NULL,
  `ORDER_ID` int NULL DEFAULT NULL,
  `PAYMENT_DATE` datetime NULL DEFAULT NULL,
  `PAYMENT_METHOD` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `AMOUNT` decimal(10, 0) NULL DEFAULT NULL,
  `PAYMENT_STATUS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TRANSACTION_ID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payment
-- ----------------------------

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `ID` int NOT NULL,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `DESCRIPTION` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------

-- ----------------------------
-- Table structure for publisher
-- ----------------------------
DROP TABLE IF EXISTS `publisher`;
CREATE TABLE `publisher`  (
  `ID` int NOT NULL,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `CITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `COUNTRY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `EMAIL` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WEBSITE` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of publisher
-- ----------------------------

-- ----------------------------
-- Table structure for return_request
-- ----------------------------
DROP TABLE IF EXISTS `return_request`;
CREATE TABLE `return_request`  (
  `ID` int NOT NULL,
  `ORDER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `REQUEST_DATE` datetime NULL DEFAULT NULL,
  `STATUS` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `REASON` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `return_request_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `return_request_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `return_request_ibfk_3` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of return_request
-- ----------------------------

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `RATING` int NULL DEFAULT NULL,
  `COMMENT` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `REVIEW_DATE` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_review_user_id`(`USER_ID` ASC) USING BTREE,
  INDEX `idx_review_book_id`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review
-- ----------------------------

-- ----------------------------
-- Table structure for search_log
-- ----------------------------
DROP TABLE IF EXISTS `search_log`;
CREATE TABLE `search_log`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `SEARCH_QUERY` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `SEARCH_DATE` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `search_log_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of search_log
-- ----------------------------

-- ----------------------------
-- Table structure for shipping
-- ----------------------------
DROP TABLE IF EXISTS `shipping`;
CREATE TABLE `shipping`  (
  `ID` int NOT NULL,
  `ORDER_ID` int NULL DEFAULT NULL,
  `SHIPPING_DATE` datetime NULL DEFAULT NULL,
  `ESTIMATED_DELIVERY` date NULL DEFAULT NULL,
  `SHIPPING_STATUS` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TRACKING_NUMBER` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shipping
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `ID` int NOT NULL,
  `USERNAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `EMAIL` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PASSWORD_HASH` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `FIRST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `LAST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IS_SIGNED_IN` tinyint(1) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `ROLE` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CREATED_AT` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_user_email`(`EMAIL` ASC) USING BTREE,
  INDEX `idx_user_username`(`USERNAME` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (0, 'admin', 'admin@boitoi.com', '$2b$10$j61erVrRpSqUcA.mUs9HiuLORo.WtKi8TWZ/entx7f8dgzXaYxzam', 'Anindya', 'Biswas', '01821646373', NULL, 'Superadmin', NULL);

-- ----------------------------
-- Table structure for user_address
-- ----------------------------
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `ADDRESS_TYPE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `CITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `COUNTRY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ZIP_CODE` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `IS_DEFAULT` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_address
-- ----------------------------

-- ----------------------------
-- Table structure for user_ebook_access
-- ----------------------------
DROP TABLE IF EXISTS `user_ebook_access`;
CREATE TABLE `user_ebook_access`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_EDITION_ID` int NULL DEFAULT NULL,
  `PURCHASE_DATE` datetime NULL DEFAULT NULL,
  `EXPIRY_DATE` datetime NULL DEFAULT NULL,
  `ACCESS_COUNT` int NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_EDITION_ID`(`BOOK_EDITION_ID` ASC) USING BTREE,
  CONSTRAINT `user_ebook_access_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_ebook_access_ibfk_2` FOREIGN KEY (`BOOK_EDITION_ID`) REFERENCES `book_edition` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_ebook_access
-- ----------------------------

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `ADDED_DATE` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wishlist
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
