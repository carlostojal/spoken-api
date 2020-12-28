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
  CONSTRAINT `FollowRelations_Follows` FOREIGN KEY (`follows`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FollowRelations_User` FOREIGN KEY (`user`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FollowRelations`
--

LOCK TABLES `FollowRelations` WRITE;
/*!40000 ALTER TABLE `FollowRelations` DISABLE KEYS */;
INSERT INTO `FollowRelations` VALUES ('mM8MDIkJNlQbKlD','mM8MDIkJNlQbKlD',1602340662572,1),('rKRS7vfvXyAfc0g','rKRS7vfvXyAfc0g',1603583429887,1);
/*!40000 ALTER TABLE `FollowRelations` ENABLE KEYS */;
UNLOCK TABLES;

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
  CONSTRAINT `Media_Users` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `time` bigint NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostComments_FK` (`post_id`),
  KEY `PostComments_FK_1` (`user_id`),
  CONSTRAINT `PostComments_Posts` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PostComments_Users` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `time` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PostReactions_FK` (`post_id`),
  KEY `PostReactions_FK_1` (`user_id`),
  CONSTRAINT `PostReactions_Posts` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PostReactions_Users` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostReactions`
--

LOCK TABLES `PostReactions` WRITE;
/*!40000 ALTER TABLE `PostReactions` DISABLE KEYS */;
INSERT INTO `PostReactions` VALUES ('ovziP6TKK6km4Nu','mM8MDIkJNlQbKlD','uiQI0oWxpdf7NEq',1603022878223),('xWR0wFf5ttBkS4G','mM8MDIkJNlQbKlD','qGEP9shTFzC70Ii',1603032437595);
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
  `user_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
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
  CONSTRAINT `Posts_Media` FOREIGN KEY (`media_id`) REFERENCES `Media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Posts_OriginalPost` FOREIGN KEY (`original_post_id`) REFERENCES `Posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Posts_Users` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES ('qGEP9shTFzC70Ii','mM8MDIkJNlQbKlD',1602699523468,'Hello 2',NULL,NULL,0,NULL,NULL,NULL),('SINkz6tklpBTm7U','mM8MDIkJNlQbKlD',1602699401929,'Hello 1',NULL,NULL,0,NULL,NULL,NULL),('uiQI0oWxpdf7NEq','mM8MDIkJNlQbKlD',1602699164255,'Hello',NULL,NULL,0,NULL,NULL,NULL);
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
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('mM8MDIkJNlQbKlD','Carlos','Tojal',1070064000000,'carlos.tojal@hotmail.com',1,9000,'carlostojal','$2b$10$gB2UVfAj9MerOR0jpNu.OO8vcrN26h.tKJGyKKu/PWz5iy..Ci1xW',NULL,'personal','private'),('rKRS7vfvXyAfc0g','Test','Test',1603583367525,'test@test.com',1,9874,'test','$2b$10$d3YFtl3RC76RtPg3Zxq8auFHUNUrtpgT27p2PBdXic7tG8UzlzN06',NULL,'personal','public');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2020-11-03 21:42:06
