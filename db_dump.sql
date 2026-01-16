-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: calendrek
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT '0',
  `g_day` int DEFAULT '-1',
  `g_month` int DEFAULT '-1',
  `h_day` int DEFAULT '-1',
  `h_month` int DEFAULT '-1',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` (`id`, `user_id`, `g_day`, `g_month`, `h_day`, `h_month`, `description`) VALUES (1,0,-1,-1,15,10,'ט\"ו בשבט'),(2,0,-1,-1,10,9,'צום עשרה בטבת'),(3,0,-1,-1,25,8,'א חנוכה'),(4,0,-1,-1,26,8,'ב חנוכה'),(5,0,-1,-1,27,8,'ג חנוכה'),(6,0,-1,-1,28,8,'ד חנוכה'),(7,0,-1,-1,29,8,'ה חנוכה'),(9,0,-1,-1,30,8,'ו חנוכה'),(10,0,-1,-1,1,9,'ז חנוכה'),(11,0,-1,-1,2,9,'ח חנוכה'),(12,0,-1,-1,13,11,'תענית אסתר'),(13,0,-1,-1,14,11,'פורים'),(14,0,-1,-1,15,11,'שושן פורים'),(15,0,-1,-1,14,0,'ערב פסח'),(16,0,-1,-1,15,0,'פסח'),(17,0,-1,-1,16,0,'א דחוה\"מ'),(18,0,-1,-1,17,0,'ב דחוה\"מ'),(19,0,-1,-1,18,0,'ג דחוה\"מ'),(20,0,-1,-1,19,0,'ד דחוה\"מ'),(21,0,-1,-1,20,0,'ה דחוה\"מ'),(22,0,-1,-1,21,0,'שביעי של פסח'),(23,0,-1,-1,22,0,'אסרו חג'),(24,0,-1,-1,27,0,'יום הזיכרון לשואה ולגבורה'),(25,0,-1,-1,4,1,'יום הזיכרון'),(26,0,-1,-1,5,1,'יום העצמאות'),(27,0,-1,-1,17,1,'ערב ל\"ג בעומר'),(28,0,-1,-1,18,1,'ל\"ג בעומר'),(29,0,-1,-1,5,2,'ערב שבועות'),(30,0,-1,-1,6,2,'שבועות'),(31,0,-1,-1,7,2,'אסרו חג'),(32,0,-1,-1,17,3,'צום שבעה עשר בתמוז'),(33,0,-1,-1,8,4,'ערב תשעה באב'),(34,0,-1,-1,9,4,'צום תשעה באב'),(35,0,-1,-1,15,4,'ט\"ו באב'),(36,0,-1,-1,29,5,'ערב ראש השנה'),(37,0,-1,-1,1,6,'ראש השנה'),(38,0,-1,-1,2,6,'ראש השנה'),(39,0,-1,-1,3,6,'צום גדליה'),(40,0,-1,-1,9,6,'ערב יום כיפור'),(41,0,-1,-1,10,6,'יום כיפור'),(42,0,-1,-1,14,6,'ערב סוכות'),(43,0,-1,-1,15,6,'סוכות'),(44,0,-1,-1,16,6,'א דחוה\"מ'),(45,0,-1,-1,17,6,'ב דחוה\"מ'),(46,0,-1,-1,18,6,'ג דחוה\"מ'),(47,0,-1,-1,19,6,'ד דחוה\"מ'),(48,0,-1,-1,20,6,'ה דחוה\"מ'),(49,0,-1,-1,21,6,'הושענא רבה'),(50,0,-1,-1,22,6,'שמחת תורה'),(51,0,-1,-1,23,6,'אסרו חג'),(52,0,-1,-1,24,6,'יום זיכרון לארועי שבעה באוקטובר'),(53,0,-1,-1,12,7,'יום זיכרון ליצחק רבין'),(54,0,-1,-1,24,8,'ערב חנוכה'),(88,1,1,0,-1,-1,'תאריך ראשון לינואר'),(89,1,12,0,-1,-1,'תאריך שני לינואר'),(90,0,21,0,-1,-1,'ארוע כללי לינואר');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `first` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `first`) VALUES (1,'לוינסון',0),(2,'רובין',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-15 12:00:22
