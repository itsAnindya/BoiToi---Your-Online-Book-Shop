/*
 Navicat Premium Dump SQL

 Source Server         : Protaya's Server
 Source Server Type    : MySQL
 Source Server Version : 90200 (9.2.0)
 Source Host           : 192.168.0.126:3306
 Source Schema         : boitoi_db

 Target Server Type    : MySQL
 Target Server Version : 90200 (9.2.0)
 File Encoding         : 65001

 Date: 05/07/2025 20:14:21
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
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (2);

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
  CONSTRAINT `admin_permission_ibfk_1` FOREIGN KEY (`ADMIN_USER_ID`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `admin_permission_ibfk_2` FOREIGN KEY (`PERMISSION_ID`) REFERENCES `permission` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `permitted_by` FOREIGN KEY (`GRANTED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_permission
-- ----------------------------

-- ----------------------------
-- Table structure for author
-- ----------------------------
DROP TABLE IF EXISTS `author`;
CREATE TABLE `author`  (
  `ID` int NOT NULL,
  `NAME` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `BIO` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `DATE_OF_BIRTH` date NULL DEFAULT NULL,
  `NATIONALITY` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `WEBSITE` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHOTO_URL` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of author
-- ----------------------------

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `ID` int NOT NULL,
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
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PUBLISHER_ID`(`PUBLISHER_ID` ASC) USING BTREE,
  INDEX `idx_book_title`(`TITLE` ASC) USING BTREE,
  INDEX `idx_book_isbn`(`ISBN` ASC) USING BTREE,
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `publisher` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES (100, 'দমফাটানো হাসির মীরাক্কেল জোকস্', '9789844322288', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (101, 'জাদরেল জনি', '9789849043737', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (102, 'পুরুষের যতো অসুখ', '9789849104759', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (103, 'মেদ কমাবেন কীভাবে', '9789849104773', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (104, 'সুস্বাস্থ্যের সাত-সতের', '9789844321700', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (105, 'আমাদের ', '9789844322516', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:59:24', 'Fiction');
INSERT INTO `book` VALUES (106, 'আমীরুলের কি ছড়া হয়', '9789844323247', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (107, 'বিশ্বভরা রূপকথা : রূপকথা সমগ্র ২', '9789844323506', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (108, 'ফেরা', '97898490299201', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000226.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (109, 'বহুব্রীহি', '9847016600272', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000227.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (110, 'ভয়', '97898490299225', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (111, 'ফিহা সমীকরণ', '9847016600623', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000229.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (112, '১৯৭১', '9848005080', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (113, 'অপেক্ষা', '9847016600173', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (114, 'হিমু মিসির আলি যুগলবন্দি', '9847016600791', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000232.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (115, 'কিছুক্ষণ', '98480051163', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000233.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (116, 'প্রিয়পদরেখা', '98470166319', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000234.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (117, 'বৃষ্টি ও বসন্তবিলাস', '9789849029900912', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10007117.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (118, 'প্রেমের গল্প', '9847016600272', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (119, 'বিজ্ঞান ও গণিত সমগ্র', '98470166814', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000563.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (120, 'ক্রসফায়ার এবং অন্যান্য', '9789849029960', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000575.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (121, 'একজন সাদাসিধে মা এবং অন্যান্য', '9789849029900091', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10003744.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (122, 'যখনি জাগিবে তুমি', '9789849029908', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10005502.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (123, 'তারুণ্যের এপিঠ-ওপিঠ', '9789849029908', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10007120.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (124, 'এডলফ হিটলার', '9847011600777', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (125, '২৬৭ দিনের মুক্তিযুদ্ধ', '9847011600760', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (126, 'কেন এলো জরুরি অবস্থা', '9847016600210', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (127, 'প্রথম বিশ্বযুদ্ধ', '98480051156', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (128, 'দ্বিতীয় বিশ্বযুদ্ধের ট্রাজেডি', '9847016600104', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (129, 'আজকের বিশ্ব রাজনীতি', '9848005536', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (130, 'মোগল সাম্রাজ্যের সোনালী অধ্যায়', '97898490229133', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (131, 'ইসলামের দিগ্বিজয়', '97898490299833', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (132, 'ক্যান্সারের সাথে বসবাস', '98480051147', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (133, 'শ্রেষ্ঠ কবিতা', '97898490299249', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (134, 'কৃষ্ণকান্তের উইল', '984701670410', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001952.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (135, 'গোয়েন্দা কাহিনি : আতঙ্কের দুর্গ', '9789849029900668', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (136, 'মানুষের মুখ (২) চেনা অচেনা মুখ', '9789849028192', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (137, 'আমরা সবাই রাজা', '9789849001867', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (138, 'বাবার প্রিয় মুখ ( মানুষের মুখ - ৫ )', '9789844322646', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (139, 'কাছের মানুষের মুখ ( মানুষের মুখ - ৬ )', '9789844322653', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (140, 'মানুষের মুখ সমগ্র ১', '9789844323308', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (141, 'অপ্সরার স্পর্শ', '9789844321045', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (142, 'গিগাবাইট দৈত্য', '9789844324145', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10008910.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (143, 'সহস্র গাণিতিক কুইজ', '9789844320284', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (144, 'বিজ্ঞানের স্মরণীয় নারীরা', '9789844320499', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (145, 'সায়েন্স ফিকশন ডোনা', '9789844323278', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (146, 'শ্রেষ্ঠ বড় গল্প', '9841800942', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000788.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (147, 'রক্তকরবী', '9841801019', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000785.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (148, 'গোরা', '9841803037', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/defaultbook.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (149, 'ঘরে বাইরে', '9841801316', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000641.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (150, 'চোখের বালি', '9841802872', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000638.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (151, 'জীবন স্মৃতি', '984180274X', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001327.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (152, 'রাশিয়ার চিঠি', '9841803836', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002732.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (153, 'ছিন্নপত্র', '9841803844', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002970.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (154, 'সঞ্চয়িতা', '9789849092087', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10003145.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (155, 'গল্পগুচ্ছ', '9789849092070', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10003564.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (156, 'গীতাঞ্জলি', '9847008401773', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001502.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (157, 'মানসী', '9847008403638', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000647.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (158, 'বলাকা', '9847008403621', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002490.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (159, 'সোনার তরী', '9847008403607', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002560.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (160, 'ক্ষণিকা', '9847008403614', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10006736.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (161, 'আধুনিক সাহিত্য', '9847035502748', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001285.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (162, 'সোনার তরী', '9847035502663', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002560.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (163, 'প্রাচীন সাহিত্য', '9845695054', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001296.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (164, 'সহজপাঠ (১ম ও ২য়)', '9845692013', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001297.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (165, 'সেরা ভৌতিক গল্প', '9845691404', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10001298.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (166, 'ছন্দ', '9848167226', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10000846.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (167, 'জীবনস্মৃতি', '9847034302532', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002996.jpg', '2025-06-25 11:45:00', 'Fiction');
INSERT INTO `book` VALUES (168, 'সোনার তরী', '9847034306941', '2025-01-01', NULL, 100, 'English', '1st', 200.00, 10, 'Good book.', 1, '/images/books/10002560.jpg', '2025-06-25 11:45:00', 'Fiction');

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `ADDED_AT` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------

-- ----------------------------
-- Table structure for category_bestseller
-- ----------------------------
DROP TABLE IF EXISTS `category_bestseller`;
CREATE TABLE `category_bestseller`  (
  `PERIOD_TYPE` enum('DAILY','WEEKLY','MONTHLY','YEARLY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'MONTHLY',
  `PERIOD_START` date NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `RANK` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`PERIOD_TYPE`, `PERIOD_START`, `CATEGORY_ID`, `RANK`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  INDEX `CATEGORY_ID`(`CATEGORY_ID` ASC) USING BTREE,
  CONSTRAINT `category_bestseller_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `category_bestseller_ibfk_2` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category_bestseller
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of discount
-- ----------------------------

-- ----------------------------
-- Table structure for favourite
-- ----------------------------
DROP TABLE IF EXISTS `favourite`;
CREATE TABLE `favourite`  (
  `USER_ID` int NOT NULL,
  `BOOK_ID` int NOT NULL,
  `ADDED_AT` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`USER_ID`, `BOOK_ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `favourite_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `favourite_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of favourite
-- ----------------------------

-- ----------------------------
-- Table structure for inventory_log
-- ----------------------------
DROP TABLE IF EXISTS `inventory_log`;
CREATE TABLE `inventory_log`  (
  `ID` int NOT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `CHANGE_TYPE` enum('ADDED','REMOVED','RETURNED','DAMAGED','ADJUSTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `QUANTITY_CHANGED` int NULL DEFAULT NULL,
  `CHANGED_AT` datetime NULL DEFAULT NULL,
  `COMMENT` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `inventory_log_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of inventory_log
-- ----------------------------

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
  `CREATED_AT` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID` DESC) USING BTREE,
  INDEX `notification_recipient`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `notification_recipient` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `ORDERD_AT` timestamp NULL DEFAULT NULL,
  `SHIPPING_ADDRESS` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ORDER_STATUS` enum('pending','confirmed','processing','shipped','delivered','cancelled','returned','refunded','on_hold') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `SHIPPING_FEE` decimal(12, 2) NULL DEFAULT 40.00,
  `TOTAL_AMOUNT` decimal(12, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_order_user_id`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  PRIMARY KEY (`ORDER_ID`, `BOOK_ID`) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `order_book_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_book_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_discount
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
  `AMOUNT` decimal(12, 0) NULL DEFAULT NULL,
  `PAYMENT_STATUS` enum('unpaid','pending','processing','paid','refunded','partially_refunded','failed','cancelled','chargeback') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unpaid',
  `TRANSACTION_ID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `WEBSITE` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PASSWORD_HASH` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT NULL,
  `STATUS` enum('ACTIVE','INACTIVE','BANNED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of publisher
-- ----------------------------

-- ----------------------------
-- Table structure for publisher_book_draft
-- ----------------------------
DROP TABLE IF EXISTS `publisher_book_draft`;
CREATE TABLE `publisher_book_draft`  (
  `ID` int NOT NULL,
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
  `REQUEST_ID` int NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_book_title`(`TITLE` ASC) USING BTREE,
  INDEX `idx_book_isbn`(`ISBN` ASC) USING BTREE,
  INDEX `REQUEST_ID`(`REQUEST_ID` ASC) USING BTREE,
  CONSTRAINT `publisher_book_draft_ibfk_1` FOREIGN KEY (`REQUEST_ID`) REFERENCES `publisher_request` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of publisher_book_draft
-- ----------------------------

-- ----------------------------
-- Table structure for publisher_request
-- ----------------------------
DROP TABLE IF EXISTS `publisher_request`;
CREATE TABLE `publisher_request`  (
  `ID` int NOT NULL,
  `PUBLISHER_ID` int NULL DEFAULT NULL,
  `REQUEST_TYPE` enum('ADD_BOOK','UPDATE_BOOK','REMOVE_BOOK') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `STATUS` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING',
  `SUBMITTED_AT` timestamp NULL DEFAULT NULL,
  `REVIEWED_AT` timestamp NULL DEFAULT NULL,
  `REVIEWED_BY` int NULL DEFAULT NULL,
  `NOTES` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `PUBLISHER_ID`(`PUBLISHER_ID` ASC) USING BTREE,
  INDEX `REVIEWED_BY`(`REVIEWED_BY` ASC) USING BTREE,
  CONSTRAINT `publisher_request_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `publisher` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `publisher_request_ibfk_2` FOREIGN KEY (`REVIEWED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of publisher_request
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `POSTED_AT` timestamp NULL DEFAULT NULL,
  `IS_VERIFIED_PURCHASER` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_review_user_id`(`USER_ID` ASC) USING BTREE,
  INDEX `idx_review_book_id`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of review
-- ----------------------------
INSERT INTO `review` VALUES (1, 2, 100, 1, 'Good', '2025-07-04 23:08:08', 1);
INSERT INTO `review` VALUES (2, 2, 101, 1, 'Good', '2025-07-03 23:10:37', 1);
INSERT INTO `review` VALUES (3, 2, 102, 2, 'Good', '2025-07-01 23:11:07', 1);
INSERT INTO `review` VALUES (4, 2, 103, 3, 'Good', '2025-06-30 23:11:31', 1);

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
-- Records of review_reaction
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `SHIPPING_STATUS` enum('label_created','not_shipped','in_transit','out_for_delivery','shipped','delivered','returned','failed_delivery','cancelled','lost','damaged') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `TRACKING_NUMBER` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ORDER_ID`(`ORDER_ID` ASC) USING BTREE,
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`ORDER_ID`) REFERENCES `order` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `PASSWORD_HASH` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FIRST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `LAST_NAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `PHONE` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `CREATED_AT` datetime NULL DEFAULT NULL,
  `LAST_ACTIVE` datetime NULL DEFAULT NULL,
  `IS_ACTIVE` tinyint(1) NULL DEFAULT 0,
  `GENDER` enum('UNSPECIFIED','MALE','FEMALE','NON-BINARY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UNSPECIFIED',
  `BIRTHDAY` date NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_user_email`(`EMAIL` ASC) USING BTREE,
  INDEX `idx_user_username`(`USERNAME` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', NULL, 'hash', NULL, NULL, NULL, NULL, NULL, 0, 'UNSPECIFIED', NULL);
INSERT INTO `user` VALUES (2, 'prottoy', 'prottoy@example.com', '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', 'Prottoy', 'Das', '01712345678', '2025-06-24 12:00:00', '2025-06-24 12:00:00', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (3, 'anindya', 'anindya@example.com', '$2b$10$86qqVb2OxZu/a56hpWoaKObpWPgffjZuP6N7SjfcbeuVUnDtFHCXi', 'Anindya', 'Biswas', '01712345678', '2025-06-24 12:00:00', '2025-06-24 12:00:00', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (4, 'sourav', 'sourav@example.com', '$2b$10$cSpOAoJw8oKbwhvk1xxZmOLy99BM8v5OfKbQclE2BwQfVjgZQ1rBa', 'Sourav', 'Sarkar', '01712345678', '2025-06-24 12:00:00', '2025-06-24 12:00:00', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (5, 'THK_is_dead', 'tahjib@example.com', '$2b$10$gGtA5D8G1XuE.Ekh76xuGuNmEwiztRruePKl1WHYPBEO4tI6N0ICS', 'Tahjib', 'Hossain Khan', '01712345678', '2025-06-24 12:00:00', '2025-07-05 19:58:17', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (6, 'johnpork', 'johnpork@gmail.com', '$2b$10$WCnA6LqcglLLOHKoNWfUSe1T9CN.rXul4fnM2qQ8fHKatYuFYYwtC', 'John', 'Pork', '01234567891', '2025-06-28 01:41:00', '2025-06-28 01:41:00', 0, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (7, 'anindya1', 'anindya@gmail.com', '$2b$10$UQH5JtdMmEic2uRe4TEv7.RhVf2SPy/sUn1ArmLwucMakKwDPFuz6', 'anindya', 'biswas', '12345678901', '2025-06-28 02:05:35', '2025-06-28 02:05:35', 0, 'FEMALE', '2025-05-31');

-- ----------------------------
-- Table structure for user_address
-- ----------------------------
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address`  (
  `ID` int NOT NULL,
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_address
-- ----------------------------
INSERT INTO `user_address` VALUES (1, 6, 'home', 'Bangladesh University of Engineering and Technology\nPalashi, Dhaka 1000', 'Dhaka', 'Bangladesh', 'Bangladesh', '1000', 1);
INSERT INTO `user_address` VALUES (2, 7, 'office', '60 Biswanath Heights, Natun Bazar', 'Magura', 'Bangladesh', 'Bangladesh', '7600', 1);

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist`  (
  `ID` int NOT NULL,
  `USER_ID` int NULL DEFAULT NULL,
  `BOOK_ID` int NULL DEFAULT NULL,
  `ADDED_AT` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  INDEX `BOOK_ID`(`BOOK_ID` ASC) USING BTREE,
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`BOOK_ID`) REFERENCES `book` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of wishlist
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
