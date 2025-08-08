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

 Date: 01/08/2025 00:38:53
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
INSERT INTO `admin` VALUES (1);
INSERT INTO `admin` VALUES (2);
INSERT INTO `admin` VALUES (3);
INSERT INTO `admin` VALUES (1001);

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
-- Records of admin_permission
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 484 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of author
-- ----------------------------
INSERT INTO `author` VALUES (200, 'Mr. Rohit Manglik', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (201, 'Bradley N. Miller', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (202, 'David L. Ranum', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (203, 'Julie Anderson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (204, 'John M. Zelle', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (205, 'Wesley Chun', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (206, 'Michał Jaworski', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (207, 'Tarek Ziadé', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (208, 'Michael Learn', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (209, 'John Brown', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (210, 'Mike Kernell', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (211, 'Shivakumar Gopalakrishnan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (212, 'Michael Clark', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (213, 'William Sullivan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (214, 'Rydhm Beri', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (215, 'Daniel O\'Reilly', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (216, 'Dr. Krishna Kumar Mohbey', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (217, 'Dr. Brijesh Bakariya', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (218, 'Bob Mather', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (219, 'Computer Programming Academy', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (220, 'Nupur Soni', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (221, 'Michal Jaworski', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (222, 'Deepali Srivastava', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (223, 'Nandi Dr. Rupam Dr. Gypsy, Kumar Sharma', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (224, 'Sinan Ozdemir', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (225, 'V.K. Jain', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (226, 'Foster Provost', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (227, 'Tom Fawcett', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (228, 'Prof John Smith', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (229, 'Lillian Pierson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (230, 'Dhaanyalakshmi Ahuja', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (231, 'Joel Grus', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (232, 'Field Cady', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (233, 'Keshav Sud', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (234, 'Pakize Erdogmus', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (235, 'Seifedine Kadry', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (236, 'Fausto Pedro García Márquez', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (237, 'Benjamin Lev', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (238, 'Siddharth Swarup Rautaray', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (239, 'Phani Pemmaraju', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (240, 'Hrushikesha Mohanty', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (241, 'Mario A. B. Capurso', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (242, 'Juan J. Cuadrado-Gallego', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (243, 'Yuri Demchenko', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (244, 'John D. Kelleher', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (245, 'Brendan Tierney', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (246, 'Alejandro Garcia', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (247, 'Sanjeev J. Wagh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (248, 'Manisha S. Bhende', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (249, 'Anuradha D. Thakare', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (250, 'John Paul Mueller', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (251, 'Luca Massaron', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (252, 'Probyto Data Science and Consulting Pvt. Ltd.', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (253, 'Rakibul Hassan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (254, 'T V Geetha', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (255, 'S Sendhilkumar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (256, 'Seyedeh Leili Mirtaheri', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (257, 'Reza Shahbazian', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (258, 'Garry Briscoe', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (259, 'Terry Caelli', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (260, 'Yagang Zhang', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (261, 'Ameet V Joshi', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (262, 'Yves Kodratoff', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (263, 'V Kishore Ayyadevara', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (264, 'Rahul Kumar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (265, 'Shai Shalev-Shwartz', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (266, 'Shai Ben-David', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (267, 'Igor Kononenko', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (268, 'Matjaz Kukar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (269, 'Kai Turing', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (270, 'AI', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (271, 'Rachid Guerraoui', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (272, 'Nirupam Gupta', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (273, 'Rafael Pinot', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (274, 'Patanjali Kashyap', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (275, 'Cybellium', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (276, 'Prathmesh Yelne', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (277, 'Hannes Hapke', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (278, 'Catherine Nelson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (279, 'Dr. Khongdet Phasinam', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (280, 'Dr Alok Kumar Singh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (281, 'Ms. Tanya Singh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (282, 'M. K. Sharma', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (283, 'Plevris, Vagelis', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (284, 'Ahmad, Afaq', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (285, 'Lagaros, Nikos D.', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (286, 'Joshua Johanan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (287, 'Talha Khan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (288, 'Ricardo Zea', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (289, 'NARAYAN CHANGDER', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (290, 'Vishal Layka', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (291, 'Mark J. Anderson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (292, 'Patrick J. Whitcomb', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (293, 'Sufyan bin Uzayr', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (294, 'Nicholas Cloud', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (295, 'Tim Ambler', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (296, 'Oscar Medina', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (297, 'Chris Beckett', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (298, 'Rita Zhang', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (299, 'Eric Overfield', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (300, 'Kanwal Khipple', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (301, 'Benjamin Niaulin', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (302, 'ROBIUL KARIM', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (303, 'Kai Qian', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (304, 'Erwin Ouyang', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (305, 'Nicolae Sfetcu', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (306, 'Prof. Veerendra', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (307, 'Sajjad Umar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (308, 'Tim Downey', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (309, 'Rheinwerk Publishing, Inc', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (310, 'Philip Ackermann', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (311, 'Jhankar Mahbub', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (312, 'Amos Q. Haviv', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (313, 'Luke Welling', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (314, 'Ben Shaw', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (315, 'Saurabh Badhwar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (316, 'Chris Guest', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (317, 'Bharath Chandra K S', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (318, 'Joost Nico Kok', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (319, 'Jerry Kaplan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (320, 'B. J. Copeland', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (321, 'Wolfgang Ertel', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (322, 'Denis Rothman', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (323, 'Dr Dheeraj Mehrotra', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (324, 'Simplilearn', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (325, 'Ralf T. Kreutzer', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (326, 'Marie Sirrenberg', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (327, 'Lavanya Sharma', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (328, 'Pradeep Kumar Garg', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (329, 'Tom Taulli', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (330, 'Zhongzhi Shi', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (331, 'Sue Ellen Haupt', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (332, 'Antonello Pasini', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (333, 'Caren Marzban', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (334, 'OECD', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (335, 'Konstantin V Titov', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (336, 'Shahab D. Mohaghegh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (337, 'Nitin Liladhar Rane', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (338, 'George F. Luger', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (339, 'Luger', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (340, 'Kate Crawford', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (341, 'Dr. Anil Kumar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (342, 'Sivasubramanian Balasubramanian', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (343, 'Dr. Haewon Byeon', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (344, 'Prof. Ganesh Vasudeo Manerkar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (345, 'Khushwant Singh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (346, 'J. K. Rowling', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (347, 'Danielle Fuller', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (348, 'DeNel Rehberg Sedo', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (349, 'Ivan King', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (350, 'bestsellers', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (351, 'John Sutherland', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (352, 'Sarah Churchwell', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (353, 'Thomas Ruys Smith', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (354, 'Hill Napolean', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (355, 'Leo Tak-hung Chan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (356, 'Agatha Christie', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (357, 'Jon Helgason', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (358, 'Sara Kärrholm', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (359, 'Ann Steiner', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (360, 'Steven Tötösy de Zepetnek', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (361, 'Katarzyna Bartoszyńska', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (362, 'Julie Rak', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (363, 'Albert N. Greco', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (364, 'Jim Milliot', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (365, 'Robert M. Wharton', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (366, 'Michael Korda', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (367, 'Steve Weber', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (368, 'Angus Phillips', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (369, 'Michael Bhaskar', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (370, 'Bradley A. Gorski', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (371, 'Craig Munro', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (372, 'Robyn Sheahan-Bright', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (373, 'মুহম্মদ জাফর ইকবাল', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (374, 'Mohammad Jafar Iqbal', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (375, 'Humāẏūna Āhameda', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (376, 'Roger Luckhurst', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (377, 'Everett Franklin Bleiler', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (378, 'Richard Bleiler', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (379, 'R. Reginald', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (380, 'Douglas Menville', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (381, 'Mary A. Burgess', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (382, 'Many Authors', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (383, 'Brian Stableford', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (384, 'Fatma Gamze Erkan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (385, 'Bonnie Noonan', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (386, 'Alan N. Shapiro', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (387, 'Gary Westfahl', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (388, 'Sara Martín', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (389, 'James Gunn', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (390, 'Michael R. Page', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (391, 'Daniel A. Finch-Race', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (392, 'Emiliano Guaraldo', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (393, 'Marco Malvestio', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (394, 'Steve Davidson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (395, 'Kermit Woodall', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (396, 'Stefan Weihampel', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (397, 'Stefan Weisshampel', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (398, 'Library of Congress', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (400, 'William Le Queux', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (401, 'Earl Derr Biggers', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (402, 'Anna Katharine Green', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (403, 'Ethel Lina White', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (404, 'Wilkie Collins', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (405, 'Victor L. Whitechurch', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (406, 'H. C. McNeile', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (407, 'Sapper', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (408, 'Roger M Sobin', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (409, 'Carol Caverly', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (410, 'Edgar Wallace', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (411, 'Joseph Sheridan Le Fanu', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (412, 'Arthur Morrison', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (413, 'John Charles', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (414, 'Joanna Morrison', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (415, 'Candace Clark', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (416, 'Fergus Hume', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (417, 'William H. Epstein', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (418, 'Wilhelm Hemecker', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (419, 'Edward Saunders', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (420, 'Carl Rollyson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (421, 'Christian Forstner', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (422, 'Mark Walker', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (423, 'Ann Jefferson', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (424, 'Tomas Hägg', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (425, 'David Suchoff', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (426, 'Mary Rhiel', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (427, 'William Chambers', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (428, 'Ana Caetano', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (429, 'Magda Nico', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (430, 'William Allen', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (431, 'Brenda Ayres', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (432, 'Richard Bradford', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (433, 'J. Darcy', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (434, 'Prue Chamberlayne', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (435, 'Joanna Bornat', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (436, 'Tom Wengraf', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (437, 'Leslie Stephen', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (438, 'Sir Sidney Lee', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (439, 'George Elliott Howard', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (440, 'Library of Congress. Subject Cataloging Division', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (441, 'James Duff Brown', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (442, 'Stephen Samuel Stratton', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (443, 'Bijoy Sarkar ', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (444, 'Monowar Hossain ', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (445, 'John E. Jessup', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (446, 'Robert W. Coakley', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (447, 'Jayanta Kumar Baidya', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (448, 'James Hadden Smith', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (449, 'Hume H. Cale', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (450, 'William E. Roscoe', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (451, 'Benjamin de Carvalho', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (452, 'Julia Costa Lopez', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (453, 'Halvard Leira', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (454, 'E. Wayne Ross', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (455, 'Rufus Bird', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (456, 'Simon Thurley', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (457, 'Michael Turner', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (458, 'Armin Lange', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (459, 'Kerstin Mayerhofer', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (460, 'Dina Porat', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (461, 'Lawrence H. Schiffman', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (462, 'Various', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (463, 'Michael C. Thomsett', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (464, 'Jean Freestone Thomsett', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (466, 'T. F. Leong', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (467, 'Caesar Augustus Rodney Janvier', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (468, 'Vasily Sesemann', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (469, 'Helen Gibbon', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (470, 'Ben Golder', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (471, 'Lucas Lixinski', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (472, 'Marina Nehme', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (473, 'Prue Vines', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (474, 'Herbert Baxter Adams', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (475, 'Anonymous', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `author` VALUES (476, 'Direct Test Author A', NULL, NULL, NULL, NULL, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 449 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES (200, 'Python Programming and Applications', '9789371047555', '2024-03-09', 200, 198, 'en', NULL, 100.00, 10, 'EduGorilla Publication is a trusted name in the education sector, committed to empowering learners with high-quality study materials and resources. Specializing in competitive exams and academic support, EduGorilla provides comprehensive and well-structured content tailored to meet the needs of students across various streams and levels.', 1, 'http://books.google.com/books/content?id=snxZEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (201, 'Python Programming in Context', '9781284175554', '2019-10-01', 201, 516, 'en', NULL, 200.00, 10, 'Python Programming in Context, Third Edition provides a comprehensive and accessible introduction to Python fundamentals. Updated with the latest version of Python, the new Third Edition offers a thorough overview of multiple applied areas, including image processing, cryptography, astronomy, the Internet, and bioinformatics. Taking an active learning approach, each chapter starts with a comprehensive real-world project that teaches core design techniques and Python programming while engaging students. An ideal first language for learners entering the rapidly expanding field of computer science, Python gives students a solid platform of key problem-solving skills that translate easily across programming languages.', 1, 'http://books.google.com/books/content?id=b-2oDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (202, 'Python Programming', '9781887902991', '2004-01-01', 202, 533, 'en', NULL, 300.00, 10, 'This book is suitable for use in a university-level first course in computing (CS1), as well as the increasingly popular course known as CS0. It is difficult for many students to master basic concepts in computer science and programming. A large portion of the confusion can be blamed on the complexity of the tools and materials that are traditionally used to teach CS1 and CS2. This textbook was written with a single overarching goal: to present the core concepts of computer science as simply as possible without being simplistic.', 1, 'http://books.google.com/books/content?id=aJQILlLxRmAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (203, 'Core Python Programming', '9780130260369', '2001-01-01', 203, 805, 'en', NULL, 400.00, 10, 'Experts and novices alike will be able to find information about every command they\'ll need to use Linux. This complete, practical desk reference is organized by function, with a road map-style alphabetical reference for quick access of information about all aspects of running and administering the program. The CD-ROM contains Windows and Linux Python distributions plus extensive cross-platform source code from the book.', 1, 'http://books.google.com/books/content?id=mh0bU6NXrBgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (204, 'Expert Python Programming', '9781801076197', '2021-05-28', 204, 631, 'en', NULL, 500.00, 10, 'Gain a deep understanding of building, maintaining, packaging, and shipping robust Python applications Key FeaturesDiscover the new features of Python, such as dictionary merge, the zoneinfo module, and structural pattern matchingCreate manageable code to run in various environments with different sets of dependenciesImplement effective Python data structures and algorithms to write, test, and optimize codeBook Description This new edition of Expert Python Programming provides you with a thorough understanding of the process of building and maintaining Python apps. Complete with best practices, useful tools, and standards implemented by professional Python developers, this fourth edition has been extensively updated. Throughout this book, you’ll get acquainted with the latest Python improvements, syntax elements, and interesting tools to boost your development efficiency. The initial few chapters will allow experienced programmers coming from different languages to transition to the Python ecosystem. You will explore common software design patterns and various programming methodologies, such as event-driven programming, concurrency, and metaprogramming. You will also go through complex code examples and try to solve meaningful problems by bridging Python with C and C++, writing extensions that benefit from the strengths of multiple languages. Finally, you will understand the complete lifetime of any application after it goes live, including packaging and testing automation. By the end of this book, you will have gained actionable Python programming insights that will help you effectively solve challenging problems. What you will learnExplore modern ways of setting up repeatable and consistent Python development environmentsEffectively package Python code for community and production useLearn modern syntax elements of Python programming, such as f-strings, enums, and lambda functionsDemystify metaprogramming in Python with metaclassesWrite concurrent code in PythonExtend and integrate Python with code written in C and C++Who this book is for The Python programming book is intended for expert programmers who want to learn Python’s advanced-level concepts and latest features. Anyone who has basic Python skills should be able to follow the content of the book, although it might require some additional effort from less experienced programmers. It should also be a good introduction to Python 3.9 for those who are still a bit behind and continue to use other older versions.', 1, 'http://books.google.com/books/content?id=2tAwEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (205, 'Python Programming', '1801571406', '2021-01-02', 205, 386, 'en', NULL, 600.00, 10, 'Includes 2 manuscripts Learn Python Programming In today\'s Industry, Python Programming is highly recommended for developing Websites. The creator of this programming language was Guido Van Rossum, released first in the year 1991. The multiple supporting programming paradigms made itself unique from other programming languages as it had some outstanding features like unique adaptability, the ability to adopt machine learning, scientific computation, cloud infrastructure and above all web development. Python\'s role is really commendable in both software development, as well as, web development. This book is helpful for learning everything Python has to offer. By connecting with a database system Python can read and modify files. To create workflows in Software, this language is helpful. Python also supports a dynamic type system, automatic memory management, object-oriented and structured programming. Moreover, this programming language has the potential to support the various concepts in functional and aspect-oriented programming. Where the other programming languages use semicolon or parentheses to complete a command, Python uses new lines to complete it. Python Coding and Programming Python is one of the easiest computer languages to learn. The most striking part of this language is that it is widely used in NASA. The developers should focus on the quality of the source code to simplify its uses. Other programming languages never focused on the code readability, but Python is always ready to strengthen the code readability with the help of English keywords. Writing additional code is not necessary for Python to create custom applications. ﻿ When you want to learn a language understood by computers, all over the world, you should take the help of this eBook. It supports several programming paradigms like logic programming and design by contract. In late 1980, as a legatee to the ABC language, the python was conceived. The exceptional powerful ideology of this programming language has influenced many other languages, like BOO, GOBRA, JULIA, RUBY, SWIFT, etc, and those languages hire Python designs for their development.', 1, 'http://books.google.com/books/content?id=k1UmzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (206, 'Programming in C and Python', '9789371442664', '2024-05-18', 200, 400, 'en', NULL, 700.00, 10, 'EduGorilla Publication is a trusted name in the education sector, committed to empowering learners with high-quality study materials and resources. Specializing in competitive exams and academic support, EduGorilla provides comprehensive and well-structured content tailored to meet the needs of students across various streams and levels.', 1, 'http://books.google.com/books/content?id=RJJkEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (207, 'Python Programming Series 2', '1802262938', '2021-04-16', 206, 212, 'en', NULL, 800.00, 10, '55 % discount for bookstores ! Now At $37.99 instead of $ 58.88 $ Your customers will never stop reading this guide !!! PYTHON PROGRAMMING Would you like to learn the hard core of Python coding? You are the type of genius the great eBook in the next few lines is dedicated to, check it out. Learning the complex processes of Python Programming is a tough task most people don\'t want to try. Even Computer, Engineering, Tech and related fields do not want to, to even imagine the interest of a non-tech related fan. Why? It is for the same reason, it is complicated! It has different stages that can be easily mixed up. It also contains so many lessons and tasks that can overwhelm you right before you start. Computer Tech specialists only find it easier because they\'ve been in the field all day of life. Non Tech specialists struggle especially. But isn\'t there a way you can learn the hardcore easily whether you are or not in the tech fields? The eBook after the next few lines can find you the answers. Python is a top class programming application. So, it is actually meant for top class programmers. It contains complex programs that everyone mixes up and confuse in the nearest minute. It can be very frustrating too. That\'s why you know many people who learnt the basics of python programming and stopped halfway. But if you are good at it, it can offer you the most thrilling experience you will ever have. Coding with python can become your only profession and as well, the most exciting thing on earth. It is full of amazing drills and challenges. If is fun and sort of crazy. Python coding has a way of helping people develop their creativity too. Buy it Now and let your customers get addicted to this amazing book !!', 1, 'http://books.google.com/books/content?id=q_xnzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (208, 'Python Programming for Beginners', '1803621362', '2023-03-14', NULL, 0, 'en', NULL, 900.00, 10, 'Unlock the full potential of Python programming with our comprehensive guidebook! Are you a beginner programmer looking to master Python? Or an experienced developer seeking to expand your skills? Our book caters to all levels of expertise, providing you with a step-by-step guide to learning and applying Python programming in a variety of contexts. With easy-to-understand explanations and real-life examples, our book covers the fundamentals of Python, including: Data Types. Control Structures. Object-Oriented Programming, ...and much more. You\'ll also delve into advanced topics such as web scraping, GUI programming, and game development, empowering you to take your Python skills to the next level. Designed for the busy learner, our book is structured with short, digestible chapters that allow you to learn at your own pace. Plus, our user-friendly language and engaging writing style make it a pleasure to read and easy to comprehend. As a beginner or experienced developer, you know the importance of staying up to date with the latest programming languages and techniques. With our book, you\'ll have everything you need to start using Python for real-world applications, giving you a competitive edge in today\'s tech-driven market. Don\'t miss out on the opportunity to become a Python expert. Order our book today and start your journey toward Python mastery!', 1, 'http://books.google.com/books/content?id=zQq5zwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (209, 'Modern Python Programming using ChatGPT', '9789365894318', '2024-08-29', 207, 437, 'en', NULL, 100.00, 10, 'DESCRIPTION Modern Python Programming using ChatGPT is your essential guide to leveraging Artificial Intelligence to streamline and enhance your Python development workflow across the entire software development lifecycle (SDLC). This book covers every stage, from requirements gathering and design to implementation, testing, security, deployment, and observability, demonstrating how ChatGPT can be of invaluable assistance throughout. Learn how to use ChatGPT to break down features into stories, design, and architect software, implement AI-generated code snippets, write clean and maintainable code, test and secure applications, deploy efficiently, and monitor performance. This comprehensive guide shows you how to integrate ChatGPT seamlessly into every stage of your Python projects. Discover how ChatGPT can automate repetitive tasks, generate high-quality code snippets, provide instant debugging tips, and ensure your code adheres to industry standards and best practices. This book provides thorough coverage of the latest trends and best practices in Python development, equipping you with the tools to write clean, maintainable, and robust code. Through practical examples and hands-on exercises, you will learn how to apply ChatGPT in real-world scenarios, making your development process more efficient and productive. KEY FEATURES ● Supercharge the entire SDLC using ChatGPT\'s AI-driven insights. ● Seamlessly integrate ChatGPT into every stage of your Python projects. ● Practical, real-world examples and hands-on exercises. WHAT YOU WILL LEARN ● To seamlessly integrate ChatGPT from coding to deployment to monitoring. ● Use ChatGPT to gather and document software requirements. ● Break down features into stories with ChatGPT assistance. ● Design, architect, and implement clean, maintainable code using AI-generated snippets. ● Test, secure, and deploy applications with AI support. ● Optimize performance and monitor software using ChatGPT. WHO THIS BOOK IS FOR This book is for Python developers of all experience levels who want to enhance their entire software development process using AI. Basic knowledge of Python is assumed, but detailed instructions are provided to help you integrate ChatGPT into your projects effectively. TABLE OF CONTENTS 1. ChatGPT and Its Capabilities 2. Benefits of Using ChatGPT in Python Development 3. Setting up ChatGPT for Python Development 4. Requirements Gathering 5. Design and Architecture 6. Implementing a Software Product 7. Pull Review and Commit Messages 8. Using ChatGPT for Coding with SOLID Principles 9. Software Testing with ChatGPT in Python 10. Deployment with ChatGPT 11. Performance and Observability 12. Revolutionary Impact of ChatGPT 13. Limitations, Pitfalls and Dangers of ChatGPT 14. Preparing for the Future with ChatGPT', 1, 'http://books.google.com/books/content?id=DcMdEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (210, 'Coding', '1801690219', '2021-02-06', 205, 592, 'en', NULL, 200.00, 10, '55 % discount for bookstores ! Now At $31.99 instead of $ 74,38 Includes 3 manuscripts Learn Python Programming In today\'s Industry, Python Programming is highly recommended for developing Websites. The creator of this programming language was Guido Van Rossum, released first in the year 1991. The multiple supporting programming paradigms made itself unique from other programming languages as it had some outstanding features like unique adaptability, the ability to adopt machine learning, scientific computation, cloud infrastructure and above all web development. Python\'s role is really commendable in both software development, as well as, web development. This book is helpful for learning everything Python has to offer.By connecting with a database system Python can read and modify files. To create workflows in Software, this language is helpful. Python also supports a dynamic type system, automatic memory management, object-oriented and structured programming. Moreover, this programming language has the potential to support the various concepts in functional and aspect-oriented programming. Where the other programming languages use semicolon or parentheses to complete a command, Python uses new lines to complete it. Python Coding and Programming Python is one of the easiest computer languages to learn. The most striking part of this language is that it is widely used in NASA. The developers should focus on the quality of the source code to simplify its uses. Other programming languages never focused on the code readability, but Python is always ready to strengthen the code readability with the help of English keywords. Writing additional code is not necessary for Python to create custom applications. When you want to learn a language understood by computers, all over the world, you should take the help of this eBook. It supports several programming paradigms like logic programming and design by contract. In late 1980, as a legatee to the ABC language, the python was conceived. The exceptional powerful ideology of this programming language has influenced many other languages, like BOO, GOBRA, JULIA, RUBY, SWIFT, etc, and those languages hire Python designs for their development. Linux for beginners For computers, servers, mainframes, mobile, and embedded devices, Linux is an open-source and community-developed and operating system. As it is an open source OS, the code is free to create Linux. That\'s why the appropriate skills for the users are necessary, even if they are beginners, so that they can get the best out of the operating system. This is not only used by the web programmers but also by the regular computer or laptop users and even mobile phones . Get hold of the eBook to learn more. As it is a bit different from the popular operating system like Windows or Android, it takes a little bit of time to get the hang of it. The most important thing about Linux that it is free. It is really hard to hack into Linux as it is highly secured. For different types of users, there are different flavors and the available flavors are called \'distributions\'. Buy it Now and let your customeres get addcted to this amazing book', 1, 'http://books.google.com/books/content?id=F_4vzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (211, 'Python Programming Illustrated For Beginners & Intermediates“Learn By Doing” Approach-Step By Step Ultimate Guide To Mastering Python', NULL, '2018-06-21', 208, 137, 'en', NULL, 300.00, 10, 'Python Programming Illustrated Guide For Beginners & Intermediates Whether you are at a beginner or intermediate level this book is crafted just for you! Learn Python Fundamentals This is your beginner\'s step by step guide with illustrated pictures! Learn one of the most essential, renowned and practical programming languages in 21st century. Python is a general purpose programming used by many start-ups. Its design emphasizes code readability, notably using significant whitespace Did you know Mozilla Firefox, PBS, Reddit, and even NASA! All use Python programming for their websites? Providing constructs whether small or large scale Python is versatile and can be used in a variety of ways. What You Will Learn: Python Running Your First Program Identifiers Variables Data Types Codes Practical Implementations And, much, much more! If you want to learn more about python programming it is highly recommended you start from the ground up by using this book. Why not start off by making a small and affordable investment with your illustrated beginners guide that walks you through python programming step by step. Why choose this book? Addresses Fundamental Concepts Goes Straight To The Point, No fluff or nonsense Practical Examples High Quality Diagrams \"Noob friendly\" (Good For beginners) Object Oriented Programming With Python Lambda Expressions Endorses Learn \"By Doing Approach\" Concise And To The Point I been working tirelessly to provide you quality books at an affordable price. I believe this book will give you the confidence to tackle python programming at a fundamental level. What are you waiting for? Make the greatest investment in knowledge base right now. Buy your copy now!', 1, 'http://books.google.com/books/content?id=QqetDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (212, 'Python Made Simple', '9789388511025', '2019-09-17', 207, 467, 'en', NULL, 400.00, 10, 'Take tiny steps to enter the big world of data science through this interesting guide DESCRIPTIONÊ In the last few years, python gained popularity and became the first choice of the students, teachers as well as professionals. It is being used in different fields such as education, software development, website development and also in various advanced research. In the field of education it allows students to learn the programming language in an easier and efficient manner. In the information technology field it can be used as a language for creating softwares as well as for web developments. It can be integrated with different platforms like Django. In research, Python programming can be used in simulation or it can be used for machine learning techniques. The primary goal of this text is to create a pedagogically sound and accessible textbook that emphasises on core concepts of Python programming. The book contains lots of practical examples to show the working of a particular code construct. The book can be very helpful in order to learn the basic and advance concepts of python programming. In the beginning of the book the focus is on the basic concepts related to core python programming starting from the installation phase of python interpreterÊto building the concepts for the reader towards python programming. Then the book moves towards the concept of different statements and programming conditions that python programming can handle in an easier manner. It then moves to the concepts related to object oriented programming and at last the reader will get to know about the database connectivity with the python program. KEY FEATURES Acquire basic concepts related to python programming Understand the core functionalities of Python Programming Provide the information regarding idle IDE Computational Problem solving in Python Object oriented concepts in Python Database connectivity with Python WHAT WILL YOU LEARN You can learn the core concept related to python programming You will get to learn how to program in python You can learn how Python programming helps to solve computational problems By reading this book you can learn how to work with pythonÊ You will get familiarity with the python programming concepts. You will learn how to operate idle IDE and how it can be used to write python program in easier way. WHO THIS BOOK IS FOR The book is intended for anyone who wish to learn python programming language. This book also covers the syllabus of various universities and readers can use this book as a help in their academic education. This book can be used by readers to start with python programming from basics to advanced level even without having any prior knowledge of python programming.Ê Table of Contents Introduction to Python Python Fundamentals Expression and Operators Control Statements Functions List Processing Tuple Processing Dictionary Processing String Processing File Processing Exception Handling Object Oriented Programming Inheritance & Polymorphism Database Design in Python', 1, 'http://books.google.com/books/content?id=hgKwDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (213, 'Python Programming', '1801825882', '2021-02-07', NULL, 292, 'en', NULL, 500.00, 10, '★ 55% OFF for Bookstores! NOW at $32.95 instead of $42.95★ Would You Like to Know How to Automate Boring Stuff Quickly? Discover the Easiest Way to Learn Everything About Python and Machine Learning! Are you ready to embark on a great journey through the incredible world of Python and data science? If you are reading this, you probably have a keen interest in programming and computer science. You like to know how things work, and you want to make them work as efficiently as possible, right? If so, then Python is the perfect programming language for you to learn! Would you like to: Learn how programming in Python works? Learn to automate tasks with Python? Bring your ideas to life faster and monetize them easily? But you: Have no prior knowledge about Python? Are a little bit afraid because it seems complicated? Well, if the answer to any question is \"yes,\" then the solution you are looking for is right in front of you. With this incredible bundle in your hands, you will go from beginner to pro in no time. The guides found inside this bundle are designed explicitly for people with little or no prior knowledge about Python programming. Every manual is written in a step-by-step and easy to digest manner so that you can understand Python without any trouble. Here\'s what this bundle about Python programming and data science can offer you: Basics of programming with Python: A comprehensive guide on how to get everything up and running. Essential tools guide: Learn how to use the best tools that are available for programming with Python. Programming made easy: Quick and easy way to learn how to make amazing and useful programs. Mastering the art of programming: Find out how to go from beginner to pro in no time with unique coding methods. Practical techniques and exercises: Put your knowledge to test and bring your ideas to life in no time. It doesn\'t matter if you are a beginner or you have never coded before; this guide will slowly ease you into the world of Python and data science. While most of the other similar books focus purely on theory and complicated concepts, these guides focus on a more practical approach to learning Python and data science. First of all, you\'ll learn basic programming concepts, such as variables, lists, classes, and loops. Then you will practice clean code writing and how to test your code safely. After that, you\'ll be able to put your knowledge to the test with some practical projects. Here is what else this bundle will show you: The basics of data types, variables, and structures How to properly define the data type of data structure Suitable types of operations and functions for data structuring Methods and applications of data analysis The basics of neural networks and how to create one Use of algorithm and models in data science Using data for prediction and deep learning The best thing about Python is that it\'s easy to learn and even easier to get up and running. By using tools like Django, for example, you can quickly bring your ideas and creations to life and start monetizing them in no time. The second best thing about learning how to program in Python is the advantage you\'ll have when you start learning other programming languages-after you master Python, learning different programming languages will be a piece of cake. If you want to conquer the Python programming language in no time, all you have to do is take these guides in your hands and follow the step-by-step instructions. Get Your Copy Now!', 1, 'http://books.google.com/books/content?id=fu8vzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (214, 'An Introduction to Python Programming: A Practical Approach', '9789391392062', '2021-08-26', 207, 472, 'en', NULL, 600.00, 10, 'step-by-step approach to Python programming with machine learning fundamental and theoretical principles. KEY FEATURES ● Introduces readers to Python programming in a very simple way. ● Extensive practical demonstration of Python concepts using numerous examples. ● Implementation of machine learning in Python using hands-on techniques. DESCRIPTION The book ‘Introduction to Python Programming: A Practical Approach’ lays out a path for readers who want to pursue a career in the field of computer software development. It covers the fundamentals of Python programming as well as machine learning principles. Students will benefit from the examples that are included with each concept, which will aid them in understanding the concept. This book provides a practical understanding of Python programming using numerous programs and examples. It also develops problem-solving and code-writing abilities for the readers. This book covers Python fundamentals, operators, and data structures such as strings, lists, dictionaries, and tuples. It also contains information on file and exception handling. The implementation of a machine learning model has also been included in this book. With the help of this book, students and programmers can improve their programming skills as well as their ability to sprint towards a rewarding career. WHAT YOU WILL LEARN ● Learn Python concepts, operators, and data structures. ● Learn the properties and operations of lists, tuples, and dictionaries. ● Write Python code to solve specific issues. ● Write Python code to handle disk files and exceptions. ● Work with OOPS properties like classes, objects, constructors, inheritance, and polymorphism. ● Use machine learning for classification, regression, prediction, and clustering. WHO THIS BOOK IS FOR This book is intended for current and aspiring emerging technology professionals, students, and anyone else who wishes to better understand the Python programming language and machine learning concepts. TABLE OF CONTENTS 1. Chapter 1: Basics of Python Programming 2. Chapter 2: Operators and Expressions 3. Chapter 3: Control Flow Statements 4. Chapter 4: Functions 5. Chapter 5: Strings 6. Chapter 6: Lists 7. Chapter 7: Tuple 8. Chapter 8: Dictionaries 9. Chapter 9: File Handling 10. Chapter 10: Exception Handling, Modules, and Packages 11. Chapter 11: Object-oriented Programming 12. Chapter 12: Machine Learning with Python 13. Chapter 13: Clustering with Python', 1, 'http://books.google.com/books/content?id=tVc_EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (215, 'Coding for Kids in Python: Python Programming Projects for Kids and Beginners to Get Started Programming Fun Games', NULL, '2022-05-13', 209, 183, 'en', NULL, 700.00, 10, 'Are you looking to teach your kid how to code? Or are you looking to start coding? This book on beginner Python is the answer. The whole world seems to be running on computers. Everything\'s going digital. Everybody\'s trying to learn how to code. But most people fail to get far. Coding is a tough skills to learn; and even tougher to master. Coding takes time to learn. The younger one starts the better. However, coding can be a lot of fun and gratifying. Kids who learn the basics well and code fun projects get hooked on it. And it\'s amazing to see how fast kids can improve if they enjoy it. The important thing is to get a step-by-step beginners\' guide that starts from the very basics. This book starts off with the very basics; how to install the software, set up and write your first lines of code. There are exercises at the end of each chapter that can test your new found knowledge and move you ahead. And then, once you master those skills, we get you a few more advanced skills that can get you started making simple games, animations and websites. Even if you\'ve never touched a computer in your life, you will find this book useful. Scroll up and Click \'Add to Cart\' Now', 1, 'http://books.google.com/books/content?id=0z5vEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Young Adult Nonfiction', 201);
INSERT INTO `book` VALUES (216, 'Python Programming', '9798611331996', '2020-02-08', NULL, 259, 'en', NULL, 800.00, 10, 'Have you always wanted to learn computer programming but you are worried it will take too long? Or perhaps you know other programming languages and are interested in learning Python quickly? Here\'s the deal... As a beginner you might think that programming is complex... Learning a coding language can take months, and the possibility to give up before mastering it could be high. So, if you have a project to develop you could think on hiring a professional programmer to shorten the time. This may seem like a good solution but it is certainly very expensive and if the programmer you chose doesn\'t perform a proper job you still have to pay for it. The best solution is to follow a complete programming manual with hands-on projects and practical exercises. Computer Programming Academy structured this guide as a course with seven chapters for seven days and studied special exercises for each section to apply what you have learned step-by-step. This protocol, tested on both total beginners and people who were already familiar with coding, takes advantage of the principle of diving, concentrating learning in one week. The result of this method has been one for both categories of students: the content of the course was learned faster and remembered longer respect the average. Inside this book, you will go through a first section in which fundamental and basic notions of programming are discussed, to get to the next chapters crafted specifically to help you learn advanced Python coding concepts required to develop web based programs and applications. In the detail, you will learn: What are the most widely used programming languages and why Python is considered the best of them to learn for a beginner Mathematical and statistic basic concepts for code writing you can\'t do without The most common mistakes to avoid when you start programming Step-by-step instructions to install required packages to set up a Python coding environment on your operating system A proven strategy to write efficient and effective Python codes in less than a week The 7 built-in functions to make your life easier while coding a software program The program you need to develop your first own web based application Tips and tricks that will help you take your coding skills to a next level (an entire chapter dedicated for those who want to take a step further) Exercises and quizzes at the end of every chapter to review immediately what you\'ve learned Extra content that you will appreciate as curious technology enthusiast Why is this book different? Most of the books on the market only take a brief look into the Python world, showing some of the topics but never going deep concretely. The best way to learn Python is by doing and with this manual you will work through applicable projects in order to solidify your knowledge and obtain a huge sense of achievement. This is what this guide offers to you, even if you\'re completely new to programming in 2020 or you are just looking to widen your skills as programmer. Would You Like To Know More? Scroll up to the top of the page and select the BUY NOW button. The key to become a Python master is one click away!', 1, 'http://books.google.com/books/content?id=6PZqzQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (217, '\"Everything with Python\"', '9788119517510', '2024-01-17', 210, 278, 'en', NULL, 900.00, 10, 'This book aims at providing fundamental concepts of Python programming. It is a good textbook basically designed for the CBSE curriculum for computer science. Here concepts are presented in the form of programs making it quite easy and simple for students to understand. It showcases actual screenshots of the programs from the programming environment to make it more student-friendly. Because of the user-friendly interface provided in the book a novice learner can also learn Python programming without any difficulty. As Python is open source, programs written in this book can execute on different operating systems like Windows, Linux, and Mac, etc. this ONE book covers all the topics that are present in the curriculum of 11th (CS, IP) and 12 (CS, IP).', 1, 'http://books.google.com/books/content?id=xLTuEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (218, 'Expert Python Programming', '1789808898', '2019-04-29', NULL, 646, 'en', NULL, 100.00, 10, 'Refine your Python programming skills and build professional grade applications with this comprehensive guide Key Features Create manageable code that can run in various environments with different sets of dependencies Implement effective Python data structures and algorithms to write optimized code Discover the exciting new features of Python 3.7 Book Description Python is a dynamic programming language that\'s used in a wide range of domains thanks to its simple yet powerful nature. Although writing Python code is easy, making it readable, reusable, and easy to maintain is challenging. Complete with best practices, useful tools, and standards implemented by professional Python developers, the third edition of Expert Python Programming will help you overcome this challenge. The book will start by taking you through the new features in Python 3.7. You\'ll then learn the advanced components of Python syntax, in addition to understanding how to apply concepts of various programming paradigms, including object-oriented programming, functional programming, and event-driven programming. This book will also guide you through learning the best naming practices, writing your own distributable Python packages, and getting up to speed with automated ways of deploying your software on remote servers. You\'ll discover how to create useful Python extensions with C, C++, Cython, and CFFI. Furthermore, studying about code management tools, writing clear documentation, and exploring test-driven development will help you write clean code. By the end of the book, you will have become an expert in writing efficient and maintainable Python code. What you will learn Explore modern ways of setting up repeatable and consistent development environments Package Python code effectively for community and production use Learn modern syntax elements of Python programming such as f-strings, enums, and lambda functions Demystify metaprogramming in Python with metaclasses Write concurrent code in Python Extend Python with code written in different languages Integrate Python with code written in different languages Who this book is for This book will appeal to you if you\'re a programmer looking to take your Python knowledge to the next level by writing efficient code and learning the latest features of version 3.7 and above.', 1, 'http://books.google.com/books/content?id=KVc6xQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (219, 'Ultimate Python Programming', '9789355516558', '2024-05-16', 207, 1429, 'en', NULL, 200.00, 10, 'Dive deep into the core concepts of Python KEY FEATURES ● The concepts in this book are illustrated through numerous short code snippets and more than 650 programming examples. ● The book contains a comprehensive collection of over 900 end-of-chapter exercises, including both MCQs and programming exercises. The solutions to all the exercises are also available. ● The book includes coding conventions and best practices for writing efficient, readable, and maintainable code. DESCRIPTION This book provides a comprehensive and thorough introduction to Python, a popular programming language used by various top companies across various domains. Whether you are a novice starting your programming journey or an experienced programmer looking to expand your skill set, this book is designed to assist you in mastering core Python concepts. Starting with the basics, this book guides you through the setup, basic commands, and key language rules. The book covers important ideas like different types of data, variables, and how to control the flow of your programs. You will also learn about collections for organizing data, functions for reusable code, modules for organizing bigger projects, and object-oriented programming for modeling real-world things. Advanced topics include customizing object behavior, efficient data processing, modifying function behavior, and handling errors gracefully. The book includes many figures and coding examples to give you a visual and hands-on experience. There are numerous exercises that provide opportunities to further reinforce your knowledge. By the end of this book, readers will develop a strong foundation in core Python and will gain the confidence to excel in their studies and professional work. WHAT YOU WILL LEARN ● Develop programs using procedural, object-oriented, and functional paradigms. ● Understand complex topics like iterators, generators, and decorators. ● Learn how to create and use modules and packages. ● Master the advanced concepts of object-oriented programming. ● Learn how to handle errors in Python and interact with files. ● Automate resource management patterns using context managers. WHO THIS BOOK IS FOR This book can be used by anyone who wants to learn Python from scratch. It can be a valuable resource for engineering students and students from other streams who have Python as part of their curriculum. This book facilitates a swift introduction to the language for individuals aiming to transition into data science, AI, or ML. TABLE OF CONTENTS 1. Introduction to Python 2. Getting Started 3. Strings 4. Lists and Tuples 5. Dictionaries and Sets 6. Conditional Execution 7. Loops 8. Looping Techniques 9. Comprehensions 10. Functions 11. Modules and Packages 12. Namespaces and Scope 13. Files 14. Object Oriented Programming 15. Magic Methods 16. Inheritance and Polymorphism 17. Iterators and Generators 18. Decorators 19. Lambda Expressions and Functional Programming 20. Exception Handling 21. Context Managers Solutions', 1, 'http://books.google.com/books/content?id=xRQIEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (220, 'Data Science Fundamentals and Practical Approaches', '9789389845679', '2020-09-03', 207, 586, 'en', NULL, 300.00, 10, 'Learn how to process and analysis data using Python Key Features a- The book has theories explained elaborately along with Python code and corresponding output to support the theoretical explanations. The Python codes are provided with step-by-step comments to explain each instruction of the code. a- The book is quite well balanced with programs and illustrative real-case problems. a- The book not only deals with the background mathematics alone or only the programs but also beautifully correlates the background mathematics to the theory and then finally translating it into the programs. a- A rich set of chapter-end exercises are provided, consisting of both short-answer questions and long-answer questions. Description This book introduces the fundamental concepts of Data Science, which has proved to be a major game-changer in business solving problems. Topics covered in the book include fundamentals of Data Science, data preprocessing, data plotting and visualization, statistical data analysis, machine learning for data analysis, time-series analysis, deep learning for Data Science, social media analytics, business analytics, and Big Data analytics. The content of the book describes the fundamentals of each of the Data Science related topics together with illustrative examples as to how various data analysis techniques can be implemented using different tools and libraries of Python programming language. Each chapter contains numerous examples and illustrative output to explain the important basic concepts. An appropriate number of questions is presented at the end of each chapter for self-assessing the conceptual understanding. The references presented at the end of every chapter will help the readers to explore more on a given topic. What will you learn a- Understand what machine learning is and how learning can be incorporated into a program. a- Perform data processing to make it ready for visual plot to understand the pattern in data over time. a- Know how tools can be used to perform analysis on big data using python a- Perform social media analytics, business analytics, and data analytics on any data of a company or organization. Who this book is for The book is for readers with basic programming and mathematical skills. The book is for any engineering graduates that wish to apply data science in their projects or wish to build a career in this direction. The book can be read by anyone who has an interest in data analysis and would like to explore more out of interest or to apply it to certain real-life problems. Table of Contents 1. Fundamentals of Data Science1 2. Data Preprocessing 3. Data Plotting and Visualization 4. Statistical Data Analysis 5. Machine Learning for Data Science 6. Time-Series Analysis 7. Deep Learning for Data Science 8. Social Media Analytics 9. Business Analytics 10. Big Data Analytics About the Authors Dr. Gypsy Nandi is an Assistant Professor (Sr) in the Department of Computer Applications, Assam Don Bosco University, India. Her areas of interest include Data Science, Social Network Mining, and Machine Learning. She has completed her Ph.D. in the field of \'Social Network Analysis and Mining\'. Her research scholars are currently working mainly in the field of Data Science. She has several research publications in reputed journals and book series. Dr. Rupam Kumar Sharma is an Assistant Professor in the Department of Computer Applications, Assam Don Bosco University, India. His area of interest includes Machine Learning, Data Analytics, Network, and Cyber Security. He has several research publications in reputed SCI and Scopus journals. He has also delivered lectures and trained hundreds of trainees and students across different institutes in the field of security and android app development.', 1, 'http://books.google.com/books/content?id=Eb9IEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (221, 'Principles of Data Science', '9781785888922', '2016-12-16', 204, 389, 'en', NULL, 400.00, 10, 'Learn the techniques and math you need to start making sense of your data About This Book Enhance your knowledge of coding with data science theory for practical insight into data science and analysis More than just a math class, learn how to perform real-world data science tasks with R and Python Create actionable insights and transform raw data into tangible value Who This Book Is For You should be fairly well acquainted with basic algebra and should feel comfortable reading snippets of R/Python as well as pseudo code. You should have the urge to learn and apply the techniques put forth in this book on either your own data sets or those provided to you. If you have the basic math skills but want to apply them in data science or you have good programming skills but lack math, then this book is for you. What You Will Learn Get to know the five most important steps of data science Use your data intelligently and learn how to handle it with care Bridge the gap between mathematics and programming Learn about probability, calculus, and how to use statistical models to control and clean your data and drive actionable results Build and evaluate baseline machine learning models Explore the most effective metrics to determine the success of your machine learning models Create data visualizations that communicate actionable insights Read and apply machine learning concepts to your problems and make actual predictions In Detail Need to turn your skills at programming into effective data science skills? Principles of Data Science is created to help you join the dots between mathematics, programming, and business analysis. With this book, you\'ll feel confident about asking—and answering—complex and sophisticated questions of your data to move from abstract and raw statistics to actionable ideas. With a unique approach that bridges the gap between mathematics and computer science, this books takes you through the entire data science pipeline. Beginning with cleaning and preparing data, and effective data mining strategies and techniques, you\'ll move on to build a comprehensive picture of how every piece of the data science puzzle fits together. Learn the fundamentals of computational mathematics and statistics, as well as some pseudocode being used today by data scientists and analysts. You\'ll get to grips with machine learning, discover the statistical models that help you take control and navigate even the densest datasets, and find out how to create powerful visualizations that communicate what your data means. Style and approach This is an easy-to-understand and accessible tutorial. It is a step-by-step guide with use cases, examples, and illustrations to get you well-versed with the concepts of data science. Along with explaining the fundamentals, the book will also introduce you to slightly advanced concepts later on and will help you implement these techniques in the real world.', 1, 'http://books.google.com/books/content?id=9NDcDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (222, 'Data Science and Analytics (with Python, R and SPSS Programming)', '9789386173676', NULL, 211, 275, 'en', NULL, 500.00, 10, 'The Book has been written completely as per AICTE recommended syllabus on \"Data Sciences\". SALIENT FEATURES OF THE BOOK: Explains how data is collected, managed and stored for data science. With complete courseware for understand the key concepts in data science including their real-world applications and the toolkit used by data scientists. Implement data collection and management. Provided with state of the arts subjectwise. With all required tutorials on R, Python and Bokeh, Anaconda, IBM SPSS-21 and Matplotlib.', 1, 'http://books.google.com/books/content?id=iiEEEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (223, 'Data Science for Business', '9781449374280', '2013-07-27', 212, 506, 'en', NULL, 600.00, 10, 'Written by renowned data science experts Foster Provost and Tom Fawcett, Data Science for Business introduces the fundamental principles of data science, and walks you through the \"data-analytic thinking\" necessary for extracting useful knowledge and business value from the data you collect. This guide also helps you understand the many data-mining techniques in use today. Based on an MBA course Provost has taught at New York University over the past ten years, Data Science for Business provides examples of real-world business problems to illustrate these principles. You’ll not only learn how to improve communication between business stakeholders and data scientists, but also how participate intelligently in your company’s data science projects. You’ll also discover how to think data-analytically, and fully appreciate how data science methods can support business decision-making. Understand how data science fits in your organization—and how you can use it for competitive advantage Treat data as a business asset that requires careful investment if you’re to gain real value Approach business problems data-analytically, using the data-mining process to gather good data in the most appropriate way Learn general concepts for actually extracting knowledge from data Apply data science principles when interviewing data science job candidates', 1, 'http://books.google.com/books/content?id=4ZctAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (224, 'Data Science for Beginners', '1791620124', '2018-12-12', 213, 83, 'en', NULL, 700.00, 10, 'DATA SCIENCE FOR BEGINNERS Introduction to Data Science: Python,Coding, Application, Statistics,Decision Tree, Neural Network, and Linear Algebra WHAT THIS BOOK WILL DO FOR YOU We will talk about what is the need for data science and then what exactly is data science some definitions and understand. The differences between data science and business intelligence,Then we will talk about the prerequisites for learning data science, and then what does the data scientist do. What are the activities performed by a data scientist as a part of his daily life and then we will talk about the data science lifecycle witha quick example and briefly touch upon the demand or ever-increasing demand for data scientist. Benefits of Data science Data Science: Automobile Data science: Aviation Data science can also be used to make promotional offers. Chapters Data science: Its Advantage Data science: Its Definition Process in data science Difference between business intelligence and data science Prerequisites for data science Machine learning. Data science: Tools and skills in data science. Data Science: Machine-learning algorithms Data science: Life cycle of a data science Data science: Exploratory data analysis Data science: Techniques for exploratory data analysis', 1, 'http://books.google.com/books/content?id=WLy1vwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (225, 'Data Science For Dummies', '9781118841556', '2015-03-09', 214, 408, 'en', NULL, 800.00, 10, '\"Jobs in data science abound, but few people have the data science skills needed to fill these increasingly important roles in organizations. Data Science For Dummies is the perfect starting point for IT professionals and students interested in making sense of their organization\'s massive data sets and applying their findings to real-world business scenarios. From uncovering rich data sources to managing large amounts of data within hardware and software limitations, ensuring consistency in reporting, merging various data sources, and beyond, you\'ll develop the know-how you need to effectively interpret data and tell a story that can be understood by anyone in your organization.\"--Provided by publisher.', 1, 'http://books.google.com/books/content?id=Syy9BgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (226, 'Big Data and Data Science', '9789361522772', '2025-01-03', 215, 112, 'en', NULL, 900.00, 10, 'Big Data and Data Science: Analytics for the Future dives into the fundamentals of big data and data science. We explain the data science life cycle and its major components, such as statistics and visualization, using various programming languages like R. As technology evolves, the significance of data science and big data analytics continues to grow, making this field increasingly important. Our book is designed in a reader-friendly manner, targeting newcomers to data science. Concepts are presented clearly and can be easily implemented through the procedures and algorithms provided. As data collection multiplies exponentially, analytics remains an evolving field with vast career opportunities. We cater to two types of readers: those skeptical about the benefits of big data and predictive analytics, and enthusiasts keen to explore current applications of these technologies. Big data is a fantastic choice for launching a career in IT, and this book equips you with the knowledge needed to succeed. We cover a broad spectrum of topics, ensuring a strong foundation in data science and big data analytics.', 1, 'http://books.google.com/books/content?id=vjJBEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (227, 'Data Science from Scratch', '9781492041108', '2019-04-12', 216, 398, 'en', NULL, 100.00, 10, 'Data science libraries, frameworks, modules, and toolkits are great for doing data science, but they’re also a good way to dive into the discipline without actually understanding data science. With this updated second edition, you’ll learn how many of the most fundamental data science tools and algorithms work by implementing them from scratch. If you have an aptitude for mathematics and some programming skills, author Joel Grus will help you get comfortable with the math and statistics at the core of data science, and with hacking skills you need to get started as a data scientist. Today’s messy glut of data holds answers to questions no one’s even thought to ask. This book provides you with the know-how to dig those answers out.', 1, 'http://books.google.com/books/content?id=YBKSDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (228, 'The Data Science Handbook', '9781394234509', '2024-10-31', 214, 374, 'en', NULL, 200.00, 10, 'Practical, accessible guide to becoming a data scientist, updated to include the latest advances in data science and related fields. Becoming a data scientist is hard. The job focuses on mathematical tools, but also demands fluency with software engineering, understanding of a business situation, and deep understanding of the data itself. This book provides a crash course in data science, combining all the necessary skills into a unified discipline. The focus of The Data Science Handbook is on practical applications and the ability to solve real problems, rather than theoretical formalisms that are rarely needed in practice. Among its key points are: An emphasis on software engineering and coding skills, which play a significant role in most real data science problems. Extensive sample code, detailed discussions of important libraries, and a solid grounding in core concepts from computer science (computer architecture, runtime complexity, and programming paradigms). A broad overview of important mathematical tools, including classical techniques in statistics, stochastic modeling, regression, numerical optimization, and more. Extensive tips about the practical realities of working as a data scientist, including understanding related jobs functions, project life cycles, and the varying roles of data science in an organization. Exactly the right amount of theory. A solid conceptual foundation is required for fitting the right model to a business problem, understanding a tool’s limitations, and reasoning about discoveries. Data science is a quickly evolving field, and this 2nd edition has been updated to reflect the latest developments, including the revolution in AI that has come from Large Language Models and the growth of ML Engineering as its own discipline. Much of data science has become a skillset that anybody can have, making this book not only for aspiring data scientists, but also for professionals in other fields who want to use analytics as a force multiplier in their organization.', 1, 'http://books.google.com/books/content?id=M4wuEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (229, 'Introduction to Data Science and Machine Learning', '9781838803339', '2020-03-25', 217, 233, 'en', NULL, 300.00, 10, 'Introduction to Data Science and Machine Learning has been created with the goal to provide beginners seeking to learn about data science, data enthusiasts, and experienced data professionals with a deep understanding of data science application development using open-source programming from start to finish. This book is divided into four sections: the first section contains an introduction to the book, the second covers the field of data science, software development, and open-source based embedded hardware; the third section covers algorithms that are the decision engines for data science applications; and the final section brings together the concepts shared in the first three sections and provides several examples of data science applications.', 1, 'http://books.google.com/books/content?id=THb-DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (230, 'Data Science and Digital Business', '9783319956510', '2019-01-04', 218, 319, 'en', NULL, 400.00, 10, 'This book combines the analytic principles of digital business and data science with business practice and big data. The interdisciplinary, contributed volume provides an interface between the main disciplines of engineering and technology and business administration. Written for managers, engineers and researchers who want to understand big data and develop new skills that are necessary in the digital business, it not only discusses the latest research, but also presents case studies demonstrating the successful application of data in the digital business.', 1, 'http://books.google.com/books/content?id=fo2CDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (231, 'Trends of Data Science and Applications', '9789813368156', '2021-03-21', 219, 345, 'en', NULL, 500.00, 10, 'This book includes an extended version of selected papers presented at the 11th Industry Symposium 2021 held during January 7–10, 2021. The book covers contributions ranging from theoretical and foundation research, platforms, methods, applications, and tools in all areas. It provides theory and practices in the area of data science, which add a social, geographical, and temporal dimension to data science research. It also includes application-oriented papers that prepare and use data in discovery research. This book contains chapters from academia as well as practitioners on big data technologies, artificial intelligence, machine learning, deep learning, data representation and visualization, business analytics, healthcare analytics, bioinformatics, etc. This book is helpful for the students, practitioners, researchers as well as industry professional.', 1, 'http://books.google.com/books/content?id=ABklEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (232, 'Data Science Quick Reference Manual Analysis and Visualization', NULL, NULL, 220, 221, 'en', NULL, 600.00, 10, 'This work follows the 2021 curriculum of the Association for Computing Machinery for specialists in Data Sciences, with the aim of producing a manual that collects notions in a simplified form, facilitating a personal training path starting from specialized skills in Computer Science or Mathematics or Statistics. It has a bibliography with links to quality material but freely usable for your own training and contextual practical exercises. Second of a series of books, it covers methodological aspects, analysis and visualization. It describes the CRISP DM methodology, the working phases, the success criteria, the languages and the environments that can be used, the application libraries. Since this book uses Orange for the application aspects, its installation and widgets are described. In visualization, historical notes are made, and next the book describes the characteristics of an effective visualization, the types of messages that can be conveyed, the Grammar of Graphics, the use of a graph and a dashboard, the software and libraries that can be used, the role and use of color. 55 types of graphs are then analyzed, reporting meaning, use, examples and visual dimensions also with a vocabulary of graphs and summary tables. Examples are given in Orange and the possible use of Python with Orange is explained. Visualization-based inference is discussed, exploratory and confirmatory analysis is defined and techniques are reported. The book is accompanied by supporting material and it is possible to download the project samples in Orange and sample data.', 1, 'http://books.google.com/books/content?id=TZKgEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (233, 'The Data Science Framework', '9783030510237', '2020-10-01', 219, 202, 'en', NULL, 700.00, 10, 'This edited book first consolidates the results of the EU-funded EDISON project (Education for Data Intensive Science to Open New science frontiers), which developed training material and information to assist educators, trainers, employers, and research infrastructure managers in identifying, recruiting and inspiring the data science professionals of the future. It then deepens the presentation of the information and knowledge gained to allow for easier assimilation by the reader. The contributed chapters are presented in sequence, each chapter picking up from the end point of the previous one. After the initial book and project overview, the chapters present the relevant data science competencies and body of knowledge, the model curriculum required to teach the required foundations, profiles of professionals in this domain, and use cases and applications. The text is supported with appendices on related process models. The book can be used to develop new courses in data science, evaluate existing modules and courses, draft job descriptions, and plan and design efficient data-intensive research teams across scientific disciplines.', 1, 'http://books.google.com/books/content?id=d5EAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (234, 'Data Science', '9780262535434', '2018-04-13', 221, 0, 'en', NULL, 800.00, 10, 'A concise introduction to the emerging field of data science, explaining its evolution, relation to machine learning, current uses, data infrastructure issues, and ethical challenges. The goal of data science is to improve decision making through the analysis of data. Today data science determines the ads we see online, the books and movies that are recommended to us online, which emails are filtered into our spam folders, and even how much we pay for health insurance. This volume in the MIT Press Essential Knowledge series offers a concise introduction to the emerging field of data science, explaining its evolution, current uses, data infrastructure issues, and ethical challenges. It has never been easier for organizations to gather, store, and process data. Use of data science is driven by the rise of big data and social media, the development of high-performance computing, and the emergence of such powerful methods for data analysis and modeling as deep learning. Data science encompasses a set of principles, problem definitions, algorithms, and processes for extracting non-obvious and useful patterns from large datasets. It is closely related to the fields of data mining and machine learning, but broader in scope. This book offers a brief history of the field, introduces fundamental data concepts, and describes the stages in a data science project. It considers data infrastructure and the challenges posed by integrating data from multiple sources, introduces the basics of machine learning, and discusses how to link machine learning expertise with real-world problems. The book also reviews ethical and legal issues, developments in data regulation, and computational approaches to preserving privacy. Finally, it considers the future impact of data science and offers principles for success in data science projects.', 1, 'http://books.google.com/books/content?id=6NuMEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (235, 'Data Science Workflow for Beginners', NULL, NULL, 222, 62, 'en', NULL, 900.00, 10, 'This book brings to you a simple yet effective 40 to 60 mins introduction that will clear all your doubts about Data Sience and will answer some important questions like: What is data Science ? The book explores all the initial concepts a person might want to know about the data science workflow. There’s not coding, math or statistics required to successfully understand the goals and end results of this process. This book takes you on an exclusive tour of datasets and sites to download your first datasets. Then jumps into a comprehensive and easy-to-follow data science process letting you go through 3 data visualization projects. (Python Code Understanding is Recommended for the Data Visualization projects) - 40 to 60 mins reading time. - 3 Data Visualization projects. - 10 Datasets sources. - 26 Quality datasets for your first visualizations. - Get the code and reuse in your own projects. The ebook covers: - Intro to Data Science. - The Workflow of Data Science. - Data Science and Machine Learning. - Datasets to start right away. - Data Visualization Projects. (Python Code Understanding Recommended)', 1, 'http://books.google.com/books/content?id=g1XvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (236, 'Fundamentals of Data Science', '103207986X', '2022-01-01', NULL, 0, 'en', NULL, 100.00, 10, 'Fundamentals of Data Science is designed for students, academicians and practitioners with a complete walkthrough right from the foundational groundwork required to outlining all the concepts, techniques and tools required to understand Data Science.Data Science is an umbrella term for the non-traditional techniques and technologies that are required to collect, aggregate, process, and gain insights from massive datasets. This book offers all the processes, methodologies, various steps like data acquisition, pre-process, mining, prediction, and visualization tools for extracting insights from vast amounts of data by the use of various scientific methods, algorithms, and processesReaders will learn the steps necessary to create the application with SQl, NoSQL, Python, R, Matlab, Octave and Tablue.This book provides a stepwise approach to building solutions to data science applications right from understanding the fundamentals, performing data analytics to writing source code. All the concepts are discussed in simple English to help the community to become Data Scientist without much pre-requisite knowledge.Features:Simple strategies for developing statistical models that analyze data and detect patterns, trends, and relationships in data sets.Complete roadmap to Data Science approach with dedicatedsections which includes Fundamentals, Methodology and Tools. Focussed approach for learning and practice various Data Science Toolswith Sample code and examples for practice.Information is presented in an accessible way for students, researchers and academicians and professionals.', 1, 'http://books.google.com/books/content?id=0M_BzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (237, 'Python for Data Science For Dummies', '9781394213092', '2023-10-03', 214, 471, 'en', NULL, 200.00, 10, 'Let Python do the heavy lifting for you as you analyze large datasets Python for Data Science For Dummies lets you get your hands dirty with data using one of the top programming languages. This beginner’s guide takes you step by step through getting started, performing data analysis, understanding datasets and example code, working with Google Colab, sampling data, and beyond. Coding your data analysis tasks will make your life easier, make you more in-demand as an employee, and open the door to valuable knowledge and insights. This new edition is updated for the latest version of Python and includes current, relevant data examples. Get a firm background in the basics of Python coding for data analysis Learn about data science careers you can pursue with Python coding skills Integrate data analysis with multimedia and graphics Manage and organize data with cloud-based relational databases Python careers are on the rise. Grab this user-friendly Dummies guide and gain the programming skills you need to become a data pro.', 1, 'http://books.google.com/books/content?id=YfPaEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (238, 'Data Science for Business Professionals', '9789389423280', '2020-05-06', 207, 376, 'en', NULL, 300.00, 10, 'Primer into the multidisciplinary world of Data Science KEY FEATURESÊÊ - Explore and use the key concepts of Statistics required to solve data science problems - Use Docker, Jenkins, and Git for Continuous Development and Continuous Integration of your web app - Learn how to build Data Science solutions with GCP and AWS DESCRIPTIONÊ The book will initially explain the What-Why of Data Science and the process of solving a Data Science problem. The fundamental concepts of Data Science, such as Statistics, Machine Learning, Business Intelligence, Data pipeline, and Cloud Computing, will also be discussed. All the topics will be explained with an example problem and will show how the industry approaches to solve such a problem. The book will pose questions to the learners to solve the problems and build the problem-solving aptitude and effectively learn. The book uses Mathematics wherever necessary and will show you how it is implemented using Python with the help of an example dataset.Ê WHAT WILL YOU LEARNÊÊ - Understand the multi-disciplinary nature of Data Science - Get familiar with the key concepts in Mathematics and Statistics - Explore a few key ML algorithms and their use cases - Learn how to implement the basics of Data Pipelines - Get an overview of Cloud Computing & DevOps - Learn how to create visualizations using Tableau WHO THIS BOOK IS FORÊ This book is ideal for Data Science enthusiasts who want to explore various aspects of Data Science. Useful for Academicians, Business owners, and Researchers for a quick reference on industrial practices in Data Science.Ê TABLE OF CONTENTS 1. Data Science in Practice 2. Mathematics Essentials 3. Statistics Essentials 4. Exploratory Data Analysis 5. Data preprocessing 6. Feature Engineering 7. Machine learning algorithms 8. Productionizing ML models 9. Data Flows in Enterprises 10. Introduction to Databases 11. Introduction to Big Data 12. DevOps for Data Science 13. Introduction to Cloud Computing 14. Deploy Model to Cloud 15. Introduction to Business IntelligenceÊ 16. Data Visualization Tools 17. Industry Use Case 1 Ð FormAssist 18. Industry Use Case 2 Ð PeopleReporter 19. Data Science Learning Resources 20. Do It Your Self Challenges 21. MCQs for Assessments', 1, 'http://books.google.com/books/content?id=A4ThDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (239, 'Data Science Quick Reference Manual - Modeling and Machine Learning', NULL, NULL, 223, 191, 'en', NULL, 400.00, 10, 'This work follows the 2021 curriculum of the Association for Computing Machinery for specialists in Data Sciences, with the aim of producing a manual that collects notions in a simplified form, facilitating a personal training path starting from specialized skills in Computer Science or Mathematics or Statistics. It has a bibliography with links to quality material but freely usable for your own training and contextual practical exercises. Part of a series of books, it first summarizes the standard CRISP DM working methodology used in this work and in Data Science projects. Since this text uses Orange for the application aspects, it describes its installation and widgets. Then it considers the concept of model, its life cycle and the relationship with measures and metrics. The data modeling phase is considered from the point of view of machine learning by deepening the types of machine learning, the types of models, the types of problems and the types of algorithms. After considering the ideal characteristics of models and algorithms, a vocabulary of the types of models and algorithms is compiled and their use in Orange is considered through two supervised and unsupervised projects respectively. The text is accompanied by supporting material and you can download the samples in Orange and the test data.', 1, 'http://books.google.com/books/content?id=IEDUEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (240, 'Machine Learning For Dummies', '9781119245513', '2016-05-31', 214, 432, 'en', NULL, 500.00, 10, 'Your no-nonsense guide to making sense of machine learning Machine learning can be a mind-boggling concept for the masses, but those who are in the trenches of computer programming know just how invaluable it is. Without machine learning, fraud detection, web search results, real-time ads on web pages, credit scoring, automation, and email spam filtering wouldn\'t be possible, and this is only showcasing just a few of its capabilities. Written by two data science experts, Machine Learning For Dummies offers a much-needed entry point for anyone looking to use machine learning to accomplish practical tasks. Covering the entry-level topics needed to get you familiar with the basic concepts of machine learning, this guide quickly helps you make sense of the programming languages and tools you need to turn machine learning-based tasks into a reality. Whether you\'re maddened by the math behind machine learning, apprehensive about AI, perplexed by preprocessing data—or anything in between—this guide makes it easier to understand and implement machine learning seamlessly. Grasp how day-to-day activities are powered by machine learning Learn to \'speak\' certain languages, such as Python and R, to teach machines to perform pattern-oriented tasks and data analysis Learn to code in R using R Studio Find out how to code in Python using Anaconda Dive into this complete beginner\'s guide so you are armed with all you need to know about machine learning!', 1, 'http://books.google.com/books/content?id=JLEyDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (241, 'হাতেকলমে মেশিন লার্নিং - Hatekalame Machine Learning', NULL, NULL, 224, 204, 'bn', NULL, 600.00, 10, 'ডাটা নির্ভর পৃথিবীতে বাঁচতে হলে জানতে হবে এর ভেতরের কারুকাজ। আপনার অজান্তে শুধুমাত্র হাতের ফোনটাই তৈরি করছে হাজারো ডাটা, প্রতিদিন। আপনার এবং অন্যের ব্যবহারে। প্রচুর ডাটা আর অসম্ভব কম্পিউটেশনাল ক্ষমতা আমাদেরকে দেখাচ্ছে ভবিষ্যৎ দেখার নতুন পেশা। যারা ডাটাকে নিয়ে ভবিষ্যৎ ক্যারিয়ার গড়তে চান - তাদেরকে লক্ষ্য করে তৈরি করা হয়েছে বইটা। কম্পিউটারের ফিল্ড নয়, বরং সব পেশাজীবীদের জন্য একটু আলাদা ধারণা দিয়ে লেখা হয়েছে শুরু থেকে। সেকারণে এটা কোন স্পেসিফিক ‘ল্যাঙ্গুয়েজ’ নির্ভর নয়। বরং, কনসেপ্টের পেছনে জোর দেয়া হয়েছে শুরু থেকে শেষ পর্যন্ত। শুরুতে বুঝতে পারে সবাই, এমন একটা প্ল্যাটফর্ম নিয়ে আলাপ হয়েছে - যার শুরুটা শিখতে লাগে দুই দিন। পরের বইগুলোতে আস্তে আস্তে আপনাকে নিয়ে যাবে প্রযুক্তির ভেতরে। আপনার অজান্তে। ডাটাকে চিনতে - একদম ভেতর থেকে। ডাটা পেশাজীবীর হাত ধরে। বোঝার সুবিধার্থে বইয়ের শুরুটা হয়েছে “আর” প্রোগ্রামিং এনভায়রনমেন্ট দিয়ে। পাশাপাশি পুরো এক্সারসাইজটা করে দেয়া আছে পাইথনে। প্রযুক্তিবিদ নয়, আপনি যে পেশারই হোন না কেন, ভবিষ্যৎ দেখতে চাইলে দরকার এই বই। মানুষ ভবিষ্যৎ দেখতে পারে না - ব্যাপারটা ঠিক নয় একদম। সবার জন্য লেখা এই বইটা পড়লে বুঝবেন কি ‘মিস’ করেছেন এতোদিন! নিশ্চিতভাবে বলা যায় - চিন্তা ধারণা পাল্টে যাবে আপনার। আজকের পর থেকে। হাতে কলমে অংশটুকু তৈরি করা হয়েছে দশম থেকে দ্বাদশ শ্রেণীর ছাত্রছাত্রীদের লক্ষ্য করে।', 1, 'http://books.google.com/books/content?id=7xbpDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Antiques & Collectibles', 204);
INSERT INTO `book` VALUES (242, 'Machine Learning', '9781000867169', '2023-05-17', 225, 478, 'en', NULL, 700.00, 10, 'Machine Learning: Concepts, Techniques and Applications starts at basic conceptual level of explaining machine learning and goes on to explain the basis of machine learning algorithms. The mathematical foundations required are outlined along with their associations to machine learning. The book then goes on to describe important machine learning algorithms along with appropriate use cases. This approach enables the readers to explore the applicability of each algorithm by understanding the differences between them. A comprehensive account of various aspects of ethical machine learning has been discussed. An outline of deep learning models is also included. The use cases, self-assessments, exercises, activities, numerical problems, and projects associated with each chapter aims to concretize the understanding. Features Concepts of Machine learning from basics to algorithms to implementation Comparison of Different Machine Learning Algorithms – When to use them & Why – for Application developers and Researchers Machine Learning from an Application Perspective – General & Machine learning for Healthcare, Education, Business, Engineering Applications Ethics of machine learning including Bias, Fairness, Trust, Responsibility Basics of Deep learning, important deep learning models and applications Plenty of objective questions, Use Cases, Activity and Project based Learning Exercises The book aims to make the thinking of applications and problems in terms of machine learning possible for graduate students, researchers and professionals so that they can formulate the problems, prepare data, decide features, select appropriate machine learning algorithms and do appropriate performance evaluation.', 1, 'http://books.google.com/books/content?id=iKEIEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (243, 'Machine Learning', '9781000737691', '2022-09-29', 225, 212, 'en', NULL, 800.00, 10, 'The book reviews core concepts of machine learning (ML) while focusing on modern applications. It is aimed at those who want to advance their understanding of ML by providing technical and practical insights. It does not use complicated mathematics to explain how to benefit from ML algorithms. Unlike the existing literature, this work provides the core concepts with emphasis on fresh ideas and real application scenarios. It starts with the basic concepts of ML and extends the concepts to the different deep learning algorithms. The book provides an introduction and main elements of evaluation tools with Python and walks you through the recent applications of ML in self-driving cars, cognitive decision making, communication networks, security, and signal processing. The concept of generative networks is also presented and focuses on GANs as a tool to improve the performance of existing algorithms. In summary, this book provides a comprehensive technological path from fundamental theories to the categorization of existing algorithms, covers state-of-the-art, practical evaluation tools and methods to empower you to use synthetic data to improve the performance of applications.', 1, 'http://books.google.com/books/content?id=Nud4EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (244, 'A Compendium of Machine Learning: Symbolic machine learning', NULL, '1996-01-01', 226, 386, 'en', NULL, 900.00, 10, 'Machine learning is a relatively new branch of artificial intelligence. The field has undergone a significant period of growth in the 1990s, with many new areas of research and development being explored.', 1, 'http://books.google.com/books/content?id=s2hQAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (245, 'Machine Learning', '9789533070339', '2010-02-01', 217, 448, 'en', NULL, 100.00, 10, 'Machine learning techniques have the potential of alleviating the complexity of knowledge acquisition. This book presents today’s state and development tendencies of machine learning. It is a multi-author book. Taking into account the large amount of knowledge about machine learning and practice presented in the book, it is divided into three major parts: Introduction, Machine Learning Theory and Applications. Part I focuses on the introduction to machine learning. The author also attempts to promote a new design of thinking machines and development philosophy. Considering the growing complexity and serious difficulties of information processing in machine learning, in Part II of the book, the theoretical foundations of machine learning are considered, and they mainly include self-organizing maps (SOMs), clustering, artificial neural networks, nonlinear control, fuzzy system and knowledge-based system (KBS). Part III contains selected applications of various machine learning approaches, from flight delays, network intrusion, immune system, ship design to CT and RNA target prediction. The book will be of interest to industrial engineers and scientists as well as academics who wish to pursue machine learning. The book is intended for both graduate and postgraduate students in fields such as computer science, cybernetics, system sciences, engineering, statistics, and social sciences, and as a reference for software professionals and practitioners.', 1, 'http://books.google.com/books/content?id=pgmhDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Games & Activities', 205);
INSERT INTO `book` VALUES (246, 'Machine Learning and Artificial Intelligence', '9783031122828', '2022-12-16', 219, 279, 'en', NULL, 200.00, 10, 'The new edition of this popular professional book on artificial intelligence (ML) and machine learning (ML) has been revised for classroom or training use. The new edition provides comprehensive coverage of combined AI and ML theory and applications. Rather than looking at the field from only a theoretical or only a practical perspective, this book unifies both perspectives to give holistic understanding. The first part introduces the concepts of AI and ML and their origin and current state. The second and third parts delve into conceptual and theoretic aspects of static and dynamic ML techniques. The fourth part describes the practical applications where presented techniques can be applied. The fifth part introduces the user to some of the implementation strategies for solving real life ML problems. Each chapter is accompanied with a set of exercises that will help the reader / student to apply the learnings from the chapter to a real-life problem. Completion of these exercises will help the reader / student to solidify the concepts learned. The book is appropriate for students in graduate and upper undergraduate courses in addition to researchers and professionals. It makes minimal use of mathematics to make the topics more intuitive and accessible. The book covers a large gamut of topics in the area of AI and ML and a professor can tailor a course on AI / ML based on the book by selecting and re-organizing the sequence of chapters to suit the needs.', 1, 'http://books.google.com/books/content?id=S9ekEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Technology & Engineering', 206);
INSERT INTO `book` VALUES (247, 'Introduction to Machine Learning', '155860037X', '1988-01-01', 227, 308, 'en', NULL, 300.00, 10, 'A textbook suitable for undergraduate courses in machine learning and related topics, this book provides a broad survey of the field. Generous exercises and examples give students a firm grasp of the concepts and techniques of this rapidly developing, challenging subject. Introduction to Machine Learning synthesizes and clarifies the work of leading researchers, much of which is otherwise available only in undigested technical reports, journals, and conference proceedings. Beginning with an overview suitable for undergraduate readers, Kodratoff establishes a theoretical basis for machine learning and describes its technical concepts and major application areas. Relevant logic programming examples are given in Prolog. Introduction to Machine Learning is an accessible and original introduction to a significant research area.', 1, 'http://books.google.com/books/content?id=SY789Y7Fc14C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (248, 'Pro Machine Learning Algorithms', '9781484235645', '2018-06-30', 228, 379, 'en', NULL, 400.00, 10, 'Bridge the gap between a high-level understanding of how an algorithm works and knowing the nuts and bolts to tune your models better. This book will give you the confidence and skills when developing all the major machine learning models. In Pro Machine Learning Algorithms, you will first develop the algorithm in Excel so that you get a practical understanding of all the levers that can be tuned in a model, before implementing the models in Python/R. You will cover all the major algorithms: supervised and unsupervised learning, which include linear/logistic regression; k-means clustering; PCA; recommender system; decision tree; random forest; GBM; and neural networks. You will also be exposed to the latest in deep learning through CNNs, RNNs, and word2vec for text mining. You will be learning not only the algorithms, but also the concepts of feature engineering to maximize the performance of a model. You will see the theory along with case studies, such as sentiment classification, fraud detection, recommender systems, and image recognition, so that you get the best of both theory and practice for the vast majority of the machine learning algorithms used in industry. Along with learning the algorithms, you will also be exposed to running machine-learning models on all the major cloud service providers. You are expected to have minimal knowledge of statistics/software programming and by the end of this book you should be able to work on a machine learning project with confidence. What You Will Learn Get an in-depth understanding of all the major machine learning and deep learning algorithms Fully appreciate the pitfalls to avoid while building models Implement machine learning algorithms in the cloud Follow a hands-on approach through case studies for each algorithm Gain the tricks of ensemble learning to build more accurate models Discover the basics of programming in R/Python and the Keras framework for deep learning Who This Book Is For Business analysts/ IT professionals who want to transition into data science roles. Data scientists who want to solidify their knowledge in machine learning.', 1, 'http://books.google.com/books/content?id=DKNiDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (249, 'Machine Learning Quick Reference', '1788830571', '2019-01-31', 229, 294, 'en', NULL, 500.00, 10, 'Your hands-on reference guide to developing, training, and optimizing your machine learning models Key Features Your guide to learning efficient machine learning processes from scratch Explore expert techniques and hacks for a variety of machine learning concepts Write effective code in R, Python, Scala, and Spark to solve all your machine learning problems Book Description Machine learning makes it possible to learn about the unknowns and gain hidden insights into your datasets by mastering many tools and techniques. This book guides you to do just that in a very compact manner. After giving a quick overview of what machine learning is all about, Machine Learning Quick Reference jumps right into its core algorithms and demonstrates how they can be applied to real-world scenarios. From model evaluation to optimizing their performance, this book will introduce you to the best practices in machine learning. Furthermore, you will also look at the more advanced aspects such as training neural networks and work with different kinds of data, such as text, time-series, and sequential data. Advanced methods and techniques such as causal inference, deep Gaussian processes, and more are also covered. By the end of this book, you will be able to train fast, accurate machine learning models at your fingertips, which you can easily use as a point of reference. What you will learn Get a quick rundown of model selection, statistical modeling, and cross-validation Choose the best machine learning algorithm to solve your problem Explore kernel learning, neural networks, and time-series analysis Train deep learning models and optimize them for maximum performance Briefly cover Bayesian techniques and sentiment analysis in your NLP solution Implement probabilistic graphical models and causal inferences Measure and optimize the performance of your machine learning models Who this book is for If you\'re a machine learning practitioner, data scientist, machine learning developer, or engineer, this book will serve as a reference point in building machine learning solutions. You will also find this book useful if you\'re an intermediate machine learning developer or data scientist looking for a quick, handy reference to all the concepts of machine learning. You\'ll need some exposure to machine learning to get the best out of this book.', 1, 'http://books.google.com/books/content?id=eExEuwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (250, 'Understanding Machine Learning', '9781107057135', '2014-05-19', 230, 415, 'en', NULL, 600.00, 10, 'Introduces machine learning and its algorithmic paradigms, explaining the principles behind automated learning approaches and the considerations underlying their usage.', 1, 'http://books.google.com/books/content?id=ttJkAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (251, 'Machine Learning and Data Mining', '9780857099440', '2007-04-30', 231, 475, 'en', NULL, 700.00, 10, 'Data mining is often referred to by real-time users and software solutions providers as knowledge discovery in databases (KDD). Good data mining practice for business intelligence (the art of turning raw software into meaningful information) is demonstrated by the many new techniques and developments in the conversion of fresh scientific discovery into widely accessible software solutions. This book has been written as an introduction to the main issues associated with the basics of machine learning and the algorithms used in data mining.Suitable for advanced undergraduates and their tutors at postgraduate level in a wide area of computer science and technology topics as well as researchers looking to adapt various algorithms for particular data mining tasks. A valuable addition to the libraries and bookshelves of the many companies who are using the principles of data mining (or KDD) to effectively deliver solid business and industry solutions. - Provides an introduction to the main issues associated with the basics of machine learning and the algorithms used in data mining - A valuable addition to the libraries and bookshelves of companies using the principles of data mining (or KDD) to effectively deliver solid business and industry solutions', 1, 'http://books.google.com/books/content?id=NUikAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (252, 'Machine Learning Applications', '9788233971786', '2025-02-18', 232, 131, 'en', NULL, 800.00, 10, 'Machine Learning Applications explores the transformative impact of machine learning across healthcare, finance, and transportation. Moving beyond theory, it highlights real-world applications of algorithms in these vital sectors. For instance, machine learning powers diagnostics in healthcare, enabling image recognition for disease detection, and enhances algorithmic trading in finance, automating investment strategies. The book examines how machine learning, a subset of artificial intelligence, automates complex tasks and derives insights from vast datasets. It begins with fundamental principles, progresses through case studies in each sector, and concludes with ethical considerations and future trends. One intriguing insight is its role in predictive maintenance within transportation, anticipating equipment failures. This book stands out by bridging the gap between theoretical knowledge and practical uses, making it valuable for professionals and students alike. By focusing on tangible implementations and real-world examples, Machine Learning Applications empowers readers to apply these techniques effectively.', 1, 'http://books.google.com/books/content?id=F2FJEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (253, 'Robust Machine Learning', '9789819706884', '2024-04-04', 219, 180, 'en', NULL, 900.00, 10, 'Today, machine learning algorithms are often distributed across multiple machines to leverage more computing power and more data. However, the use of a distributed framework entails a variety of security threats. In particular, some of the machines may misbehave and jeopardize the learning procedure. This could, for example, result from hardware and software bugs, data poisoning or a malicious player controlling a subset of the machines. This book explains in simple terms what it means for a distributed machine learning scheme to be robust to these threats, and how to build provably robust machine learning algorithms. Studying the robustness of machine learning algorithms is a necessity given the ubiquity of these algorithms in both the private and public sectors. Accordingly, over the past few years, we have witnessed a rapid growth in the number of articles published on the robustness of distributed machine learning algorithms. We believe it is time to provide a clear foundation to this emerging and dynamic field. By gathering the existing knowledge and democratizing the concept of robustness, the book provides the basis for a new generation of reliable and safe machine learning schemes. In addition to introducing the problem of robustness in modern machine learning algorithms, the book will equip readers with essential skills for designing distributed learning algorithms with enhanced robustness. Moreover, the book provides a foundation for future research in this area.', 1, 'http://books.google.com/books/content?id=3_X-EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Mathematics', 207);
INSERT INTO `book` VALUES (254, 'Machine Learning for Decision Makers', '9781484229880', '2018-01-04', 228, 381, 'en', NULL, 100.00, 10, 'Take a deep dive into the concepts of machine learning as they apply to contemporary business and management. You will learn how machine learning techniques are used to solve fundamental and complex problems in society and industry. Machine Learning for Decision Makers serves as an excellent resource for establishing the relationship of machine learning with IoT, big data, and cognitive and cloud computing to give you an overview of how these modern areas of computing relate to each other. This book introduces a collection of the most important concepts of machine learning and sets them in context with other vital technologies that decision makers need to know about. These concepts span the process from envisioning the problem to applying machine-learning techniques to your particular situation. This discussion also provides an insight to help deploy the results to improve decision-making. The book usescase studies and jargon busting to help you grasp the theory of machine learning quickly. You\'ll soon gain the big picture of machine learning and how it fits with other cutting-edge IT services. This knowledge will give you confidence in your decisions for the future of your business. What You Will Learn Discover the machine learning, big data, and cloud and cognitive computing technology stack Gain insights into machine learning concepts and practices Understand business and enterprise decision-making using machine learning Absorb machine-learning best practices Who This Book Is For Managers tasked with making key decisions who want to learn how and when machine learning and related technologies can help them.', 1, 'http://books.google.com/books/content?id=YKVFDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (255, 'AWS certification guide - AWS Certified Machine Learning - Specialty', '9798871220535', NULL, 233, 167, 'en', NULL, 200.00, 10, 'AWS Certification Guide - AWS Certified Machine Learning – Specialty Unleash the Potential of AWS Machine Learning Embark on a comprehensive journey into the world of machine learning on AWS with this essential guide, tailored for those pursuing the AWS Certified Machine Learning – Specialty certification. This book is a valuable resource for professionals seeking to harness the power of AWS for machine learning applications. Inside, You\'ll Explore: Foundational to Advanced ML Concepts: Understand the breadth of AWS machine learning services and tools, from SageMaker to DeepLens, and learn how to apply them in various scenarios. Practical Machine Learning Scenarios: Delve into real-world examples and case studies, illustrating the practical applications of AWS machine learning technologies in different industries. Targeted Exam Preparation: Navigate the certification exam with confidence, thanks to detailed insights into the exam format, including specific chapters aligned with the certification objectives and comprehensive practice questions. Latest Trends and Best Practices: Stay at the forefront of machine learning advancements with up-to-date coverage of the latest AWS features and industry best practices. Written by a Machine Learning Expert Authored by an experienced practitioner in AWS machine learning, this guide combines in-depth knowledge with practical insights, providing a rich and comprehensive learning experience. Your Comprehensive Resource for ML Certification Whether you are deepening your existing machine learning skills or embarking on a new specialty in AWS, this book is your definitive companion, offering an in-depth exploration of AWS machine learning services and preparing you for the Specialty certification exam. Advance Your Machine Learning Career Beyond preparing for the exam, this guide is about mastering the complexities of AWS machine learning. It\'s a pathway to developing expertise that can be applied in innovative and transformative ways across various sectors. Start Your Specialized Journey in AWS Machine Learning Set off on your path to becoming an AWS Certified Machine Learning specialist. This guide is your first step towards mastering AWS machine learning and unlocking new opportunities in this exciting and rapidly evolving field. © 2023 Cybellium Ltd. All rights reserved. www.cybellium.com', 1, 'http://books.google.com/books/content?id=zfboEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (256, 'Machine Learning & AI', NULL, '2023-08-01', 234, 250, 'en', NULL, 300.00, 10, 'Discover the extraordinary possibilities of machine learning and artificial intelligence in this groundbreaking exploration. From self-driving cars to virtual assistants, this book delves into the fascinating world of algorithms and how they are transforming industries and revolutionizing our lives. Explore the inner workings of neural networks, deep learning models, and predictive analytics, and witness the profound impact they have on decision-making, problem-solving, and data analysis. Whether you\'re a novice or an expert in the field, prepare to be captivated by the limitless potential of machine learning and AI.', 1, 'http://books.google.com/books/content?id=quXAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Education', 208);
INSERT INTO `book` VALUES (257, 'Building Machine Learning Pipelines', '9781492053163', '2020-07-13', 216, 367, 'en', NULL, 400.00, 10, 'Companies are spending billions on machine learning projects, but it’s money wasted if the models can’t be deployed effectively. In this practical guide, Hannes Hapke and Catherine Nelson walk you through the steps of automating a machine learning pipeline using the TensorFlow ecosystem. You’ll learn the techniques and tools that will cut deployment time from days to minutes, so that you can focus on developing new models rather than maintaining legacy systems. Data scientists, machine learning engineers, and DevOps engineers will discover how to go beyond model development to successfully productize their data science projects, while managers will better understand the role they play in helping to accelerate these projects. Understand the steps to build a machine learning pipeline Build your pipeline using components from TensorFlow Extended Orchestrate your machine learning pipeline with Apache Beam, Apache Airflow, and Kubeflow Pipelines Work with data using TensorFlow Data Validation and TensorFlow Transform Analyze a model in detail using TensorFlow Model Analysis Examine fairness and bias in your model performance Deploy models with TensorFlow Serving or TensorFlow Lite for mobile devices Learn privacy-preserving machine learning techniques', 1, 'http://books.google.com/books/content?id=H6_wDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (258, 'Fundamental of Machine Learning', NULL, '2022-09-15', 235, 191, 'en', NULL, 500.00, 10, '', 1, 'http://books.google.com/books/content?id=-XCJEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (259, 'Artificial Intelligence and Machine Learning Techniques for Civil Engineering', '9781668456446', '2023-06-05', 236, 404, 'en', NULL, 600.00, 10, 'In recent years, artificial intelligence (AI) has drawn significant attention with respect to its applications in several scientific fields, varying from big data handling to medical diagnosis. A tremendous transformation has taken place with the emerging application of AI. AI can provide a wide range of solutions to address many challenges in civil engineering. Artificial Intelligence and Machine Learning Techniques for Civil Engineering highlights the latest technologies and applications of AI in structural engineering, transportation engineering, geotechnical engineering, and more. It features a collection of innovative research on the methods and implementation of AI and machine learning in multiple facets of civil engineering. Covering topics such as damage inspection, safety risk management, and information modeling, this premier reference source is an essential resource for engineers, government officials, business leaders and executives, construction managers, students and faculty of higher education, librarians, researchers, and academicians.', 1, 'http://books.google.com/books/content?id=RXeiEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Technology & Engineering', 206);
INSERT INTO `book` VALUES (260, 'Web Developer\'s Reference Guide', '9781783552146', '2016-03-28', 204, 838, 'en', NULL, 700.00, 10, 'A one-stop guide to the essentials of web development including popular frameworks such as jQuery, Bootstrap, AngularJS, and Node.js About This Book Understand the essential elements of HTML, CSS, and JavaScript, including how and when to use them Walk through three of the best and most popular web development frameworks – jQuery, Bootstrap, and AngularJS References for any function you will need in your day-to-day web development Who This Book Is For This book is perfect for beginners but more advanced web developers will also benefit. Laid out so you can refer to as much or as little as you need to, with this book you can exhaustively explore essential concepts for modern web developers. What You Will Learn Explore detailed explanations of all the major HTML elements and attributes, illustrated with examples Take a deep dive into CSS properties and functions and master their usage Find clear, concise descriptions of JavaScript syntax and expressions Recognize various JavaScript design patterns and learn the basics of JavaScript object-orientated programming Implement the latest ECMAScript 6 for client-side scripting in your web applications Discover new ways to develop your website\'s front end quickly and easily using Bootstrap Write JavaScript extensibly using jQuery-JavaScript\'s feature-rich library Delve into the key Node.js modules used in JavaScript server-side programming Access AngularJS \'s important modules, controllers, directives, and services quickly In Detail This comprehensive reference guide takes you through each topic in web development and highlights the most popular and important elements of each area. Starting with HTML, you will learn key elements and attributes and how they relate to each other. Next, you will explore CSS pseudo-classes and pseudo-elements, followed by CSS properties and functions. This will introduce you to many powerful and new selectors. You will then move on to JavaScript. This section will not just introduce functions, but will provide you with an entire reference for the language and paradigms. You will discover more about three of the most popular frameworks today—Bootstrap, which builds on CSS, jQuery which builds on JavaScript, and AngularJS, which also builds on JavaScript. Finally, you will take a walk-through Node.js, which is a server-side framework that allows you to write programs in JavaScript. Style and approach This book is an easy-to-follow, comprehensive reference guide. Each topic, function, or element is listed methodically along with parameters, return values, and descriptions. Examples are also included to help you put the concepts to use quickly in the real world.', 1, 'http://books.google.com/books/content?id=Fp3jCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (261, 'WEB DEVELOPMENT', NULL, '2024-03-04', 237, 321, 'en', NULL, 800.00, 10, 'If you need a free PDF practice set of this book for your studies, feel free to reach out to me at cbsenet4u@gmail.com, and I\'ll send you a copy! THE WEB DEVELOPMENT MCQ (MULTIPLE CHOICE QUESTIONS) SERVES AS A VALUABLE RESOURCE FOR INDIVIDUALS AIMING TO DEEPEN THEIR UNDERSTANDING OF VARIOUS COMPETITIVE EXAMS, CLASS TESTS, QUIZ COMPETITIONS, AND SIMILAR ASSESSMENTS. WITH ITS EXTENSIVE COLLECTION OF MCQS, THIS BOOK EMPOWERS YOU TO ASSESS YOUR GRASP OF THE SUBJECT MATTER AND YOUR PROFICIENCY LEVEL. BY ENGAGING WITH THESE MULTIPLE-CHOICE QUESTIONS, YOU CAN IMPROVE YOUR KNOWLEDGE OF THE SUBJECT, IDENTIFY AREAS FOR IMPROVEMENT, AND LAY A SOLID FOUNDATION. DIVE INTO THE WEB DEVELOPMENT MCQ TO EXPAND YOUR WEB DEVELOPMENT KNOWLEDGE AND EXCEL IN QUIZ COMPETITIONS, ACADEMIC STUDIES, OR PROFESSIONAL ENDEAVORS. THE ANSWERS TO THE QUESTIONS ARE PROVIDED AT THE END OF EACH PAGE, MAKING IT EASY FOR PARTICIPANTS TO VERIFY THEIR ANSWERS AND PREPARE EFFECTIVELY.', 1, 'http://books.google.com/books/content?id=KhP5EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Juvenile Nonfiction', 209);
INSERT INTO `book` VALUES (262, 'Introduction to Web Development', '9789368422341', '2024-03-12', 200, 205, 'en', NULL, 900.00, 10, 'EduGorilla Publication is a trusted name in the education sector, committed to empowering learners with high-quality study materials and resources. Specializing in competitive exams and academic support, EduGorilla provides comprehensive and well-structured content tailored to meet the needs of students across various streams and levels.', 1, 'http://books.google.com/books/content?id=juFQEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (263, 'Learn Java for Web Development', '9781430259831', '2014-02-15', 228, 461, 'en', NULL, 100.00, 10, 'AngularJS is the leading framework for building dynamic JavaScript applications that take advantage of the capabilities of modern browsers and devices. AngularJS, which is maintained by Google, brings the power of the Model-View-Controller (MVC) pattern to the client, providing the foundation for complex and rich web apps. It allows you to build applications that are smaller, faster, and with a lighter resource footprint than ever before.Best-selling author Adam Freeman explains how to get the most from AngularJS. He begins by describing the MVC pattern and the many benefits that can be gained...', 1, 'http://books.google.com/books/content?id=werfAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (264, 'Mastering Web development', '9798870038957', NULL, 233, 197, 'en', NULL, 200.00, 10, 'Unleash Your Potential in Web Development with \"Mastering Web Development\" In today\'s digital age, web development is a skill that empowers individuals and organizations to create impactful online experiences, from websites and web applications to e-commerce platforms. Mastering web development opens the doors to limitless possibilities, whether you\'re a seasoned developer or just starting on your coding journey. \"Mastering Web Development\" is your comprehensive guide to becoming a proficient web developer, providing you with the knowledge, skills, and strategies to create dynamic and cutting-edge web solutions. Your Path to Web Development Excellence Web development is more than just writing code—it\'s about crafting user-friendly, responsive, and visually engaging websites and applications. Whether you\'re new to web development or looking to expand your skills, this book will empower you to master the art of web development. What You Will Discover Foundations of Web Development: Gain a strong understanding of HTML, CSS, and JavaScript—the core building blocks of the web. Front-End Development: Dive into front-end technologies, including responsive design, UI/UX principles, and popular front-end frameworks. Back-End Development: Explore back-end programming languages, server-side scripting, and databases to create dynamic web applications. Web Development Tools: Master the use of essential web development tools, such as code editors, version control, and debugging tools. Web Security: Learn best practices for securing web applications and protecting against common security threats. Web Development Trends: Stay up-to-date with the latest trends in web development, including Progressive Web Apps (PWAs) and Single Page Applications (SPAs). Why \"Mastering Web Development\" Is Essential Comprehensive Coverage: This book provides comprehensive coverage of web development topics, ensuring that you have a well-rounded understanding of web technologies and practices. Expert Guidance: Benefit from insights and advice from experienced web developers and industry experts who share their knowledge and best practices. Career Advancement: Web development skills are in high demand, and this book will help you unlock your full potential in this dynamic field. Stay Competitive: In a digitally-driven world, mastering web development is vital for staying competitive and creating impactful online experiences. Your Journey to Web Development Mastery Begins Here \"Mastering Web Development\" is your roadmap to excelling in the world of web development and advancing your career. Whether you aspire to be a front-end developer, back-end developer, or full-stack developer, this guide will equip you with the skills and knowledge to achieve your goals. Don\'t miss the opportunity to become a proficient web developer. Start your journey to web development mastery today and join the ranks of professionals who are shaping the digital landscape. \"Mastering Web Development\" is the ultimate resource for individuals seeking to excel in the field of web development. Whether you are new to web development or looking to enhance your skills, this book will provide you with the knowledge and strategies to become a proficient web developer. Don\'t wait; begin your journey to web development mastery today! © 2023 Cybellium Ltd. All rights reserved. www.cybellium.com', 1, 'http://books.google.com/books/content?id=0bfnEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (265, 'Human Factors and Web Development', '9781135634995', '2002-08-01', 225, 355, 'en', NULL, 300.00, 10, 'Due to the ever-changing technological landscape and the global integration of the Internet in schools, libraries, homes, and businesses, the content of this second edition changed significantly. Since many computer users are connected at both home and work, the Web has transformed communication; consumption patterns; and access to business, politi', 1, 'http://books.google.com/books/content?id=jVauDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (266, 'JavaScript Frameworks for Modern Web Development', '9781484249956', '2019-10-31', 228, 555, 'en', NULL, 400.00, 10, 'Enrich your software design skills and take a guided tour of the wild, vast, and untamed frontier that is JavaScript development. Especially useful for frontend developers, this revision includes specific chapters on React and VueJS, as well as an updated one on Angular. To help you get the most of your new skills, each chapter also has a \"further reading\" section. This book will serve as an introduction to both new and well established libraries and frameworks, such as Angular, VueJS, React, Grunt, Yeoman, RequireJS, Browserify, Knockout, Kraken, Async.js, Underscore, and Lodash. It also covers utilities that have gained popular traction and support from seasoned developers and tools applicable to the entire development stack, both client- and server-side. While no single book can possibly cover every JavaScript library of value, JavaScript Frameworks for Modern Web Development focuses on incredibly useful libraries and frameworks that production software uses. You will be treated to detailed analyses and sample code for tools that manage dependencies, structure code in a modular fashion, automate repetitive build tasks, create specialized servers, structure client side applications, facilitate horizontal scaling, and interacting with disparate data stores. What You\'ll Learn Work with a variety of JavaScript frameworks, such as Angular, Vue, React, RequireJS, Knockout, and more Choose the right framework for different types of projects Employ the appropriate libraries and tools in your projects Discover useful JavaScript development tools such as Grunt, Yeoman, Lodash, etc. Who This Book Is For Web developers of all levels of ability; particularly relevant for front-end developers, server-side coders, and developers interestedin learning JavaScript.', 1, 'http://books.google.com/books/content?id=CCe7DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (267, 'Pro SharePoint 2013 Branding and Responsive Web Development', '9781430250289', '2013-06-11', 228, 566, 'en', NULL, 500.00, 10, 'Pro SharePoint 2013 Branding and Responsive Web Development is the definitive reference on the technologies, tools, and techniques needed for building responsive websites and applications with SharePoint 2013. The book focuses on solutions that provide the best browser experience for the myriad of devices, browsers, and screen orientations and resolutions. Web technology has changed considerably in the past few years. Microsoft has embraced the new generation of open standards represented by HTML5 and JavaScript, and these changes are represented in a fundamental shift in how SharePoint 2013 supports web content management and publishing. Authors Eric Overfield, Oscar Medina, Kanwal Khipple, and Rita Zhang join forces to dive into the new features and capabilities provided by SharePoint 2013 and combine them with the latest techniques in responsive web design and development to demonstrate how to build modern and progressive websites and applications. Pro SharePoint 2013 Branding and Responsive Web Development covers the following technologies: SharePoint 2013 Server Edition Office 365 SharePoint Online Expression Blend 2013 Napa Tools for Office and SharePoint Development Visual Studio 2012 HTML5 and CSS3 JavaScript, JQuery, JQuery UI, Modernizr, and the Bootstrap Framework SharePoint 2013 Client Object Model What you’ll learnThrough the context of building a complete website on SharePoint 2013 from start to finish, readers will learn how to combine SharePoint 2013 web content management features and capabilities with modern web design and development skills. The key topics to be covered include: Design Manager – this new feature allows web designers and developers to build SharePoint branding templates using standard HTML and CSS and convert the templates to SharePoint master pages. This opens up branding to a wider audience of designers who struggled with having to understand the complexity of SharePoint and ASP.NET master pages. Client Object Model – this feature is based on web service technologies for interacting with server-side data from client-side. This feature has been extended significantly to support the new SharePoint application model, which heavily emphasizes client-side development. This book will provide full coverage of utilizing these updated web service technologies and how they can be used to build interactive websites. Device Channels – similar to the capabilities provided by HTML5 media queries, the new channels capability allows SharePoint to detect client devices and browsers to load the appropriate master page to provide a unique browser experience. Variations and Translation Services – SharePoint 2013 continues to improve features and capabilities for building multi-lingual sites including new support for integration with professional translation service providers, or automated translation web services. Term Set Navigation and SEO Improvements – SharePoint 2013 now provides native support for Search Engine Optimization requirements such as page meta fields, as well as a completely new approach to site navigation and human friendly URLs through the use of Managed Metadata navigation. Who this book is for Pro SharePoint 2013 Branding and Responsive Web Development is designed for web designers and developers who have existing knowledge of basic website design and development, including HTML, CSS, and JavaScript. This book builds upon that foundational knowledge to walk the reader through a complete project lifecycle for building a responsive website on SharePoint 2013. Table of Contents What’s New in SharePoint 2013 Web Content Management Responsive Web Design and Development with HTML5 Gather Requirements and Wire frame for the Site Building a SharePoint HTML Master Page Using Device Channels to customize ClientUX Design Site Structure and Navigation with Managed Metadata Publish Cross-Site Content with Catalogs Design and Develop Page Layouts and Content Types Integrate Search-Driven Content Build Rich Interactive Forms Upload Documents and Files Integrate Location-Based Features Integrating Feeds and Social Media Supporting Multilingual Sites Appendix A: Setting up your Design and Development Environment', 1, 'http://books.google.com/books/content?id=2XkADDySIagC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (268, 'A Journey Of Web Development With AI', NULL, '2025-05-06', 238, 28, 'en', NULL, 600.00, 10, '', 1, 'http://books.google.com/books/content?id=CZ5bEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (269, 'Java Web Development Illuminated', '0763734233', '2007-01-01', 201, 732, 'en', NULL, 700.00, 10, '\"This text introduces students to the concepts of building Web-distributed applications and helps develop the necessary skills through numerous examples, projects, case studies and hands-on examples.\"--BOOK JACKET.', 1, 'http://books.google.com/books/content?id=oY9fShrQyUgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (270, 'Hands-On IoT: Wi-Fi and Embedded Web Development', NULL, '2020-06-19', 239, 209, 'en', NULL, 800.00, 10, 'Rapid advances in IoT technology demand a lot of devices to be connected to the internet. To design such devices, we usually need knowledges about microcontrollers and computer network. As an example, we often found devices that can be connected to the network and can be configured via web interfaces. These devices implement embedded web server. For example, most of network devices usually use embedded web server as the interface for configuration. Although there are a lot of books that discuss about microcontrollers or web development, they usually discuss the topics in separate books. Rarely, there is a book that discusses both of the topics in one book, i.e. the book that discusses how to create a web interface for a microcontroller. Therefore, this book is written to fill that gap. The Arduino library is used to program the ESP32, while HTML, CSS, and JavaScript are used to build the web interface.', 1, 'http://books.google.com/books/content?id=7E3sDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (271, 'Web Design & Development', NULL, NULL, 240, 469, 'en', NULL, 900.00, 10, 'A guide for developing web sites by means of conceptualization, planning, modeling, and execution of electronic media delivery via Internet. Web development is a broad term for any activities related to developing a web site for the World Wide Web or an intranet. This can include e-commerce business development, web design, web content development, client-side/server-side coding, and web server configuration. However, among web professionals, \"web development\" usually refers only to the non-design aspects of building web sites, e.g. writing markup and coding. Web development can range from developing the simplest static single page of plain text to the most complex web-based internet applications, electronic businesses, or social network services. Web design is a process of conceptualization, planning, modeling, and execution of electronic media delivery via Internet in the form of Markup language suitable for interpretation by Web browser and display as Graphical user interface (GUI).', 1, 'http://books.google.com/books/content?id=DUvpEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (272, 'Ultimate Deno for Web Development: Build Lightning-Fast, Secure Web Applications with Deno Using TypeScript, React, Rust, and Cloud-Ready Tools like Docker, Azure, and Chocolatey', '9789349888791', '2025-05-28', 241, 431, 'en', NULL, 100.00, 10, 'Master Modern Web App Development with Deno, TypeScript, and Rust Key Features● Build secure, high-performance apps with Deno and TypeScript.● Integrate React, Rust, and Next.js for full-stack workflows.● Deploy using Docker, Azure, and manage tools via Chocolatey. Book DescriptionDeno is a modern, secure runtime for JavaScript and TypeScript, offering developers a simplified, efficient way to build high-performance web applications with built-in tooling and a robust standard library. In Ultimate Deno for Web Development, you\'ll dive deep into the Deno ecosystem—from setting up the runtime and understanding its architecture to mastering TypeScript, integrating Rust modules, and leveraging Deno’s security-first execution model. You\'ll progressively build full-stack applications using modern tools like React, Next.js, and Visual Studio Code, while learning to manage dependencies with Chocolatey and deploy seamlessly with Docker and Microsoft Azure. Real-world examples guide you through creating RESTful APIs, managing users, implementing robust testing strategies, and preparing your applications for production. Each chapter builds upon the last, ensuring a seamless learning journey from fundamentals to deployment. Whether you\'re a student, freelancer, or professional developer, this book equips you to harness Deno’s full potential and build secure, scalable web applications with confidence. Don’t get left behind—step into the future of web development with Deno today. What you will learn● Install and configure the Deno runtime for modern web development.● Build dynamic, full-stack applications using TypeScript, React, and Next.js.● Leverage Deno’s toolchain, standard library, and secure execution model.● Use Rust modules and Language Server Protocol (LSP) to boost performance.● Compare Deno with Node.js to understand architectural differences and benefits.● Test and deploy Deno applications on the cloud using Docker and Azure.', 1, 'http://books.google.com/books/content?id=Jw1hEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (273, 'Ruby on Rails for Agile Web Development: A Hands-on Guide to Building Dynamic and Efficient Web Applications', '9788197396502', '2024-08-27', 241, 408, 'en', NULL, 200.00, 10, 'Master the Art of Agile Development with Ruby on Rails Key Features● Master Ruby on Rails with practical guidance on Scrum and Kanban. ● Build high-performance, efficient web applications with best practices. ● Advance your web development skills and unlock new career opportunities. ● Test your knowledge with chapter-end quizzes to reinforce learning. Book Description Discover the power of Ruby on Rails web development framework, through the pages of \"Ruby on Rails for Agile Web Development\".This book combines the robustness of Rails with the agility of development methodologies like Scrum and Kanban to help you efficiently build high-performing web applications. Starting with an overview of Ruby and Rails architecture, you will quickly grasp the fundamentals of agile development. You will explore methodologies such as Scrum and Kanban while gaining hands-on experience in key areas like CRUD operations, database management, styling, authentication, testing, RESTful APIs, deployment, and more. Each chapter concludes with a short quiz to reinforce your understanding and test your progress, ensuring you effectively grasp the concepts. By the end of the book, you will emerge as a competent Ruby on Rails developer with a deep understanding of agile web development principles. With real-world examples and practical exercises, this book empowers you to tackle real-time challenges and build robust web applications. You will confidently implement features like social media integration, email functionality, payment gateways, and file uploads. This book sets you on a path to success in the rapidly evolving field of web development. Prepare to excel, innovate, and create outstanding web applications using the power of Ruby on Rails. What you will learn ● Master the Ruby language and Rails architecture to develop web applications efficiently and reduce code complexity. ● Gain practical knowledge of Scrum and Kanban to contribute effectively to development teams and projects. ● Learn CRUD operations, database management, styling, authentication, and testing. ● Develop RESTful APIs and web services to enable communication between your Rails applications and other systems. ● Build real-time applications, including social media apps, email functionality, payment gateways, and file uploads, to enhance your practical skills and confidence. ● Apply test-driven development (TDD) practices to ensure your applications are reliable and maintainable. ● Explore advanced Rails topics, including background jobs, caching, internationalization, and security, to further enhance your development skills. Table of Contents 1. Introduction 2. Agile Development Fundamentals 3. Getting Started with Ruby on Rails 4. CRUD Operations and Database Management 5. Basics of Styling and Front-End Development 6. Authentication and Authorization 7. Testing and Test-Driven Development 8. RESTful APIs and Web Services 9. Deployment and Scaling 10. Building A Real-World Rails Application 11. Advanced Topics in Ruby on Rails 12. Conclusion Index', 1, 'http://books.google.com/books/content?id=QyNIEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (274, 'Guide to Web Development with Java', '9781447124436', '2012-02-21', 242, 399, 'en', NULL, 300.00, 10, 'This comprehensive textbook introduces readers to the three-tiered, Model-View-Controller (MVC) architecture by using Hibernate, JSPs, and Java Servlets. These three technologies all use Java, so that a student with a background in programming will be able to master them with ease, with the end result of being able to create web applications that use MVC, validate user input and save data to a database. Features: presents the many topics of web development in small steps, in an accessible, easy-to-follow style; uses powerful technologies that are freely available on the web to speed up web development, such as JSP, JavaBeans, annotations, JSTL, Java 1.5, Hibernate and Tomcat; discusses HTML, HTML Forms, Cascading Style Sheets and XML; introduces core technologies from the outset, such as the MVC architecture; contains questions and exercises at the end of each chapter, detailed illustrations, chapter summaries, and a glossary; includes examples for accessing common web services.', 1, 'http://books.google.com/books/content?id=QAru8BiWXzYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (275, 'Full Stack Web Development', '9781836644927', '2024-09-18', 204, 743, 'en', NULL, 400.00, 10, 'This book is a complete guide to mastering full stack web development from HTML and CSS to JavaScript, Node.js, and PHP. Learn to build, optimize, and deploy dynamic web applications using modern tools and practices. Key Features Comprehensive coverage of front-end and back-end web development Practical examples and real-life applications for dynamic websites Detailed exploration of essential tools, databases, and security for full stack developers Book DescriptionThis book offers a comprehensive guide to full stack web development, covering everything from core web technologies to advanced topics. The early chapters introduce foundational concepts like client-server relationships, HTML, CSS, and JavaScript. Readers learn how to build static and dynamic web pages, gaining a solid grounding in front-end development. As the book progresses, it delves into more advanced areas such as structuring applications, databases, and server-side programming using frameworks like Node.js and PHP. Practical examples, such as building web servers and handling data, help readers apply their skills in real-world scenarios, bridging the gap between theory and practice. The later chapters address crucial topics like web security, performance optimization, and project management. Readers are introduced to modern practices like Docker, microservices, and Agile project management, equipping them to handle scalable, secure applications. By the end, readers will have a holistic understanding of how to build, secure, and deploy full stack applications, making this book ideal for both beginners and experienced developers seeking to refine their skills.What you will learn Master HTML and CSS for web design Build interactive web pages using JavaScript Implement server-side logic with Node.js and PHP Optimize websites for accessibility and performance Use databases for data storage Secure and deploy web applications Who this book is for This book is ideal for aspiring web developers, students, and professionals seeking full stack development skills. Readers should have a basic understanding of web technologies. It is ideal for those wanting to create dynamic web applications from scratch.', 1, 'http://books.google.com/books/content?id=8PMiEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (276, 'হাবলুদের জন্য প্রোগ্রামিং - Habluder Jonya Programming', NULL, '2020-04-16', 224, 125, 'bn', NULL, 500.00, 10, 'অতি সম্প্রতি বাংলাদেশের শিক্ষাঙ্গনে উন্নয়ন অনুকূল বেশ কিছু সংস্কৃতি সংযোজিত হয়েছে যার মধ্যে নানা বিষয়ের উপর অলিম্পিয়াড, বিশ্ববিদ্যালয়ের ছাত্রদের জন্য প্রোগ্রামিং প্রতিযোগিতা। আবার গত ১২-১৩ বছর ধরে প্রাক-বিশ্ববিদ্যালয়ের ছাত্রদের জন্যও প্রোগ্রামিং প্রতিযোগিতা। অবাক করা বিষয় হলো আমাদের স্কুল কলেজের ছাত্ররা প্রোগ্রামিংকে চ্যালেঞ্জ হিসাবে নিয়েছে এবং ইতিমধ্যে বেশ সফলতাও অর্জন করেছে। যেমন সকল অলিম্পিয়াডের মধ্যে প্রথম সিলভার মেডেল পেয়েছে সিটি কলেজের মো. আবীরুল ইসলাম ২০০৯ সালে। তাও আবার উপমহাদেশের সকল প্রতিযোগীর মধ্যে শ্রেষ্ঠ হয়ে। ২০১২ সালে ইতালিতে অনুষ্ঠিত আইওয়াই’তে তো বাংলাদেশের বৃষ্টি সিকদার সারা পৃথিবীর সবগুলো মেয়ের মধ্যে শ্রেষ্ঠ বিবেচিত হলো। এই বিষয়গুলোতে আমাদের তরুণদের যে প্রশংসনীয় আগ্রহ ও চ্যালেঞ্জ গ্রহণ করার ক্ষমতা তাঁর যথাযথ প্রতিফলন ঘটেছে এই বইয়ের লেখকের মাধ্যমে। ঝংকার মাহবুবের বইয়ের পাণ্ডুলিপি পড়ে আমি খুবই অবাক এবং আশান্বিত হয়েছি যে আমাদের পরবর্তী প্রজন্ম নানা বিষয়ে যথেষ্ট দক্ষতা অর্জন করেই বড় হচ্ছে। বইয়ের নামকরণ থেকে শুরু করে ব্যবহূত ভাষা এবং ঢং সবই ভিন্ন ও আকর্ষণীয়। বইয়ের নাম ‘হাবলুদের জন্য প্রোগ্রামিং’ হলেও লেখক সন্দেহাতীতভাবে বিশ্বাস করে যে আমাদের যে কোনো তরুণের জন্য প্রোগ্রামিং শেখা তেমন কোনো কঠিন কাজ নয়। প্রতিটা অধ্যায়ই লেখকের স্বতন্ত্র ভাষায়, ঢংয়ে খুবই হালকা মেজাজে উপভোগ্য কৌতুকের সঙ্গে উপস্থাপিত হয়েছে যাতে করে কোন ‘হাবলু’ই টের না পায় যে সে খুবই জটিল কিছু শিখতে যাচ্ছে। অনুশীলন করার জন্য বইতেই পর্যাপ্ত ফাঁকা জায়গা দেয়া আছে। আমি আশা করি আমাদের ছেলেমেয়েরা এই বইটি পড়ে যেমন প্রোগ্রামিংয়ের ভয় জয় করবে ঠিক একইভাবে প্রোগ্রামিংয়ের বেশ কিছু ধারণাও আত্মস্থ করতে পারবে। আমি ঝংকার মাহবুবকে বইটি লেখার জন্য অভিনন্দন জানাই আর তাঁর বইয়ের পাঠকদের প্রতি রইল মেধার অনুশীলনীর মাধ্যমে শ্রেয়তর মস্তিষ্কের অধিকারী হয়ে বাংলাদেশকে সমৃদ্ধ করার আমন্ত্রণ। ড. মোহাম্মদ কায়কোবাদ অধ্যাপক, কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ, বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়', 1, 'http://books.google.com/books/content?id=txjdDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Antiques & Collectibles', 204);
INSERT INTO `book` VALUES (277, 'MEAN Web Development', '9781785883675', '2016-11-30', 204, 367, 'en', NULL, 600.00, 10, 'Develop your real-time MEAN application efficiently using a combination of MongoDB, Express, Angular, and Node About This Book Construct a fully-functional MEAN application by using its components along with the best third-party modules Harness the power of the JavaScript ecosystem to effectively run, build, and test your MEAN application Gain a deep, practical understanding of real-time web application development through real-world examples Who This Book Is For If you are a JavaScript developer who is interested in building modern web applications using MongoDB, Express, Angular 2, and Node 5.0, then this book is for you. You only need knowledge of JavaScript development. What You Will Learn Use MongoDB to store and retrieve your application\'s data Connect your Express application to MongoDB and use the Mongoose module Manage your users\' authentication and offer them diverse login options using Passport Structure and use an Angular 2 application in your MEAN project Use Socket.io to create real-time communication between your client and server Test your application\'s Express and Angular 2 entities In Detail The MEAN stack is a collection of the most popular modern tools for web development that helps you build fast, robust, and maintainable web applications. Starting with the MEAN core frameworks, this pragmatic guide will explain the key concepts of each framework, how to set them up properly, and how to use popular modules to connect it all together. By following the real-world examples shown in this tutorial, you will scaffold your MEAN application architecture, add an authentication layer, and develop an MVC structure to support your project development. You will learn the best practices of maintaining clear and simple code and will see how to avoid common pitfalls. Finally, you will walk through the different tools and frameworks that will help expedite your daily development cycles. Watch how your application development grows by learning from the only guide that is solely orientated towards building a full, end-to-end, real-time application using the MEAN stack! Style and approach This comprehensive guide covers every part of the MEAN stack, and focuses on the gestalt power of the apps they can create through practical, real-world examples', 1, 'http://books.google.com/books/content?id=n5vcDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (278, 'PHP and MySQL Web Development', '8131729877', NULL, 243, 1012, 'en', NULL, 700.00, 10, '', 1, 'http://books.google.com/books/content?id=hfFAlyu0yzgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'MySQL (Electronic resource)', 210);
INSERT INTO `book` VALUES (279, 'Web Development with Django', '9781803235127', '2023-05-26', 204, 764, 'en', NULL, 800.00, 10, 'Create your own websites easily, securely, and quickly with Django by tackling practical activities based on realistic case studies Key Features Understand Django functionality and the Model-View-Template (MVT) paradigm Create and iteratively build a book review website, adding features as you build your knowledge Explore advanced concepts such as REST API implementation and third-party module integration Book DescriptionDo you want to develop reliable and secure applications that stand out from the crowd without spending hours on boilerplate code? You’ve made the right choice trusting the Django framework, and this book will tell you why. Often referred to as a “batteries included” web development framework, Django comes with all the core features needed to build a standalone application. Web Development with Django will take you through all the essential concepts and help you explore its power to build real-world applications using Python. Throughout the book, you’ll get the grips with the major features of Django by building a website called Bookr – a repository for book reviews. This end-to-end case study is split into a series of bitesize projects presented as exercises and activities, allowing you to challenge yourself in an enjoyable and attainable way. As you advance, you\'ll acquire various practical skills, including how to serve static files to add CSS, JavaScript, and images to your application, how to implement forms to accept user input, and how to manage sessions to ensure a reliable user experience. You’ll cover everyday tasks that are part of the development cycle of a real-world web application. By the end of this Django book, you\'ll have the skills and confidence to creatively develop and deploy your own projects.What you will learn Create a new application and add models to describe your data Use views and templates to control behavior and appearance Implement access control through authentication and permissions Develop practical web forms to add features such as file uploads Build a RESTful API and JavaScript code that communicates with it Connect to a database such as PostgreSQL Who this book is for This book is for programmers looking to enhance their web development skills using the Django framework. To fully understand the concepts explained in this book, basic knowledge of Python programming as well as familiarity with JavaScript, HTML, and CSS is assumed.', 1, 'http://books.google.com/books/content?id=HEG8EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (280, 'ARTIFICIAL INTELLIGENCE', '9781848261259', '2009-12-20', 244, 418, 'en', NULL, 900.00, 10, 'Artificial Intelligence is a component of Encyclopedia of Technology, Information, and Systems Management Resources in the global Encyclopedia of Life Support Systems (EOLSS), which is an integrated compendium of twenty Encyclopedias. The Theme on Artificial Intelligence provides the essential aspects and fundamentals of Artificial Intelligence: Definition, Trends, Techniques, and Cases; Logic in Artificial Intelligence (AI); Computational Intelligence; Knowledge Based System Development Tools. It is aimed at the following five major target audiences: University and College Students, Educators, Professional Practitioners, Research Personnel and Policy Analysts, Managers, and Decision Makers.', 1, 'http://books.google.com/books/content?id=v_jhDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Artificial intelligence', 211);
INSERT INTO `book` VALUES (281, 'Artificial Intelligence', '9780190602383', '2016-01-01', 245, 193, 'en', NULL, 100.00, 10, 'Over the coming decades, Artificial Intelligence will profoundly impact the way we live, work, wage war, play, seek a mate, educate our young, and care for our elderly. It is likely to greatly increase our aggregate wealth, but it will also upend our labor markets, reshuffle our social order, and strain our private and public institutions. Eventually it may alter how we see our place in the universe, as machines pursue goals independent of their creators and outperform us in domains previously believed to be the sole dominion of humans. Whether we regard them as conscious or unwitting, revere them as a new form of life or dismiss them as mere clever appliances, is beside the point. They are likely to play an increasingly critical and intimate role in many aspects of our lives. The emergence of systems capable of independent reasoning and action raises serious questions about just whose interests they are permitted to serve, and what limits our society should place on their creation and use. Deep ethical questions that have bedeviled philosophers for ages will suddenly arrive on the steps of our courthouses. Can a machine be held accountable for its actions? Should intelligent systems enjoy independent rights and responsibilities, or are they simple property? Who should be held responsible when a self-driving car kills a pedestrian? Can your personal robot hold your place in line, or be compelled to testify against you? If it turns out to be possible to upload your mind into a machine, is that still you? The answers may surprise you.', 1, 'http://books.google.com/books/content?id=7y_KDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (282, 'Artificial Intelligence', '1695377117', '2019-09-24', NULL, 44, 'en', NULL, 200.00, 10, 'Artificial intelligence (AI), the ability of a digital computer or computer-controlled robot to perform tasks commonly associated with intelligent beings. The term is frequently applied to the project of developing systems endowed with the intellectual processes characteristic of humans, such as the ability to reason, discover meaning, generalize, or learn from past experience. Since the development of the digital computer in the 1940s, it has been demonstrated that computers can be programmed to carry out very complex tasks-as, for example, discovering proofs for mathematical theorems or playing chess-with great proficiency. Still, despite continuing advances in computer processing speed and memory capacity, there are as yet no programs that can match human flexibility over wider domains or in tasks requiring much everyday knowledge. On the other hand, some programs have attained the performance levels of human experts and professionals in performing certain specific tasks, so that artificial intelligence in this limited sense is found in applications as diverse as medical diagnosis, computer search engines, and voice or handwriting recognition.What is intelligence?All but the simplest human behaviour is ascribed to intelligence, while even the most complicated insect behaviour is never taken as an indication of intelligence. What is the difference? Consider the behaviour of the digger wasp, Sphex ichneumoneus. When the female wasp returns to her burrow with food, she first deposits it on the threshold, checks for intruders inside her burrow, and only then, if the coast is clear, carries her food inside. The real nature of the wasp\'s instinctual behaviour is revealed if the food is moved a few inches away from the entrance to her burrow while she is inside: on emerging, she will repeat the whole procedure as often as the food is displaced. Intelligence-conspicuously absent in the case of Sphex-must include the ability to adapt to new circumstances.Psychologists generally do not characterize human intelligence by just one trait but by the combination of many diverse abilities. Research in AI has focused chiefly on the following components of intelligence: learning, reasoning, problem solving, perception, and using language.Artificial Intelligence HistoryThe term artificial intelligence was coined in 1956, but AI has become more popular today thanks to increased data volumes, advanced algorithms, and improvements in computing power and storage.Early AI research in the 1950s explored topics like problem solving and symbolic methods. In the 1960s, the US Department of Defense took interest in this type of work and began training computers to mimic basic human reasoning. For example, the Defense Advanced Research Projects Agency (DARPA) completed street mapping projects in the 1970s. And DARPA produced intelligent personal assistants in 2003, long before Siri, Alexa or Cortana were household names.This early work paved the way for the automation and formal reasoning that we see in computers today, including decision support systems and smart search systems that can be designed to complement and augment human abilities.While Hollywood movies and science fiction novels depict AI as human-like robots that take over the world, the current evolution of AI technologies isn\'t that scary - or quite that smart. Instead, AI has evolved to provide many specific benefits in every industry. Keep reading for modern examples of artificial intelligence in health care, retail and more.', 1, 'http://books.google.com/books/content?id=vQwmygEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (283, 'Introduction to Artificial Intelligence', '9783319584874', '2018-01-18', 218, 365, 'en', NULL, 300.00, 10, 'This accessible and engaging textbook presents a concise introduction to the exciting field of artificial intelligence (AI). The broad-ranging discussion covers the key subdisciplines within the field, describing practical algorithms and concrete applications in the areas of agents, logic, search, reasoning under uncertainty, machine learning, neural networks, and reinforcement learning. Fully revised and updated, this much-anticipated second edition also includes new material on deep learning. Topics and features: presents an application-focused and hands-on approach to learning, with supplementary teaching resources provided at an associated website; contains numerous study exercises and solutions, highlighted examples, definitions, theorems, and illustrative cartoons; includes chapters on predicate logic, PROLOG, heuristic search, probabilistic reasoning, machine learning and data mining, neural networks and reinforcement learning; reports on developments in deep learning, including applications of neural networks to generate creative content such as text, music and art (NEW); examines performance evaluation of clustering algorithms, and presents two practical examples explaining Bayes’ theorem and its relevance in everyday life (NEW); discusses search algorithms, analyzing the cycle check, explaining route planning for car navigation systems, and introducing Monte Carlo Tree Search (NEW); includes a section in the introduction on AI and society, discussing the implications of AI on topics such as employment and transportation (NEW). Ideal for foundation courses or modules on AI, this easy-to-read textbook offers an excellent overview of the field for students of computer science and other technical disciplines, requiring no more than a high-school level of knowledge of mathematics to understand the material.', 1, 'http://books.google.com/books/content?id=geFHDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (284, 'Artificial Intelligence By Example', '9781788990028', '2018-05-31', 204, 476, 'en', NULL, 400.00, 10, 'Be an adaptive thinker that leads the way to Artificial Intelligence Key Features AI-based examples to guide you in designing and implementing machine intelligence Develop your own method for future AI solutions Acquire advanced AI, machine learning, and deep learning design skills Book Description Artificial Intelligence has the potential to replicate humans in every field. This book serves as a starting point for you to understand how AI is built, with the help of intriguing examples and case studies. Artificial Intelligence By Example will make you an adaptive thinker and help you apply concepts to real-life scenarios. Using some of the most interesting AI examples, right from a simple chess engine to a cognitive chatbot, you will learn how to tackle the machine you are competing with. You will study some of the most advanced machine learning models, understand how to apply AI to blockchain and IoT, and develop emotional quotient in chatbots using neural networks. You will move on to designing AI solutions in a simple manner rather than get confused by complex architectures and techniques. This comprehensive guide will be a starter kit for you to develop AI applications on your own. By the end of this book, will have understood the fundamentals of AI and worked through a number of case studies that will help you develop business vision. What you will learn Use adaptive thinking to solve real-life AI case studies Rise beyond being a modern-day factory code worker Acquire advanced AI, machine learning, and deep learning designing skills Learn about cognitive NLP chatbots, quantum computing, and IoT and blockchain technology Understand future AI solutions and adapt quickly to them Develop out-of-the-box thinking to face any challenge the market presents Who this book is for Artificial Intelligence by Example is a simple, explanatory, and descriptive guide for junior developers, experienced developers, technology consultants, and those interested in AI who want to understand the fundamentals of Artificial Intelligence and implement it practically by devising smart solutions. Prior experience with Python and statistical knowledge is essential to make the most out of this book.', 1, 'http://books.google.com/books/content?id=KnxeDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (285, 'BASICS OF ARTIFICIAL INTELLIGENCE & MACHINE LEARNING', '9781645872832', '2019-06-03', 246, 77, 'en', NULL, 500.00, 10, 'The concept of Artificial Intelligence (AI) & Machine Learning (ML) has been in practice for over years with the advent of technological progress. Over time, it has blended our lives through nearly every narration of learning, teaching, enjoyment, normal routine operations and what not. The aspect delivers a common understanding of the topics with reference to it making an impact on our lives, with a better framework of technology affecting our lives in particular. Let us look up to science for a change to be brought about in us. Let us create awareness of making technology available to people, in a broader sense. As that happens, people who are responsible need to be told about the use and misuse of the same. As we lead our lives, we come across the fact that AI, Robotics and Learning Machines seem to be the household topic of discussion. Earlier, AI was perceived to be reserved for only ‘Geniuses’ or ‘Researchers’ or the ‘computer’ community, but it very aptly integrates and impacts each and every aspect of our lives. Knowingly or unknowingly, it has become intellectually influential in shaping our thoughts, actions and the day-to-day chores.', 1, 'http://books.google.com/books/content?id=QSybDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (286, 'Introduction to Artificial Intelligence', '9798577898397', '2020-12-14', 247, 26, 'en', NULL, 600.00, 10, 'This AI beginner’s guide aims to take the readers through the current AI landscape, provides the key fundamentals and terminologies of AI, and offers practical guidelines on why and how you can be a part of the AI revolution, and also the ways in which you can scale up your AI career.', 1, 'http://books.google.com/books/content?id=1L8OEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (287, 'Understanding Artificial Intelligence', '9783030252717', '2019-09-25', 219, 321, 'en', NULL, 700.00, 10, 'Artificial Intelligence (AI) will change the lives of people and businesses more fundamentally than many people can even imagine today. This book illustrates the importance of AI in an era of digitalization. It introduces the foundations of AI and explains its benefits and challenges for companies and entire industries. In this regard, AI is approached not just as yet another technology, but as a fundamental innovation, which will spread into all areas of the economy and life, and will disrupt business processes and business models in the years to come. In turn, the book assesses the potential that AI holds, and clarifies the framework that is necessary for pursuing a responsible approach to AI. In a series of best-practice cases, the book subsequently highlights a broad range of sectors and industries, from production to services; from customer service to marketing and sales; and in industries like retail, health care, energy, transportation and many more. In closing, a dedicated chapter outlines a roadmap for a specific corporate AI journey. No one can ignore intensive work with AI today - neither as a private person, let alone as a top performer in companies. This book offers a thorough, carefully crafted, and easy to understand entry into the field of AI. The central terms used in the AI ​​context are given a very good explanation. In addition, a number of cases show what AI can do today and where the journey is heading. An important book that you should not miss! Professor Dr. Harley Krohmer University of Bern \"Inspiring, thought provoking and comprehensive, this book is wittingly designed to be a catalyst for your individual and corporate AI journey.” Avo Schönbohm, Professor at the Berlin School of Economics and Law, Enterprise Game Designer at LUDEO and Business Punk', 1, 'http://books.google.com/books/content?id=5Q-yDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (288, 'Artificial Intelligence', '9781000462678', '2021-10-28', 225, 265, 'en', NULL, 800.00, 10, 'Artificial Intelligence: Technologies, Applications, and Challenges is an invaluable resource for readers to explore the utilization of Artificial Intelligence, applications, challenges, and its underlying technologies in different applications areas. Using a series of present and future applications, such as indoor-outdoor securities, graphic signal processing, robotic surgery, image processing, character recognition, augmented reality, object detection and tracking, intelligent traffic monitoring, emergency department medical imaging, and many more, this publication will support readers to get deeper knowledge and implementing the tools of Artificial Intelligence. The book offers comprehensive coverage of the most essential topics, including: Rise of the machines and communications to IoT (3G, 5G). Tools and Technologies of Artificial Intelligence Real-time applications of artificial intelligence using machine learning and deep learning. Challenging Issues and Novel Solutions for realistic applications Mining and tracking of motion based object data image processing and analysis into the unified framework to understand both IoT and Artificial Intelligence-based applications. This book will be an ideal resource for IT professionals, researchers, under or post-graduate students, practitioners, and technology developers who are interested in gaining insight to the Artificial Intelligence with deep learning, IoT and machine learning, critical applications domains, technologies, and solutions to handle relevant challenges.', 1, 'http://books.google.com/books/content?id=hJsIEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (289, 'Artificial Intelligence Basics', '9781484250280', '2019-08-01', 228, 195, 'en', NULL, 900.00, 10, 'Artificial intelligence touches nearly every part of your day. While you may initially assume that technology such as smart speakers and digital assistants are the extent of it, AI has in fact rapidly become a general-purpose technology, reverberating across industries including transportation, healthcare, financial services, and many more. In our modern era, an understanding of AI and its possibilities for your organization is essential for growth and success. Artificial Intelligence Basics has arrived to equip you with a fundamental, timely grasp of AI and its impact. Author Tom Taulli provides an engaging, non-technical introduction to important concepts such as machine learning, deep learning, natural language processing (NLP), robotics, and more. In addition to guiding you through real-world case studies and practical implementation steps, Taulli uses his expertise to expand on the bigger questions that surround AI. These include societal trends, ethics, andfuture impact AI will have on world governments, company structures, and daily life. Google, Amazon, Facebook, and similar tech giants are far from the only organizations on which artificial intelligence has had—and will continue to have—an incredibly significant result. AI is the present and the future of your business as well as your home life. Strengthening your prowess on the subject will prove invaluable to your preparation for the future of tech, and Artificial Intelligence Basics is the indispensable guide that you’ve been seeking. What You Will Learn Study the core principles for AI approaches such as machine learning, deep learning, and NLP (Natural Language Processing) Discover the best practices to successfully implement AI by examining case studies including Uber, Facebook, Waymo, UiPath, and Stitch Fix Understand how AI capabilities for robots can improve business Deploy chatbots and Robotic Processing Automation (RPA) to save costs and improve customer service Avoid costly gotchas Recognize ethical concerns and other risk factors of using artificial intelligence Examine the secular trends and how they may impact your business Who This Book Is For Readers without a technical background, such as managers, looking to understand AI to evaluate solutions.', 1, 'http://books.google.com/books/content?id=zOOmDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (290, 'Advanced Artificial Intelligence', '9811200874', '2019-01-01', 248, 0, 'en', NULL, 100.00, 10, 'The joint breakthrough of big data, cloud computing and deep learning has made artificial intelligence (AI) the new focus in the international arena. AI is a branch of computer science, developing intelligent machine with imitating, extending and augmenting human intelligence through artificial means and techniques to realize intelligent behaviour. This comprehensive compendium, consisting of 15 chapters, captures the updated achievements of AI. It is completely revised to reflect the current researches in the field, through numerous techniques and strategies to address the impending challenges facing computer scientists today. The unique volume is useful for senior or graduate students in the information field and related tertiary specialities. It is also a suitable reference text for professionals, researchers, and academics in AI, machine learning, electrical & electronic engineering and biocomputing.', 1, 'http://books.google.com/books/content?id=yYzvwAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Artificial intelligence', 211);
INSERT INTO `book` VALUES (291, 'ARTIFICIAL INTELLIGENCE', NULL, '2023-10-17', 237, 653, 'en', NULL, 200.00, 10, 'If you need a free PDF practice set of this book for your studies, feel free to reach out to me at cbsenet4u@gmail.com, and I\'ll send you a copy! THE ARTIFICIAL INTELLIGENCE MCQ (MULTIPLE CHOICE QUESTIONS) SERVES AS A VALUABLE RESOURCE FOR INDIVIDUALS AIMING TO DEEPEN THEIR UNDERSTANDING OF VARIOUS COMPETITIVE EXAMS, CLASS TESTS, QUIZ COMPETITIONS, AND SIMILAR ASSESSMENTS. WITH ITS EXTENSIVE COLLECTION OF MCQS, THIS BOOK EMPOWERS YOU TO ASSESS YOUR GRASP OF THE SUBJECT MATTER AND YOUR PROFICIENCY LEVEL. BY ENGAGING WITH THESE MULTIPLE-CHOICE QUESTIONS, YOU CAN IMPROVE YOUR KNOWLEDGE OF THE SUBJECT, IDENTIFY AREAS FOR IMPROVEMENT, AND LAY A SOLID FOUNDATION. DIVE INTO THE ARTIFICIAL INTELLIGENCE MCQ TO EXPAND YOUR ARTIFICIAL INTELLIGENCE KNOWLEDGE AND EXCEL IN QUIZ COMPETITIONS, ACADEMIC STUDIES, OR PROFESSIONAL ENDEAVORS. THE ANSWERS TO THE QUESTIONS ARE PROVIDED AT THE END OF EACH PAGE, MAKING IT EASY FOR PARTICIPANTS TO VERIFY THEIR ANSWERS AND PREPARE EFFECTIVELY.', 1, 'http://books.google.com/books/content?id=h-eKEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Juvenile Nonfiction', 209);
INSERT INTO `book` VALUES (292, 'Artificial Intelligence Methods in the Environmental Sciences', '9781402091193', '2008-11-28', 242, 418, 'en', NULL, 300.00, 10, 'How can environmental scientists and engineers use the increasing amount of available data to enhance our understanding of planet Earth, its systems and processes? This book describes various potential approaches based on artificial intelligence (AI) techniques, including neural networks, decision trees, genetic algorithms and fuzzy logic. Part I contains a series of tutorials describing the methods and the important considerations in applying them. In Part II, many practical examples illustrate the power of these techniques on actual environmental problems. International experts bring to life ways to apply AI to problems in the environmental sciences. While one culture entwines ideas with a thread, another links them with a red line. Thus, a “red thread“ ties the book together, weaving a tapestry that pictures the ‘natural’ data-driven AI methods in the light of the more traditional modeling techniques, and demonstrating the power of these data-based methods.', 1, 'http://books.google.com/books/content?id=0N4XBd5yl6oC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Science', 212);
INSERT INTO `book` VALUES (293, 'Artificial Intelligence in Society', '9789264545199', '2019-06-11', 249, 152, 'en', NULL, 400.00, 10, 'The artificial intelligence (AI) landscape has evolved significantly from 1950 when Alan Turing first posed the question of whether machines can think. Today, AI is transforming societies and economies. It promises to generate productivity gains, improve well-being and help address global challenges, such as climate change, resource scarcity and health crises.', 1, 'http://books.google.com/books/content?id=eRmdDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (294, 'Introduction to Artificial Intelligence', '9798874154950', '2024-01-06', 213, 0, 'en', NULL, 500.00, 10, 'Definition and History of AI: Explore the origins and evolution of AI, from its humble beginnings to its current transformative impact. Types of AI: Delve into the different types of AI, from Narrow AI and General AI to the intriguing realm of Superintelligent AI. Data\'s Crucial Role: Understand the importance of data in AI, its various types (Structured, Unstructured, Semi-Structured), and how it drives AI innovation. Fundamentals of Machine Learning: Uncover the core concepts of machine learning, from Supervised vs. Unsupervised Learning to Reinforcement Learning and Common Algorithms. Neural Networks and Deep Learning: Learn the basics of neural networks, explore the power of deep learning, and grasp the significance of Convolutional Neural Networks (CNNs) and Recurrent Neural Networks (RNNs). Natural Language Processing (NLP): Gain insights into how AI understands language, including Sentiment Analysis, Chatbots, and Translation. Computer Vision: Discover the wonders of image recognition and object detection, along with the intricacies of Facial Recognition Technology. Robotics and Autonomous Systems: Explore AI\'s role in robotics, from AI-driven robots to self-driving cars and drones. Ethical Considerations: Delve into the ethical aspects of AI, addressing bias, fairness, privacy, and security concerns. Real-World Applications: Witness AI\'s impact across industries such as healthcare, finance, and retail, and glimpse into the future of AI in various sectors. Emerging Trends: Stay ahead of the curve by exploring quantum computing\'s synergy with AI and the convergence of AI with the Internet of Things (IoT). Career Paths: Learn about the diverse roles in AI and the essential skills required, as well as the exciting future of work in the AI field. Whether you\'re a fan of AI, a student eager to learn, or a seasoned professional, \"Introduction to Artificial Intelligence: Understanding the Basics\" provides you with the essential knowledge to grasp, appreciate, and effectively navigate the AI revolution. Get ready for an exciting adventure into the fascinating world of artificial intelligence.', 1, 'http://books.google.com/books/content?id=2idr0AEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (295, 'Artificial Intelligence for Science and Engineering Applications', '9781040003954', '2024-04-01', 225, 137, 'en', NULL, 600.00, 10, 'Artificial Intelligence (AI) is defined as the simulation of human intelligence through the mimicking of the human brain for analysis, modeling, and decision‐making. Science and engineering problem solving requires modeling of physical phenomena, and humans approach the solution of scientific and engineering problems differently from other problems. Artificial Intelligence for Science and Engineering Applications addresses the unique differences in how AI should be developed and used in science and engineering. Through the inclusion of definitions and detailed examples, this book describes the actual and realistic requirements as well as what characteristics must be avoided for correct and successful science and engineering applications of AI. This book: Offers a brief history of AI and covers science and engineering applications Explores the modeling of physical phenomena using AI Discusses explainable AI (XAI) applications Covers the ethics of AI in science and engineering Features real‐world case studies Offering a probing view into the unique nature of scientific and engineering exploration, this book will be of interest to generalists and experts looking to expand their understanding of how AI can better tackle and advance technology and developments in scientific and engineering disciplines.', 1, 'http://books.google.com/books/content?id=l1cIEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (296, 'Artificial Intelligence and Industry in Society 5.0', '9788198127112', '2024-10-13', 250, 123, 'en', NULL, 700.00, 10, 'The past few years have seen artificial intelligence (AI) acting as a force that has been changing industries, societies and also the educational landscape. The objective of this book is to present a holistic view of the different sectors being affected by AI and to list some of the challenges or opportunities that have arisen as part of this fast-moving area. The opening chapter is on the ethically fraught domain of AI technologies such as ChatGPT in educational contexts, noting new frontiers for cheating and suggesting ways that its integrity can be protected during this next industrial push of technological change. Even as AI tools grow in common use, educational institutions must grapple with these complexities to maintain notions of fair play and knowledge building. Further chapters move beyond AI in education to how it can be used as a broad lever for smart and sustainable campuses, cities, and infrastructure. The text in Chapter two centers on the way artificial intelligence (machine learning and deep learning) can steer more insightful urban planning, resource management and development that is sustainable. Chapter three presents a wider coverage of AI applications, including the concept of digital twins in different sectors-healthcare, finance and agriculture-as examples on how digital replicas improve productivity and innovation across various industries under Industry 4.0; 5.0 and Society 5.0. Chater four and five moves to the regulatory issues regarding AI. They talk about the importance of strong policies and the technological, economic, and regulatory obstacles holding back AI from realizing its promise in helping industries become smarter and more sustainable. The book also wraps up with a reflective commentary which presents the real-world applications of AI, future directions and potential research topics in AI, thereby providing readers some suggestions about where we could go regarding the development of AI in the next few years. This is the series of chapters that will show you how transformational AI can be; we hope it awakens the imagination and motivates people to conduct research and innovation in this exciting sector.', 1, 'http://books.google.com/books/content?id=2Y8rEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (297, 'Artificial Intelligence: Structures and Strategies for Complex Problem Solving, 5/e', '8131723275', '2004-01-01', 243, 932, 'en', NULL, 800.00, 10, 'Much has changed since the early editions of Artificial Intelligence were published. To reflect this the introductory material of this fifth edition has been substantially revised and rewritten to capture the excitement of the latest developments in AI work. Artificial intelligence is a diverse field. To ask the question \"\"what is intelligence?\"\" is to invite as many answers as there are approaches to the subject of artificial intelligence. These could be intelligent agents, logical reasoning, neural networks, expert systems, evolutionary computing and so on. This fifth edition covers all the m.', 1, 'http://books.google.com/books/content?id=u-a2C0Mr1kwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (298, 'The Atlas of AI', '9780300209570', '2021-04-06', 251, 336, 'en', NULL, 900.00, 10, 'The hidden costs of artificial intelligence, from natural resources and labor to privacy and freedom What happens when artificial intelligence saturates political life and depletes the planet? How is AI shaping our understanding of ourselves and our societies? In this book Kate Crawford reveals how this planetary network is fueling a shift toward undemocratic governance and increased inequality. Drawing on more than a decade of research, award-winning science, and technology, Crawford reveals how AI is a technology of extraction: from the energy and minerals needed to build and sustain its infrastructure, to the exploited workers behind \"automated\" services, to the data AI collects from us. Rather than taking a narrow focus on code and algorithms, Crawford offers us a political and a material perspective on what it takes to make artificial intelligence and where it goes wrong. While technical systems present a veneer of objectivity, they are always systems of power. This is an urgent account of what is at stake as technology companies use artificial intelligence to reshape the world.', 1, 'http://books.google.com/books/content?id=KfodEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (299, 'ARTIFICIAL INTELLIGENCE: A MODERN APPROACH', '9788197370816', '2024-05-18', 252, 251, 'en', NULL, 100.00, 10, 'Here we try to define artificial intelligence (AI) and explain why we think it deserves more attention than other worthy research topics; obviously, this is a prerequisite to doing any kind of study in this area. We humans take great pride in our intelligence; in fact, we call ourselves Homo sapiens, which means \"man the wise.\" Human cognition has long baffled scientists, who have sought to explain how a little particle of stuff like us can see, understand, predict, and control an enormous and complex cosmos. Beyond that, the field of artificial intelligence (AI) aims to do more than just understand; it aims to build intelligent objects. One of the newest innovations in engineering and science is AI. The name wasn\'t even thought of until 1956, although development started in earnest almost immediately after WWII ended. Science professionals from several disciplines often mention artificial intelligence (AI) as the \"field I would most like to be in\" next to molecular biology. If you\'re a physics student, you could think that all the great thinkers like Galileo, Newton, Einstein, and others have thought of everything. Conversely, AI is still on the market for a handful of brilliant minds to join their team full-time. At now, AI encompasses a wide variety of subfields, from the broad (perception and learning) to the narrow (proving mathematical theorems, writing poetry, operating a car on a congested street, and disease detection, among many others). These are but a few of the many activities that might be categorised as AI-related. Artificial intelligence (AI) is a field that really covers all intellectual pursuits; it is relevant to everyone', 1, 'http://books.google.com/books/content?id=NuIrEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (300, 'Ṭrena ṭu Pākistāna', '9847840113', '2012-01-01', NULL, 159, 'en', NULL, 200.00, 10, '', 1, NULL, '2025-07-20 05:20:25', 'Popular literature', 213);
INSERT INTO `book` VALUES (301, 'Harry Potter and the philosopher\'s stone', '9844640911', '2004-01-01', NULL, 272, 'bn', NULL, 300.00, 10, 'Bengali Translation of Harry Potter and the phisopher\'s stone by J.K. Rowling.', 1, NULL, '2025-07-20 05:20:25', 'England', 214);
INSERT INTO `book` VALUES (302, 'Reading Bestsellers', '9781108864855', '2023-04-27', 230, 153, 'en', NULL, 400.00, 10, 'Readers are essential agents in the production of bestsellers but bestsellers are not essential to readers\' leisure pursuits. The starting point in this Element is readers\' opinions about and their uses of bestselling fiction in English. Readers\' relationships with bestsellers bring into view their practices of book selection, and their navigation of book recommendation culture. Based on three years of original research (2019–2021), including a quantitative survey with readers, interviews with social media influencers, and qualitative work with international Gen Z readers in a private Instagram chat space, the authors highlight three core actions contemporary multimodal readers make– choosing, connecting, and responding– in a transmedia era where on- and offline media practices co-exist. The contemporary multimodal reader, or the MMR3, they argue, illustrates the pervasiveness of recommendation culture, reliance on trusted others, and an ethic of responsiveness.', 1, 'http://books.google.com/books/content?id=G2-7EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (303, 'Bestsellers', NULL, '2017-01-03', 253, 32, 'en', NULL, 500.00, 10, 'Hear What the Critics are Saying Wow, very inspirational and powerful; everyone must read this book. Hell: A Place Without Hope, is by far one of the best Christian books to have come out in the last decade. A Must Read.” -Mary Jones – Valley Daily News “I give this book Five Stars All The Way! This book makes my list as one of the top reads in the Christian genre. Anyone of Faith will enjoy this book very much.” -Theresa Davis – Elite Media Group “Hell: A Place Without Hope a very powerful and thought provoking book. Every generation, young and old, should have to read this book. Ten Thumbs Up.” -Dave Baker – Book Bloggers of America “This was an excellent book; it was short, I ended up reading it in less than two hours; however, it has a very strong and positive message. Amazing Book!” -Lisa Cooper – Literary Times Inc. “This was a very powerful book; very solid message about the dangers of not giving your life to Christ. Highly Recommend.” -Emma Right – Writers United Group “I fell to my knees at the end and cried. This book reminded me why I became a born-again Christian. Powerful Message.” -Carl Mosner – Readers Cove Unlimited Editorial Review Hell: A Place Without Hope is a very spiritual and powerful book. Its messages are time tested and true. This book really made me think; but more importantly, it made me feel. If you are looking for a book that will move you to tears, then look no further than Hell: A Place Without Hope; a masterful book that will not only inspire you to become a better person, but will also teach you some of life’s greatest lessons. Inspirational Book! David T. Williams About the Book A young man spends a day in hell and comes back to tell us the story. Hell: A Place Without Hope, is a powerful book that sends a strong message. Every generation of young people should have to read this wonderful Christian book. This book is based on Real Life Experience, which I derived from a vision I had in the year 2005. (bestseller books, bestseller books free, bestsellers, free bestsellers, bestsellers for women, bestsellers for men) [bestsellers]', 1, 'http://books.google.com/books/content?id=WcjTDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Comics & Graphic Novels', 215);
INSERT INTO `book` VALUES (304, 'Bestsellers (Routledge Revivals)', '9781136830631', '2010-10-04', 254, 190, 'en', NULL, 600.00, 10, 'First published in 1981, this book offers a study of British and American popular fiction in the 1970s, a decade in which the quest for the superseller came to dominate the lives of publishers on both sides of the Atlantic. Illustrated by examples of the lurid incidents that catapult so many books into the bestseller charts, this comprehensive study covers the work of Robbins, Hailey and Maclean, the \'bodice rippers\', the disaster craze, horror, war stories and media tie-ins such as The Godfather, Jaws and Star Wars.', 1, 'http://books.google.com/books/content?id=2gOsAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (305, 'Must Read: Rediscovering American Bestsellers', '9781441162168', '2012-08-02', 255, 386, 'en', NULL, 700.00, 10, 'A unique survey and interpretive history, spanning 200 years, of the American bestseller.', 1, 'http://books.google.com/books/content?id=Qubh7e5XW0kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (306, 'Socho Aur Amir Bano (চিন্তা করুন এবং ধনী হন', '9355995490', '2022-09-14', 256, 0, 'bn', NULL, 800.00, 10, '', 1, 'http://books.google.com/books/content?id=HWqFzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', 'Self-Help', 217);
INSERT INTO `book` VALUES (307, 'Books', '9780595318810', NULL, 257, 376, 'en', NULL, 900.00, 10, '', 1, 'http://books.google.com/books/content?id=9VcGJjb8b3IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (308, 'Readers, Reading and Reception of Translated Fiction in Chinese', '9781317641230', '2014-04-08', 254, 259, 'en', NULL, 100.00, 10, 'Translated fiction has largely been under-theorized, if not altogether ignored, in literary studies. Though widely consumed, translated novels are still considered secondary versions of foreign masterpieces. Readers, Reading and Reception of Translated Fiction in Chinese recognizes that translated novels are distinct from non-translated novels, just as they are distinct from the originals from which they are derived, but they are neither secondary nor inferior. They provide different models of reality; they are split apart by two languages, two cultures and two literary systems; and they are characterized by cultural hybridity, double voicing and multiple intertextualities. With the continued popularity of translated fiction, questions related to its reading and reception take on increasing significance. Chan draws on insights from textual and narratological studies to unravel the processes through which readers interact with translated fiction. Moving from individual readings to collective reception, he considers how lay Chinese readers, as a community, \'received\' translated British fiction at specific historical moments during the late twentieth and early twenty-first centuries. Case studies discussed include translations of stream-of-consciousness novels, fantasy fiction and postmodern works. In addition to lay readers, two further kinds of reader with bilingual facility are examined: the way critics and historians approach translated fiction is investigated from structuralist and poststrcuturalist perspectives. A range of novels by well-known British authors constitute the core of the study, including novels by Oscar Wilde, James Joyce, D.H. Lawrence, Virginia Woolf, John Fowles, Helen Fielding and J.K. Rowling.', 1, 'http://books.google.com/books/content?id=Se1QAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (309, 'গোপন প্রতিপক্ষ', '8971520671', '2019-08-26', 258, 422, 'bn', NULL, 200.00, 10, 'টমি এবং টুপ্পেন্স তরুণ, প্রেমে... এবং ফ্ল্যাট ভেঙে গেছে। উত্তেজনায় অস্থির, তারা একটি সাহসী ব্যবসায়িক স্কিম শুরু করার সিদ্ধান্ত নিয়েছে ইয়ং অ্যাডভেঞ্চারার্স লিমিটেড -- \"কিছু করতে রাজি, কোথাও যেতে চাই।\" কিন্তু পাপী মিঃ হুইটিংটন তাদের প্রথম দায়িত্ব যখন তাদেরকে একটি ছদ্মবেশী ষড়যন্ত্রের দিকে টেনেছিল তখন তারা দর কষাকষির চেয়ে বেশি পায়। তারা নিজেদের কল্পনাও করতে পারে না তার চেয়ে বেশি বিপদে ডুবে যায় before এমন বিপদ যা তাদের ব্যবসায়ের ... এবং তাদের জীবনকে আকস্মিক বন্ধ করে দিতে পারে।', 1, 'http://books.google.com/books/content?id=M4AuyQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (310, 'Hype', '9789187675324', '2015-01-01', 259, 254, 'en', NULL, 300.00, 10, 'In the world of books and literature, “hype” is associated with bestsellerism - the books that sell the most, are read by vast numbers, and constantly talked about in media and staff rooms. Often, it is the success in itself that generates an interest because popularity begets popularity. Quite often though, a hyped bestseller is met with a skeptic criticism of poor language, a badly constructed plot, a predictable story line, or all three. The bestseller phenomenon is sometimes conceived as a threat against “real” literature. Research into the creation, reception, and meaning of bestsellers is utterly scarce and Hype: Bestsellers and Literary Culture is an important contribution to the understanding of the literature read by the masses. Popular literature plays an important role in the lives of millions of readers, offering entertainment, social commentary, and alternate perspectives on everyday life. This volume brings together such diverse issues as the creation of hype, the role and the meaning of the author in the present-day media landscape, changes in the book trade, and the relationship between bestsellers and research into them. Further articles give an historical overview on postapocalyptic stories, desert romances and the role of the authors. This book offers new knowledge on a subject that is increasingly popular within university curricula. Although the anthology is a work of academic research the texts are of equal interest to general readers.', 1, 'http://books.google.com/books/content?id=m4yBEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (311, 'Comparative Literature: Theory, Method, Application', '9789004458536', '1998-01-01', 260, 298, 'en', NULL, 400.00, 10, 'This book serves several purposes, all very much needed in today\'s embattled situation of the humanities and the study of literature. First, in Chapter One, the author proposes that the discipline of Comparative Literature is a most advantageous approach for the study of literature and culture as it is a priori a discipline of cross-disciplinarity and of international dimensions. After a Manifesto for a New Comparative Literature, he proceeds to offer several related theoretical frameworks as a composite method for the study of literature and culture he designates and explicates as the systemic and empirical approach. Following the introduction of the proposed New Comparative Literature, the author applies his method to a wide variety of literary and cultural areas of inquiry such as Literature and Cultural Participation where he discusses several aspects of reading and readership (Chapter Two), Comparative Literature as/and Interdisciplinarity (Chapter Three) where he deals with theory and application for film and literature and medicine and literature, Cultures, Peripheralities, and Comparative Literature (Chapter Four) where he proposes a theoretical designation he terms inbetween peripherality for the study of East Central European literatures and cultures as well as ethnic minority writing, Women\'s Literature and Men Writing about Women (Chapter Five) where he analyses texts written by women and texts about women written by men in the theoretical context of Ethical Constructivism, The Study of Translation and Comparative Literature (Chapter Six) where after a theoretical introduction he presents a new version of Anton Popovic\'s dictionary for literary translation as a taxonomy for the study of translation, and The Study of Literature and the Electronic Age (Chapter Seven), where he discusses the impact of new technologies on the study of literature and culture. The analyses in their various applications of the proposed New Comparative Literature involve modern and contemporary authors and their works such as Dorothy Richardson, Margit Kaffka, Mircea Cartarescu, Robert Musil, Alfred Döblin, Hermann Hesse, Péter Esterházy, Dezsö Kosztolányi, Michael Ondaatje, Endre Kukorelly, Else Seel, and others.', 1, 'http://books.google.com/books/content?id=l442EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (312, 'Estranging the Novel', '9781421440644', '2021-08-03', 261, 197, 'en', NULL, 500.00, 10, '\"The author\'s comparative approach to studying literary form makes a forceful case for a more geographically and formally expansive vision of the novel\"--', 1, 'http://books.google.com/books/content?id=UyA3EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (313, 'Boom!', '9781554589418', '2013-06-15', 262, 375, 'en', NULL, 600.00, 10, 'Since the early 1990s, tens of thousands of memoirs by celebrities and unknown people have been published, sold, and read by millions of American readers. The memoir boom, as the explosion of memoirs on the market has come to be called, has been welcomed, vilified, and dismissed in the popular press. But is there really a boom in memoir production in the United States? If so, what is causing it? Are memoirs all written by narcissistic hacks for an unthinking public, or do they indicate a growing need to understand world events through personal experiences? This study seeks to answer these questions by examining memoir as an industrial product like other products, something that publishers and booksellers help to create. These popular texts become part of mass culture, where they are connected to public events. The genre of memoir, and even genre itself, ceases to be an empty classification category and becomes part of social action and consumer culture at the same time. From James Frey’s controversial A Million Little Pieces to memoirs about bartending, Iran, the liberation of Dachau, computer hacking, and the impact of 9/11, this book argues that the memoir boom is more than a publishing trend. It is becoming the way American readers try to understand major events in terms of individual experiences. The memoir boom is one of the ways that citizenship as a category of belonging between private and public spheres is now articulated.', 1, 'http://books.google.com/books/content?id=d47ZAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (314, 'The Book Publishing Industry', '9781136850356', '2013-07-31', 254, 502, 'en', NULL, 700.00, 10, 'This volume provides an innovative and detailed overview of the book publishing industry, including details about the business processes in editorial, marketing and production. The work explores the complex issues that occur every day in the publishing industry.', 1, 'http://books.google.com/books/content?id=ib03AAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (315, 'Making the List', '0760725594', '2001-01-01', 263, 264, 'en', NULL, 800.00, 10, 'Using the annual hardcover best seller lists from \"The Bookman\" and then \"Publishers Weekly,\" examines twentieth-century American social, cultural, and historical trends through the lens of popular literature.', 1, 'http://books.google.com/books/content?id=isnf42j5rRUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (316, 'App Storm: Best Kindle Fire Apps, a Torrent of Games, Tools, and Learning Applications, Free and Paid, for Young and Old', NULL, '2013-11-02', 264, 149, 'en', NULL, 900.00, 10, 'Psst ... Hey, can we talk? It\'s about your Kindle Fire. You spent about $200 of your hard-earned money to buy it, right? Fine, the Kindle Fire is a heckuva bargain. But think about this: What if I could show you how to get a LOT more out of your Kindle Fire? Like $100 dollars\' worth of free downloads. Every day, 365 times a year. That\'s right, more than $100 dollars\' worth of free downloads. Every day of the year, another hundred clams\' worth of downloads. Games, apps, videos, and Kindle eBooks. Plus more than 20,000 other free apps that aren\'t available in Amazon\'s App Store for Kindle. I\'ll show you how to get those, too. Would you spend a few minutes of reading to get that? You\'ll get it, plus much more, by downloading and reading this book right now. A free paid app, every day. Plus dozens of free Kindle books (I hand-pick a fresh batch every morning). Discover what\'s missing from your Kindle library, and how to get it FREE. Plus, at least $100 worth of free stuff for your Kindle, every day, 365 times a year. What, you need more convincing? OK, here\'s the table of Contents from \"App Storm,\" my brand-new book of recommendations for the must-have apps for your Kindle Fire: INTRODUCTION ► A WORD ABOUT FREE APPS Fast Start Guide to the Kindle Fire Firing up your Kindle for the first time Batter charging life Shopping for apps Installing an App How Many Apps Can You Have? Removing apps To Permanently Delete an App 1 ► MUSIC APPS FOR KINDLE FIRE STITCHER RADIO XIIALIVE LITE VEVO PANDORA I HEART RADIO SONOS HOMEDJ TUNEIN RADIO GONEMAD WINAMP FOR ANDROID 2 ► VIDEO APPS FOR KINDLE FIRE VPLAYER SIMPLE MP4 PLAYER FLV PLAYER NETFLIX WATCH MOVIES NOW PRO 3 ► COMMUNICATION APPS FOR KINDLE FIRE SKYPE FOR KINDLE FIRE HD IMO YAHOO MESSENGER YAG - YET ANOTHER GTALK- GOOGLE TALK CLIENT FOR ANDROID TRILLIAN TALK.TO - ONE APP FOR ALL YOUR CHATS CISCO WEBEX MEETINGS LINKEDIN FACEBOOK 4 ► PRODUCTIVITY APPS FOR KINDLE FIRE QUICKOFFICE PRO EVERNOTE OFFICE CALCULATOR FREE ANY.DO DAY-TIMER PLAN2GO SMARTR CONTACTS BOX GREADER INSTAPAPER ES FILE EXPLORER ITRANSLATE EXCHANGE BY TOUCHDOWN OFFICESUITE PROFESSIONAL 6 POCKET PRINTERSHARE MOBILE PRINT ENHANCED EMAIL POCKET INFORMANT CALCULATOR PLUS FREE CALCULATOR ULTIMATE & GRAPH LOGMEINIGNITION SPLASHTOP REMOTE DESKTOP GODADDY MOBILE DOMAINS 5 ► UTILITIES FOR KINDLE FIRE MSECURE ANTAIR NIGHTSTAND BATTERY HD CONVERTPAD MOON PHASE PRO STOPWATCH MAPS WITH ME LITE NORTON MOBILE SECURITY LITE ANDROXPLORER ALARM CLOCK, CALENDAR, TODO LIST, NIGHTSTAND - PRODUCTIVITY HELPER ALL-IN-ONE CAMERA INSTAFIRE 6 ► GAMES FOR KINDLE FIRE ANGRY BIRDS FREE BAD PIGGIES FREE HD MINECRAFT POCKET EDITION SLENDER MAN PLANTS VS. ZOMBIES THE HAUNT SOLITAIRE BEJEWELED 2 SCRABBLE ROBOT UNICORN ATTACK FLOW FREE DRAWING PAD THUMBZILLA DOODLE JUMP HELLO KITTY CAFE 7 ► NETWORKING APPS FOR KINDLE FIRE WI-FI ANALYZER FREE ... continued', 1, 'http://books.google.com/books/content?id=XWzlAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Computers', 200);
INSERT INTO `book` VALUES (317, 'The Oxford Handbook of Publishing', '9780198794202', '2019-01-01', NULL, 480, 'en', NULL, 100.00, 10, 'The Oxford Handbook of Publishing marks the coming of age of the scholarship in publishing studies with a comprehensive exploration of current research on subjects such as copyright, corporate social responsibility, globalizing markets, and changing technology that have transformed the industry in recent years.', 1, 'http://books.google.com/books/content?id=ACKQDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Business & Economics', 203);
INSERT INTO `book` VALUES (318, 'Cultural Capitalism', '9781501779800', '2025-03-15', 265, 267, 'en', NULL, 200.00, 10, 'Cultural Capitalism explores Russian literature\'s eager embrace of capitalism in the post-Soviet era. When the Soviet Union fell, books were suddenly bought and sold as commodities. Russia\'s first bestseller lists brought attention and prestige. Even literary prizes turned to the market for legitimacy. The rise of capitalism entirely transformed both the economics and the aesthetics of Russian literature. By reconstructing the market\'s influence on everything from late-Soviet paper shortages to the prose of neoimperialism, Cultural Capitalism reveals Russian literature\'s exuberant hopes for and deep disappointments in capitalism. Only a free market, it was hoped, could cure endemic book deficits and liberate literature from ideological constraints. But as the market came to dominate literature, it imposed an ideology of its own, one that directed literary development for decades. Through archival research, original interviews, and provocative readings of literary texts, Bradley A. Gorski immerses the reader in both the economic and aesthetic worlds of post-Soviet Russian literature to reveal a cultural logic dominated by capitalism. The Russian 1990s and early 2000s saw markets introduced, adopted, and debated at an accelerated pace, all against the backdrop of a socialist past, staging the polemics between capitalism and culture in high drama and sharp relief. But the market forces at the center of the post-Soviet transition are fundamental to cultural trends worldwide. By revealing the complexities of Russia\'s story, Cultural Capitalism mounts a critique that cuts across national borders and provides a new way of seeing culture in the post-1989 era worldwide.', 1, 'http://books.google.com/books/content?id=d_wvEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (319, 'Paper Empires', '9781458782687', '2010-07-01', 266, 790, 'en', NULL, 300.00, 10, 'This new volume in UQP\'s History of the Book in Australia series explores Australian book production and consumption from 1946 to the present day. In the immediate postwar era, most books were imported into a colonial market dominated by British publishers. Paper Empires traces this fascinating and volatile half-century, using wide-ranging resea...', 1, 'http://books.google.com/books/content?id=2VpEGwl08vEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (320, 'সায়েন্স ফিকশান সমগ্র', '9844460611', '1994-01-01', NULL, 568, 'bn', NULL, 400.00, 10, 'Science fiction collection by a well known Bengali scientist.', 1, NULL, '2025-07-20 05:20:25', 'Bangladesh', 219);
INSERT INTO `book` VALUES (321, 'বৈজ্ঞানিক কল্পকাহিনী প্রডিজি', '9848765646', '2011-01-01', NULL, 150, 'bn', NULL, 500.00, 10, '', 1, NULL, '2025-07-20 05:20:25', 'Bengali language materials', 220);
INSERT INTO `book` VALUES (322, 'Chāẏābīthi', NULL, '1994-01-01', NULL, 127, 'en', NULL, 600.00, 10, '', 1, NULL, '2025-07-20 05:20:25', 'Bengali fiction', 221);
INSERT INTO `book` VALUES (323, 'Science Fiction', '9780745628936', '2005-05-06', 267, 320, 'en', NULL, 700.00, 10, 'In this new and timely cultural history of science fiction, Roger Luckhurst examines the genre from its origins in the late nineteenth century to its latest manifestations. The book introduces and explicates major works of science fiction literature by placing them in a series of contexts, using the history of science and technology, political and economic history, and cultural theory to develop the means for understanding the unique qualities of the genre. Luckhurst reads science fiction as a literature of modernity. His astute analysis examines how the genre provides a constantly modulating record of how human embodiment is transformed by scientific and technological change and how the very sense of self is imaginatively recomposed in popular fictions that range from utopian possibility to Gothic terror. This highly readable study charts the overlapping yet distinct histories of British and American science fiction, with commentary on the central authors, magazines, movements and texts from 1880 to the present day. It will be an invaluable guide and resource for all students taking courses on science fiction, technoculture and popular literature, but will equally be fascinating for anyone who has ever enjoyed a science fiction book.', 1, 'http://books.google.com/books/content?id=F3JU3SJ5fDIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (324, 'Science-fiction', '0873386043', '1998-01-01', 268, 780, 'en', NULL, 800.00, 10, 'Complementing Science-Fiction: The Early Years, which surveys science-fiction published in book form from its beginnings through 1930, the present volume covers all the science-fiction printed in the genre magazines--Amazing, Astounding, and Wonder, along with offshoots and minor magazines--from 1926 through 1936. This is the first time this historically important literary phenomenon, which stands behind the enormous modern development of science-fiction, has been studied thoroughly and accurately. The heart of the book is a series of descriptions of all 1,835 stories published during this period, plus bibliographic information. Supplementing this are many useful features: detailed histories of each of the magazines, an issue by issue roster of contents, a technical analysis of the art work, brief authors\' biographies, poetry and letter indexes, a theme and motif index of approximately 30,0000 entries, and general indexes. Science-Fiction: The Gernsback Years is not only indispensable for reference librarians, collectors, readers, and scholars interested in science-fiction, it is also of importance to the study of popular culture during the Great Depression in the United States. Most of its data, which are largely based on rare and almost unobtainable sources, are not available elsewhere.', 1, 'http://books.google.com/books/content?id=PbMdeizaCNcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (325, 'Science Fiction and Fantasy Literature', '9780941028769', '2010-09-01', 269, 802, 'en', NULL, 900.00, 10, 'Science Fiction and Fantasy Literature, A Checklist, 1700-1974, Volume one of Two, contains an Author Index, Title Index, Series Index, Awards Index, and the Ace and Belmont Doubles Index.', 1, 'http://books.google.com/books/content?id=P8zW2AH6150C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Reference', 223);
INSERT INTO `book` VALUES (326, 'কল্পবিশ্ব ডিটেকটিভ সায়েন্স ফিকশন সংখ্যা ২০১৯ / Kalpabiswa Detective Science Fiction Issue 2019', NULL, NULL, 270, 373, 'bn', NULL, 100.00, 10, 'বর্ষণমুখর বিকেলে এসে গেল কল্পবিশ্বের বিশেষ কল্পবিজ্ঞান গোয়েন্দা সংখ্যা। জানালার পাশে এক কাপ চা বা কফি নিয়ে বসে পড়ুন, আর চোখ রাখুন ল্যাপ্টপ বা ফোনে়। এবারে একগুচ্ছ ডিটেকটিভ কল্পবিজ্ঞানের পাশে থাকছে আমাদের সবার প্রণম্য সাহিত্যিক শ্রী অদ্রীশ বর্ধনকে ফিরে দেখা বিভিন্ন পত্র পত্রিকায় প্রকাশিত খবর ও পাঠকদের বার্তার মধ্যে দিয়ে। সঙ্গে থাকছে প্রবন্ধ ও গ্রন্থ পরিচিতি। আপনার পাঠ শুভ হোক।', 1, 'http://books.google.com/books/content?id=5T7oDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (327, 'Science Fact and Science Fiction', '9781135923747', '2006-09-06', 254, 756, 'en', NULL, 200.00, 10, 'Science fiction is a literary genre based on scientific speculation. Works of science fiction use the ideas and the vocabulary of all sciences to create valid narratives that explore the future effects of science on events and human beings. Science Fact and Science Fiction examines in one volume how science has propelled science-fiction and, to a lesser extent, how science fiction has influenced the sciences. Although coverage will discuss the science behind the fiction from the Classical Age to the present, focus is naturally on the 19th century to the present, when the Industrial Revolution and spectacular progress in science and technology triggered an influx of science-fiction works speculating on the future. As scientific developments alter expectations for the future, the literature absorbs, uses, and adapts such contextual visions. The goal of the Encyclopedia is not to present a catalog of sciences and their application in literary fiction, but rather to study the ongoing flow and counterflow of influences, including how fictional representations of science affect how we view its practice and disciplines. Although the main focus is on literature, other forms of science fiction, including film and video games, are explored and, because science is an international matter, works from non-English speaking countries are discussed as needed.', 1, 'http://books.google.com/books/content?id=9ZpsBgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (328, 'Challenging Anthropocentrism in Eco-Science Fiction Novels', '9781527567061', '2024-01-03', 271, 204, 'en', NULL, 300.00, 10, 'This book explores the relationship between humanity and nature while challenging the notion that anthropocentric behaviour causes the environmental catastrophes depicted in the four selected British eco-science fiction novels. These novels are John Christopher’s The Death of Grass (1956), J. G. Ballard’s The Drought (1965), Brian Aldiss’s Earthworks (1965), and John Brunner’s The Sheep Look Up (1972), all of which fictionalise the fact that the consequences of environmental problems can be diverse but equally serious. This book examines how even the smallest damage caused by human beings to the environment negatively affects them, other living beings, and the ecosystem they need to live and flourish. In conjunction with these, the factors and conditions that push characters in the novels to ignore and harm the environment are also scrutinised. While examining how and why the environmental problems in the novels have arisen, it is evaluated whether the authors propose solutions to these problems and, if so, what they are.', 1, 'http://books.google.com/books/content?id=N2LvEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (329, 'Women Scientists in Fifties Science Fiction Films', '9781476610054', '2015-02-18', 272, 237, 'en', NULL, 400.00, 10, 'In the 1950s, science was rapidly advancing, and so were scientific opportunities for women. Modern science fiction films reflected these simultaneous social developments. This book proposes that the social ideology of the 1950s, which was partly concerned with gender issues, saturated the B science fiction films of that era and inspired a new appreciation for the role of women in scientific advancements and other social achievements. Drawing on feminist literary and cultural theory, the author argues that the emergence of the modern American science fiction film in 1950 and the situation of post-World War II female scientists together created a film genre. That genre was explicitly amenable to exploring the tension between a woman\'s place in her home and her place in the work force, particularly in scientific fields. Early chapters provide a general introduction to the science fiction genre and specifically describe 1950s B science fiction films as they resonate with concerns proper to feminist theory. Subsequent chapters offer detailed, historically situated readings of 10 B science fiction films from the 1950s that feature women in science. The cinematic representations of female scientists are compared and contrasted with real female professionals of the time, illuminating the changing gender dynamics reflected in popular film in the 1950s. Films analyzed include Rocketship X-M, It Came from Beneath the Sea, Them!, Tarantula, The Deadly Mantis, Beginning of the End, Kronos, Cat-Women of the Moon, World Without End, and Queen of Outer Space.', 1, 'http://books.google.com/books/content?id=wL_ABgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Performing Arts', 224);
INSERT INTO `book` VALUES (330, 'Decoding Digital Culture with Science Fiction', '9783839472422', '2024-06-04', 273, 375, 'en', NULL, 500.00, 10, 'How do digital media technologies affect society and our lives? Through the cultural theory hypotheses of hyper-modernism, hyperreality, and posthumanism, Alan N. Shapiro investigates the social impact of Virtual/Augmented Reality, AI, social media platforms, robots, and the Brain-Computer Interface. His examination of concepts of Jean Baudrillard and Katherine Hayles, as well as films such as Blade Runner 2049, Ghost in the Shell, Ex Machina, and the TV series Black Mirror, suggests that the boundary between science fiction narratives and the »real world« has become indistinct. Science-fictional thinking should be advanced as a principal mode of knowledge for grasping the world and digitalization.', 1, 'http://books.google.com/books/content?id=pyMMEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Social Science', 212);
INSERT INTO `book` VALUES (331, 'Hugo Gernsback and the Century of Science Fiction', '9780786430796', '2007-08-01', 272, 284, 'en', NULL, 600.00, 10, 'An examination of science fiction editor and author Hugo Gernsback\'s career, this critical study explores the many ways in which his work influenced the genre. It summarizes the science fiction theories of Gernsback and his successors, considers his efforts to define science fiction both verbally and visually, and for the first time offers detailed studies of his rarest periodicals, including Technocracy Review, Superworld Comics, and Science-Fiction Plus. An analysis of his ground-breaking novel, Ralph 124C 41+: A Romance of the Year 2660, and its influences on a variety of science fiction novels, films and television programs is also offered.', 1, 'http://books.google.com/books/content?id=T98bGdEXz9gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (332, 'Masculinity in Contemporary Science Fiction by Men', '9781836249641', '2025-05-30', 274, 272, 'en', NULL, 700.00, 10, 'Masculinity in Contemporary Science Fiction by Men: No Plans for the Future is the first comprehensive study of the self-representation of men in SF novels published in the twenty-first century by male authors. Exploring a broad selection of writers and works, the fourteen chapters present a panoramic overview of men’s contributions to current SF and explore their slow but noticeable progress in the representation of gender. The impact of feminism and gender studies, and the demands of readers, have profoundly transformed men’s SF, which now presents far more caring and vulnerable male characters. The old stereotypes are being replaced by a collective reflection on how men and masculinity are changing, though the lack of a common agenda results in novels that, while exciting and often challenging, sometimes miss the chance to imagine a better, anti-patriarchal, pro-feminist future for men and for all human beings. The authors analysed include Robert Charles Wilson, Geoff Ryman, Samuel R. Delany, Richard K. Morgan, John Scalzi, Iain M. Banks, Ernest Cline, James S.A. Corey, Colson Whitehead, Andy Weir, Daniel H. Wilson, Ian McDonald, Yoon Ha Lee, Tade Thompson, Neal Stephenson and Kim Stanley Robinson.', 1, 'http://books.google.com/books/content?id=dahjEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (333, 'The Rise and Fall of American Science Fiction, from the 1920s to the 1960s', '9781476638515', '2019-10-04', 272, 312, 'en', NULL, 800.00, 10, '﻿ By examining important aspects of science fiction in the twentieth century, this book explains how the genre evolved to its current state. Close critical attention is given to topics including the art that has accompanied science fiction, the subgenres of space opera and hard science fiction, the rise of SF anthologies, and the burgeoning impact of the marketplace on authors. Included are in-depth studies of key texts that contributed to science fiction\'s growth, including Philip Francis Nowlan\'s first Buck Rogers story, the first published stories of A. E. van Vogt, and the early juveniles of Isaac Asimov, Arthur C. Clarke and Robert Heinlein.', 1, 'http://books.google.com/books/content?id=tPuzDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (334, 'Modern Science Fiction: A Critical Analysis', '9781476673196', '2018-06-07', 272, 214, 'en', NULL, 900.00, 10, 'James Gunn--one of the founding figures of science fiction scholarship and teaching--wrote in 1951 what is likely the first master\'s thesis on modern science fiction. Portions were in the short-lived pulp magazine Dynamic but it has otherwise remained unavailable. Here in its first full publication, the thesis explores many of the classic Golden Age stories of the 1940s and the critical perspective that informed Gunn\'s essential genre history Alternate Worlds and his anthology series The Road to Science Fiction. The editor\'s introduction and commentary show the historical significance of Gunn\'s work and its relevance to today\'s science fiction studies.', 1, 'http://books.google.com/books/content?id=el5dDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (335, 'Italian Science Fiction and the Environmental Humanities', '9781835534212', '2023-11-15', 274, 180, 'en', NULL, 100.00, 10, 'This volume explores Italian science fiction from the nineteenth century to the twenty-first, covering literary texts, films, music and visual works by figures as diverse as Maria Rosa Cutrufelli, Peter Kolosimo, Primo Levi, Antonio Margheriti, Gilda Musa and Roberto Vacca. It broadens the horizons of both Italian studies and the environmental humanities by addressing a long-neglected genre, and expands our understanding of relations between the ecological, the imaginary and the sociopolitical. The chapters draw on a variety of methodological frameworks, including animal studies, ecocriticism, ecofeminism, eco-media studies, energy humanities and posthumanism. The reader will gain insights into consequential topics such as anthropocentrism/speciesism, ecomodernist thought, environmental justice struggles at the planetary and regional level, non-human and new materialist ontologies, utopian/dystopian philosophies and prospects for transitioning beyond the crisis of petro-modernity through the construction of post-depletion futures. Open Access versions of the introduction and six of the book chapters are available on the Liverpool University Press website.', 1, 'http://books.google.com/books/content?id=agtkEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (336, 'Cents of Wonder - Science Fiction\'s First Award Winners', NULL, NULL, 275, 351, 'en', NULL, 200.00, 10, 'Now! Together! For The First Time Anywhere! Pulled straight from the pages of the leading magazines of their age, 14 stories by the people whose imagination, creativity, and scientific acumen helped define the genre that would become known as Science Fiction. Between 1926 and 1930 Hugo Gernsback hosted the science fiction field’s inaugural writing contests, first in Amazing Stories, and then again in Science Wonder Stories, the genre’s first two magazines devoted entirely to the publication of scientifiction tales. These are the authors whose tales of wonder and speculation inspired the writers you’re more familiar with, writers such as Asimov, Bradbury, Le Guin, Heinlein, Brackett, Moore, and others. Before there was science fiction, before there were Fans, before conventions, before comics, before cosplay, these fourteen pioneers stepped off into the unknown of imagination and helped entire generations learn to willingly suspend their disbelief, engage their sense of wonder, and take off for the stars! And they won awards for it!', 1, 'http://books.google.com/books/content?id=7NCREAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (337, 'The Role of Science Fiction', '9783836660068', '2008-07-01', 276, 113, 'en', NULL, 300.00, 10, 'In \"The role of Science Fiction in selected works of Isaac Asimov and Kurt Vonnegut\" the author elaborates upon important similarities and differences between the use of science fiction motives in selected works of Isaac Asimov and Kurt Vonnegut. The analysis includes Asimov\'s Foundation and Robots and Empire and Vonnegut\'s Sirens of Titan and Galapagos.', 1, 'http://books.google.com/books/content?id=NJH5AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (338, 'Library of Congress Subject Headings', NULL, '2011-01-01', NULL, 1672, 'en', NULL, 400.00, 10, '', 1, 'http://books.google.com/books/content?id=2x9wB7a7DvIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Subject headings, Library of Congress', 226);
INSERT INTO `book` VALUES (339, 'Library of Congress Subject Headings', NULL, '2004-01-01', NULL, 1662, 'en', NULL, 500.00, 10, '', 1, 'http://books.google.com/books/content?id=pEhkh_9bP9wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Subject headings, Library of Congress', 226);
INSERT INTO `book` VALUES (341, 'Espionage & Mystery Novels', NULL, '2022-05-17', 277, 16744, 'en', NULL, 600.00, 10, 'William Le Queux (1864-1927) was a famous and incredibly visionary writer who wrote in the genres of mystery, thriller, and espionage - in the years leading up to World War I. His best-known works are the invasion thrillers \"The Great War in England in 1897\" and the anti-German invasion fantasy \"The Invasion of 1910.\" – all written before the war..._x000D_ This edition includes: Novels_x000D_ The Great War in England in 1897_x000D_ The Invasion of 1910_x000D_ Guilty Bonds_x000D_ Zoraida_x000D_ The Temptress_x000D_ The Great White Queen_x000D_ Devil\'s Dice_x000D_ Whoso Findeth a Wife_x000D_ The Eye of Istar_x000D_ If Sinners Entice Thee_x000D_ The Bond of Black_x000D_ The Day of Temptation_x000D_ The Veiled Man_x000D_ The Wiles of the Wicked_x000D_ An Eye for an Eye_x000D_ In White Raiment_x000D_ Of Royal Blood_x000D_ Her Majesty\'s Minister_x000D_ The Under-Secretary_x000D_ The Seven Secrets_x000D_ As We Forgive Them_x000D_ The Sign of the Stranger_x000D_ The Hunchback of Westminster_x000D_ The Closed Book_x000D_ The Czar\'s Spy_x000D_ Behind the Throne_x000D_ The Pauper of Park Lane_x000D_ The Mysterious Mr. Miller_x000D_ Whatsoever a Man Soweth_x000D_ The Great Court Scandal_x000D_ The Lady in the Car_x000D_ The House of Whispers_x000D_ The Red Room_x000D_ Spies of the Kaiser_x000D_ The Great God Gold (Treasure of Israel)_x000D_ Hushed Up! A Mystery of London_x000D_ The Death-Doctor_x000D_ The Lost Million_x000D_ The Price of Power_x000D_ Her Royal Highness_x000D_ The White Lie_x000D_ The Four Faces_x000D_ The Sign of Silence_x000D_ The Mysterious Three_x000D_ At the Sign of the Sword_x000D_ The Mystery of the Green Ray_x000D_ Number 70, Berlin_x000D_ The Way to Win_x000D_ The Broken Thread_x000D_ The Place of Dragons_x000D_ The Zeppelin Destroyer_x000D_ Sant of the Secret Service_x000D_ The Stolen Statesman_x000D_ The Doctor of Pimlico_x000D_ Whither Thou Goest_x000D_ The Intriguers_x000D_ The Red Widow (The Death-Dealers of London)_x000D_ Mademoiselle of Monte Carlo_x000D_ This House to Let_x000D_ The Golden Face_x000D_ The Stretton Street Affair_x000D_ The Voice from the Void_x000D_ Short Story Collections_x000D_ Stolen Souls_x000D_ The Count\'s Chauffeur_x000D_ The Bomb-Makers_x000D_ The Gay Triangle', 1, 'http://books.google.com/books/content?id=kPRyEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (342, 'EARL DERR BIGGERS Ultimate Collection: 20+ Mystery Novels, Detective Tales & Short Stories, Including the Charlie Chan Series (Illustrated)', NULL, '2024-01-16', 278, 2838, 'en', NULL, 700.00, 10, 'Earl Derr Biggers is renowned for his captivating mystery novels, and the EARL DERR BIGGERS Ultimate Collection compiles 20+ of his best works, including the iconic Charlie Chan series. Biggers\'s writing style combines suspenseful plot twists with insightful character development, creating a rich literary experience for readers. Set in the early 20th century, Biggers\'s novels offer a glimpse into the cultural and societal norms of the time, making them not only entertaining but also historically enlightening. The collection also includes illustrated editions, enhancing the visual experience of the stories. Overall, Biggers\'s work is a must-read for any mystery enthusiast or lover of classic literature. Earl Derr Biggers\'s background as a Harvard graduate and successful playwright provides insight into the meticulous crafting of his mystery novels. His unique storytelling ability stems from his keen observation of human behavior and his talent for creating complex yet relatable characters. Biggers\'s interest in detective fiction may have been inspired by the popular mystery genre of his time, driving him to create his own iconic series and characters. I highly recommend the EARL DERR BIGGERS Ultimate Collection to anyone looking for a compelling mystery read that offers both entertainment and historical context. Biggers\'s masterful storytelling and intriguing plots will keep readers engaged from beginning to end, making this collection a timeless addition to any bookshelf.', 1, 'http://books.google.com/books/content?id=xSnmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (343, 'THE DETECTIVE EBENEZER GRYCE MYSTERIES – Complete Collection: 11 Mystery Novels in One Volume', NULL, '2024-01-13', 278, 2825, 'en', NULL, 800.00, 10, 'Anna Katharine Green\'s \"The Detective Ebenezer Gryce Mysteries - Complete Collection: 11 Mystery Novels in One Volume\" is a riveting collection of classic mystery novels set in the late 19th century. Green\'s literary style combines intricate plot twists with well-developed characters, making each mystery a thrilling journey for readers. The stories are filled with suspense, intrigue, and clever detective work, all written in Green\'s signature eloquent prose that keeps readers guessing until the very end. This collection showcases Green\'s talent for crafting intricate plots and clever solutions that have stood the test of time in the mystery genre. Anna Katharine Green, often referred to as the mother of the detective novel, drew inspiration from her love of mystery and crime fiction, as well as her keen observation of human nature. Her background in law and her passion for writing led her to create the iconic character of Detective Ebenezer Gryce, a brilliant and astute investigator who solves the most baffling mysteries with ease. Green\'s unique perspective and storytelling abilities have made her a revered figure in the world of detective fiction. I highly recommend \"The Detective Ebenezer Gryce Mysteries\" to readers who enjoy classic detective fiction and intricate, well-crafted mysteries. Green\'s collection is a must-read for fans of the genre, offering a glimpse into the Golden Age of detective fiction and showcasing the timeless appeal of masterfully written mysteries.', 1, 'http://books.google.com/books/content?id=H0PmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (344, 'British Mysteries Collection: The Complete 7 Novels & Detective Story', NULL, '2023-12-05', 277, 1426, 'en', NULL, 900.00, 10, 'This carefully crafted ebook: \"British Mysteries Collection: The Complete 7 Novels & Detective Story\" is formatted for your eReader with a functional and detailed table of contents. Ethel Lina White (1876-1944) was a British crime writer, best known for her novel The Wheel Spins, on which the Alfred Hitchcock film, The Lady Vanishes, was based. Some Must Watch: Set in early 20th century England, on the Welsh border, the novel tells the story of a serial killer who murders disabled young women in the community. His next victim apparently is Helen, a mute girl working as a maid for the wealthy, bedridden Mrs. Warren. Mrs. Warren urges her to leave the house, as does Dr. Parry, who knows the reason for Helen\'s loss of speech and hopes to help her get her voice back. Fear Stalks the Village: Series of poison pen letters cause panic in a small, quiet English village and soon after, the murders start happening. As the fear arises, Joan Brooks, who used to live a peaceful life, is forced to act fast in order to save the lives of her loved ones and her own. She Faded into Air: The story of the alleged disappearance of Evelyn Cross was too fantastic for credence. According to the available evidence, she melted into thin air shortly after four o\'clock on a foggy afternoon in late October. One minute, she was visible in the flesh--a fashionable blonde, nineteen years of age and weighing about eight and a half stone. The next minute, she was gone. The Wheel Spins: Miss Loveapple has always had an unusual belief in her incredible luck. However, her luck is about to run out when she becomes a target of a cruel serial killer. Unaware of the danger, she goes through a number of insane situations escaping the death by a mere wonder. How long will she last? Contents: Fear Stalks the Village Some Must Watch (The Spiral Staircase) Wax The Wheel Spins (The Lady Vanishes) Step in the Dark While She Sleeps She Faded into Air', 1, 'http://books.google.com/books/content?id=lsPiEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (345, 'THE MYSTERY NOVELS OF WILKIE COLLINS', NULL, '2023-11-21', 278, 4204, 'en', NULL, 100.00, 10, 'In \"The Mystery Novels of Wilkie Collins,\" readers are invited to delve into the intricate narratives that laid the groundwork for the modern detective genre. Collins adeptly weaves suspenseful plots characterized by meticulous attention to detail, rich characterizations, and an innovative use of unreliable narrators. His novels, such as \"The Woman in White\" and \"The Moonstone,\" serve as a mirror to Victorian society\'s anxieties regarding identity, gender, and morality, all while providing thrilling twists that keep readers on the edge of their seats. The book\'Äôs literary style employs a blend of realism and sensationalism, making it an essential study for enthusiasts of Gothic literature and mystery fiction alike. Wilkie Collins, often heralded as the father of the mystery novel, was influenced by his career as a playwright and his close association with contemporary writers like Charles Dickens. His unique position within the cultural milieu of Victorian England allowed him to experiment with narrative forms and themes that reflected his own experiences as a man of literature and social reformer. Collins\'s personal struggles with health and his complex relationships with women infused his work with an authenticity that resonates deeply within his stories. For those intrigued by the evolution of the mystery genre, Collins\'s works are indispensable. This anthology not only showcases his exceptional storytelling prowess but also invites readers to explore the deeper societal questions embedded within his narratives. \"The Mystery Novels of Wilkie Collins\" is highly recommended for both literary scholars and casual readers who seek a compelling connection to the origins of suspense in literature.', 1, 'http://books.google.com/books/content?id=UTTmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (346, 'BRITISH MYSTERIES COLLECTION - 31 Novels & Short Stories in One Volume', NULL, '2023-12-08', 277, 680, 'en', NULL, 200.00, 10, 'This carefully crafted ebook: \"BRITISH MYSTERIES COLLECTION - 31 Novels & Short Stories in One Volume: The Thorpe Hazell Detective Tales, Thrilling Stories of the Railway, Murder at the Pageant, A Warning in Red and many more\" is formatted for your eReader with a functional and detailed table of contents: The Canon in Residence Downland Echoes Murder at the Pageant Thrilling Stories of the Railway Peter Crane\'s Cigars The Tragedy on the London and Mid-Northern The Affair of the Corridor Express Sir Gilbert Murrell\'s Picture How the Bank Was Saved The Affair of the German Dispatch-Box How the Bishop Kept His Appointment The Adventure of the Pilot Engine The Stolen Necklace The Mystery of the Boat Express How the Express Was Saved A Case of Signaling Winning the Race The Strikers The Ruse That Succeeded Other Railway Stories A Perilous Ride The Slip Coach Mystery In the Rockhurst Tunnel The Convict\'s Revenge A Warning in Red A Jump for Freedom Special Working Instructions Pierre Cournet\'s Last Run Between Two Fires The Triumph of Seth P. Tucker A Policy of Silence In a Tight Fix The Romance of the \"Southern Queen\" Victor Lorenzo Whitechurch (1868-1933) was a Church of England clergyman and author. He is best known for his detective stories featuring Thorpe Hazell, the first amateur railway detective, whom the author intended to be as far from Sherlock Holmes as possible. Another Whitechurch\'s character was the spy Captain Ivan Koravitch. His stories were admired for their immaculate plotting and factual accuracy. Whitechurch was one of the first writers to submit his manuscripts to Scotland Yard for vetting as to police procedure.', 1, 'http://books.google.com/books/content?id=4MbiEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (347, 'Mystery & Crime Collection', NULL, '2022-05-17', 277, 4301, 'en', NULL, 300.00, 10, 'Herman Cyril McNeile (1888-1937) commonly known as H. C. McNeile or Sapper, was a British soldier and author. Drawing on his experiences in the trenches during the First World War, he started writing short stories and getting them published in the Daily Mail. After the war McNeile left the army and continued writing, although he changed from war stories to thrillers. In 1920 he published Bulldog Drummond, whose eponymous hero became his best-known creation. The character was based on McNeile himself, on his friend Gerard Fairlie and on English gentlemen generally. Drummond is a First World War veteran, brutalised by his experiences in the trenches and bored with his post-war lifestyle. He publishes an advertisement looking for adventure, and soon finds himself embroiled in a series of exploits, many of which involve Carl Peterson—who becomes his nemesis—and Peterson\'s mistress, the femme fatale Irma. McNeile interspersed his Drummond work with other detective novels and story collections that included two characters who appeared as protagonists in their own works, Jim Maitland and Ronald Standish. H. C. McNeile thrillers are a continuation of his war stories, with upper class Englishmen defending England from foreigners plotting against it._x000D_ This unique and meticulously edited collection includes: Jim Maitland_x000D_ The Island of Terror_x000D_ Bulldog Drummond _x000D_ The Black Gang _x000D_ The Third Round _x000D_ The Final Count _x000D_ The Female of the Species _x000D_ Temple Tower _x000D_ The Return of Bulldog Drummond _x000D_ Knock-Out_x000D_ Bulldog Drummond at Bay_x000D_ Challenge_x000D_ The Horror At Staveley Grange_x000D_ Tiny Carteret_x000D_ Ronald Standish_x000D_ Men, Women and Guns _x000D_ The Saving Clause _x000D_ Out of the Blue_x000D_ The Finger of Fate', 1, 'http://books.google.com/books/content?id=tPNyEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (348, 'Mystery fiction and modern life', '1617034401', NULL, 279, 260, 'en', NULL, 400.00, 10, '', 1, 'http://books.google.com/books/content?id=AXdgm32XQR4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (349, 'The Essential Mystery Lists', '9781615952038', '2011-09-30', 280, 591, 'en', NULL, 500.00, 10, 'For the first time in one place, Roger M. Sobin has compiled a list of nominees and award winners of virtually every mystery award ever presented. He has also included many of the “best of” lists by more than fifty of the most important contributors to the genre.; Mr. Sobin spent more than two decades gathering the data and lists in this volume, much of that time he used to recheck the accuracy of the material he had collected. Several of the “best of” lists appear here for the first time in book form. Several others have been unavailable for a number of years.; Of special note, are Anthony Boucher’s “Best Picks for the Year.” Boucher, one of the major mystery reviewers of all time, reviewed for The San Francisco Chronicle, Ellery Queen Mystery Magazine, and The New York Times. From these resources Mr. Sobin created “Boucher’s Best” and “Important Lists to Consider,” lists that provide insight into important writing in the field from 1942 through Boucher’s death in 1968.? This is a great resource for all mystery readers and collectors.; ; Winner of the 2008 Macavity Awards for Best Mystery Nonfiction.', 1, 'http://books.google.com/books/content?id=8r-Ma6S1cEQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Reference', 223);
INSERT INTO `book` VALUES (350, 'The Thea Barlow Cozy Mysteries Box Set (Three Complete Cozy Mystery Novels)', '9781644571347', '2019-10-22', 281, 758, 'en', NULL, 600.00, 10, 'Chicago Journalist Investigates Wyoming\'s Old Rural Legends and Stumbles Into Modern-Day Murder and Mayhem in This Box Set Filled with Humor, History, and One Mean-Spirited Chicken. ALL THE OLD LIONS: On her first assignment—unravel the mystery of Halfway Halt, a defunct brothel in Hijax, Wyoming—Thea must ply townsfolk who don\'t want their secrets revealed, and finger a murderer...if she wants to survive. FROGSKIN AND MUTTONFAT: In Wyoming with old flame Max Holman to interview the 82-year-old Kid Corcoran, last of the old-time bandits, Thea is caught up in a maelstrom of greed, murder, and revenge when a local reporter is found knifed to death in Thea\'s room. DEAD IN HOG HEAVEN: In Hog Heaven to investigate the ruins of an old rural bordello, Thea stumbles upon a woman\'s body and is fingered for murder. \"Good stories, interesting characters, a touch of romance, and a little humor. Lots of fun!\" ~Mysterious Woman \"Blends Old West and New with humor, lore, and an admirable, entertaining heroine.\" ~The Poisoned Pen \"...an engaging and cleanly told. Highly Recommended.\" ~Gothic Journal THE THEA BARLOW WYOMING MYSTERIES, in order All the Old Lions Frogskin and Muttonfat Dead in Hog Heaven Death by Doodlebug', 1, 'http://books.google.com/books/content?id=VeJkEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (351, 'Mr. J. G. Reeder Collection: 5 Mystery Novels & 4 Detective Stories', NULL, '2023-11-20', 278, 1023, 'en', NULL, 700.00, 10, 'The \"Mr. J. G. Reeder Collection\" presents a captivating anthology of five mystery novels and four detective stories by Edgar Wallace, a prolific writer renowned for his gripping narratives and imaginative plots. This compilation showcases Wallace\'s emblematic style, characterized by sharp dialogue, intricate plots, and a deft ability to weave suspense throughout his storytelling. Set against the backdrop of early 20th-century Britain, these tales delve into the complexities of human nature, often revealing societal concerns and moral ambiguities through the lens of crime and detection, inviting readers to engage with both the characters and the perplexing situations they face. Edgar Wallace, a prominent figure in the mystery and crime genres, was driven by his journalistic background, which infused his writing with a keen eye for detail and a sense of urgency. This collection reflects not only his mastery of suspense but also his desire to entertain and provoke thought, paralleling the cultural shifts of his time. Born into humble beginnings, Wallace\'s varied life experiences, including his ventures in journalism and screenwriting, informed his vibrant storytelling, making him a pioneer in the world of detective fiction. For readers who savor the intricate fabric of mystery and revel in the process of deduction, the \"Mr. J. G. Reeder Collection\" is an essential addition to their literary repertoire. Wallace\'Äôs ability to craft engaging narratives ensures that these stories are as relevant today as they were upon their release. This collection is a true testament to the art of mystery writing, inviting both new readers and veteran enthusiasts to rediscover Wallace\'s genius.', 1, 'http://books.google.com/books/content?id=_TrmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (352, 'Mr. J. G. Reeder Series: Premium Collection of 5 Mystery Novels & 4 Detective Stories', NULL, '2024-01-07', 278, 1022, 'en', NULL, 800.00, 10, 'In the captivating collection \"Mr. J. G. Reeder Series: Premium Collection of 5 Mystery Novels & 4 Detective Stories,\" Edgar Wallace showcases his remarkable flair for crafting intricate plots filled with suspense, wit, and unexpected twists. The narratives revolve around the astute detective Mr. J. G. Reeder, whose unique methods and keen insight into human nature unravel complex criminal schemes set against the backdrop of early 20th-century London. Wallace\'s engaging prose employs vivid imagery and a fast-paced style, characteristic of the golden age of detective fiction, reflecting the societal anxieties and moral dilemmas of his time. Edgar Wallace, a prolific English writer, earned his stripes as a journalist and playwright, experiences that undoubtedly informed his keen narrative sensibilities. Often referred to as a forefather of crime fiction, Wallace\'Äôs exposure to the gritty environments of London and fascination with the criminal underworld plays a significant role in shaping the content and characters of his works. His ability to weave humor into tension-laden plots is a hallmark of his style, making his stories not only thrilling but also richly entertaining. This collection is an essential read for mystery aficionados who relish clever storytelling and multifaceted characters. Wallace\'s mastery in creating suspenseful atmospheres paired with engaging dialogue ensures readers stay glued to the page. Immerse yourself in the intriguing world of Mr. J. G. Reeder, where every unraveling mystery is a testament to Wallace\'s prowess in the genre.', 1, 'http://books.google.com/books/content?id=n0TmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (353, 'Ghost Stories and Mysteries', '0486207153', '1975-01-01', 282, 404, 'en', NULL, 900.00, 10, 'Remaining supernatural fiction by writer many consider greatest ghost story writer of all time. Mystery stories are equally memorable.', 1, 'http://books.google.com/books/content?id=NA-qQ2YFlNoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (354, 'Martin Hewitt - Complete Series: 25 Mysteries in One Volume (Illustrated)', NULL, '2023-12-30', 277, 628, 'en', NULL, 100.00, 10, 'Martin Hewitt is an ex lawyer\'s assistant who eventually found his inclination better suited to crime investigation. He is a low-key, realistic, lower class answer to Sherlock Holmes, though his cases are just as weird and mysterious as Holmes\'s. Martin Hewitt stories are similar in style to those of Arthur Conan Doyle, cleverly plotted and very amusing, while the character himself is a bit less arrogant and a bit more charming than Holmes. Table of Contents: Martin Hewitt, Investigator The Lenton Croft Robberies The Loss of Sammy Crockett The Case of Mr. Foggatt The Case of the Dixon Torpedo The Quinton Jewel Affair The Stanway Cameo Mystery The Affair of the Tortoise Chronicles of Martin Hewitt The Ivy Cottage Mystery The Nicobar Bullion Case The Holford Will Case The Case of the Missing Hand The Case of Laker, Absconded The Case of the Lost Foreigner Adventures of Martin Hewitt The Affair of Mrs. Seton\'s Child The Case of Mr. Geldard\'s Elopement The Case of the Dead Skipper The Case of the \"Flitterbat Lancers\" The Case of the Late Mr. Rewse The Case of the Ward Lane Tabernacle The Red Triangle The Affair of Samuel\'s Diamonds The Case of Mr. Jacob Mason The Case of the Lever Key The Case of the Burnt Barn The Case of the Admiralty Code The Adventure of Channel Marsh', 1, 'http://books.google.com/books/content?id=_xbmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (355, 'The Mystery Readers\' Advisory', '083890811X', '2002-01-01', 283, 244, 'en', NULL, 200.00, 10, 'Three librarians from Scottsdale, Arizona provide library staff with an introduction to the mystery genre and offer tips and techniques for providing advice to mystery readers in the library. They include some of their own bibliographies, but refer readers elsewhere for fuller ones. They also include a brief history of the genre to pass on to readers new to it.', 1, 'http://books.google.com/books/content?id=bsWM8vWJHzoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Language Arts & Disciplines', 202);
INSERT INTO `book` VALUES (356, 'The Thorpe Hazell Mysteries', NULL, '2023-12-27', 278, 110, 'en', NULL, 300.00, 10, 'In \"The Thorpe Hazell Mysteries,\" Victor L. Whitechurch masterfully intertwines elements of early 20th-century detective fiction with intricate plotting and vivid characterizations. The novel follows amateur detective Thorpe Hazell as he navigates a labyrinth of clues and red herrings across diverse settings. Whitechurch employs a style that is both succinct and richly evocative, reflecting the literary norms of the period while also pushing against conventional boundaries, thus paving the way for future mystery genres. The stories captivate readers with not only their suspenseful narratives but also their explorations of human psychology and morality within the context of British society during that era. Victor L. Whitechurch, known for his contributions to detective fiction, was influenced by his background in zoology and his experiences in the natural world, which often inform his storytelling. His keen observational skills and understanding of human behavior, coupled with a sharp wit, allow him to construct multi-dimensional characters and engaging plots. Whitechurch\'s literary career showcases a commitment to the genre, earning him a place among the notable writers of his time. \"The Thorpe Hazell Mysteries\" is a compelling read for both aficionados of detective fiction and newcomers alike, as it not only delivers intricate mysteries but also richly developed characters. This collection promises to engage readers\' intellect while providing a delightful escape into Whitechurch\'Äôs meticulously crafted world. A must-read for those seeking to explore the evolution of the mystery genre!', 1, 'http://books.google.com/books/content?id=xSfmEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (357, 'The Mysterious Cases of Martin Hewitt', NULL, '2022-11-13', 277, 626, 'en', NULL, 400.00, 10, 'Martin Hewitt is an ex lawyer\'s assistant who eventually found his inclination better suited to crime investigation. He is a low-key, realistic, lower class answer to Sherlock Holmes, though his cases are just as weird and mysterious as Holmes\'s. Martin Hewitt stories are similar in style to those of Arthur Conan Doyle, cleverly plotted and very amusing, while the character himself is a bit less arrogant and a bit more charming than Holmes. Arthur Morrison (1863-1945) was an English writer and journalist known for his realistic novels and stories about working-class life in London\'s East End, and for his detective stories, featuring Martin Hewitt and Horace Dorrington. Table of Contents: Martin Hewitt, Investigator The Lenton Croft Robberies The Loss of Sammy Crockett The Case of Mr. Foggatt The Case of the Dixon Torpedo The Quinton Jewel Affair The Stanway Cameo Mystery The Affair of the Tortoise Chronicles of Martin Hewitt The Ivy Cottage Mystery The Nicobar Bullion Case The Holford Will Case The Case of the Missing Hand The Case of Laker, Absconded The Case of the Lost Foreigner Adventures of Martin Hewitt The Affair of Mrs. Seton\'s Child The Case of Mr. Geldard\'s Elopement The Case of the Dead Skipper The Case of the \"Flitterbat Lancers\" The Case of the Late Mr. Rewse The Case of the Ward Lane Tabernacle The Red Triangle The Affair of Samuel\'s Diamonds The Case of Mr. Jacob Mason The Case of the Lever Key The Case of the Burnt Barn The Case of the Admiralty Code The Adventure of Channel Marsh', 1, 'http://books.google.com/books/content?id=akaVEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (358, 'British Murder Mysteries - Wilkie Collins Collection', NULL, '2022-11-13', 277, 4201, 'en', NULL, 500.00, 10, 'The \'British Murder Mysteries - Wilkie Collins Collection\' presents a meticulously curated selection of Collins\'s most celebrated works that define the genre of detective fiction. With a distinctive combination of intricate plotting and vivid characterization, Collins weaves intricate narratives that delve into themes of morality, identity, and societal constraints, often employing unreliable narrators and innovative structures. His pioneering methods, particularly in the suspenseful use of cliffhangers and foreshadowing, have positioned him as a precursor to modern mystery writers, situating his work within the broader Victorian literary context that grapples with emergent anxieties surrounding crime and the human psyche. Wilkie Collins, a contemporary of Charles Dickens and a stalwart of the Victorian literary scene, crafted this collection during a time of heightened fascination with justice and crime in urban England. Renowned for his own tumultuous experiences and legal background, Collins\'s writing echoes his profound insights into human nature and societal hypocrisy. His personal connections to themes of betrayal and duplicity are mirrored throughout the narratives, allowing readers to glimpse the complexities of his own life in the shadows of his fiction. For readers intrigued by the foundations of detective fiction and the psychological dimensions of crime, this collection is a quintessential exploration of Collins\'s genius. Each story not only entertains but also invites readers to engage with pressing moral questions, making it a vital addition to the libraries of enthusiast and scholar alike.', 1, 'http://books.google.com/books/content?id=7EiVEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (359, 'The Collected Mysteries of Fergus Hume', NULL, '2022-11-13', 277, 4630, 'en', NULL, 600.00, 10, 'In \"The Collected Mysteries of Fergus Hume,\" the reader is invited into a labyrinthine world of crime, intrigue, and moral complexity. Hume, a pioneer of the detective genre, showcases his adeptness at intertwining suspense with richly drawn characters in a series of compelling narratives. The collection serves as both homage and commentary on the Victorian fascination with mystery and the uncanny, all while employing exquisite prose that elevates the genre beyond mere sensationalism. Hume\'s nuanced plots often reflect societal undercurrents, revealing how crime, class, and morality intersect in Victorian England, providing a holistic reading experience. Fergus Hume, an underrated yet significant figure in the world of crime fiction, was born in 1859 in England and later emigrated to Australia. His early exposure to the diverse societal fabric of both countries undoubtedly shaped his literary voice, steering him towards themes of injustice and the complexity of human nature. Hume\'s breakout success, \"The Mystery of a Hansom Cab,\" solidified his reputation and established him as a leading storyteller during an era marked by rapid social change and urbanization, making his insights deeply relevant. \"The Collected Mysteries of Fergus Hume\" is not merely a compilation of tales; it is an essential exploration of the foundations of detective fiction. Readers who seek a sophisticated interplay of intrigue and eloquence will find Hume\'s work a perfect addition to their literary repertoire. Delve into this collection to experience a transformative journey through the realms of mystery, where every page offers a glimpse into the shadows beneath Victorian society.', 1, 'http://books.google.com/books/content?id=bvObEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (360, 'Recognizing Biography', '9781512801880', '2017-11-15', 284, 244, 'en', NULL, 700.00, 10, 'Epstein\'s narrative interweaves interpretive and theoretical chapters as it emplots the discourse of English biography from Walton to Strachey. In this way familiar generic relationships between biographer, subject, life, text, falsehood, and readership are analyzed in specific (if constantly shifting) historical, literary, cultural, and economic texts.', 1, 'http://books.google.com/books/content?id=fVUrEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (361, 'Biography in Theory', '9783110516692', '2017-08-07', 285, 416, 'en', NULL, 800.00, 10, 'This textbook is an anthology of significant theoretical discussions of biography as a genre and as a literary-historical practice. Covering the 18th to the 21st centuries, the reader includes programmatic texts by authors such as Herder, Carlyle, Dilthey, Proust, Freud, Kracauer, Woolf and Bourdieu. Each text is accompanied by a commentary placing its contribution in critical context. Ideal for use in undergraduate seminars, this reader may also be of interest for academic researchers in the areas of literary studies and history aiming to get an overview of historical questions in biographical theory. This revised and updated English language edition also includes new translations of texts by J. G. Herder and Stefan Zweig, as well as an introductory discussion on the possibility of a ‘theory of biography’. Note: Due to copyright reasons, the chapter \"Sade, Fourier, Loyola [Extract] (1971)\" (pp. 175–177) by Roland Barthes could not be included in the ebook.', 1, 'http://books.google.com/books/content?id=78w0DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (362, 'Reading Biography', '9780595337477', '2004-01-01', 257, 85, 'en', NULL, 900.00, 10, 'Most book reviewers know very little about the history or the art of biography. Indeed, if there is any art in biography, it is the rare reviewer that acknowledges it or knows how to discuss it. Usually the reviewer regards biography as an occasion to wax eloquent about what he or she thinks of the subject. Little space, if any, is devoted to the biography\'s structure or style, to the biographer\'s peculiar problems, or to how the biography relates to others about the same subject. Carl Rollyson, a professional biographer and weekly columnist (On Biography) for The New York Sun, explores the ramifications of authorized and unauthorized biographies, investigates the relationship between biography and history, biography and fiction, biography and autobiography, as well commenting on certain perennial biographical subjects such as Napoleon, on sub genres such as children\'s biography, and on the most recent developments in life writing. Rollyson\'s aim is to reach not merely scholars but that vast general audience addicted to reading biography, enhancing their pleasure by providing insight (or you might say, the inside word) on how biographies are put together.', 1, 'http://books.google.com/books/content?id=ye6ausAiJUIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Biography & Autobiography', 227);
INSERT INTO `book` VALUES (363, 'Biographies in the History of Physics', '9783030485092', '2020-07-22', 219, 316, 'en', NULL, 100.00, 10, 'This book sheds new light on the biographical approach in the history of physics by including the biographies of scientific objects, institutions, and concepts. What is a biography? Can biographies also be written for non-human subjects like scientific instruments, institutions or concepts? The respective chapters of this book discuss these controversial questions using examples from the history of physics. By approaching biography as metaphor, it transcends the boundaries between various perspectives on the history of physics, and enriches our grasp of the past.', 1, 'http://books.google.com/books/content?id=87nyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Science', 212);
INSERT INTO `book` VALUES (364, 'Biography and the Question of Literature in France', '9780191533778', '2007-01-04', 286, 440, 'en', NULL, 200.00, 10, 'This book takes a fresh look at the relations between literature and biography by tracing the history of their connections through three hundred years of French literature. The starting point for this history is the eighteenth century when the term \'biography\' first entered the French language and when the word \'literature\' began to acquire its modern sense of writing marked by an aesthetic character. Arguing that the idea of literature is inherently open to revision and contestation, Ann Jefferson examines the way in which biographically-orientated texts have been engaged in questioning and revising definitions of literature. At the same time, she tracks the evolving forms of biographical writing in French culture, and proposes a reappraisal of biography in terms not only of its forms, but also of its functions. Although Ann Jefferson\'s book has powerful theoretical implications for both biography and the literary, it is first and foremost a history, offering a comprehensive new account of the development of French literature through this dual focus on the question of literature and on the relations between literature and biography. It offers original readings of major authors and texts in the light of these concerns, beginning with Rousseau and ending with \'life-writing\' contemporary authors such as Pierre Michon and Jacques Roubaud. Other authors discussed include Mme de Stäel, Victor Hugo, Sainte-Beuve, Barbey d\'Aurevilly, Baudelaire, Nerval, Mallarmé, Schwob, Proust, Gide, Leiris, Sartre, Genet, Barthes, and Roger Laporte.', 1, 'http://books.google.com/books/content?id=0Q9REAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (365, 'The Art of Biography in Antiquity', '9781107016699', '2012-04-05', 230, 513, 'en', NULL, 300.00, 10, 'Examines the whole spectrum of Greek and Roman biography, which explores the virtues and vices of philosophers, statesmen and poets.', 1, 'http://books.google.com/books/content?id=NhLQbSdTKooC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Biography & Autobiography', 227);
INSERT INTO `book` VALUES (366, 'The Seductions of Biography', '9781134714421', '2016-02-04', 254, 234, 'en', NULL, 400.00, 10, 'The Seductions of Biography is an important volume which sheds new light on a flourishing literary form, the biography. In postmodern culture, new methods and intentions emerge, as well as new obstacles, towards our understanding of biography as a genre. This book provides a thorough exploration of this genre, from a wide range of postmodern perspectives. The Seductions of Biography brings together a number of essays which reflect in culturally critical as well as autobiographical terms on current themes and practices of contemporary biography. Issues addressed by these essays focus on the postmodern dilemma itself--as new voices from excluded communities make themselves heard in biographical works, the decentralization of new issues, such as gender, ethnicity, and sexuality, becomes problematic. Contributors question the responsibilities a biographer has, both to the subject and the public, and consider also questions of morality and taste; for example, is it fair to use private tapings made by your subject\'s analyst? And how much do we really need to know about Eleanor Roosevelt\'s sex life? The impact of sexuality on our reading of public figures is addressed, as well as other issues which explore the popular and provocative nature of biography. Interdisciplinary and wide-ranging in scope, The Seductions of Biography will appeal to biographers, historians, cultural critics, and the vast population of avid biography readers. Contributors: Kwame Anthony Appiah, Clark Blaise, Marilyn L. Brownstein, Blanche Wiesen Cook, John D\'Emilio, Jeffrey Louis Decker, Michael Eric Dyson, Diana Fuss, Marjorie Garber, Henry Louis Gates, Jr., Hayden Herrera, Maurice Isserman, Barbara Johnson, William S. McFeely, Diane Wood Middlebrook, Richard J. Powell, Phyllis Rose, Doris Sommer, Marita Sturken, Sherley Anne Williams, Jean Fagan Yellin', 1, 'http://books.google.com/books/content?id=T9qCCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Social Science', 212);
INSERT INTO `book` VALUES (367, 'Biography Exemplary and Instructive', NULL, '1873-01-01', NULL, 322, 'en', NULL, 500.00, 10, '', 1, 'http://books.google.com/books/content?id=BW4BAAAAQAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Biography', 227);
INSERT INTO `book` VALUES (368, 'Biographical Research', '9781000564778', '2022-03-30', 287, 231, 'en', NULL, 600.00, 10, 'Studying people’s lives requires acknowledging the multiple entanglements between individual singularity and processes of social patterning. This book testifies how challenging and creative the study of these connections can be. It gathers international contributions that show, in imaginative ways, how a person’s life or specific domains of existence can be observed, tackled, and analysed across time. This volume reveals the potential of biographical research in the production of social theory, in the development of methodological innovation, in giving voice and protagonism to people, and in the understanding of the social unfolding of their lives. It is a testimony of a vibrant and youthful field, with a long tradition in social sciences, and with numerous connections with other study areas, namely the life course approach. The different chapters illustrate how the challenges posed by this type of research focused on the individual level of analysis are particular and what creative responses are required to continue analysing the link between biography and society. The chapters in this book were originally published as a special issue of the journal Contemporary Social Science.', 1, 'http://books.google.com/books/content?id=lK0IEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Social Science', 212);
INSERT INTO `book` VALUES (369, 'The American Biographical Dictionary', NULL, '1857-01-01', 288, 926, 'en', NULL, 700.00, 10, '', 1, 'http://books.google.com/books/content?id=o-AUAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'North America', 229);
INSERT INTO `book` VALUES (370, 'Biographical Misrepresentations of British Women Writers', '9783319567501', '2017-11-08', 218, 296, 'en', NULL, 800.00, 10, 'This book is an investigation of the biases, contradictions, errors, ambiguities, gaps, and historical contexts in biographies of controversial British women who published during the long nineteenth century, many of them left unchecked and perpetuated from publication to publication. Fourteen scholars analyze the agenda, problems, and strengths of biographical material, highlighting the flaws, deficiencies, and influences that have distorted the portraits of women such as Lady Mary Wortley Montagu, Mary Wollstonecraft, Mary Hays, Sydney Owenson, Letitia Elizabeth Landon, Felicia Hemans, Elizabeth Barrett Browning, Caroline Norton, Elizabeth Gaskell, Charlotte Brontë, Lady Florence Dixie, George Eliot, and Edith Simcox. Through exposing distortions, this fascinating study demonstrates that biographies are often more about the biographer than they are about the biographee and that they are products of the time in which they are written.', 1, 'http://books.google.com/books/content?id=M8I9DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (371, 'A Companion to Literary Biography', '9781118896297', '2018-11-28', 214, 628, 'en', NULL, 900.00, 10, 'An authoritative review of literary biography covering the seventeenth century to the twentieth century A Companion to Literary Biography offers a comprehensive account of literary biography spanning the history of the genre across three centuries. The editor – an esteemed literary biographer and noted expert in the field – has encouraged contributors to explore the theoretical and methodological questions raised by the writing of biographies of writers. The text examines how biographers have dealt with the lives of classic authors from Chaucer to contemporary figures such as Kingsley Amis. The Companion brings a new perspective on how literary biography enables the reader to deal with the relationship between the writer and their work. Literary biography is the most popular form of writing about writing, yet it has been largely neglected in the academic community. This volume bridges the gap between literary biography as a popular genre and its relevance for the academic study of literature. This important work: Allows the author of a biography to be treated as part of the process of interpretation and investigates biographical reading as an important aspect of criticism Examines the birth of literary biography at the close of the seventeenth century and considers its expansion through the eighteenth, nineteenth and twentieth centuries Addresses the status and writing of literary biography from numerous perspectives and with regard to various sources, methodologies and theories Reviews the ways in which literary biography has played a role in our perception of writers in the mainstream of the English canon from Chaucer to the present day Written for students at the undergraduate level, through postgraduate and doctoral levels, as well as academics, A Companion to Literary Biography illustrates and accounts for the importance of the literary biography as a vital element of criticism and as an index to our perception of literary history.', 1, 'http://books.google.com/books/content?id=EtpwDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Biography & Autobiography', 227);
INSERT INTO `book` VALUES (372, 'Biographies and Miscellaneous Papers', NULL, '1867-01-01', NULL, 544, 'en', NULL, 100.00, 10, '', 1, 'http://books.google.com/books/content?id=wkKEe-VV_pAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', '', 251);
INSERT INTO `book` VALUES (373, 'Melancholy and Literary Biography, 1640-1816', '9781137271099', '2013-06-25', 218, 232, 'en', NULL, 200.00, 10, 'This book traces the development of literary biography in the eighteenth century; how writers\' melancholy was probed to explore the inner life. Case studies of a number of significant authors reveal the 1790s as a time of biographical experimentation. Reaction against philosophical biography led to a nineteenth-century taste for romanticized lives.', 1, 'http://books.google.com/books/content?id=-UrH2Twx5h4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Literary Criticism', 216);
INSERT INTO `book` VALUES (374, 'The Turn to Biographical Methods in Social Science', '0415228387', '2000-01-01', 289, 372, 'en', NULL, 300.00, 10, 'Biographical research methods have become a useful and popular tool for contemporary social scientists. This book combines an exploration of the origins of this field with comparative examples of the ways biographical methods have been applied.', 1, 'http://books.google.com/books/content?id=EtmNgalre30C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Reference', 223);
INSERT INTO `book` VALUES (375, 'Library of Congress Subject Headings', NULL, '2003-01-01', NULL, 1816, 'en', NULL, 400.00, 10, '', 1, 'http://books.google.com/books/content?id=8KHkDcIBEGIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Subject headings, Library of Congress', 226);
INSERT INTO `book` VALUES (376, 'Dictionary of National Biography', NULL, '1895-01-01', NULL, 472, 'en', NULL, 500.00, 10, '', 1, 'http://books.google.com/books/content?id=fWhIAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Great Britain', 230);
INSERT INTO `book` VALUES (377, '... Biography of American Statesmanship', NULL, '1909-01-01', NULL, 80, 'en', NULL, 600.00, 10, '', 1, 'http://books.google.com/books/content?id=yroXAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'United States', 231);
INSERT INTO `book` VALUES (378, 'Subject Headings Used in the Dictionary Catalogues of the Library of Congress', NULL, '1966-01-01', NULL, 1448, 'en', NULL, 700.00, 10, '', 1, 'http://books.google.com/books/content?id=CEl6ScPP8bgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Subject headings', 226);
INSERT INTO `book` VALUES (379, 'British Musical Biography', NULL, '1897-01-01', NULL, 498, 'en', NULL, 800.00, 10, '', 1, 'http://books.google.com/books/content?id=SR8KAQAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Music', 233);
INSERT INTO `book` VALUES (380, 'Indian History Project', NULL, '2020-09-20', 290, 176, 'bn', NULL, 900.00, 10, 'ভারতীয় ইতিহাসের নানাবিধ তথ্যাবলী বইটিতে তুলে ধরা হয়েছে। নেট/সেট/এসএসসি সহ বিভিন্ন চাকরির পরীক্ষায় এই ই-বুক গ্রন্থটি ছাত্রছাত্রী বা পরীক্ষার্থীদের অনেক উপকারে আসবে, আশা রাখি।', 1, 'http://books.google.com/books/content?id=mjVIEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Architecture', 234);
INSERT INTO `book` VALUES (381, 'A Guide to the Study and Use of Military History', NULL, '1979-01-01', NULL, 528, 'en', NULL, 100.00, 10, 'This Guide to the Study and Use of Military History is designed to foster an appreciation of the value of military history and explain its uses and the resources available for its study. It is not a work to be read and lightly tossed aside, but one the career soldier should read again or use as a reference at those times during his career when necessity or leisure turns him to the contemplation of the military past.', 1, 'http://books.google.com/books/content?id=ZUh2_a6aJKgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Electronic government information', 235);
INSERT INTO `book` VALUES (382, 'Bharoter Itihas: 300-1206 Saal (History of India: 300-1206 AD)', '9789354390654', '2021-01-01', 291, 329, 'bn', NULL, 200.00, 10, 'BHAROTER ITIHAS (300-1206 Saal): A textbook of History for three year degree course (Semester System) prepared as per the new C.B.C.S. system of all the Universities of West Bengal & Tripura, written by Jayanta Kumar Baidya (M.A./M.Phil.), Assistant Professor, Department of History, Shirakole Mahavidyalaya. Former Assistant Professor of Sir Gurudas Mahavidyalaya, Asansol Girls’ College, Bangabasi College & Prafullya Chandra College.', 1, 'http://books.google.com/books/content?id=haZjEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (383, 'History of Duchess County, New York', NULL, '1882-01-01', NULL, 805, 'en', NULL, 300.00, 10, '', 1, 'http://books.google.com/books/content?id=MR2I3hdYkV0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (384, 'Routledge Handbook of Historical International Relations', '9781351168946', '2021-06-28', 287, 886, 'en', NULL, 400.00, 10, 'This handbook presents a comprehensive, concise and accessible overview of the field of Historical International Relations (HIR). It summarizes and synthesizes existing contributions to the field while presenting central themes, approaches and methodologies that have driven the development of HIR, providing the reader with a sense of the diversity and research dynamics that are at the heart of this field of study. The wide range of topics covered are grouped under the following headings: Traditions: Demonstrates the wide variety of approaches to HIR. Thinking International Relations Historically: Different ways of thinking IR historically share some common concerns and areas for further investigation. Actors, Processes and Institutions: Explores the processes, actors, practices, and institutions that constitute the core objects of study of many HIR scholars. Situating Historical International Relations: Critically reflects about the situatedness of our objects of study. Approaches: Examines how HIR scholars conduct and reflect about their research, often in dialogue with a variety of perspectives from cognate disciplines. Summarizing key contributions and trends while also sketching out challenges for future inquiry, this is an invaluable resource for students, academics and researchers from a range of disciplines, particularly International Relations, global history, political science, history, sociology, anthropology, peace studies, diplomatic studies, security studies, international political thought, political geography, international law.', 1, 'http://books.google.com/books/content?id=b2jwEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Political Science', 212);
INSERT INTO `book` VALUES (385, 'The Social Studies Curriculum', '9780791481042', '2012-02-01', 292, 370, 'en', NULL, 500.00, 10, 'The third edition of The Social Studies Curriculum thoroughly updates the definitive overview of the primary issues teachers face when creating learning experiences for students in social studies. By connecting the diverse elements of the social studies curriculum—history education, civic, global, and social issues—the book offers a unique and critical perspective that separates it from other texts in the field. This edition includes new work on race, gender, sexuality, critical multiculturalism, visual culture, moral deliberation, digital technologies, teaching democracy, and the future of social studies education. In an era marked by efforts to standardize curriculum and teaching, this book challenges the status quo by arguing that social studies curriculum and teaching should be about uncovering elements that are taken for granted in our everyday experiences, and making them the target of inquiry.', 1, 'http://books.google.com/books/content?id=4qFMqjxte9IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Education', 208);
INSERT INTO `book` VALUES (386, 'Library of Congress Subject Headings', NULL, '2010-01-01', NULL, 1992, 'en', NULL, 600.00, 10, '', 1, 'http://books.google.com/books/content?id=50nv0Fqpk2IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Subject headings, Library of Congress', 226);
INSERT INTO `book` VALUES (387, 'Prachin Bharoter Itihas: Prachin Somoikal-300 Saal (History of Ancient India: Pre History-300 Years)', '9789388937450', '2019-01-01', 291, 176, 'bn', NULL, 700.00, 10, 'PRACHIN BHAROTER ITIHAS (Prachin Somoikal-300 Saal): A textbook of History for three year degree course (Semester System) prepared as per the new C.B.C.S. system of all the Universities of West Bengal. 1st Semester (Honours/General) written by Jayanta Kumar Baidya (M.A./M.Phil.), Head, Department of History, Sir Gurudas Mahavidyalaya, Kolkata. Former Assistant Professor of Bangabasi College, Prafullya Chandra College and Asansol Girls’ College.', 1, 'http://books.google.com/books/content?id=f8ZmEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Architecture', 234);
INSERT INTO `book` VALUES (388, 'St James\'s Palace', '9780300267464', '2022-01-01', 251, 290, 'en', NULL, 800.00, 10, 'The first modern history of St James\'s Palace, shedding light on a remarkable building at the heart of the history of the British monarchy that remains by far the least known of the royal residences In this first modern history of St James\'s Palace, the authors shed new light on a remarkable building that, despite serving as the official residence of the British monarchy from 1698 to 1837, is by far the least known of the royal residences. The book explores the role of the palace as home to the heir to the throne before 1714, its impact on the development of London and the West end during the late Stuart period, and how, following the fire at the palace of Whitehall, St James\'s became the principal seat of the British monarchy in 1698. The arrangement and display of the paintings and furnishings making up the Royal Collection at St James\'s is chronicled as the book follows the fortunes of the palace through the Victorian and Edwardian periods up to the present day. Specially commissioned maps, phased plans, and digital reconstructions of the palace at key moments in its development accompany a rich array of historical drawings, watercolors, photographs, and plans. The book includes a foreword by His Royal Highness The Prince of Wales. Published in association with Royal Collection Trust', 1, 'http://books.google.com/books/content?id=nr6rEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (389, 'Comprehending Antisemitism through the Ages: A Historical Perspective', '9783110672046', '2021-08-23', 285, 332, 'en', NULL, 900.00, 10, 'This volume traces the history of antisemitism from antiquity through contemporary manifestations of the discrimination of Jews. It documents the religious, sociological, political and economic contexts in which antisemitism thrived and thrives and shows how such circumstances served as support and reinforcement for a curtailment of the Jews’ social status. The volume sheds light on historical processes of discrimination and identifies them as a key factor in the contemporary and future fight against antisemitism.', 1, 'http://books.google.com/books/content?id=WpZEEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (390, 'The Circle of Knowledge: A Classified, Simplified, Visualized Book of Answers', NULL, '2022-06-02', 277, 2131, 'en', NULL, 100.00, 10, 'The Circle of Knowledge is an informative book that was designed in 1917, to be both inspiring and entertaining. The book represents the modern, progressive spirit which fits that time, in its forms of expression and its editorship. The purpose of this work is to answer the why, who, what, when, where, how of the wide majority of curious minds, both young and adult, and encourage them to raise further questions. Special measures were taken in creating this work to isolate essentials from non-essentials; to differentiate human interest subjects of universal significance from those of little concern; to deliver living truths instead of dead vocabulary; and finally, to bring the whole within the knowledge of the intermediate reader, without regard to age, in an acceptable and exciting form. The use of visual outlines and tables; maps, drawings, and diagrams; the illustrated works of great painters, sculptors, and architects all are used to give the reader the valuable and cultural knowledge of past and present.', 1, 'http://books.google.com/books/content?id=dBF0EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (391, 'War and Conflict Quotations', '9781476611488', '2015-09-02', 272, 303, 'en', NULL, 200.00, 10, 'History is replete with pronouncements on war. Some reflect on man’s warlike nature (“We are quick to flare up, we races of men on the earth”—Homer); others deal with the practical strategies of the combatants (“If Hitler invaded hell I would make at least a favorable reference to the devil in the House of Commons”—Winston Churchill); and still others offer advice for avoiding conflict (“The most disadvantageous peace is better than the most just war”—Desiderius Erasmus). More than 2,700 quotations on war and conflict are presented in this reference work. The quotations are arranged by more than 100 broad categories, from action to winning. For each, the quotation is first given, followed by its author, the work in which it appeared (when appropriate), and the date. The book includes numerous cross-references, and keyword-in-context and author indexes are provided for further utility.', 1, 'http://books.google.com/books/content?id=yxOBCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'History', 218);
INSERT INTO `book` VALUES (392, 'Reauthorization of Appropriation for the National Historical Publications and Records Commission', NULL, '1980-01-01', NULL, 84, 'en', NULL, 300.00, 10, '', 1, 'http://books.google.com/books/content?id=aZ4kAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Government publications', 237);
INSERT INTO `book` VALUES (393, 'Our Reason for Being', '9781666717068', '2022-08-11', 293, 267, 'en', NULL, 400.00, 10, 'Ecclesiastes is a persuasive speech with a rhetoric so unique that it can be easily misunderstood. It speaks powerfully to believers as well as nonbelievers because it addresses the question of the meaning of life in the most satisfying way. The heart of this book is an expositional commentary that interprets Ecclesiastes as authoritative Scripture. It seeks to recover the rhetoric of the speech in terms of its comprehensive message on the meaning of life as well as its compelling force to get the message across. Preceding the expositional commentary is an introduction to Ecclesiastes that presents a new approach to outlining and reading Ecclesiastes as a coherent speech. It also presents an overview of the “forest”—the overall rhetorical flow of the speech from beginning to end. This is to prevent one from getting lost when immersed in the “trees” of the expositional commentary. Following the expositional commentary are two topical studies to give Ecclesiastes the breadth and depth of coverage it deserves. The first is an interdisciplinary exposition on the meaning of life. The second is an interpretive essay to defend exegetically the interpretation of Ecclesiastes as a coherent speech.', 1, 'http://books.google.com/books/content?id=YsWAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Religion', 238);
INSERT INTO `book` VALUES (394, 'Historical Sketch of the Missions in India', NULL, '1901-01-01', NULL, 382, 'en', NULL, 500.00, 10, '', 1, 'http://books.google.com/books/content?id=Acr6GSoBFbYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Missions', 239);
INSERT INTO `book` VALUES (395, 'Aesthetics', '9789004357990', '2007-01-01', 260, 309, 'en', NULL, 600.00, 10, 'Preliminary Material -- Aesthetics: Definition and Object -- Difficuties for Aesthetics -- Immediate Aesthetics Perception--the Material Basis of Aesthetics -- The Optimal Starting Point: Nature or Art? -- Three Starting Points for Aesthetics Analysis -- The Essential Properties of Aesthetics Perception -- The Internal Structure of an Aesthetic Object -- The Expressiveness of an Aesthetic Object and its Objective Sense -- Aesthetic Form and Aesthetic Structure -- The Relations of Natural and Artistic Beauty with Respect to Origin -- The Aesthetic Critertion of Natural and Artistic Beauty is the Same -- The Conception of Nature\'s Beauty in the History of European Culture. The Beauty of Wild Nature -- The Beauty of Organic Forms -- Human Beauty. Its Ideal -- Organic Beauty and the Sexual Instinct -- Beauty and Ugliness. Their Relation in Art -- The Peculiarity of Natural Beauty -- The Relation of Primitive Art to Others Areas of Culture -- Attempts to Derive the Origin of Art form General Psychological Principles. Criticism -- Stimuli for the Emergence of Representational Art -- The Origin of Music -- General Conclusions -- The Artist and the Child (Primitive Man) -- A General Characterization of the Creative Process -- The Creative Process: Three Basic Moments -- Creative Imagination -- The Problem: Formulation and Explication -- Taine\'s \"Milieu Theory\" and its Critical Appraisal -- The Psychological Theory of \"Numbing\" and its Critique -- The Relation of the Artist\'s Individual and Creativity to the Cultural Environment -- The Relation of the Development of Art to General Cultural Development -- The Historical Changing of Styles and the Theories Explaining it -- Introduction -- Beauty and Morality -- Art (Beauty) and Truth -- The Aesthetic of the Ancient Greeks -- Rationalist Aesthetics in France and Germany -- The Empiricist Aesthetics of the English -- The Aesthetics of Kant -- Vico -- German Idealist Aesthetics: Schelling, Hegel, Schopenhauer -- The Formalists. Fechner -- Contemporary Aesthetic Theories -- The Problem -- The Relation of the Art Work to the Subject. Optical and Acoustic Impression: Their Difference -- Spatial and Nonspatial Forms of Art -- Objective and Nonobjective Forms of Art -- Representational and Nonrepresentational Art -- Notes -- Index.', 1, 'http://books.google.com/books/content?id=bfh1DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Social Science', 212);
INSERT INTO `book` VALUES (396, 'Critical Legal Education as a Subversive Activity', '9781000806694', '2015-10-16', 287, 250, 'en', NULL, 700.00, 10, 'In an age when everyone aspires to teach critical thinking skills in the classroom, what does it mean to be a subversive law teacher? Who or what might a subversive law teacher seek to subvert – the authority of the law, the university, their own authority as teachers, perhaps? Are law students ripe for subversion, agents of, or impediments to, subversion? Do they learn to ask critical questions? Responding to the provocation in the classic book Teaching as a Subversive Activity, by Postman and Weingartner, the idea that teaching could, or even should, be subversive still holds true today, and its premise is particularly relevant in the context of legal education. We therefore draw on this classic book to discuss, in the present volume, the consideration of research into legal education as lifetime learning, as creating meaning, as transformative and as developing world-changing thinking within the legal context. The volume offers research into classroom experiences and theoretical and historical interrogations of what it means to teach law subversively. Primarily aimed at legal educators and doctoral students in law planning careers as academics, its insights speak directly to tensions in higher education more broadly.', 1, 'http://books.google.com/books/content?id=FWaXEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Law', 240);
INSERT INTO `book` VALUES (397, 'Municipal Government and Land Tenure', NULL, '1886-01-01', NULL, 670, 'en', NULL, 800.00, 10, '', 1, 'http://books.google.com/books/content?id=Hs7jfxcIr64C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Local government', 241);
INSERT INTO `book` VALUES (398, 'Federal Register', NULL, '1992-12-18', NULL, 1266, 'en', NULL, 900.00, 10, '', 1, 'http://books.google.com/books/content?id=7Y1LyK7ya_gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Administrative law', 240);
INSERT INTO `book` VALUES (399, 'Catalogue of the Library of the South Carolina College', '9783368774233', '2024-11-12', 217, 126, 'en', NULL, 100.00, 10, 'Reprint of the original, first published in 1836.', 1, 'http://books.google.com/books/content?id=xagwEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (400, 'Test Book Title', '978-1234567890', '2025-07-19', 1001, 300, 'English', '1st', 299.99, 50, 'A test book for approval system', 1, 'https://example.com/cover.jpg', '2025-07-20 05:20:25', 'Fiction', 201);
INSERT INTO `book` VALUES (401, 'Achieving Serenity', '978-93-6087-544-2', '2025-07-19', 210, 138, 'English', '1st', 299.00, 10, 'Serenity is often associated with a calm and composed state of mind, where individuals feel undisturbed by external factors or internal turmoil.\nIn the hustle and bustle of our fast-paced lives, the pursuit of serenity becomes a beacon of hope and necessity. \nSerenity is important for holistic well-being, encompassing mental, emotional, and physical health. It contributes to a positive mind-set, improved relationships, and the ability to navigate life\'s challenges with grace and resilience.\nHowever, achieving serenity can be challenging for several reasons. \nWelcome to \"Unlocking Serenity State: Practical Strategies for Stress Relief and Enhanced Quality of Life.\" Your companion on a journey towards tranquility. \nThis book offers practical and actionable strategies to navigate the storms of stress and finding the calm within.\nTo preserve and enhance serenity, it\'s crucial to manage and mitigate stress through various strategies such as mindfulness practices, relaxation techniques, regular exercise, and cultivating a supportive social network. Addressing the root causes of stress and developing healthy coping mechanisms contributes to a more serene and balanced state of being.', 1, 'https://shashwatpublication.com/files/book-covers/front_cover_imgSB20872.jpg', '2025-07-20 05:20:25', 'Non-Fiction', 222);
INSERT INTO `book` VALUES (402, 'Understanding Analysis (Undergraduate Texts in Mathematics)', '978-1493927111', '2025-07-20', 218, 324, 'English', '2nd', 99.00, 10, 'This lively introductory text exposes the student to the rewards of a rigorous study of functions of a real variable. In each chapter, informal discussions of questions that give analysis its inherent fascination are followed by precise, but not overly formal, developments of the techniques needed to make sense of them. By focusing on the unifying themes of approximation and the resolution of paradoxes that arise in the transition from the finite to the infinite, the text turns what could be a daunting cascade of definitions and theorems into a coherent and engaging progression of ideas. Acutely aware of the need for rigor, the student is much better prepared to understand what constitutes a proper mathematical proof and how to write one.\n\nFifteen years of classroom experience with the first edition of Understanding Analysis have solidified and refined the central narrative of the second edition. Roughly 150 new exercises join a selection of the best exercises from the first edition, and three more project-style sections have been added. Investigations of Euler’s computation of ζ(2), the Weierstrass Approximation ­ Theorem, and the gamma function are now among the book’s cohort of seminal results serving as motivation and payoff for the beginning student to master the methods of analysis.', 1, 'https://m.media-amazon.com/images/I/51OS+nZ1bEL._SL1244_.jpg', '2025-07-20 03:24:40', 'Other', NULL);
INSERT INTO `book` VALUES (403, 'Linear Algebra Done Right (Undergraduate Texts in Mathematics)', '978-3031410260', '2025-07-20', 218, 407, 'English', '1st', 99.00, 10, 'Now available in Open Access, this best-selling textbook for a second course in linear algebra is aimed at undergraduate math majors and graduate students. The fourth edition gives an expanded treatment of the singular value decomposition and its consequences. It includes a new chapter on multilinear algebra, treating bilinear forms, quadratic forms, tensor products, and an approach to determinants via alternating multilinear forms. This new edition also increases the use of the minimal polynomial to provide cleaner proofs of multiple results. Also, over 250 new exercises have been added.\n\nThe novel approach taken here banishes determinants to the end of the book. The text focuses on the central goal of linear algebra: understanding the structure of linear operators on finite-dimensional vector spaces. The author has taken unusual care to motivate concepts and simplify proofs. A variety of interesting exercises in each chapter helps students understand and manipulate the objects of linear algebra. Beautiful formatting creates pages with an unusually student-friendly appearance in both print and electronic versions.\n\nNo prerequisites are assumed other than the usual demand for suitable mathematical maturity. The text starts by discussing vector spaces, linear independence, span, basis, and dimension. The book then deals with linear maps, eigenvalues, and eigenvectors. Inner-product spaces are introduced, leading to the finite-dimensional spectral theorem and its consequences. Generalized eigenvectors are then used to provide insight into the structure of a linear operator.\n\nFrom the reviews of previous editions:\n\nAltogether, the text is a didactic masterpiece. ― zbMATH\n\nThe determinant-free proofs are elegant and intuitive. ― American Mathematical Monthly\n\nThe most original linear algebra book to appear in years, it certainly belongs in every undergraduate library ― CHOICE', 1, 'https://m.media-amazon.com/images/I/51793S0SvIL._SL1246_.jpg', '2025-07-20 04:15:27', 'Other', NULL);
INSERT INTO `book` VALUES (404, NULL, NULL, NULL, 218, NULL, 'English', '1st', 0.00, 0, '', 1, '/images/books/defaultbook.jpg', '2025-07-20 07:01:45', 'General', NULL);
INSERT INTO `book` VALUES (405, 'G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3)', '978-1493912179', '2025-07-20', 218, 206, 'English', '2014th', 108.00, 9, 'The main purpose of this volume is to provide a focused analysis of the function of the G protein-coupled signaling pathways that operate in the interconnected network of retinal neurons as they detect and encode the information carried by light. The organization of this volume will generally follow the path of signal flow in the retina. First we will describe recent advances in understanding the phototransduction cascade of rod and cone photoreceptors, which use signaling cascade based on the GPCR rhodopsin to transduce incident light into neural activity. Chapters will be devoted to unique specializations of the two major types of photosensitive cells that comprise the predominant input for our spatial and color vision. Subsequently, the mechanisms of synaptic information encoding by retinal ON bipolar cells will be described, where the GPCR mGluR6 plays a fundamental role. Chapters in this section will examine macromolecular organization of the mGluR6 signaling pathway as well as current understanding of its function. The functional characteristics of this signaling mechanism will be explored in detail. Additionally, this section will cover the role of dopamine receptors in modulating signal transmission between photoreceptors and ON-bipolar cells. Finally, chapters will be focused on the output neurons of the inner retina, ganglion cells, where the components of the emerging GPCR melanopsin cascade in intrinsically photosensitive ganglion cells will be detailed. Collectively these mechanisms allow the retina to represent visual space over a wide range of light intensities.', 1, 'https://m.media-amazon.com/images/I/61Nr5MbbgWL._SL1240_.jpg', '2025-07-20 07:29:33', 'Other', NULL);
INSERT INTO `book` VALUES (406, 'A Big History of Globalization (World-Systems Evolution and Global Futures)', '978-3030057060', '2025-07-25', 218, 304, 'English', '1st ed, 2019 ed', 299.00, 10, 'This book presents the history of globalization as a network-based story in the context of Big History. Departing from the traditional historic discourse, in which communities, cities, and states serve as the main units of analysis, the authors instead trace the historical emergence, growth, interconnection, and merging of various types of networks that have gradually encompassed the globe. They also focus on the development of certain ideas, processes, institutions, and phenomena that spread through those networks to become truly global.\n\nThe book specifies five macro-periods in the history of globalization and comprehensively covers the first four, from roughly the 9th – 7th millennia BC to World War I. For each period, it identifies the most important network-related developments that facilitated (or even spurred on) such transitions and had the greatest impacts on the history of globalization.\n\nBy analyzing the world system\'s transition to new levels of complexityand connectivity, the book provides valuable insights into the course of Big History and the evolution of human societies.', 1, 'https://m.media-amazon.com/images/I/71Z4H49UtFL._SL1246_.jpg', '2025-07-25 15:07:13', 'Other', NULL);
INSERT INTO `book` VALUES (407, NULL, NULL, NULL, 218, NULL, 'English', '1st', 0.00, 0, '', 1, '/images/books/defaultbook.jpg', '2025-07-27 01:36:14', 'General', NULL);
INSERT INTO `book` VALUES (410, NULL, NULL, NULL, 200, NULL, 'English', '1st', 0.00, 0, '', 1, '/images/books/defaultbook.jpg', '2025-07-27 01:44:56', 'General', NULL);
INSERT INTO `book` VALUES (411, 'Direct Test Book', NULL, NULL, 200, NULL, 'English', '1st', 15.99, 10, NULL, 1, NULL, '2025-07-27 01:45:55', NULL, NULL);
INSERT INTO `book` VALUES (412, 'Basic Mathematics 4', '978-0387967875', '2025-07-27', 218, 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 1, 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', '2025-07-27 01:48:58', 'Non-Fiction', NULL);
INSERT INTO `book` VALUES (438, 'Basic Mathematics 1', '978-TEST-123456', '1988-07-01', 218, NULL, 'English', '1st', NULL, NULL, NULL, 1, NULL, '2025-07-27 03:15:30', NULL, NULL);
INSERT INTO `book` VALUES (447, 'Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition', '978-3030645724', '2022-02-19', 218, 1914, 'English', '1st', 249.00, 10, 'This book provides a structured and analytical guide to the use of artificial intelligence in medicine. Covering all areas within medicine, the chapters give a systemic review of the history, scientific foundations, present advances, potential trends, and future challenges of artificial intelligence within a healthcare setting.\nArtificial Intelligence in Medicine aims to give readers the required knowledge to apply artificial intelligence to clinical practice. The book is relevant to medical students, specialist doctors, and researchers whose work will be affected by artificial intelligence.', 1, 'https://m.media-amazon.com/images/I/515qMrsY2lL._SL1208_.jpg', '2025-07-27 03:55:03', 'Non-Fiction', NULL);
INSERT INTO `book` VALUES (448, 'Test Book', '978-TEST-999999', '2024-01-01', 218, 200, 'English', '1st', 25.99, 100, 'Test description', 1, '/images/test.jpg', '2025-07-27 03:55:59', 'Fiction', NULL);

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
INSERT INTO `book_author` VALUES (200, 200, 'Author');
INSERT INTO `book_author` VALUES (201, 201, 'Author');
INSERT INTO `book_author` VALUES (201, 202, 'Author');
INSERT INTO `book_author` VALUES (201, 203, 'Author');
INSERT INTO `book_author` VALUES (202, 204, 'Author');
INSERT INTO `book_author` VALUES (203, 205, 'Author');
INSERT INTO `book_author` VALUES (204, 206, 'Author');
INSERT INTO `book_author` VALUES (204, 207, 'Author');
INSERT INTO `book_author` VALUES (205, 208, 'Author');
INSERT INTO `book_author` VALUES (206, 200, 'Author');
INSERT INTO `book_author` VALUES (207, 209, 'Author');
INSERT INTO `book_author` VALUES (208, 210, 'Author');
INSERT INTO `book_author` VALUES (209, 211, 'Author');
INSERT INTO `book_author` VALUES (210, 208, 'Author');
INSERT INTO `book_author` VALUES (210, 212, 'Author');
INSERT INTO `book_author` VALUES (211, 213, 'Author');
INSERT INTO `book_author` VALUES (212, 214, 'Author');
INSERT INTO `book_author` VALUES (213, 215, 'Author');
INSERT INTO `book_author` VALUES (214, 216, 'Author');
INSERT INTO `book_author` VALUES (214, 217, 'Author');
INSERT INTO `book_author` VALUES (215, 218, 'Author');
INSERT INTO `book_author` VALUES (216, 219, 'Author');
INSERT INTO `book_author` VALUES (217, 220, 'Author');
INSERT INTO `book_author` VALUES (218, 207, 'Author');
INSERT INTO `book_author` VALUES (218, 221, 'Author');
INSERT INTO `book_author` VALUES (219, 222, 'Author');
INSERT INTO `book_author` VALUES (220, 223, 'Author');
INSERT INTO `book_author` VALUES (221, 224, 'Author');
INSERT INTO `book_author` VALUES (222, 225, 'Author');
INSERT INTO `book_author` VALUES (223, 226, 'Author');
INSERT INTO `book_author` VALUES (223, 227, 'Author');
INSERT INTO `book_author` VALUES (224, 228, 'Author');
INSERT INTO `book_author` VALUES (225, 229, 'Author');
INSERT INTO `book_author` VALUES (226, 230, 'Author');
INSERT INTO `book_author` VALUES (227, 231, 'Author');
INSERT INTO `book_author` VALUES (228, 232, 'Author');
INSERT INTO `book_author` VALUES (229, 233, 'Author');
INSERT INTO `book_author` VALUES (229, 234, 'Author');
INSERT INTO `book_author` VALUES (229, 235, 'Author');
INSERT INTO `book_author` VALUES (230, 236, 'Author');
INSERT INTO `book_author` VALUES (230, 237, 'Author');
INSERT INTO `book_author` VALUES (231, 238, 'Author');
INSERT INTO `book_author` VALUES (231, 239, 'Author');
INSERT INTO `book_author` VALUES (231, 240, 'Author');
INSERT INTO `book_author` VALUES (232, 241, 'Author');
INSERT INTO `book_author` VALUES (233, 242, 'Author');
INSERT INTO `book_author` VALUES (233, 243, 'Author');
INSERT INTO `book_author` VALUES (234, 244, 'Author');
INSERT INTO `book_author` VALUES (234, 245, 'Author');
INSERT INTO `book_author` VALUES (235, 246, 'Author');
INSERT INTO `book_author` VALUES (236, 247, 'Author');
INSERT INTO `book_author` VALUES (236, 248, 'Author');
INSERT INTO `book_author` VALUES (236, 249, 'Author');
INSERT INTO `book_author` VALUES (237, 250, 'Author');
INSERT INTO `book_author` VALUES (237, 251, 'Author');
INSERT INTO `book_author` VALUES (238, 252, 'Author');
INSERT INTO `book_author` VALUES (239, 241, 'Author');
INSERT INTO `book_author` VALUES (240, 250, 'Author');
INSERT INTO `book_author` VALUES (240, 251, 'Author');
INSERT INTO `book_author` VALUES (241, 253, 'Author');
INSERT INTO `book_author` VALUES (242, 254, 'Author');
INSERT INTO `book_author` VALUES (242, 255, 'Author');
INSERT INTO `book_author` VALUES (243, 256, 'Author');
INSERT INTO `book_author` VALUES (243, 257, 'Author');
INSERT INTO `book_author` VALUES (244, 258, 'Author');
INSERT INTO `book_author` VALUES (244, 259, 'Author');
INSERT INTO `book_author` VALUES (245, 260, 'Author');
INSERT INTO `book_author` VALUES (246, 261, 'Author');
INSERT INTO `book_author` VALUES (247, 262, 'Author');
INSERT INTO `book_author` VALUES (248, 263, 'Author');
INSERT INTO `book_author` VALUES (249, 264, 'Author');
INSERT INTO `book_author` VALUES (250, 265, 'Author');
INSERT INTO `book_author` VALUES (250, 266, 'Author');
INSERT INTO `book_author` VALUES (251, 267, 'Author');
INSERT INTO `book_author` VALUES (251, 268, 'Author');
INSERT INTO `book_author` VALUES (252, 269, 'Author');
INSERT INTO `book_author` VALUES (252, 270, 'Author');
INSERT INTO `book_author` VALUES (253, 271, 'Author');
INSERT INTO `book_author` VALUES (253, 272, 'Author');
INSERT INTO `book_author` VALUES (253, 273, 'Author');
INSERT INTO `book_author` VALUES (254, 274, 'Author');
INSERT INTO `book_author` VALUES (255, 275, 'Author');
INSERT INTO `book_author` VALUES (256, 276, 'Author');
INSERT INTO `book_author` VALUES (257, 277, 'Author');
INSERT INTO `book_author` VALUES (257, 278, 'Author');
INSERT INTO `book_author` VALUES (258, 279, 'Author');
INSERT INTO `book_author` VALUES (258, 280, 'Author');
INSERT INTO `book_author` VALUES (258, 281, 'Author');
INSERT INTO `book_author` VALUES (258, 282, 'Author');
INSERT INTO `book_author` VALUES (259, 283, 'Author');
INSERT INTO `book_author` VALUES (259, 284, 'Author');
INSERT INTO `book_author` VALUES (259, 285, 'Author');
INSERT INTO `book_author` VALUES (260, 286, 'Author');
INSERT INTO `book_author` VALUES (260, 287, 'Author');
INSERT INTO `book_author` VALUES (260, 288, 'Author');
INSERT INTO `book_author` VALUES (261, 289, 'Author');
INSERT INTO `book_author` VALUES (262, 200, 'Author');
INSERT INTO `book_author` VALUES (263, 290, 'Author');
INSERT INTO `book_author` VALUES (264, 275, 'Author');
INSERT INTO `book_author` VALUES (265, 291, 'Author');
INSERT INTO `book_author` VALUES (265, 292, 'Author');
INSERT INTO `book_author` VALUES (266, 293, 'Author');
INSERT INTO `book_author` VALUES (266, 294, 'Author');
INSERT INTO `book_author` VALUES (266, 295, 'Author');
INSERT INTO `book_author` VALUES (267, 296, 'Author');
INSERT INTO `book_author` VALUES (267, 297, 'Author');
INSERT INTO `book_author` VALUES (267, 298, 'Author');
INSERT INTO `book_author` VALUES (267, 299, 'Author');
INSERT INTO `book_author` VALUES (267, 300, 'Author');
INSERT INTO `book_author` VALUES (267, 301, 'Author');
INSERT INTO `book_author` VALUES (268, 302, 'Author');
INSERT INTO `book_author` VALUES (269, 303, 'Author');
INSERT INTO `book_author` VALUES (270, 304, 'Author');
INSERT INTO `book_author` VALUES (271, 305, 'Author');
INSERT INTO `book_author` VALUES (272, 306, 'Author');
INSERT INTO `book_author` VALUES (273, 307, 'Author');
INSERT INTO `book_author` VALUES (274, 308, 'Author');
INSERT INTO `book_author` VALUES (275, 309, 'Author');
INSERT INTO `book_author` VALUES (275, 310, 'Author');
INSERT INTO `book_author` VALUES (276, 311, 'Author');
INSERT INTO `book_author` VALUES (277, 312, 'Author');
INSERT INTO `book_author` VALUES (278, 313, 'Author');
INSERT INTO `book_author` VALUES (279, 314, 'Author');
INSERT INTO `book_author` VALUES (279, 315, 'Author');
INSERT INTO `book_author` VALUES (279, 316, 'Author');
INSERT INTO `book_author` VALUES (279, 317, 'Author');
INSERT INTO `book_author` VALUES (280, 318, 'Author');
INSERT INTO `book_author` VALUES (281, 319, 'Author');
INSERT INTO `book_author` VALUES (282, 320, 'Author');
INSERT INTO `book_author` VALUES (283, 321, 'Author');
INSERT INTO `book_author` VALUES (284, 322, 'Author');
INSERT INTO `book_author` VALUES (285, 323, 'Author');
INSERT INTO `book_author` VALUES (286, 324, 'Author');
INSERT INTO `book_author` VALUES (287, 325, 'Author');
INSERT INTO `book_author` VALUES (287, 326, 'Author');
INSERT INTO `book_author` VALUES (288, 327, 'Author');
INSERT INTO `book_author` VALUES (288, 328, 'Author');
INSERT INTO `book_author` VALUES (289, 329, 'Author');
INSERT INTO `book_author` VALUES (290, 330, 'Author');
INSERT INTO `book_author` VALUES (291, 289, 'Author');
INSERT INTO `book_author` VALUES (292, 331, 'Author');
INSERT INTO `book_author` VALUES (292, 332, 'Author');
INSERT INTO `book_author` VALUES (292, 333, 'Author');
INSERT INTO `book_author` VALUES (293, 334, 'Author');
INSERT INTO `book_author` VALUES (294, 335, 'Author');
INSERT INTO `book_author` VALUES (295, 336, 'Author');
INSERT INTO `book_author` VALUES (296, 337, 'Author');
INSERT INTO `book_author` VALUES (297, 338, 'Author');
INSERT INTO `book_author` VALUES (297, 339, 'Author');
INSERT INTO `book_author` VALUES (298, 340, 'Author');
INSERT INTO `book_author` VALUES (299, 341, 'Author');
INSERT INTO `book_author` VALUES (299, 342, 'Author');
INSERT INTO `book_author` VALUES (299, 343, 'Author');
INSERT INTO `book_author` VALUES (299, 344, 'Author');
INSERT INTO `book_author` VALUES (300, 345, 'Author');
INSERT INTO `book_author` VALUES (301, 346, 'Author');
INSERT INTO `book_author` VALUES (302, 347, 'Author');
INSERT INTO `book_author` VALUES (302, 348, 'Author');
INSERT INTO `book_author` VALUES (303, 349, 'Author');
INSERT INTO `book_author` VALUES (303, 350, 'Author');
INSERT INTO `book_author` VALUES (304, 351, 'Author');
INSERT INTO `book_author` VALUES (305, 352, 'Author');
INSERT INTO `book_author` VALUES (305, 353, 'Author');
INSERT INTO `book_author` VALUES (306, 354, 'Author');
INSERT INTO `book_author` VALUES (308, 355, 'Author');
INSERT INTO `book_author` VALUES (309, 356, 'Author');
INSERT INTO `book_author` VALUES (310, 357, 'Author');
INSERT INTO `book_author` VALUES (310, 358, 'Author');
INSERT INTO `book_author` VALUES (310, 359, 'Author');
INSERT INTO `book_author` VALUES (311, 360, 'Author');
INSERT INTO `book_author` VALUES (312, 361, 'Author');
INSERT INTO `book_author` VALUES (313, 362, 'Author');
INSERT INTO `book_author` VALUES (314, 363, 'Author');
INSERT INTO `book_author` VALUES (314, 364, 'Author');
INSERT INTO `book_author` VALUES (314, 365, 'Author');
INSERT INTO `book_author` VALUES (315, 366, 'Author');
INSERT INTO `book_author` VALUES (316, 367, 'Author');
INSERT INTO `book_author` VALUES (317, 368, 'Author');
INSERT INTO `book_author` VALUES (317, 369, 'Author');
INSERT INTO `book_author` VALUES (318, 370, 'Author');
INSERT INTO `book_author` VALUES (319, 371, 'Author');
INSERT INTO `book_author` VALUES (319, 372, 'Author');
INSERT INTO `book_author` VALUES (320, 373, 'Author');
INSERT INTO `book_author` VALUES (320, 374, 'Author');
INSERT INTO `book_author` VALUES (321, 373, 'Author');
INSERT INTO `book_author` VALUES (322, 375, 'Author');
INSERT INTO `book_author` VALUES (323, 376, 'Author');
INSERT INTO `book_author` VALUES (324, 377, 'Author');
INSERT INTO `book_author` VALUES (324, 378, 'Author');
INSERT INTO `book_author` VALUES (325, 379, 'Author');
INSERT INTO `book_author` VALUES (325, 380, 'Author');
INSERT INTO `book_author` VALUES (325, 381, 'Author');
INSERT INTO `book_author` VALUES (326, 382, 'Author');
INSERT INTO `book_author` VALUES (327, 383, 'Author');
INSERT INTO `book_author` VALUES (328, 384, 'Author');
INSERT INTO `book_author` VALUES (329, 385, 'Author');
INSERT INTO `book_author` VALUES (330, 386, 'Author');
INSERT INTO `book_author` VALUES (331, 387, 'Author');
INSERT INTO `book_author` VALUES (332, 388, 'Author');
INSERT INTO `book_author` VALUES (333, 387, 'Author');
INSERT INTO `book_author` VALUES (411, 476, 'Author');

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
INSERT INTO `book_category` VALUES (200, 200);
INSERT INTO `book_category` VALUES (201, 200);
INSERT INTO `book_category` VALUES (202, 200);
INSERT INTO `book_category` VALUES (203, 200);
INSERT INTO `book_category` VALUES (204, 200);
INSERT INTO `book_category` VALUES (205, 200);
INSERT INTO `book_category` VALUES (206, 200);
INSERT INTO `book_category` VALUES (209, 200);
INSERT INTO `book_category` VALUES (211, 200);
INSERT INTO `book_category` VALUES (212, 200);
INSERT INTO `book_category` VALUES (213, 200);
INSERT INTO `book_category` VALUES (214, 200);
INSERT INTO `book_category` VALUES (217, 200);
INSERT INTO `book_category` VALUES (218, 200);
INSERT INTO `book_category` VALUES (219, 200);
INSERT INTO `book_category` VALUES (221, 200);
INSERT INTO `book_category` VALUES (222, 200);
INSERT INTO `book_category` VALUES (223, 200);
INSERT INTO `book_category` VALUES (226, 200);
INSERT INTO `book_category` VALUES (227, 200);
INSERT INTO `book_category` VALUES (228, 200);
INSERT INTO `book_category` VALUES (229, 200);
INSERT INTO `book_category` VALUES (231, 200);
INSERT INTO `book_category` VALUES (232, 200);
INSERT INTO `book_category` VALUES (233, 200);
INSERT INTO `book_category` VALUES (234, 200);
INSERT INTO `book_category` VALUES (235, 200);
INSERT INTO `book_category` VALUES (237, 200);
INSERT INTO `book_category` VALUES (238, 200);
INSERT INTO `book_category` VALUES (239, 200);
INSERT INTO `book_category` VALUES (240, 200);
INSERT INTO `book_category` VALUES (244, 200);
INSERT INTO `book_category` VALUES (247, 200);
INSERT INTO `book_category` VALUES (248, 200);
INSERT INTO `book_category` VALUES (250, 200);
INSERT INTO `book_category` VALUES (251, 200);
INSERT INTO `book_category` VALUES (252, 200);
INSERT INTO `book_category` VALUES (254, 200);
INSERT INTO `book_category` VALUES (255, 200);
INSERT INTO `book_category` VALUES (257, 200);
INSERT INTO `book_category` VALUES (258, 200);
INSERT INTO `book_category` VALUES (260, 200);
INSERT INTO `book_category` VALUES (262, 200);
INSERT INTO `book_category` VALUES (263, 200);
INSERT INTO `book_category` VALUES (264, 200);
INSERT INTO `book_category` VALUES (265, 200);
INSERT INTO `book_category` VALUES (266, 200);
INSERT INTO `book_category` VALUES (267, 200);
INSERT INTO `book_category` VALUES (268, 200);
INSERT INTO `book_category` VALUES (269, 200);
INSERT INTO `book_category` VALUES (270, 200);
INSERT INTO `book_category` VALUES (271, 200);
INSERT INTO `book_category` VALUES (272, 200);
INSERT INTO `book_category` VALUES (273, 200);
INSERT INTO `book_category` VALUES (274, 200);
INSERT INTO `book_category` VALUES (275, 200);
INSERT INTO `book_category` VALUES (277, 200);
INSERT INTO `book_category` VALUES (279, 200);
INSERT INTO `book_category` VALUES (281, 200);
INSERT INTO `book_category` VALUES (283, 200);
INSERT INTO `book_category` VALUES (284, 200);
INSERT INTO `book_category` VALUES (285, 200);
INSERT INTO `book_category` VALUES (286, 200);
INSERT INTO `book_category` VALUES (288, 200);
INSERT INTO `book_category` VALUES (289, 200);
INSERT INTO `book_category` VALUES (295, 200);
INSERT INTO `book_category` VALUES (296, 200);
INSERT INTO `book_category` VALUES (298, 200);
INSERT INTO `book_category` VALUES (299, 200);
INSERT INTO `book_category` VALUES (316, 200);
INSERT INTO `book_category` VALUES (215, 201);
INSERT INTO `book_category` VALUES (220, 202);
INSERT INTO `book_category` VALUES (302, 202);
INSERT INTO `book_category` VALUES (308, 202);
INSERT INTO `book_category` VALUES (319, 202);
INSERT INTO `book_category` VALUES (323, 202);
INSERT INTO `book_category` VALUES (337, 202);
INSERT INTO `book_category` VALUES (355, 202);
INSERT INTO `book_category` VALUES (225, 203);
INSERT INTO `book_category` VALUES (230, 203);
INSERT INTO `book_category` VALUES (242, 203);
INSERT INTO `book_category` VALUES (243, 203);
INSERT INTO `book_category` VALUES (287, 203);
INSERT INTO `book_category` VALUES (294, 203);
INSERT INTO `book_category` VALUES (314, 203);
INSERT INTO `book_category` VALUES (317, 203);
INSERT INTO `book_category` VALUES (241, 204);
INSERT INTO `book_category` VALUES (276, 204);
INSERT INTO `book_category` VALUES (245, 205);
INSERT INTO `book_category` VALUES (246, 206);
INSERT INTO `book_category` VALUES (259, 206);
INSERT INTO `book_category` VALUES (253, 207);
INSERT INTO `book_category` VALUES (256, 208);
INSERT INTO `book_category` VALUES (385, 208);
INSERT INTO `book_category` VALUES (261, 209);
INSERT INTO `book_category` VALUES (291, 209);
INSERT INTO `book_category` VALUES (278, 210);
INSERT INTO `book_category` VALUES (280, 211);
INSERT INTO `book_category` VALUES (290, 211);
INSERT INTO `book_category` VALUES (292, 212);
INSERT INTO `book_category` VALUES (363, 212);
INSERT INTO `book_category` VALUES (300, 213);
INSERT INTO `book_category` VALUES (301, 214);
INSERT INTO `book_category` VALUES (303, 215);
INSERT INTO `book_category` VALUES (304, 216);
INSERT INTO `book_category` VALUES (305, 216);
INSERT INTO `book_category` VALUES (310, 216);
INSERT INTO `book_category` VALUES (311, 216);
INSERT INTO `book_category` VALUES (312, 216);
INSERT INTO `book_category` VALUES (313, 216);
INSERT INTO `book_category` VALUES (328, 216);
INSERT INTO `book_category` VALUES (331, 216);
INSERT INTO `book_category` VALUES (332, 216);
INSERT INTO `book_category` VALUES (333, 216);
INSERT INTO `book_category` VALUES (334, 216);
INSERT INTO `book_category` VALUES (335, 216);
INSERT INTO `book_category` VALUES (360, 216);
INSERT INTO `book_category` VALUES (361, 216);
INSERT INTO `book_category` VALUES (364, 216);
INSERT INTO `book_category` VALUES (370, 216);
INSERT INTO `book_category` VALUES (373, 216);
INSERT INTO `book_category` VALUES (306, 217);
INSERT INTO `book_category` VALUES (315, 218);
INSERT INTO `book_category` VALUES (318, 218);
INSERT INTO `book_category` VALUES (382, 218);
INSERT INTO `book_category` VALUES (383, 218);
INSERT INTO `book_category` VALUES (388, 218);
INSERT INTO `book_category` VALUES (389, 218);
INSERT INTO `book_category` VALUES (391, 218);
INSERT INTO `book_category` VALUES (320, 219);
INSERT INTO `book_category` VALUES (321, 220);
INSERT INTO `book_category` VALUES (322, 221);
INSERT INTO `book_category` VALUES (324, 222);
INSERT INTO `book_category` VALUES (326, 222);
INSERT INTO `book_category` VALUES (327, 222);
INSERT INTO `book_category` VALUES (336, 222);
INSERT INTO `book_category` VALUES (341, 222);
INSERT INTO `book_category` VALUES (342, 222);
INSERT INTO `book_category` VALUES (343, 222);
INSERT INTO `book_category` VALUES (344, 222);
INSERT INTO `book_category` VALUES (345, 222);
INSERT INTO `book_category` VALUES (346, 222);
INSERT INTO `book_category` VALUES (347, 222);
INSERT INTO `book_category` VALUES (350, 222);
INSERT INTO `book_category` VALUES (351, 222);
INSERT INTO `book_category` VALUES (352, 222);
INSERT INTO `book_category` VALUES (353, 222);
INSERT INTO `book_category` VALUES (354, 222);
INSERT INTO `book_category` VALUES (356, 222);
INSERT INTO `book_category` VALUES (357, 222);
INSERT INTO `book_category` VALUES (358, 222);
INSERT INTO `book_category` VALUES (359, 222);
INSERT INTO `book_category` VALUES (390, 222);
INSERT INTO `book_category` VALUES (399, 222);
INSERT INTO `book_category` VALUES (325, 223);
INSERT INTO `book_category` VALUES (349, 223);
INSERT INTO `book_category` VALUES (374, 223);
INSERT INTO `book_category` VALUES (329, 224);
INSERT INTO `book_category` VALUES (330, 225);
INSERT INTO `book_category` VALUES (366, 225);
INSERT INTO `book_category` VALUES (368, 225);
INSERT INTO `book_category` VALUES (395, 225);
INSERT INTO `book_category` VALUES (338, 226);
INSERT INTO `book_category` VALUES (339, 226);
INSERT INTO `book_category` VALUES (375, 226);
INSERT INTO `book_category` VALUES (386, 226);
INSERT INTO `book_category` VALUES (362, 227);
INSERT INTO `book_category` VALUES (365, 227);
INSERT INTO `book_category` VALUES (371, 227);
INSERT INTO `book_category` VALUES (367, 228);
INSERT INTO `book_category` VALUES (369, 229);
INSERT INTO `book_category` VALUES (376, 230);
INSERT INTO `book_category` VALUES (377, 231);
INSERT INTO `book_category` VALUES (378, 232);
INSERT INTO `book_category` VALUES (379, 233);
INSERT INTO `book_category` VALUES (380, 234);
INSERT INTO `book_category` VALUES (387, 234);
INSERT INTO `book_category` VALUES (381, 235);
INSERT INTO `book_category` VALUES (384, 236);
INSERT INTO `book_category` VALUES (392, 237);
INSERT INTO `book_category` VALUES (393, 238);
INSERT INTO `book_category` VALUES (394, 239);
INSERT INTO `book_category` VALUES (396, 240);
INSERT INTO `book_category` VALUES (397, 241);
INSERT INTO `book_category` VALUES (398, 242);

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
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (0000000051, 3, 202, 1, '2025-07-31 23:58:22');

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
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (200, 'Computers', NULL, NULL);
INSERT INTO `category` VALUES (201, 'Young Adult Nonfiction', NULL, NULL);
INSERT INTO `category` VALUES (202, 'Language Arts & Disciplines', NULL, NULL);
INSERT INTO `category` VALUES (203, 'Business & Economics', NULL, NULL);
INSERT INTO `category` VALUES (204, 'Antiques & Collectibles', NULL, NULL);
INSERT INTO `category` VALUES (205, 'Games & Activities', NULL, NULL);
INSERT INTO `category` VALUES (206, 'Technology & Engineering', NULL, NULL);
INSERT INTO `category` VALUES (207, 'Mathematics', NULL, NULL);
INSERT INTO `category` VALUES (208, 'Education', NULL, NULL);
INSERT INTO `category` VALUES (209, 'Juvenile Nonfiction', NULL, NULL);
INSERT INTO `category` VALUES (210, 'MySQL (Electronic resource)', NULL, NULL);
INSERT INTO `category` VALUES (211, 'Artificial intelligence', NULL, NULL);
INSERT INTO `category` VALUES (212, 'Science', NULL, NULL);
INSERT INTO `category` VALUES (213, 'Popular literature', NULL, NULL);
INSERT INTO `category` VALUES (214, 'England', NULL, NULL);
INSERT INTO `category` VALUES (215, 'Comics & Graphic Novels', NULL, NULL);
INSERT INTO `category` VALUES (216, 'Literary Criticism', NULL, NULL);
INSERT INTO `category` VALUES (217, 'Self-Help', NULL, NULL);
INSERT INTO `category` VALUES (218, 'History', NULL, NULL);
INSERT INTO `category` VALUES (219, 'Bangladesh', NULL, NULL);
INSERT INTO `category` VALUES (220, 'Bengali language materials', NULL, NULL);
INSERT INTO `category` VALUES (221, 'Bengali fiction', NULL, NULL);
INSERT INTO `category` VALUES (222, 'Fiction', NULL, NULL);
INSERT INTO `category` VALUES (223, 'Reference', NULL, NULL);
INSERT INTO `category` VALUES (224, 'Performing Arts', NULL, NULL);
INSERT INTO `category` VALUES (225, 'Social Science', NULL, NULL);
INSERT INTO `category` VALUES (226, 'Subject headings, Library of Congress', NULL, NULL);
INSERT INTO `category` VALUES (227, 'Biography & Autobiography', NULL, NULL);
INSERT INTO `category` VALUES (228, 'Biography', NULL, NULL);
INSERT INTO `category` VALUES (229, 'North America', NULL, NULL);
INSERT INTO `category` VALUES (230, 'Great Britain', NULL, NULL);
INSERT INTO `category` VALUES (231, 'United States', NULL, NULL);
INSERT INTO `category` VALUES (232, 'Subject headings', NULL, NULL);
INSERT INTO `category` VALUES (233, 'Music', NULL, NULL);
INSERT INTO `category` VALUES (234, 'Architecture', NULL, NULL);
INSERT INTO `category` VALUES (235, 'Electronic government information', NULL, NULL);
INSERT INTO `category` VALUES (236, 'Political Science', NULL, NULL);
INSERT INTO `category` VALUES (237, 'Government publications', NULL, NULL);
INSERT INTO `category` VALUES (238, 'Religion', NULL, NULL);
INSERT INTO `category` VALUES (239, 'Missions', NULL, NULL);
INSERT INTO `category` VALUES (240, 'Law', NULL, NULL);
INSERT INTO `category` VALUES (241, 'Local government', NULL, NULL);
INSERT INTO `category` VALUES (242, 'Administrative law', NULL, NULL);
INSERT INTO `category` VALUES (243, 'Adventure', 'Adventure and action stories', NULL);
INSERT INTO `category` VALUES (244, 'Art', 'Art and design', NULL);
INSERT INTO `category` VALUES (245, 'Business', 'Business and economics', NULL);
INSERT INTO `category` VALUES (246, 'Children', 'Children\'s books', NULL);
INSERT INTO `category` VALUES (247, 'Comedy', 'Humorous and comedic works', NULL);
INSERT INTO `category` VALUES (248, 'Cooking', 'Cooking and food', NULL);
INSERT INTO `category` VALUES (249, 'Drama', 'Dramatic literature', NULL);
INSERT INTO `category` VALUES (250, 'Fantasy', 'Fantasy literature', NULL);
INSERT INTO `category` VALUES (251, 'General', 'General or uncategorized books', NULL);
INSERT INTO `category` VALUES (252, 'Health', 'Health and wellness', NULL);
INSERT INTO `category` VALUES (253, 'Horror', 'Horror and supernatural fiction', NULL);
INSERT INTO `category` VALUES (254, 'Mystery', 'Mystery and thriller novels', NULL);
INSERT INTO `category` VALUES (255, 'Non-Fiction', 'Non-fictional works including biography, history, etc.', NULL);
INSERT INTO `category` VALUES (256, 'Philosophy', 'Philosophy and ethics', NULL);
INSERT INTO `category` VALUES (257, 'Poetry', 'Poetry and verse', NULL);
INSERT INTO `category` VALUES (258, 'Programming', 'Computer programming and development', NULL);
INSERT INTO `category` VALUES (259, 'Romance', 'Romantic literature', NULL);
INSERT INTO `category` VALUES (260, 'Science Fiction', 'Science fiction literature', NULL);
INSERT INTO `category` VALUES (261, 'Technology', 'Technology and computing books', NULL);
INSERT INTO `category` VALUES (262, 'Travel', 'Travel guides and memoirs', NULL);
INSERT INTO `category` VALUES (263, 'Young Adult', 'Young adult literature', NULL);

-- ----------------------------
-- Table structure for category_bestseller
-- ----------------------------
DROP TABLE IF EXISTS `category_bestseller`;
CREATE TABLE `category_bestseller`  (
  `PERIOD_TYPE` enum('DAILY','WEEKLY','MONTHLY','YEARLY') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'MONTHLY',
  `PERIOD_START` datetime NOT NULL,
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
-- Records of category_bestseller
-- ----------------------------
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 200, 1, 200);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 200, 2, 201);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 200, 1, 201);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 200, 3, 202);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 200, 2, 202);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 200, 4, 203);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 200, 5, 204);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 200, 3, 204);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 201, 1, 215);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 202, 1, 220);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 203, 1, 225);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 203, 2, 230);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 204, 1, 241);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 203, 3, 242);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 203, 4, 243);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 205, 1, 245);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 205, 1, 245);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 206, 1, 246);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 207, 1, 253);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 208, 1, 256);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 206, 2, 259);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 206, 1, 259);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 209, 1, 261);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 204, 2, 276);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 210, 1, 278);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 211, 1, 280);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 203, 5, 287);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 211, 2, 290);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 209, 2, 291);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 212, 1, 292);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 212, 1, 292);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 213, 1, 300);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 214, 1, 301);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 202, 2, 302);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 215, 1, 303);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 216, 1, 304);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 216, 2, 305);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 217, 1, 306);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 202, 3, 308);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 216, 3, 310);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 216, 4, 311);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 216, 5, 312);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 218, 1, 315);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 218, 2, 318);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 202, 4, 319);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 219, 1, 320);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 220, 1, 321);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 221, 1, 322);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 202, 5, 323);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 222, 1, 324);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 223, 1, 325);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 222, 2, 326);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 222, 3, 327);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 224, 1, 329);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 225, 1, 330);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 222, 4, 336);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 226, 1, 338);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 226, 2, 339);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 222, 5, 341);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 223, 2, 349);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 227, 1, 362);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 212, 2, 363);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 212, 2, 363);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 227, 2, 365);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 225, 2, 366);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 228, 1, 367);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 225, 3, 368);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 229, 1, 369);
INSERT INTO `category_bestseller` VALUES ('MONTHLY', '2025-07-01 00:00:00', 216, 1, 370);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 227, 3, 371);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 223, 3, 374);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 226, 3, 375);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 230, 1, 376);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 231, 1, 377);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 232, 1, 378);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 233, 1, 379);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 234, 1, 380);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 235, 1, 381);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 218, 3, 382);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 218, 4, 383);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 236, 1, 384);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 208, 2, 385);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 226, 4, 386);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 234, 2, 387);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 218, 5, 388);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 237, 1, 392);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 238, 1, 393);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 239, 1, 394);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 225, 4, 395);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 240, 1, 396);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 241, 1, 397);
INSERT INTO `category_bestseller` VALUES ('WEEKLY', '2025-07-07 00:00:00', 242, 1, 398);

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
  `STARTED_AT` timestamp NULL DEFAULT NULL,
  `ENDED_AT` timestamp NULL DEFAULT NULL,
  `MAX_USAGE` int NULL DEFAULT NULL,
  `TIMES_USED` int NULL DEFAULT NULL,
  `ADDED_AT` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `ADDED_BY` int NULL DEFAULT NULL,
  `MIN_EXPENSE` decimal(12, 2) NULL DEFAULT NULL COMMENT 'The minimum cost of the order for which the discount is applicable',
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE INDEX `unique_discount_code`(`CODE` ASC) USING BTREE,
  INDEX `DISCOUNT_ADMIN`(`ADDED_BY` ASC) USING BTREE,
  CONSTRAINT `DISCOUNT_ADMIN` FOREIGN KEY (`ADDED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of discount
-- ----------------------------
INSERT INTO `discount` VALUES (2, 'HELLOWORLD', 'Use the code HELLOWORLD to get 30% off on any order greater than 200 BDT. This offer is for a limited time. Available to the first 200 orders only!', 'percentage', 0.30, NULL, '2025-07-30 04:57:00', '2025-08-30 04:57:00', 200, 1, '2025-07-30 10:04:34', 1, 200.00);
INSERT INTO `discount` VALUES (3, 'BOITOI', 'Get 200tk off for orders exceeding 1000 BDT! Offer applicable for first 300 orders! *Limited time offer.', 'fixed', NULL, 200.00, '2025-07-30 08:16:00', '2025-08-30 08:16:00', 300, 1, '2025-07-30 11:02:40', 1, 1000.00);

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
-- Records of favourite
-- ----------------------------

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
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `URL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `notification_recipient`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `notification_recipient` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 320 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO `notifications` VALUES (1, 2, 'New book contribution request: \"Achieving Serenity\" by Shashwat Publication', 'SYSTEM', 0, '2025-07-19 19:41:13', NULL);
INSERT INTO `notifications` VALUES (2, 3, 'New book contribution request: \"Achieving Serenity\" by Shashwat Publication', 'SYSTEM', 1, '2025-07-19 19:41:13', NULL);
INSERT INTO `notifications` VALUES (9, 2, 'New book contribution request from Test Publisher. Request ID: 1001', 'SYSTEM', 0, '2025-07-19 20:34:49', NULL);
INSERT INTO `notifications` VALUES (10, 3, 'New book contribution request from Test Publisher. Request ID: 1001', 'SYSTEM', 1, '2025-07-19 20:34:49', NULL);
INSERT INTO `notifications` VALUES (11, 999, 'New book contribution request from Test Publisher. Request ID: 1001', 'SYSTEM', 0, '2025-07-19 20:34:49', NULL);
INSERT INTO `notifications` VALUES (12, 1001, 'New book contribution request from Test Publisher. Request ID: 1001', 'SYSTEM', 0, '2025-07-19 20:34:49', NULL);
INSERT INTO `notifications` VALUES (16, 2, 'New book contribution request from publisher \"Test Publisher\" - Request ID: 1002', 'SYSTEM', 0, '2025-07-19 20:45:26', NULL);
INSERT INTO `notifications` VALUES (17, 3, 'New book contribution request from publisher \"Test Publisher\" - Request ID: 1002', 'SYSTEM', 1, '2025-07-19 20:45:26', NULL);
INSERT INTO `notifications` VALUES (18, 999, 'New book contribution request from publisher \"Test Publisher\" - Request ID: 1002', 'SYSTEM', 0, '2025-07-19 20:45:26', NULL);
INSERT INTO `notifications` VALUES (19, 1001, 'New book contribution request from publisher \"Test Publisher\" - Request ID: 1002', 'SYSTEM', 0, '2025-07-19 20:45:26', NULL);
INSERT INTO `notifications` VALUES (24, 2, 'New book contribution request from publisher \"Springer\" - Request ID: 1003', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (25, 3, 'New book contribution request from publisher \"Springer\" - Request ID: 1003', 'SYSTEM', 1, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (26, 999, 'New book contribution request from publisher \"Springer\" - Request ID: 1003', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (27, 1001, 'New book contribution request from publisher \"Springer\" - Request ID: 1003', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (31, 2, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (32, 3, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (33, 999, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (34, 1001, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:23:53', NULL);
INSERT INTO `notifications` VALUES (39, 2, 'New book contribution request from publisher \"Springer\" - Request ID: 1004', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (40, 3, 'New book contribution request from publisher \"Springer\" - Request ID: 1004', 'SYSTEM', 1, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (41, 999, 'New book contribution request from publisher \"Springer\" - Request ID: 1004', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (42, 1001, 'New book contribution request from publisher \"Springer\" - Request ID: 1004', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (46, 2, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (47, 3, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (48, 999, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (49, 1001, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 03:31:41', NULL);
INSERT INTO `notifications` VALUES (53, 2, 'New book contribution request from publisher \"Springer\" - Request ID: 1005', 'SYSTEM', 0, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (54, 3, 'New book contribution request from publisher \"Springer\" - Request ID: 1005', 'SYSTEM', 1, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (55, 999, 'New book contribution request from publisher \"Springer\" - Request ID: 1005', 'SYSTEM', 0, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (56, 1001, 'New book contribution request from publisher \"Springer\" - Request ID: 1005', 'SYSTEM', 0, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (60, 2, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (61, 3, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (62, 999, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 04:14:22', NULL);
INSERT INTO `notifications` VALUES (69, 2, 'New book contribution request from publisher \"EduGorilla Publication\" - Request ID: 2001', 'SYSTEM', 0, '2025-07-20 04:22:42', NULL);
INSERT INTO `notifications` VALUES (70, 3, 'New book contribution request from publisher \"EduGorilla Publication\" - Request ID: 2001', 'SYSTEM', 1, '2025-07-20 04:22:42', NULL);
INSERT INTO `notifications` VALUES (77, 1, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 06:49:52', NULL);
INSERT INTO `notifications` VALUES (78, 2, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 06:49:52', NULL);
INSERT INTO `notifications` VALUES (79, 3, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 06:49:52', NULL);
INSERT INTO `notifications` VALUES (80, 1001, 'New book contribution request: \"Linear Algebra Done Right (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 06:49:52', NULL);
INSERT INTO `notifications` VALUES (85, 1, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:03:21', NULL);
INSERT INTO `notifications` VALUES (86, 2, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:03:21', NULL);
INSERT INTO `notifications` VALUES (87, 3, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 07:03:21', NULL);
INSERT INTO `notifications` VALUES (88, 1001, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:03:21', NULL);
INSERT INTO `notifications` VALUES (93, 1, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:16:14', NULL);
INSERT INTO `notifications` VALUES (94, 2, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:16:14', NULL);
INSERT INTO `notifications` VALUES (95, 3, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 1, '2025-07-20 07:16:14', NULL);
INSERT INTO `notifications` VALUES (96, 1001, 'New book contribution request: \"Understanding Analysis (Undergraduate Texts in Mathematics)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:16:14', NULL);
INSERT INTO `notifications` VALUES (101, 1, 'New book contribution request: \"G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:28:22', NULL);
INSERT INTO `notifications` VALUES (102, 2, 'New book contribution request: \"G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:28:22', NULL);
INSERT INTO `notifications` VALUES (104, 1001, 'New book contribution request: \"G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3)\" by Springer', 'SYSTEM', 0, '2025-07-20 07:28:22', NULL);
INSERT INTO `notifications` VALUES (109, 1, 'New book request from \"Springer\" for \"\" (ID: 2006)', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (110, 2, 'New book request from \"Springer\" for \"\" (ID: 2006)', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (112, 1001, 'New book request from \"Springer\" for \"\" (ID: 2006)', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (116, 1, 'New book contribution request: \"A Big History of Globalization (World-Systems Evolution and Global Futures)\" by Springer', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (117, 2, 'New book contribution request: \"A Big History of Globalization (World-Systems Evolution and Global Futures)\" by Springer', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (119, 1001, 'New book contribution request: \"A Big History of Globalization (World-Systems Evolution and Global Futures)\" by Springer', 'SYSTEM', 0, '2025-07-25 15:05:54', NULL);
INSERT INTO `notifications` VALUES (123, 1, '[PUBLISHER: Springer] Book \"A Big History of Globalization (World-Systems Evolution and Global Futures)\" APPROVED', 'SYSTEM', 0, '2025-07-25 15:07:13', NULL);
INSERT INTO `notifications` VALUES (125, 1, '[PUBLISHER: Springer] Book \"A Big History of Globalization (World-Systems Evolution and Global Futures)\" APPROVED - Testing complete author processing', 'SYSTEM', 0, '2025-07-27 01:36:14', NULL);
INSERT INTO `notifications` VALUES (126, 1, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2007)', 'SYSTEM', 0, '2025-07-27 01:40:23', NULL);
INSERT INTO `notifications` VALUES (127, 2, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2007)', 'SYSTEM', 0, '2025-07-27 01:40:23', NULL);
INSERT INTO `notifications` VALUES (128, 3, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2007)', 'SYSTEM', 1, '2025-07-27 01:40:23', NULL);
INSERT INTO `notifications` VALUES (129, 1001, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2007)', 'SYSTEM', 0, '2025-07-27 01:40:23', NULL);
INSERT INTO `notifications` VALUES (133, 1, '[PUBLISHER: EduGorilla Publication] Book \"Final Author Test Book\" APPROVED - Testing final author processing', 'SYSTEM', 0, '2025-07-27 01:40:33', NULL);
INSERT INTO `notifications` VALUES (134, 1, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2008)', 'SYSTEM', 0, '2025-07-27 01:42:51', NULL);
INSERT INTO `notifications` VALUES (135, 2, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2008)', 'SYSTEM', 0, '2025-07-27 01:42:51', NULL);
INSERT INTO `notifications` VALUES (136, 3, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2008)', 'SYSTEM', 1, '2025-07-27 01:42:51', NULL);
INSERT INTO `notifications` VALUES (137, 1001, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2008)', 'SYSTEM', 0, '2025-07-27 01:42:51', NULL);
INSERT INTO `notifications` VALUES (141, 1, '[PUBLISHER: EduGorilla Publication] Book \"Final Author Test Book 2\" APPROVED - Testing updated procedure', 'SYSTEM', 0, '2025-07-27 01:42:51', NULL);
INSERT INTO `notifications` VALUES (142, 1, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2009)', 'SYSTEM', 0, '2025-07-27 01:44:56', NULL);
INSERT INTO `notifications` VALUES (143, 2, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2009)', 'SYSTEM', 0, '2025-07-27 01:44:56', NULL);
INSERT INTO `notifications` VALUES (144, 3, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2009)', 'SYSTEM', 1, '2025-07-27 01:44:56', NULL);
INSERT INTO `notifications` VALUES (145, 1001, 'New book request from \"EduGorilla Publication\" for \"\" (ID: 2009)', 'SYSTEM', 0, '2025-07-27 01:44:56', NULL);
INSERT INTO `notifications` VALUES (149, 1, '[PUBLISHER: EduGorilla Publication] Book \"Minimal Fix Test Book\" APPROVED - Testing minimal fix', 'SYSTEM', 0, '2025-07-27 01:44:56', NULL);
INSERT INTO `notifications` VALUES (150, 1, 'New book request from \"Springer\" for \"\" (ID: 2010)', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (151, 2, 'New book request from \"Springer\" for \"\" (ID: 2010)', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (152, 3, 'New book request from \"Springer\" for \"\" (ID: 2010)', 'SYSTEM', 1, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (153, 1001, 'New book request from \"Springer\" for \"\" (ID: 2010)', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (157, 1, 'New book contribution request: \"Basic Mathematics 4\" by Springer', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (158, 2, 'New book contribution request: \"Basic Mathematics 4\" by Springer', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (159, 3, 'New book contribution request: \"Basic Mathematics 4\" by Springer', 'SYSTEM', 1, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (160, 1001, 'New book contribution request: \"Basic Mathematics 4\" by Springer', 'SYSTEM', 0, '2025-07-27 01:48:10', NULL);
INSERT INTO `notifications` VALUES (164, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics 4\" APPROVED', 'SYSTEM', 0, '2025-07-27 01:48:58', NULL);
INSERT INTO `notifications` VALUES (166, 1, 'New book request from \"Springer\" for \"\" (ID: 2011)', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (167, 2, 'New book request from \"Springer\" for \"\" (ID: 2011)', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (168, 3, 'New book request from \"Springer\" for \"\" (ID: 2011)', 'SYSTEM', 1, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (169, 1001, 'New book request from \"Springer\" for \"\" (ID: 2011)', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (173, 1, 'New book contribution request: \"Basic Mathematics\" by Springer', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (174, 2, 'New book contribution request: \"Basic Mathematics\" by Springer', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (175, 3, 'New book contribution request: \"Basic Mathematics\" by Springer', 'SYSTEM', 1, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (176, 1001, 'New book contribution request: \"Basic Mathematics\" by Springer', 'SYSTEM', 0, '2025-07-27 01:56:11', NULL);
INSERT INTO `notifications` VALUES (180, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics\" REJECTED', 'SYSTEM', 0, '2025-07-27 01:58:33', NULL);
INSERT INTO `notifications` VALUES (182, 1, 'New book request from \"Springer\" for \"\" (ID: 2012)', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (183, 2, 'New book request from \"Springer\" for \"\" (ID: 2012)', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (184, 3, 'New book request from \"Springer\" for \"\" (ID: 2012)', 'SYSTEM', 1, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (185, 1001, 'New book request from \"Springer\" for \"\" (ID: 2012)', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (189, 1, 'New book contribution request: \"Basic Mathematics 5\" by Springer', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (190, 2, 'New book contribution request: \"Basic Mathematics 5\" by Springer', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (191, 3, 'New book contribution request: \"Basic Mathematics 5\" by Springer', 'SYSTEM', 1, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (192, 1001, 'New book contribution request: \"Basic Mathematics 5\" by Springer', 'SYSTEM', 0, '2025-07-27 01:59:06', NULL);
INSERT INTO `notifications` VALUES (196, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics 5\" REJECTED', 'SYSTEM', 0, '2025-07-27 01:59:30', NULL);
INSERT INTO `notifications` VALUES (198, 1, 'New book request from \"Springer\" for \"\" (ID: 2013)', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (199, 2, 'New book request from \"Springer\" for \"\" (ID: 2013)', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (200, 3, 'New book request from \"Springer\" for \"\" (ID: 2013)', 'SYSTEM', 1, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (201, 1001, 'New book request from \"Springer\" for \"\" (ID: 2013)', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (205, 1, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (206, 2, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (207, 3, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 1, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (208, 1001, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:12:24', NULL);
INSERT INTO `notifications` VALUES (212, 1, '[PUBLISHER: EduGorilla Publication] Book \"Minimal Fix Test Book\" APPROVED - Test approval', 'SYSTEM', 0, '2025-07-27 02:15:32', NULL);
INSERT INTO `notifications` VALUES (213, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics 1\" APPROVED - Test approval fixed', 'SYSTEM', 0, '2025-07-27 02:19:30', NULL);
INSERT INTO `notifications` VALUES (214, 1, 'New book request from \"Springer\" for \"\" (ID: 2014)', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (215, 2, 'New book request from \"Springer\" for \"\" (ID: 2014)', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (216, 3, 'New book request from \"Springer\" for \"\" (ID: 2014)', 'SYSTEM', 1, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (217, 1001, 'New book request from \"Springer\" for \"\" (ID: 2014)', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (221, 1, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (222, 2, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (223, 3, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 1, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (224, 1001, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 02:41:59', NULL);
INSERT INTO `notifications` VALUES (228, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics 1\" APPROVED', 'SYSTEM', 0, '2025-07-27 03:15:30', NULL);
INSERT INTO `notifications` VALUES (229, 1, 'New book request from \"Springer\" for \"\" (ID: 2015)', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (230, 2, 'New book request from \"Springer\" for \"\" (ID: 2015)', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (232, 1001, 'New book request from \"Springer\" for \"\" (ID: 2015)', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (236, 1, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (237, 2, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (238, 3, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 1, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (239, 1001, 'New book contribution request: \"Basic Mathematics 1\" by Springer', 'SYSTEM', 0, '2025-07-27 03:19:41', NULL);
INSERT INTO `notifications` VALUES (249, 1, '[PUBLISHER: Springer] Book \"Basic Mathematics 1\" REJECTED', 'SYSTEM', 0, '2025-07-27 03:22:44', NULL);
INSERT INTO `notifications` VALUES (251, 1, 'New book request from \"Springer\" for \"\" (ID: 2016)', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (252, 2, 'New book request from \"Springer\" for \"\" (ID: 2016)', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (254, 1001, 'New book request from \"Springer\" for \"\" (ID: 2016)', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (258, 1, 'New book contribution request: \"Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition\" by Springer', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (259, 2, 'New book contribution request: \"Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition\" by Springer', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (261, 1001, 'New book contribution request: \"Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition\" by Springer', 'SYSTEM', 0, '2025-07-27 03:27:08', NULL);
INSERT INTO `notifications` VALUES (265, 1, 'New book request from \"Springer\" for \"\" (ID: 2017)', 'SYSTEM', 0, '2025-07-27 03:27:22', NULL);
INSERT INTO `notifications` VALUES (266, 2, 'New book request from \"Springer\" for \"\" (ID: 2017)', 'SYSTEM', 0, '2025-07-27 03:27:22', NULL);
INSERT INTO `notifications` VALUES (268, 1001, 'New book request from \"Springer\" for \"\" (ID: 2017)', 'SYSTEM', 0, '2025-07-27 03:27:22', NULL);
INSERT INTO `notifications` VALUES (282, 1, '[PUBLISHER: Springer] Book \"Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition\" APPROVED', 'SYSTEM', 0, '2025-07-27 03:55:03', NULL);
INSERT INTO `notifications` VALUES (283, 1, '[PUBLISHER: Springer] Book \"Test Book\" APPROVED', 'SYSTEM', 0, '2025-07-27 03:55:59', NULL);
INSERT INTO `notifications` VALUES (284, 2, 'New order #1009 placed by admin. Total amount: $150.00. Status: pending', 'ORDER', 0, '2025-07-30 01:37:03', '/admin/orders/1009');
INSERT INTO `notifications` VALUES (285, 3, 'New order #1009 placed by admin. Total amount: $150.00. Status: pending', 'ORDER', 1, '2025-07-30 01:37:03', '/admin/orders/1009');
INSERT INTO `notifications` VALUES (287, 1, 'Great news! Your order #1009 has been confirmed by Prottoy Das and is now being prepared for shipping.', 'ORDER', 0, '2025-07-30 01:37:04', '/orders/1009');
INSERT INTO `notifications` VALUES (288, 1, 'Exciting news! Your order #1009 has been shipped and is on its way to you. You should receive it soon!', 'ORDER', 1, '2025-07-30 01:37:05', '/orders/1009');
INSERT INTO `notifications` VALUES (290, 2, 'New order #228355 placed by admin. Total amount: $250.50. Status: pending', 'ORDER', 0, '2025-07-30 01:43:48', '/admin/orders/228355');
INSERT INTO `notifications` VALUES (291, 3, 'New order #228355 placed by admin. Total amount: $250.50. Status: pending', 'ORDER', 1, '2025-07-30 01:43:48', '/admin/orders/228355');
INSERT INTO `notifications` VALUES (293, 1, 'Great news! Your order #228355 has been confirmed by Prottoy Das and is now being prepared for shipping.', 'ORDER', 0, '2025-07-30 01:43:49', '/orders/228355');
INSERT INTO `notifications` VALUES (294, 1, 'Exciting news! Your order #228355 has been shipped and is on its way to you. You should receive it soon!', 'ORDER', 0, '2025-07-30 01:43:50', '/orders/228355');
INSERT INTO `notifications` VALUES (295, 2, 'New order #228356 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1040.00. Status: pending', 'ORDER', 0, '2025-07-30 02:37:33', '/admin/orders/228356');
INSERT INTO `notifications` VALUES (296, 3, 'New order #228356 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1040.00. Status: pending', 'ORDER', 1, '2025-07-30 02:37:33', '/admin/orders/228356');
INSERT INTO `notifications` VALUES (298, 3, 'Your order #228356 has been delivered! We hope you enjoy your books. Thank you for choosing BoiToi!', 'ORDER', 1, '2025-07-30 02:38:52', '/orders/228356');
INSERT INTO `notifications` VALUES (299, 3, 'Your order #1004 has been cancelled by Anindya Biswas. If you have any questions, please contact our support team.', 'ORDER', 1, '2025-07-30 02:42:21', '/orders/1004');
INSERT INTO `notifications` VALUES (300, 2, 'New order #228357 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $2440.00. Status: pending', 'ORDER', 0, '2025-07-30 03:30:52', '/admin/orders/228357');
INSERT INTO `notifications` VALUES (301, 3, 'New order #228357 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $2440.00. Status: pending', 'ORDER', 1, '2025-07-30 03:30:52', '/admin/orders/228357');
INSERT INTO `notifications` VALUES (303, 3, 'Your order #228357 has been delivered! We hope you enjoy your books. Thank you for choosing BoiToi!', 'ORDER', 1, '2025-07-30 03:32:32', '/orders/228357');
INSERT INTO `notifications` VALUES (304, 2, 'New order #228358 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $2070.00. Status: pending', 'ORDER', 0, '2025-07-30 10:04:34', '/admin/orders/228358');
INSERT INTO `notifications` VALUES (305, 3, 'New order #228358 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $2070.00. Status: pending', 'ORDER', 0, '2025-07-30 10:04:34', '/admin/orders/228358');
INSERT INTO `notifications` VALUES (307, 2, 'New order #228359 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1240.00. Status: pending', 'ORDER', 0, '2025-07-30 11:02:40', '/admin/orders/228359');
INSERT INTO `notifications` VALUES (308, 3, 'New order #228359 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1240.00. Status: pending', 'ORDER', 0, '2025-07-30 11:02:40', '/admin/orders/228359');
INSERT INTO `notifications` VALUES (310, 3, 'Your order #228359 has been delivered! We hope you enjoy your books. Thank you for choosing BoiToi!', 'ORDER', 0, '2025-07-30 11:03:15', '/orders/228359');
INSERT INTO `notifications` VALUES (311, 2, 'New order #228360 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1640.00. Status: pending', 'ORDER', 0, '2025-07-30 15:00:35', '/admin/orders/228360');
INSERT INTO `notifications` VALUES (312, 3, 'New order #228360 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $1640.00. Status: pending', 'ORDER', 0, '2025-07-30 15:00:35', '/admin/orders/228360');
INSERT INTO `notifications` VALUES (314, 2, 'New order #228361 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $140.00. Status: pending', 'ORDER', 0, '2025-07-30 15:10:25', '/admin/orders/228361');
INSERT INTO `notifications` VALUES (315, 3, 'New order #228361 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $140.00. Status: pending', 'ORDER', 0, '2025-07-30 15:10:25', '/admin/orders/228361');
INSERT INTO `notifications` VALUES (316, 3, 'Your order #228361 has been delivered! We hope you enjoy your books. Thank you for choosing BoiToi!', 'ORDER', 0, '2025-07-31 23:53:41', '/orders/228361');
INSERT INTO `notifications` VALUES (317, 2, 'New order #228362 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $340.00. Status: pending', 'ORDER', 0, '2025-07-31 23:54:50', '/admin/orders/228362');
INSERT INTO `notifications` VALUES (318, 3, 'New order #228362 placed by Anindya Biswas (parabolicanindya@gmail.com). Total amount: $340.00. Status: pending', 'ORDER', 0, '2025-07-31 23:54:50', '/admin/orders/228362');

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
  `STATUS_UPDATED_BY` int NULL DEFAULT NULL,
  `STATUS_UPDATED_AT` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `idx_order_user_id`(`USER_ID` ASC) USING BTREE,
  INDEX `order_confirmation`(`STATUS_UPDATED_BY` ASC) USING BTREE,
  CONSTRAINT `order_confirmation` FOREIGN KEY (`STATUS_UPDATED_BY`) REFERENCES `admin` (`USER_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 228363 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (1000, 3, '2025-07-19 18:33:17', 'To be provided by customer', 'pending', 0.00, 500.00, NULL, NULL);
INSERT INTO `order` VALUES (1001, 3, '2025-07-19 18:34:19', 'To be provided by customer', 'pending', 0.00, 200.00, NULL, NULL);
INSERT INTO `order` VALUES (1002, 3, '2025-07-19 23:18:20', 'To be provided by customer', 'pending', 0.00, 1600.00, NULL, NULL);
INSERT INTO `order` VALUES (1003, 3, '2025-07-21 01:00:37', 'To be provided by customer', 'pending', 0.00, 2400.00, NULL, NULL);
INSERT INTO `order` VALUES (1004, 3, '2025-07-25 17:54:19', 'To be provided by customer', 'cancelled', 0.00, 1800.00, 3, '2025-07-30 02:42:21');
INSERT INTO `order` VALUES (1005, 3, '2025-07-29 22:20:02', 'To be provided by customer', 'confirmed', 0.00, 200.00, 1, '2025-07-30 00:57:31');
INSERT INTO `order` VALUES (1006, 1, '2025-07-30 01:26:28', '123 Test Street', 'pending', 40.00, 100.00, NULL, NULL);
INSERT INTO `order` VALUES (1007, 1, '2025-07-30 01:27:51', '123 Test Street', 'pending', 40.00, 100.00, NULL, NULL);
INSERT INTO `order` VALUES (1008, 5, '2025-07-30 01:28:12', 'Ahsan Ullah Hall, Zahir Rayhan Road, Dhaka-1000, Dhaka, Bangladesh', 'refunded', 40.00, 1840.00, 3, '2025-07-30 01:39:10');
INSERT INTO `order` VALUES (1009, 1, '2025-07-30 01:37:03', '123 Test Street, Test City', 'shipped', 40.00, 150.00, 3, '2025-07-30 01:37:05');
INSERT INTO `order` VALUES (228355, 1, '2025-07-30 01:43:48', '456 Real Customer Street, Dhaka, Bangladesh', 'shipped', 40.00, 250.50, 3, '2025-07-30 01:43:50');
INSERT INTO `order` VALUES (228356, 3, '2025-07-30 02:37:33', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'delivered', 40.00, 1040.00, 3, '2025-07-30 02:38:52');
INSERT INTO `order` VALUES (228357, 3, '2025-07-30 03:30:52', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'delivered', 40.00, 2440.00, 3, '2025-07-30 03:32:32');
INSERT INTO `order` VALUES (228358, 3, '2025-07-30 10:04:34', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'pending', 40.00, 2070.00, NULL, NULL);
INSERT INTO `order` VALUES (228359, 3, '2025-07-30 11:02:40', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'delivered', 40.00, 1240.00, 3, '2025-07-30 11:03:15');
INSERT INTO `order` VALUES (228360, 3, '2025-07-30 15:00:35', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'pending', 40.00, 1640.00, NULL, NULL);
INSERT INTO `order` VALUES (228361, 3, '2025-07-30 15:10:25', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'delivered', 40.00, 140.00, 3, '2025-07-31 23:53:41');
INSERT INTO `order` VALUES (228362, 3, '2025-07-31 23:54:50', '60 Biswanath Heights, Natun Bazar, Magura, Khulna, Bangladesh', 'pending', 40.00, 340.00, NULL, NULL);

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
INSERT INTO `order_book` VALUES (1000, 201, 1);
INSERT INTO `order_book` VALUES (1000, 202, 1);
INSERT INTO `order_book` VALUES (1001, 201, 1);
INSERT INTO `order_book` VALUES (1002, 217, 1);
INSERT INTO `order_book` VALUES (1002, 287, 1);
INSERT INTO `order_book` VALUES (1003, 217, 1);
INSERT INTO `order_book` VALUES (1003, 244, 1);
INSERT INTO `order_book` VALUES (1003, 268, 1);
INSERT INTO `order_book` VALUES (1004, 201, 2);
INSERT INTO `order_book` VALUES (1004, 215, 2);
INSERT INTO `order_book` VALUES (1005, 201, 1);
INSERT INTO `order_book` VALUES (1006, 201, 1);
INSERT INTO `order_book` VALUES (1007, 201, 1);
INSERT INTO `order_book` VALUES (1008, 200, 2);
INSERT INTO `order_book` VALUES (1008, 201, 4);
INSERT INTO `order_book` VALUES (1008, 203, 2);
INSERT INTO `order_book` VALUES (228356, 201, 1);
INSERT INTO `order_book` VALUES (228356, 202, 1);
INSERT INTO `order_book` VALUES (228356, 204, 1);
INSERT INTO `order_book` VALUES (228357, 245, 3);
INSERT INTO `order_book` VALUES (228357, 259, 1);
INSERT INTO `order_book` VALUES (228357, 292, 2);
INSERT INTO `order_book` VALUES (228357, 363, 1);
INSERT INTO `order_book` VALUES (228357, 370, 1);
INSERT INTO `order_book` VALUES (228358, 201, 1);
INSERT INTO `order_book` VALUES (228358, 259, 1);
INSERT INTO `order_book` VALUES (228358, 290, 1);
INSERT INTO `order_book` VALUES (228358, 291, 1);
INSERT INTO `order_book` VALUES (228358, 306, 1);
INSERT INTO `order_book` VALUES (228358, 315, 1);
INSERT INTO `order_book` VALUES (228358, 336, 1);
INSERT INTO `order_book` VALUES (228359, 230, 1);
INSERT INTO `order_book` VALUES (228359, 281, 1);
INSERT INTO `order_book` VALUES (228359, 316, 1);
INSERT INTO `order_book` VALUES (228360, 288, 2);
INSERT INTO `order_book` VALUES (228361, 308, 1);
INSERT INTO `order_book` VALUES (228362, 202, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_discount
-- ----------------------------
INSERT INTO `order_discount` VALUES (1, 228358, 2);
INSERT INTO `order_discount` VALUES (2, 228358, 2);
INSERT INTO `order_discount` VALUES (3, 228359, 3);

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of payment
-- ----------------------------
INSERT INTO `payment` VALUES (1, 1006, NULL, 'cash_on_delivery', 100, 'pending', NULL);
INSERT INTO `payment` VALUES (2, 1007, NULL, 'cash_on_delivery', 100, 'pending', NULL);
INSERT INTO `payment` VALUES (3, 1008, '2025-07-30 01:28:13', 'bkash', 1840, 'refunded', 'testtrx');
INSERT INTO `payment` VALUES (4, 228356, NULL, 'cash_on_delivery', 1040, 'paid', NULL);
INSERT INTO `payment` VALUES (5, 228357, NULL, 'cash_on_delivery', 2440, 'paid', NULL);
INSERT INTO `payment` VALUES (6, 228358, NULL, 'cash_on_delivery', 2070, 'pending', NULL);
INSERT INTO `payment` VALUES (7, 228359, NULL, 'cash_on_delivery', 1240, 'paid', NULL);
INSERT INTO `payment` VALUES (8, 228360, NULL, 'cash_on_delivery', 1640, 'pending', NULL);
INSERT INTO `payment` VALUES (9, 228361, NULL, 'cash_on_delivery', 140, 'paid', NULL);
INSERT INTO `payment` VALUES (10, 228362, NULL, 'cash_on_delivery', 340, 'pending', NULL);

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `ID` int NOT NULL AUTO_INCREMENT,
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
-- Records of publisher
-- ----------------------------
INSERT INTO `publisher` VALUES (200, 'EduGorilla Publication', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (201, 'Jones & Bartlett Learning', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (202, 'Franklin, Beedle & Associates, Inc.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (203, 'Prentice Hall Professional', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (204, 'Packt Publishing Ltd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (205, 'Mikcorp Limited', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (206, 'John Brown', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (207, 'BPB Publications', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (208, 'PublishDrive', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (209, 'Abiprod Pty Ltd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (210, 'Shashwat Publication', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:39:59', 'ACTIVE');
INSERT INTO `publisher` VALUES (211, 'KHANNA PUBLISHING HOUSE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (212, '\"O\'Reilly Media, Inc.\"', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (213, 'Independently Published', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (214, 'John Wiley & Sons', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (215, 'Educohack Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (216, 'O\'Reilly Media', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (217, 'BoD – Books on Demand', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (218, 'Springer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (219, 'Springer Nature', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (220, 'Mario A.B. Capurso', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (221, 'National Geographic Books', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (222, 'Alejandro Garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (223, 'Mario Capurso', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:02', 'ACTIVE');
INSERT INTO `publisher` VALUES (224, 'Adarsha', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (225, 'CRC Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (226, 'Intellect (UK)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (227, 'Morgan Kaufmann', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (228, 'Apress', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (229, 'Packt Publishing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (230, 'Cambridge University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (231, 'Elsevier', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (232, 'Publifye AS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (233, 'Cybellium Ltd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (234, 'Codegyan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (235, 'Blue Rose Publishers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (236, 'IGI Global', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:04', 'ACTIVE');
INSERT INTO `publisher` VALUES (237, 'CHANGDER OUTLINE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (238, 'Rafi Publisher Ltd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (239, 'Erwin Ouyang', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (240, 'Nicolae Sfetcu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (241, 'Orange Education Pvt Limited', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (242, 'Springer Science & Business Media', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (243, 'Pearson Education India', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:07', 'ACTIVE');
INSERT INTO `publisher` VALUES (244, 'EOLSS Publications', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (245, 'Oxford University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (246, 'Notion Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (247, 'IndraStra Global', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (248, 'World Scientific Publishing Company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (249, 'OECD Publishing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (250, 'Deep Science Publishing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (251, 'Yale University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (252, 'Xoffencerpublication', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:10', 'ACTIVE');
INSERT INTO `publisher` VALUES (253, 'bestsellers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (254, 'Routledge', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (255, 'A&C Black', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (256, 'Diamond Books', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (257, 'iUniverse', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (258, 'Mollusca Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (259, 'Nordic Academic Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (260, 'BRILL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (261, 'JHU Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (262, 'Wilfrid Laurier Univ. Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (263, 'Barnes & Noble Publishing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (264, 'Stephen Weber', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (265, 'Cornell University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (266, 'ReadHowYouWant.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:13', 'ACTIVE');
INSERT INTO `publisher` VALUES (267, 'Polity', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (268, 'Kent State University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (269, 'Wildside Press LLC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (270, 'Kalpabiswa Publications', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (271, 'Cambridge Scholars Publishing', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (272, 'McFarland', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (273, 'transcript Verlag', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (274, 'Liverpool University Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (275, 'The Experimenter Publishing Company, LLC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (276, 'Diplomica Verlag', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:16', 'ACTIVE');
INSERT INTO `publisher` VALUES (277, 'DigiCat', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (278, 'Good Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (279, 'Univ. Press of Mississippi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (280, 'Poisoned Pen Press Inc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (281, 'ePublishing Works!', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (282, 'Courier Corporation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (283, 'American Library Association', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:19', 'ACTIVE');
INSERT INTO `publisher` VALUES (284, 'University of Pennsylvania Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (285, 'Walter de Gruyter GmbH & Co KG', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (286, 'OUP Oxford', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (287, 'Taylor & Francis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (288, 'Boston : Jewett', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (289, 'Psychology Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:21', 'ACTIVE');
INSERT INTO `publisher` VALUES (290, 'VOICE LITERARY CULTURAL ORGANIZATION   ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:23', 'ACTIVE');
INSERT INTO `publisher` VALUES (291, 'Concept Publishing Company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:23', 'ACTIVE');
INSERT INTO `publisher` VALUES (292, 'State University of New York Press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:23', 'ACTIVE');
INSERT INTO `publisher` VALUES (293, 'Wipf and Stock Publishers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', '2025-07-06 02:40:23', 'ACTIVE');
INSERT INTO `publisher` VALUES (1001, 'Test Publisher', NULL, NULL, NULL, NULL, 'testpub@boitoi.com', NULL, NULL, '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', '2025-07-19 20:34:49', 'ACTIVE');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2021 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of publisher_book_draft
-- ----------------------------
INSERT INTO `publisher_book_draft` VALUES (1, 'Achieving Serenity', '978-93-6087-544-2', 138, 'English', '1st', 299.00, 10, 'Serenity is often associated with a calm and composed state of mind, where individuals feel undisturbed by external factors or internal turmoil.\nIn the hustle and bustle of our fast-paced lives, the pursuit of serenity becomes a beacon of hope and necessity. \nSerenity is important for holistic well-being, encompassing mental, emotional, and physical health. It contributes to a positive mind-set, improved relationships, and the ability to navigate life\'s challenges with grace and resilience.\nHowever, achieving serenity can be challenging for several reasons. \nWelcome to \"Unlocking Serenity State: Practical Strategies for Stress Relief and Enhanced Quality of Life.\" Your companion on a journey towards tranquility. \nThis book offers practical and actionable strategies to navigate the storms of stress and finding the calm within.\nTo preserve and enhance serenity, it\'s crucial to manage and mitigate stress through various strategies such as mindfulness practices, relaxation techniques, regular exercise, and cultivating a supportive social network. Addressing the root causes of stress and developing healthy coping mechanisms contributes to a more serene and balanced state of being.', 'https://shashwatpublication.com/files/book-covers/front_cover_imgSB20872.jpg', 'Non-Fiction', NULL, 222, 1, NULL);
INSERT INTO `publisher_book_draft` VALUES (1001, 'Test Book Title', '978-1234567890', 300, 'English', '1st', 299.99, 50, 'A test book for approval system', 'https://example.com/cover.jpg', 'Fiction', NULL, 201, 1001, NULL);
INSERT INTO `publisher_book_draft` VALUES (1002, 'Test Reject Book', NULL, NULL, 'English', '1st', 199.99, NULL, NULL, NULL, NULL, NULL, 251, 1002, NULL);
INSERT INTO `publisher_book_draft` VALUES (1003, 'Understanding Analysis (Undergraduate Texts in Mathematics)', '978-1493927111', 324, 'English', '2nd', 99.00, 10, 'This lively introductory text exposes the student to the rewards of a rigorous study of functions of a real variable. In each chapter, informal discussions of questions that give analysis its inherent fascination are followed by precise, but not overly formal, developments of the techniques needed to make sense of them. By focusing on the unifying themes of approximation and the resolution of paradoxes that arise in the transition from the finite to the infinite, the text turns what could be a daunting cascade of definitions and theorems into a coherent and engaging progression of ideas. Acutely aware of the need for rigor, the student is much better prepared to understand what constitutes a proper mathematical proof and how to write one.\n\nFifteen years of classroom experience with the first edition of Understanding Analysis have solidified and refined the central narrative of the second edition. Roughly 150 new exercises join a selection of the best exercises from the first edition, and three more project-style sections have been added. Investigations of Euler’s computation of ζ(2), the Weierstrass Approximation ­ Theorem, and the gamma function are now among the book’s cohort of seminal results serving as motivation and payoff for the beginning student to master the methods of analysis.', 'https://m.media-amazon.com/images/I/51OS+nZ1bEL._SL1244_.jpg', 'Other', NULL, NULL, 1003, NULL);
INSERT INTO `publisher_book_draft` VALUES (1004, 'Linear Algebra Done Right (Undergraduate Texts in Mathematics)', '978-3031410260', 407, 'English', '4th', 99.00, 10, 'Now available in Open Access, this best-selling textbook for a second course in linear algebra is aimed at undergraduate math majors and graduate students. The fourth edition gives an expanded treatment of the singular value decomposition and its consequences. It includes a new chapter on multilinear algebra, treating bilinear forms, quadratic forms, tensor products, and an approach to determinants via alternating multilinear forms. This new edition also increases the use of the minimal polynomial to provide cleaner proofs of multiple results. Also, over 250 new exercises have been added.\n\nThe novel approach taken here banishes determinants to the end of the book. The text focuses on the central goal of linear algebra: understanding the structure of linear operators on finite-dimensional vector spaces. The author has taken unusual care to motivate concepts and simplify proofs. A variety of interesting exercises in each chapter helps students understand and manipulate the objects of linear algebra. Beautiful formatting creates pages with an unusually student-friendly appearance in both print and electronic versions.\n\nNo prerequisites are assumed other than the usual demand for suitable mathematical maturity. The text starts by discussing vector spaces, linear independence, span, basis, and dimension. The book then deals with linear maps, eigenvalues, and eigenvectors. Inner-product spaces are introduced, leading to the finite-dimensional spectral theorem and its consequences. Generalized eigenvectors are then used to provide insight into the structure of a linear operator.\n\nFrom the reviews of previous editions:\n\nAltogether, the text is a didactic masterpiece. ― zbMATH\n\nThe determinant-free proofs are elegant and intuitive. ― American Mathematical Monthly\n\nThe most original linear algebra book to appear in years, it certainly belongs in every undergraduate library ― CHOICE', 'https://m.media-amazon.com/images/I/51793S0SvIL._SL1246_.jpg', 'Other', NULL, NULL, 1004, NULL);
INSERT INTO `publisher_book_draft` VALUES (1005, 'Linear Algebra Done Right (Undergraduate Texts in Mathematics)', '978-3031410260', 407, 'English', '1st', 99.00, 10, 'Now available in Open Access, this best-selling textbook for a second course in linear algebra is aimed at undergraduate math majors and graduate students. The fourth edition gives an expanded treatment of the singular value decomposition and its consequences. It includes a new chapter on multilinear algebra, treating bilinear forms, quadratic forms, tensor products, and an approach to determinants via alternating multilinear forms. This new edition also increases the use of the minimal polynomial to provide cleaner proofs of multiple results. Also, over 250 new exercises have been added.\n\nThe novel approach taken here banishes determinants to the end of the book. The text focuses on the central goal of linear algebra: understanding the structure of linear operators on finite-dimensional vector spaces. The author has taken unusual care to motivate concepts and simplify proofs. A variety of interesting exercises in each chapter helps students understand and manipulate the objects of linear algebra. Beautiful formatting creates pages with an unusually student-friendly appearance in both print and electronic versions.\n\nNo prerequisites are assumed other than the usual demand for suitable mathematical maturity. The text starts by discussing vector spaces, linear independence, span, basis, and dimension. The book then deals with linear maps, eigenvalues, and eigenvectors. Inner-product spaces are introduced, leading to the finite-dimensional spectral theorem and its consequences. Generalized eigenvectors are then used to provide insight into the structure of a linear operator.\n\nFrom the reviews of previous editions:\n\nAltogether, the text is a didactic masterpiece. ― zbMATH\n\nThe determinant-free proofs are elegant and intuitive. ― American Mathematical Monthly\n\nThe most original linear algebra book to appear in years, it certainly belongs in every undergraduate library ― CHOICE', 'https://m.media-amazon.com/images/I/51793S0SvIL._SL1246_.jpg', 'Other', 'Sheldon Axler', NULL, 1005, NULL);
INSERT INTO `publisher_book_draft` VALUES (2001, 'Test Book with Authors', '978-1234567890', 200, 'English', '1st', 29.99, 50, 'A test book to verify authors display', 'https://example.com/cover.jpg', 'Fiction', 'John Doe, Jane Smith, Bob Johnson', 201, 2001, NULL);
INSERT INTO `publisher_book_draft` VALUES (2002, 'Linear Algebra Done Right (Undergraduate Texts in Mathematics)', '978-3031410260', 407, 'English', '4th', 99.00, 10, 'Now available in Open Access, this best-selling textbook for a second course in linear algebra is aimed at undergraduate math majors and graduate students. The fourth edition gives an expanded treatment of the singular value decomposition and its consequences. It includes a new chapter on multilinear algebra, treating bilinear forms, quadratic forms, tensor products, and an approach to determinants via alternating multilinear forms. This new edition also increases the use of the minimal polynomial to provide cleaner proofs of multiple results. Also, over 250 new exercises have been added.\n\nThe novel approach taken here banishes determinants to the end of the book. The text focuses on the central goal of linear algebra: understanding the structure of linear operators on finite-dimensional vector spaces. The author has taken unusual care to motivate concepts and simplify proofs. A variety of interesting exercises in each chapter helps students understand and manipulate the objects of linear algebra. Beautiful formatting creates pages with an unusually student-friendly appearance in both print and electronic versions.\n\nNo prerequisites are assumed other than the usual demand for suitable mathematical maturity. The text starts by discussing vector spaces, linear independence, span, basis, and dimension. The book then deals with linear maps, eigenvalues, and eigenvectors. Inner-product spaces are introduced, leading to the finite-dimensional spectral theorem and its consequences. Generalized eigenvectors are then used to provide insight into the structure of a linear operator.\n\nFrom the reviews of previous editions:\n\nAltogether, the text is a didactic masterpiece. ― zbMATH\n\nThe determinant-free proofs are elegant and intuitive. ― American Mathematical Monthly\n\nThe most original linear algebra book to appear in years, it certainly belongs in every undergraduate library ― CHOICE', 'https://m.media-amazon.com/images/I/51793S0SvIL._SL1246_.jpg', 'Other', NULL, NULL, 2002, NULL);
INSERT INTO `publisher_book_draft` VALUES (2003, 'Understanding Analysis (Undergraduate Texts in Mathematics)', '978-93-6087-544-2', 324, 'English', '2nd', 248.99, 20, 'This lively introductory text exposes the student to the rewards of a rigorous study of functions of a real variable. In each chapter, informal discussions of questions that give analysis its inherent fascination are followed by precise, but not overly formal, developments of the techniques needed to make sense of them. By focusing on the unifying themes of approximation and the resolution of paradoxes that arise in the transition from the finite to the infinite, the text turns what could be a daunting cascade of definitions and theorems into a coherent and engaging progression of ideas. Acutely aware of the need for rigor, the student is much better prepared to understand what constitutes a proper mathematical proof and how to write one.\n\nFifteen years of classroom experience with the first edition of Understanding Analysis have solidified and refined the central narrative of the second edition. Roughly 150 new exercises join a selection of the best exercises from the first edition, and three more project-style sections have been added. Investigations of Euler’s computation of ζ(2), the Weierstrass Approximation ­ Theorem, and the gamma function are now among the book’s cohort of seminal results serving as motivation and payoff for the beginning student to master the methods of analysis.', 'https://m.media-amazon.com/images/I/51OS+nZ1bEL._SL1244_.jpg', 'Other', NULL, NULL, 2003, NULL);
INSERT INTO `publisher_book_draft` VALUES (2004, 'Understanding Analysis (Undergraduate Texts in Mathematics)', '978-93-6087-544-2', 324, 'English', '2', 248.99, 20, '', 'https://m.media-amazon.com/images/I/51OS+nZ1bEL._SL1244_.jpg', 'Other', NULL, NULL, 2004, NULL);
INSERT INTO `publisher_book_draft` VALUES (2005, 'G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3)', '978-1493912179', 206, 'English', '2014th', 108.00, 9, 'The main purpose of this volume is to provide a focused analysis of the function of the G protein-coupled signaling pathways that operate in the interconnected network of retinal neurons as they detect and encode the information carried by light. The organization of this volume will generally follow the path of signal flow in the retina. First we will describe recent advances in understanding the phototransduction cascade of rod and cone photoreceptors, which use signaling cascade based on the GPCR rhodopsin to transduce incident light into neural activity. Chapters will be devoted to unique specializations of the two major types of photosensitive cells that comprise the predominant input for our spatial and color vision. Subsequently, the mechanisms of synaptic information encoding by retinal ON bipolar cells will be described, where the GPCR mGluR6 plays a fundamental role. Chapters in this section will examine macromolecular organization of the mGluR6 signaling pathway as well as current understanding of its function. The functional characteristics of this signaling mechanism will be explored in detail. Additionally, this section will cover the role of dopamine receptors in modulating signal transmission between photoreceptors and ON-bipolar cells. Finally, chapters will be focused on the output neurons of the inner retina, ganglion cells, where the components of the emerging GPCR melanopsin cascade in intrinsically photosensitive ganglion cells will be detailed. Collectively these mechanisms allow the retina to represent visual space over a wide range of light intensities.', 'https://m.media-amazon.com/images/I/61Nr5MbbgWL._SL1240_.jpg', 'Other', NULL, NULL, 2005, NULL);
INSERT INTO `publisher_book_draft` VALUES (2006, 'A Big History of Globalization (World-Systems Evolution and Global Futures)', '978-3030057060', 304, 'English', '1st ed, 2019 ed', 299.00, 10, 'This book presents the history of globalization as a network-based story in the context of Big History. Departing from the traditional historic discourse, in which communities, cities, and states serve as the main units of analysis, the authors instead trace the historical emergence, growth, interconnection, and merging of various types of networks that have gradually encompassed the globe. They also focus on the development of certain ideas, processes, institutions, and phenomena that spread through those networks to become truly global.\n\nThe book specifies five macro-periods in the history of globalization and comprehensively covers the first four, from roughly the 9th – 7th millennia BC to World War I. For each period, it identifies the most important network-related developments that facilitated (or even spurred on) such transitions and had the greatest impacts on the history of globalization.\n\nBy analyzing the world system\'s transition to new levels of complexityand connectivity, the book provides valuable insights into the course of Big History and the evolution of human societies.', 'https://m.media-amazon.com/images/I/71Z4H49UtFL._SL1246_.jpg', 'Other', 'Complete Test Author, Another Test Author', NULL, 2006, NULL);
INSERT INTO `publisher_book_draft` VALUES (2009, 'Final Author Test Book', NULL, NULL, 'English', '1st', 49.99, 30, 'Testing author functionality', NULL, 'Technology', 'Test Author One, Test Author Two', NULL, 2007, NULL);
INSERT INTO `publisher_book_draft` VALUES (2010, 'Final Author Test Book 2', NULL, NULL, 'English', '1st', 39.99, 25, 'Second test', NULL, 'Science', 'Final Author A, Final Author B', NULL, 2008, NULL);
INSERT INTO `publisher_book_draft` VALUES (2011, 'Minimal Fix Test Book', NULL, NULL, 'English', '1st', 29.99, 20, 'Testing minimal fix', NULL, 'Technology', 'Minimal Author A, Minimal Author B', NULL, 2009, NULL);
INSERT INTO `publisher_book_draft` VALUES (2012, 'Basic Mathematics 4', '978-0387967875', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', NULL, NULL, 2010, NULL);
INSERT INTO `publisher_book_draft` VALUES (2013, 'Basic Mathematics', '978-0387967875', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', ' Serge Lang, Serge A. Lang', NULL, 2011, NULL);
INSERT INTO `publisher_book_draft` VALUES (2014, 'Basic Mathematics 5', '978-0387967875', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', ' Serge Lang, Serge A. Lang', NULL, 2012, NULL);
INSERT INTO `publisher_book_draft` VALUES (2015, 'Basic Mathematics 1', '978-0387967875', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', ' Serge Lang, Serge A. Lang', NULL, 2013, NULL);
INSERT INTO `publisher_book_draft` VALUES (2016, 'Basic Mathematics 1', '978-TEST-123456', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', ' Serge Lang, Serge A. Lang', NULL, 2014, '1988-07-01');
INSERT INTO `publisher_book_draft` VALUES (2017, 'Basic Mathematics 1', '978-0387967876', 494, 'English', '1st', 599.00, 10, 'This text in basic mathematics is ideal for high school or college students. It provides a firm foundation in basic principles of mathematics and thereby acts as a springboard into calculus, linear algebra and other more advanced topics. The information is clearly presented, and the author develops concepts in such a manner to show how one subject matter can relate and evolve into another.', 'https://m.media-amazon.com/images/I/515t1sJlmvL._SL1250_.jpg', 'Non-Fiction', ' Serge Lang, Serge A. Lang', NULL, 2015, '1988-07-01');
INSERT INTO `publisher_book_draft` VALUES (2018, 'Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition', '978-3030645724', 1914, 'English', '1st', 249.00, 10, 'This book provides a structured and analytical guide to the use of artificial intelligence in medicine. Covering all areas within medicine, the chapters give a systemic review of the history, scientific foundations, present advances, potential trends, and future challenges of artificial intelligence within a healthcare setting.\nArtificial Intelligence in Medicine aims to give readers the required knowledge to apply artificial intelligence to clinical practice. The book is relevant to medical students, specialist doctors, and researchers whose work will be affected by artificial intelligence.', 'https://m.media-amazon.com/images/I/515qMrsY2lL._SL1208_.jpg', 'Non-Fiction', 'Niklas Lidströmer,Hutan Ashrafian', NULL, 2016, '2022-02-19');
INSERT INTO `publisher_book_draft` VALUES (2020, 'Test Book', '978-TEST-999999', 200, 'English', '1st', 25.99, 100, 'Test description', '/images/test.jpg', 'Fiction', 'Test Author', 200, 2017, '2024-01-01');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2018 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of publisher_request
-- ----------------------------
INSERT INTO `publisher_request` VALUES (1, 210, 'ADD_BOOK', 'APPROVED', '2025-07-19 19:41:13', '2025-07-20 05:48:05', 1, 'New book contribution request: Achieving Serenity | Approved and book added to catalog | Approved and book added to catalog', NULL);
INSERT INTO `publisher_request` VALUES (1001, 1001, 'ADD_BOOK', 'APPROVED', '2025-07-19 20:34:49', '2025-07-19 20:44:39', 1001, 'Test book submission | Approved and added to catalog with Book ID: 400', NULL);
INSERT INTO `publisher_request` VALUES (1002, 1001, 'ADD_BOOK', 'REJECTED', '2025-07-19 20:45:26', '2025-07-20 07:00:52', 2, 'Rejected: Content quality needs improvement - please revise and resubmit', 'Content quality needs improvement - please revise and resubmit');
INSERT INTO `publisher_request` VALUES (1003, 218, 'ADD_BOOK', 'APPROVED', '2025-07-20 03:23:53', '2025-07-20 03:24:40', 3, 'New book contribution request: Understanding Analysis (Undergraduate Texts in Mathematics) | Approved and book added to catalog', NULL);
INSERT INTO `publisher_request` VALUES (1004, 218, 'ADD_BOOK', 'APPROVED', '2025-07-20 03:31:41', '2025-07-20 07:01:45', 2, 'New book contribution request: Linear Algebra Done Right (Undergraduate Texts in Mathematics) | Rejected: Author name not found', 'Great book, approved for publication');
INSERT INTO `publisher_request` VALUES (1005, 218, 'ADD_BOOK', 'APPROVED', '2025-07-20 04:14:22', '2025-07-20 04:15:27', 3, 'New book contribution request: Linear Algebra Done Right (Undergraduate Texts in Mathematics) | Approved and book added to catalog', NULL);
INSERT INTO `publisher_request` VALUES (2001, 200, 'ADD_BOOK', 'REJECTED', '2025-07-20 04:22:42', '2025-07-20 06:26:32', 3, 'Test book with authors | Rejected: test', NULL);
INSERT INTO `publisher_request` VALUES (2002, 218, 'ADD_BOOK', 'REJECTED', '2025-07-20 06:49:52', '2025-07-20 06:50:57', 3, 'New book contribution request: Linear Algebra Done Right (Undergraduate Texts in Mathematics) | Rejected: Request Rejected for testing purpose', NULL);
INSERT INTO `publisher_request` VALUES (2003, 218, 'ADD_BOOK', 'REJECTED', '2025-07-20 07:03:21', '2025-07-20 07:04:29', 3, 'New book contribution request: Understanding Analysis (Undergraduate Texts in Mathematics) | Rejected: Currently not accepting new books.', NULL);
INSERT INTO `publisher_request` VALUES (2004, 218, 'ADD_BOOK', 'REJECTED', '2025-07-20 07:16:14', '2025-07-20 07:17:05', 3, 'New book contribution request: Understanding Analysis (Undergraduate Texts in Mathematics) | Rejected: There\'s no description.', NULL);
INSERT INTO `publisher_request` VALUES (2005, 218, 'ADD_BOOK', 'APPROVED', '2025-07-20 07:28:22', '2025-07-20 07:29:33', 3, 'New book contribution request: G Protein Signaling Mechanisms in the Retina (Springer Series in Vision Research, 3) | Approved and book added to catalog', NULL);
INSERT INTO `publisher_request` VALUES (2006, 218, 'ADD_BOOK', 'APPROVED', '2025-07-25 15:05:54', '2025-07-27 01:36:14', 1, 'New book contribution request: A Big History of Globalization (World-Systems Evolution and Global Futures) | Approved and book added to catalog', 'Testing complete author processing');
INSERT INTO `publisher_request` VALUES (2007, 200, 'ADD_BOOK', 'APPROVED', '2025-07-27 01:40:23', '2025-07-27 01:40:33', 1, NULL, 'Testing final author processing');
INSERT INTO `publisher_request` VALUES (2008, 200, 'ADD_BOOK', 'APPROVED', '2025-07-27 01:42:51', '2025-07-27 01:42:51', 1, NULL, 'Testing updated procedure');
INSERT INTO `publisher_request` VALUES (2009, 200, 'ADD_BOOK', 'APPROVED', '2025-07-27 01:44:56', '2025-07-27 02:15:32', 1001, NULL, 'Test approval');
INSERT INTO `publisher_request` VALUES (2010, 218, 'ADD_BOOK', 'APPROVED', '2025-07-27 01:48:10', '2025-07-27 01:48:58', 3, 'New book contribution request: Basic Mathematics 4 | Approved and book added to catalog', NULL);
INSERT INTO `publisher_request` VALUES (2011, 218, 'ADD_BOOK', 'REJECTED', '2025-07-27 01:56:11', '2025-07-27 01:58:33', 3, 'New book contribution request: Basic Mathematics | Rejected: Server error', NULL);
INSERT INTO `publisher_request` VALUES (2012, 218, 'ADD_BOOK', 'REJECTED', '2025-07-27 01:59:06', '2025-07-27 01:59:30', 3, 'New book contribution request: Basic Mathematics 5 | Rejected: failed', NULL);
INSERT INTO `publisher_request` VALUES (2013, 218, 'ADD_BOOK', 'APPROVED', '2025-07-27 02:12:24', '2025-07-27 02:19:30', 1001, 'New book contribution request: Basic Mathematics 1', 'Test approval fixed');
INSERT INTO `publisher_request` VALUES (2014, 218, 'ADD_BOOK', 'APPROVED', '2025-07-27 02:41:59', NULL, NULL, 'New book contribution request: Basic Mathematics 1', NULL);
INSERT INTO `publisher_request` VALUES (2015, 218, 'ADD_BOOK', 'REJECTED', '2025-07-27 03:19:41', '2025-07-27 03:22:44', 3, 'New book contribution request: Basic Mathematics 1 | Rejected: My son hated this book.', NULL);
INSERT INTO `publisher_request` VALUES (2016, 218, 'ADD_BOOK', 'APPROVED', '2025-07-27 03:27:08', '2025-07-27 03:55:03', 1, 'New book contribution request: Artificial Intelligence in Medicine (Volume 1 & 2) 1st ed. 2022 Edition | Test approval', NULL);
INSERT INTO `publisher_request` VALUES (2017, 218, 'ADD_BOOK', 'APPROVED', '2025-07-27 03:27:22', '2025-07-27 03:55:59', 3, 'Test request | ', NULL);

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
-- Records of return_request
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of review
-- ----------------------------
INSERT INTO `review` VALUES (1, 1, 200, 5, 'Good Book', '2025-07-06 15:52:29', 1);
INSERT INTO `review` VALUES (2, 1, 201, 5, 'Good Book', '2025-07-06 15:52:29', 1);
INSERT INTO `review` VALUES (3, 1, 202, 5, 'Good Book', '2025-07-06 15:52:29', 1);
INSERT INTO `review` VALUES (4, 1, 203, 5, 'Good Book', '2025-07-06 15:52:29', 1);
INSERT INTO `review` VALUES (5, 1, 204, 5, 'Good Book', '2025-07-06 15:52:29', 1);
INSERT INTO `review` VALUES (6, 3, 201, 4, 'Recommended book if you\'re learning python.', '2025-07-25 17:15:41', NULL);
INSERT INTO `review` VALUES (7, 3, 287, 3, 'Great textbook for students who are already familiar with the concepts.', '2025-07-25 17:20:31', NULL);
INSERT INTO `review` VALUES (8, 3, 215, 3, 'My kids read this.', '2025-07-25 17:46:02', NULL);
INSERT INTO `review` VALUES (9, 3, 245, 1, 'My machine didn\'t learn anything from this book. I believe it\'s a scam.', '2025-07-30 03:36:17', NULL);
INSERT INTO `review` VALUES (11, 3, 204, 3, 'Nice', '2025-07-30 12:07:03', NULL);

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
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NULL DEFAULT NULL,
  `SEARCH_QUERY` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `SEARCH_DATE` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `USER_ID`(`USER_ID` ASC) USING BTREE,
  CONSTRAINT `search_log_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of search_log
-- ----------------------------

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
-- Records of shipping
-- ----------------------------

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
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', NULL, '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', NULL, NULL, '01234567890', NULL, NULL, 0, 'MALE', NULL);
INSERT INTO `user` VALUES (2, 'prottoy', 'prottoy@example.com', '$2b$10$O4z7p.fH5G9Kr9YlhhiKhe0TRWz7Aki6jnGrOVYwqDNw4KB.J8ZTS', 'Prottoy', 'Das', '01712345678', '2025-06-24 12:00:00', '2025-06-24 12:00:00', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (3, 'anindya', 'parabolicanindya@gmail.com', '$2b$10$E/JSVKR5NIXUr57PK5uEqO280lm/f7camMzf4w.8Xz3Wa8mNfHV6m', 'Anindya', 'Biswas', '01821646373', '2025-06-24 12:00:00', '2025-07-31 23:53:08', 1, 'MALE', '2003-04-20');
INSERT INTO `user` VALUES (4, 'sourav', 'sourav@example.com', '$2b$10$cSpOAoJw8oKbwhvk1xxZmOLy99BM8v5OfKbQclE2BwQfVjgZQ1rBa', 'Sourav', 'Sarkar', '01712345678', '2025-06-24 12:00:00', '2025-06-24 12:00:00', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (5, 'THK_is_dead', 'tahjib@example.com', '$2b$10$gGtA5D8G1XuE.Ekh76xuGuNmEwiztRruePKl1WHYPBEO4tI6N0ICS', 'Tahjib', 'Hossain Khan', '01712345678', '2025-06-24 12:00:00', '2025-07-30 01:39:24', 1, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (6, 'johnpork', 'johnpork@gmail.com', '$2b$10$WCnA6LqcglLLOHKoNWfUSe1T9CN.rXul4fnM2qQ8fHKatYuFYYwtC', 'John', 'Pork', '01234567891', '2025-06-28 01:41:00', '2025-06-28 01:41:00', 0, 'MALE', '2000-01-01');
INSERT INTO `user` VALUES (7, 'anindya1', 'anindya@gmail.com', '$2b$10$UQH5JtdMmEic2uRe4TEv7.RhVf2SPy/sUn1ArmLwucMakKwDPFuz6', 'anindya', 'biswas', '12345678901', '2025-06-28 02:05:35', '2025-06-28 02:05:35', 0, 'MALE', '2025-05-31');
INSERT INTO `user` VALUES (999, 'admin_test', 'admin@boitoi.com', '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', NULL, NULL, NULL, '2025-07-19 20:34:37', NULL, 0, 'UNSPECIFIED', NULL);
INSERT INTO `user` VALUES (1001, 'testadmin', 'testadmin@boitoi.com', '$2b$10$8YYiD7ZT1YLl.dQ0dI2uXeJKaORxV3QOhyxPV5MmHHdz3.I8zN8gW', NULL, NULL, NULL, '2025-07-19 20:34:49', NULL, 0, 'UNSPECIFIED', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_address
-- ----------------------------
INSERT INTO `user_address` VALUES (1, 6, 'home', 'Bangladesh University of Engineering and Technology\nPalashi, Dhaka 1000', 'Dhaka', 'Bangladesh', 'Bangladesh', '1000', 1);
INSERT INTO `user_address` VALUES (2, 7, 'office', '60 Biswanath Heights, Natun Bazar', 'Magura', 'Bangladesh', 'Bangladesh', '7600', 1);
INSERT INTO `user_address` VALUES (3, 3, 'office', 'Ahsan Ullah Hall, Zahir Rayhan Road', 'Dhaka-1000', 'Dhaka', 'Bangladesh', '1000', 0);
INSERT INTO `user_address` VALUES (4, 3, 'home', '60 Biswanath Heights, Natun Bazar', 'Magura', 'Khulna', 'Bangladesh', '7600', 1);
INSERT INTO `user_address` VALUES (7, 5, 'home', 'Ahsan Ullah Hall, Zahir Rayhan Road', 'Dhaka-1000', 'Dhaka', 'Bangladesh', '1000', 1);
INSERT INTO `user_address` VALUES (8, 1, 'home', 'Test Street 123', 'Test City', 'Test State', 'Bangladesh', '12345', 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of wishlist
-- ----------------------------
INSERT INTO `wishlist` VALUES (1, 3, 200, '2025-07-29 00:00:00');

-- ----------------------------
-- Procedure structure for ApproveBookRequest
-- ----------------------------
DROP PROCEDURE IF EXISTS `ApproveBookRequest`;
delimiter ;;
CREATE PROCEDURE `ApproveBookRequest`(IN p_request_id INT,
    IN p_admin_id INT,
    IN p_admin_feedback TEXT,
    OUT p_result_message VARCHAR(255),
    OUT p_new_book_id INT)
BEGIN
    DECLARE v_publisher_id INT;
    DECLARE v_title VARCHAR(255);
    DECLARE v_isbn VARCHAR(50);
    DECLARE v_published_date DATE;
    DECLARE v_page_count INT;
    DECLARE v_language VARCHAR(50);
    DECLARE v_edition VARCHAR(100);
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_stock_quantity INT;
    DECLARE v_description TEXT;
    DECLARE v_cover_url VARCHAR(500);
    DECLARE v_genre VARCHAR(100);
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        SET p_result_message = 'Database error occurred during approval';
        SET p_new_book_id = 0;
    END;

    START TRANSACTION;

    
    SELECT PUBLISHER_ID INTO v_publisher_id
    FROM PUBLISHER_REQUEST 
    WHERE ID = p_request_id AND STATUS = 'PENDING';

    IF v_publisher_id IS NULL THEN
        SET p_result_message = 'Request not found or already processed';
        SET p_new_book_id = 0;
        ROLLBACK;
    ELSE
        
        SELECT TITLE, ISBN, PUBLISHED_DATE, PAGE_COUNT, LANGUAGE, EDITION, 
               PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, GENRE
        INTO v_title, v_isbn, v_published_date, v_page_count, v_language, 
             v_edition, v_price, v_stock_quantity, v_description, v_cover_url, v_genre
        FROM PUBLISHER_BOOK_DRAFT 
        WHERE REQUEST_ID = p_request_id;

        
        INSERT INTO BOOK (TITLE, ISBN, PUBLISHED_DATE, PAGE_COUNT, LANGUAGE, 
                         EDITION, PRICE, STOCK_QUANTITY, DESCRIPTION, COVER_URL, 
                         GENRE, PUBLISHER_ID, ADDED_AT)
        VALUES (v_title, v_isbn, v_published_date, v_page_count, v_language,
                v_edition, v_price, v_stock_quantity, v_description, v_cover_url,
                v_genre, v_publisher_id, NOW());

        SET p_new_book_id = LAST_INSERT_ID();

        
        UPDATE PUBLISHER_REQUEST 
        SET STATUS = 'APPROVED', 
            REVIEWED_AT = NOW(), 
            REVIEWED_BY = p_admin_id,
            NOTES = CONCAT(COALESCE(NOTES, ''), ' | ', COALESCE(p_admin_feedback, 'Approved'))
        WHERE ID = p_request_id;

        SET p_result_message = 'Book approved and added to catalog successfully';
        
        COMMIT;
    END IF;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for ProcessBookAuthors
-- ----------------------------
DROP PROCEDURE IF EXISTS `ProcessBookAuthors`;
delimiter ;;
CREATE PROCEDURE `ProcessBookAuthors`(IN p_book_id INT,
    IN p_authors_text TEXT)
BEGIN
    DECLARE v_author_name VARCHAR(255);
    DECLARE v_author_id INT;
    DECLARE v_remaining_text TEXT;
    DECLARE v_comma_pos INT;
    DECLARE v_processed_count INT DEFAULT 0;
    
    -- Error handler for author processing
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Log error but continue processing other authors
        GET DIAGNOSTICS CONDITION 1
            @error_message = MESSAGE_TEXT;
    END;
    
    -- Clean and prepare the authors text
    SET v_remaining_text = TRIM(p_authors_text);
    
    -- Add a trailing comma to make parsing easier
    IF v_remaining_text != '' THEN
        SET v_remaining_text = CONCAT(v_remaining_text, ',');
    END IF;
    
    -- Process each author
    WHILE LENGTH(v_remaining_text) > 0 DO
        SET v_comma_pos = LOCATE(',', v_remaining_text);
        
        IF v_comma_pos > 0 THEN
            -- Extract author name
            SET v_author_name = TRIM(SUBSTRING(v_remaining_text, 1, v_comma_pos - 1));
            SET v_remaining_text = TRIM(SUBSTRING(v_remaining_text, v_comma_pos + 1));
            
            -- Process this author if name is not empty
            IF v_author_name != '' THEN
                SET v_processed_count = v_processed_count + 1;
                
                -- Check if author already exists
                SELECT ID INTO v_author_id 
                FROM author 
                WHERE NAME = v_author_name 
                LIMIT 1;
                
                -- If author doesn't exist, create them
                IF v_author_id IS NULL THEN
                    INSERT INTO author (NAME) VALUES (v_author_name);
                    SET v_author_id = LAST_INSERT_ID();
                END IF;
                
                -- Link author to book (INSERT IGNORE prevents duplicates)
                INSERT IGNORE INTO book_author (BOOK_ID, AUTHOR_ID, CONTRIBUTION)
                VALUES (p_book_id, v_author_id, 'Author');
                
                -- Reset for next iteration
                SET v_author_id = NULL;
            END IF;
        ELSE
            -- No more commas, exit loop
            SET v_remaining_text = '';
        END IF;
    END WHILE;
    
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
-- Procedure structure for SetDefaultAddress
-- ----------------------------
DROP PROCEDURE IF EXISTS `SetDefaultAddress`;
delimiter ;;
CREATE PROCEDURE `SetDefaultAddress`(IN p_user_id INT,
    IN p_address_id INT)
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
    WHERE ID = p_address_id;
    
    COMMIT;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for TriggerOrderNotification
-- ----------------------------
DROP PROCEDURE IF EXISTS `TriggerOrderNotification`;
delimiter ;;
CREATE PROCEDURE `TriggerOrderNotification`(IN order_id INT,
    IN notification_type ENUM('NEW_ORDER', 'STATUS_UPDATE'))
BEGIN
    DECLARE order_user_id INT;
    DECLARE order_status VARCHAR(50);
    DECLARE order_amount DECIMAL(12,2);
    DECLARE updated_by_admin INT;
    
    
    SELECT USER_ID, ORDER_STATUS, TOTAL_AMOUNT, STATUS_UPDATED_BY
    INTO order_user_id, order_status, order_amount, updated_by_admin
    FROM `order`
    WHERE ID = order_id;
    
    IF order_user_id IS NOT NULL THEN
        IF notification_type = 'NEW_ORDER' THEN
            
            INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
            SELECT 
                a.USER_ID,
                CONCAT('New order #', order_id, ' requires attention. Amount: $', COALESCE(order_amount, 0)),
                'ORDER',
                0,
                NOW(),
                CONCAT('/admin/orders/', order_id)
            FROM admin a;
            
        ELSEIF notification_type = 'STATUS_UPDATE' THEN
            
            INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
            VALUES (
                order_user_id,
                CONCAT('Your order #', order_id, ' status has been updated to: ', order_status),
                'ORDER',
                0,
                NOW(),
                CONCAT('/orders/', order_id)
            );
        END IF;
    END IF;
    
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table order
-- ----------------------------
DROP TRIGGER IF EXISTS `notify_admins_new_order`;
delimiter ;;
CREATE TRIGGER `notify_admins_new_order` AFTER INSERT ON `order` FOR EACH ROW BEGIN
    DECLARE customer_name VARCHAR(100) DEFAULT 'Customer';
    DECLARE customer_email VARCHAR(50) DEFAULT '';
    DECLARE notification_message TEXT;
    
    
    SELECT COALESCE(CONCAT(FIRST_NAME, ' ', LAST_NAME), USERNAME, 'Customer'),
           COALESCE(EMAIL, '')
    INTO customer_name, customer_email
    FROM user
    WHERE ID = NEW.USER_ID;
    
    
    SET notification_message = CONCAT(
        'New order #', NEW.ID, ' placed by ', customer_name,
        CASE 
            WHEN customer_email != '' THEN CONCAT(' (', customer_email, ')')
            ELSE ''
        END,
        '. Total amount: $', COALESCE(NEW.TOTAL_AMOUNT, 0),
        '. Status: ', COALESCE(NEW.ORDER_STATUS, 'pending')
    );
    
    
    INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
    SELECT 
        a.USER_ID,
        notification_message,
        'ORDER',
        0,
        NOW(),
        CONCAT('/admin/orders/', NEW.ID)
    FROM admin a
    WHERE EXISTS (SELECT 1 FROM user u WHERE u.ID = a.USER_ID AND u.IS_ACTIVE = 1);
    
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table order
-- ----------------------------
DROP TRIGGER IF EXISTS `notify_user_order_update`;
delimiter ;;
CREATE TRIGGER `notify_user_order_update` AFTER UPDATE ON `order` FOR EACH ROW BEGIN
    DECLARE admin_name VARCHAR(100) DEFAULT 'Admin';
    DECLARE notification_message TEXT;
    DECLARE status_display VARCHAR(50);
    
    
    IF (OLD.ORDER_STATUS != NEW.ORDER_STATUS OR OLD.ORDER_STATUS IS NULL) 
       AND NEW.STATUS_UPDATED_BY IS NOT NULL THEN
        
        
        SELECT COALESCE(CONCAT(u.FIRST_NAME, ' ', u.LAST_NAME), u.USERNAME, 'Admin')
        INTO admin_name
        FROM admin a
        JOIN user u ON a.USER_ID = u.ID
        WHERE a.USER_ID = NEW.STATUS_UPDATED_BY;
        
        
        SET status_display = CASE NEW.ORDER_STATUS
            WHEN 'pending' THEN 'Pending Review'
            WHEN 'confirmed' THEN 'Confirmed'
            WHEN 'processing' THEN 'Being Processed'
            WHEN 'shipped' THEN 'Shipped'
            WHEN 'delivered' THEN 'Delivered'
            WHEN 'cancelled' THEN 'Cancelled'
            WHEN 'returned' THEN 'Returned'
            WHEN 'refunded' THEN 'Refunded'
            WHEN 'on_hold' THEN 'On Hold'
            ELSE NEW.ORDER_STATUS
        END;
        
        
        SET notification_message = CASE NEW.ORDER_STATUS
            WHEN 'confirmed' THEN CONCAT(
                'Great news! Your order #', NEW.ID, ' has been confirmed by ', admin_name, 
                ' and is now being prepared for shipping.'
            )
            WHEN 'processing' THEN CONCAT(
                'Your order #', NEW.ID, ' is now being processed. We''ll notify you when it ships!'
            )
            WHEN 'shipped' THEN CONCAT(
                'Exciting news! Your order #', NEW.ID, ' has been shipped and is on its way to you. ',
                'You should receive it soon!'
            )
            WHEN 'delivered' THEN CONCAT(
                'Your order #', NEW.ID, ' has been delivered! We hope you enjoy your books. ',
                'Thank you for choosing BoiToi!'
            )
            WHEN 'cancelled' THEN CONCAT(
                'Your order #', NEW.ID, ' has been cancelled by ', admin_name, '. ',
                'If you have any questions, please contact our support team.'
            )
            WHEN 'returned' THEN CONCAT(
                'Your return request for order #', NEW.ID, ' has been processed. ',
                'Thank you for your patience.'
            )
            WHEN 'refunded' THEN CONCAT(
                'Your refund for order #', NEW.ID, ' has been processed. ',
                'The amount will be credited to your original payment method within 3-5 business days.'
            )
            WHEN 'on_hold' THEN CONCAT(
                'Your order #', NEW.ID, ' has been placed on hold by ', admin_name, '. ',
                'Our team will contact you soon with more information.'
            )
            ELSE CONCAT(
                'Your order #', NEW.ID, ' status has been updated to: ', status_display, ' by ', admin_name
            )
        END;
        
        
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT, URL)
        VALUES (
            NEW.USER_ID,
            notification_message,
            'ORDER',
            0,
            NOW(),
            CONCAT('/orders/', NEW.ID)
        );
        
    END IF;
    
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

-- ----------------------------
-- Triggers structure for table user_address
-- ----------------------------
DROP TRIGGER IF EXISTS `ensure_single_default_update`;
delimiter ;;
CREATE TRIGGER `ensure_single_default_update` AFTER UPDATE ON `user_address` FOR EACH ROW BEGIN
    DECLARE user_default_count INT DEFAULT 0;
    
    
    SELECT COUNT(*) INTO user_default_count
    FROM user_address 
    WHERE USER_ID = NEW.USER_ID AND IS_DEFAULT = 1;
    
    
    IF NEW.IS_DEFAULT = 1 AND OLD.IS_DEFAULT = 0 AND user_default_count > 1 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 0 
        WHERE USER_ID = NEW.USER_ID 
        AND ID != NEW.ID 
        AND IS_DEFAULT = 1;
    END IF;
    
    
    IF user_default_count = 0 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 1 
        WHERE USER_ID = NEW.USER_ID 
        ORDER BY ID ASC 
        LIMIT 1;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table user_address
-- ----------------------------
DROP TRIGGER IF EXISTS `ensure_default_after_delete`;
delimiter ;;
CREATE TRIGGER `ensure_default_after_delete` AFTER DELETE ON `user_address` FOR EACH ROW BEGIN
    DECLARE user_default_count INT DEFAULT 0;
    
    
    SELECT COUNT(*) INTO user_default_count
    FROM user_address 
    WHERE USER_ID = OLD.USER_ID AND IS_DEFAULT = 1;
    
    
    IF user_default_count = 0 THEN
        UPDATE user_address 
        SET IS_DEFAULT = 1 
        WHERE USER_ID = OLD.USER_ID 
        ORDER BY ID ASC 
        LIMIT 1;
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
