 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
 
 DROP SCHEMA IF EXISTS `ziksee` ;
 CREATE SCHEMA IF NOT EXISTS `ziksee` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
 USE `ziksee` ;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` varchar(24) NOT NULL,
  `userName` varchar(16) NOT NULL,
  `userPenName` varchar(16) NOT NULL DEFAULT 'NA',
  `startDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `place`
--

DROP TABLE IF EXISTS `place`;

CREATE TABLE `place` (
  `placeId` int(11) NOT NULL AUTO_INCREMENT,
  `placeName` varchar(32) NOT NULL,
  `placeLat` float(9,6) NOT NULL,
  `placeLon` float(9,6) NOT NULL,
  PRIMARY KEY (`placeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `postId` int(16) NOT NULL AUTO_INCREMENT,
  `postUserId` varchar(24) NOT NULL,
  `postText` varchar(128) DEFAULT NULL,
  `postImage` varchar(64) NOT NULL,
  `postTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postLat` float(9,6) NOT NULL,
  `postLon` float(9,6) NOT NULL,
  PRIMARY KEY (`postId`),
  KEY `postUserId` (`postUserId`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`postUserId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `commentId` int(11) NOT NULL AUTO_INCREMENT,
  `commentUserId` varchar(24) NOT NULL,
  `commentPostId` int(11) NOT NULL,
  `commentText` varchar(120) NOT NULL,
  `commentTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentId`),
  KEY `commentPostId` (`commentPostId`),
  KEY `commentUserId` (`commentUserId`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`commentUserId`) REFERENCES `user` (`userId`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`commentPostId`) REFERENCES `post` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;

CREATE TABLE `follow` (
  `userId` varchar(24) NOT NULL,
  `followId` varchar(24) NOT NULL,
  PRIMARY KEY (`userId`,`followId`),
  KEY `followId` (`followId`),
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`followId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;

CREATE TABLE `tag` (
  `tagId` varchar(32) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `zipcode`
--

DROP TABLE IF EXISTS `zipcode`;
CREATE TABLE `zipcode` (
  `zipcodeId` int(11) NOT NULL,
  PRIMARY KEY (`zipcodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `tag_in_zipcode`
--

DROP TABLE IF EXISTS `tag_in_zipcode`;

CREATE TABLE `tag_in_zipcode` (
  `tagId` varchar(32) NOT NULL,
  `zipcodeId` int(11) NOT NULL,
  PRIMARY KEY (`tagId`,`zipcodeId`),
  KEY `zipcodeId` (`zipcodeId`),
  CONSTRAINT `tag_in_zipcode_ibfk_1` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`),
  CONSTRAINT `tag_in_zipcode_ibfk_2` FOREIGN KEY (`zipcodeId`) REFERENCES `zipcode` (`zipcodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_like_coment`
--

DROP TABLE IF EXISTS `user_like_coment`;

CREATE TABLE `user_like_coment` (
  `userId` varchar(24) NOT NULL,
  `commentId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`commentId`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `user_like_coment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_like_coment_ibfk_2` FOREIGN KEY (`commentId`) REFERENCES `comment` (`commentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_like_place`
--

DROP TABLE IF EXISTS `user_like_place`;

CREATE TABLE `user_like_place` (
  `userId` varchar(24) NOT NULL,
  `placeId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`placeId`),
  KEY `placeId` (`placeId`),
  CONSTRAINT `user_like_place_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_like_place_ibfk_2` FOREIGN KEY (`placeId`) REFERENCES `place` (`placeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_like_post`
--

DROP TABLE IF EXISTS `user_like_post`;

CREATE TABLE `user_like_post` (
  `userId` varchar(24) NOT NULL,
  `postId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`postId`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  CONSTRAINT `user_like_post_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_like_post_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `post` (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_like_tag`
--

DROP TABLE IF EXISTS `user_like_tag`;

CREATE TABLE `user_like_tag` (
  `userId` varchar(24) NOT NULL,
  `tagId` varchar(32) NOT NULL,
  PRIMARY KEY (`userId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `user_like_tag_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_like_tag_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_like_zipcode`
--

DROP TABLE IF EXISTS `user_like_zipcode`;

CREATE TABLE `user_like_zipcode` (
  `userId` varchar(16) NOT NULL,
  `zipcodeId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`zipcodeId`),
  KEY `zipcodeId` (`zipcodeId`),
  CONSTRAINT `user_like_zipcode_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_like_zipcode_ibfk_2` FOREIGN KEY (`zipcodeId`) REFERENCES `zipcode` (`zipcodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `user_read_post`
--

DROP TABLE IF EXISTS `user_read_post`;

CREATE TABLE `user_read_post` (
  `userId` varchar(16) NOT NULL,
  `postId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`postId`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  CONSTRAINT `user_read_post_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_read_post_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `post` (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `userlog`
--

DROP TABLE IF EXISTS `userlog`;

CREATE TABLE `userlog` (
  `logId` int(11) NOT NULL AUTO_INCREMENT,
  `logTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logUserId` varchar(16) NOT NULL,
  `logActivity` char(1) NOT NULL,
  `logLatitude` float(9,6) NOT NULL,
  `logLongitude` float(9,6) NOT NULL,
  PRIMARY KEY (`logId`),
  KEY `logUserId` (`logUserId`),
  CONSTRAINT `userlog_ibfk_1` FOREIGN KEY (`logUserId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
