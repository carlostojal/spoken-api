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
-- Table structure for table `Media`
--

DROP TABLE IF EXISTS `Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Media` (
  `id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `path` varchar(100) NOT NULL,
  `time` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Media_FK` (`user_id`),
  CONSTRAINT `Media_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Media`
--

LOCK TABLES `Media` WRITE;
/*!40000 ALTER TABLE `Media` DISABLE KEYS */;
/*!40000 ALTER TABLE `Media` ENABLE KEYS */;
UNLOCK TABLES;

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
  `time` int NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostComments_FK` (`post_id`),
  KEY `PostComments_FK_1` (`user_id`),
  CONSTRAINT `PostComments_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`),
  CONSTRAINT `PostComments_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostComments`
--

LOCK TABLES `PostComments` WRITE;
/*!40000 ALTER TABLE `PostComments` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostComments` ENABLE KEYS */;
UNLOCK TABLES;

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
  `time` int NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostReactions_FK` (`post_id`),
  KEY `PostReactions_FK_1` (`user_id`),
  CONSTRAINT `PostReactions_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`),
  CONSTRAINT `PostReactions_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostReactions`
--

LOCK TABLES `PostReactions` WRITE;
/*!40000 ALTER TABLE `PostReactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostReactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `time` int NOT NULL,
  `text` text NOT NULL,
  `media_id` varchar(15) NOT NULL,
  `original_post_id` varchar(15) NOT NULL,
  `edited` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Posts_FK` (`media_id`),
  KEY `Posts_FK_1` (`user_id`),
  CONSTRAINT `Posts_FK` FOREIGN KEY (`media_id`) REFERENCES `Media` (`id`),
  CONSTRAINT `Posts_FK_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2020-09-26 16:57:47
