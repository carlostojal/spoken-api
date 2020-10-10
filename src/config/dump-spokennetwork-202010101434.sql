-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: spokennetwork
-- ------------------------------------------------------
-- Server version	8.0.21-0ubuntu0.20.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `FollowRelations`
--

DROP TABLE IF EXISTS `FollowRelations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FollowRelations` (
  `user` varchar(15) NOT NULL,
  `follows` varchar(15) NOT NULL,
  `create_time` bigint NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  PRIMARY KEY (`follows`,`user`),
  KEY `FollowRelations_FK` (`user`),
  CONSTRAINT `FollowRelations_FK` FOREIGN KEY (`user`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FollowRelations_FK_1` FOREIGN KEY (`follows`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Media`
--

DROP TABLE IF EXISTS `Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Media` (
  `id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `path` varchar(100) NOT NULL,
  `time` bigint NOT NULL,
  `keywords` json DEFAULT NULL,
  `is_nsfw` tinyint(1) DEFAULT NULL,
  `nsfw_cause` varchar(100) DEFAULT NULL,
  `review_status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Media_FK` (`user_id`),
  CONSTRAINT `Media_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PostComments`
--

DROP TABLE IF EXISTS `PostComments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostComments` (
  `id` varchar(15) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `post_id` varchar(15) NOT NULL,
  `time` bigint NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostComments_FK` (`post_id`),
  KEY `PostComments_FK_1` (`user_id`),
  CONSTRAINT `PostComments_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`),
  CONSTRAINT `PostComments_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PostReactions`
--

DROP TABLE IF EXISTS `PostReactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostReactions` (
  `id` varchar(15) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `post_id` varchar(15) NOT NULL,
  `time` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostReactions_FK` (`post_id`),
  KEY `PostReactions_FK_1` (`user_id`),
  CONSTRAINT `PostReactions_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`),
  CONSTRAINT `PostReactions_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PostTopics`
--

DROP TABLE IF EXISTS `PostTopics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PostTopics` (
  `post_id` varchar(15) NOT NULL,
  `topic_id` varchar(15) NOT NULL,
  PRIMARY KEY (`post_id`,`topic_id`),
  KEY `PostTopics_FK_1` (`topic_id`),
  CONSTRAINT `PostTopics_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PostTopics_FK_1` FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `time` bigint NOT NULL,
  `text` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `media_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `original_post_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `edited` tinyint(1) NOT NULL,
  `is_toxic` tinyint(1) DEFAULT NULL,
  `toxic_cause` varchar(20) DEFAULT NULL,
  `review_status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Posts_FK` (`media_id`),
  KEY `Posts_FK_1` (`user_id`),
  KEY `Posts_FK_2` (`original_post_id`),
  CONSTRAINT `Posts_FK` FOREIGN KEY (`media_id`) REFERENCES `Media` (`id`),
  CONSTRAINT `Posts_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Posts_FK_2` FOREIGN KEY (`original_post_id`) REFERENCES `Posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Topics`
--

DROP TABLE IF EXISTS `Topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Topics` (
  `id` varchar(15) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserTopics`
--

DROP TABLE IF EXISTS `UserTopics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTopics` (
  `user_id` varchar(15) NOT NULL,
  `topic_id` varchar(15) NOT NULL,
  PRIMARY KEY (`user_id`,`topic_id`),
  KEY `UserTopics_FK_1` (`topic_id`),
  CONSTRAINT `UserTopics_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserTopics_FK_1` FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(15) NOT NULL,
  `surname` varchar(15) NOT NULL,
  `birthdate` bigint NOT NULL,
  `email` varchar(50) NOT NULL,
  `email_confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `confirmation_code` int NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL,
  `profile_pic_media_id` varchar(15) DEFAULT NULL,
  `profile_type` varchar(10) NOT NULL,
  `profile_privacy_type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `USERNAME_CONSTRAINT` (`username`),
  UNIQUE KEY `EMAIL_CONSTRAINT` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'spokennetwork'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-10 14:34:52
