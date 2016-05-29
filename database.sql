SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `race_evaluation`;
CREATE TABLE `race_evaluation` (
  `vehicle_id` int(11) unsigned NOT NULL,
  `race_id` int(11) unsigned NOT NULL,
  `station` int(11) unsigned NOT NULL,
  `time` time(3) NOT NULL,
  `correct_station_order` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`vehicle_id`,`race_id`,`station`),
  KEY `vehicle` (`vehicle_id`),
  KEY `station` (`race_id`, `station`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;