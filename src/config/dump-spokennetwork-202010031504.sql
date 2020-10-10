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
-- Dumping data for table `FollowRelations`
--

LOCK TABLES `FollowRelations` WRITE;
/*!40000 ALTER TABLE `FollowRelations` DISABLE KEYS */;
INSERT INTO `FollowRelations` VALUES ('40lE1LL39q1Iv7Q','qdjb1qz4gWghtEP',1601299774417,1);
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
-- Dumping data for table `PostTopics`
--

LOCK TABLES `PostTopics` WRITE;
/*!40000 ALTER TABLE `PostTopics` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostTopics` ENABLE KEYS */;
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
  `time` bigint NOT NULL,
  `text` text NOT NULL,
  `media_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `original_post_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `edited` tinyint(1) NOT NULL,
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
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES ('Tw0AbdIcCNWtGRw','40lE1LL39q1Iv7Q',1601492237604,'Test',NULL,NULL,0);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Topics`
--

LOCK TABLES `Topics` WRITE;
/*!40000 ALTER TABLE `Topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `Topics` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `UserTopics`
--

LOCK TABLES `UserTopics` WRITE;
/*!40000 ALTER TABLE `UserTopics` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserTopics` ENABLE KEYS */;
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
INSERT INTO `Users` VALUES ('40lE1LL39q1Iv7Q','Carlos','Tojal',1070064000000,'carlos.tojal@hotmail.com',1,2726,'carlostojal','$2b$10$WYxzOBFS4FF1uP5bRCizwuPYIDoIbsNRYgENr6yVk6pk00xOj.2/G',NULL,'personal','private'),('qdjb1qz4gWghtEP','Carlos','Tojal',1070064000000,'carlos.tojal1@hotmail.com',1,3815,'carlostojal1','$2b$10$jUY/0.PU6qWWL/BxqNKCHOn7v2aMHywPeI/AopccmbQnxj7plbpEy',NULL,'personal','private');
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

-- Dump completed on 2020-10-03 15:04:25
