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


DROP TABLE IF EXISTS `race_registration`;
CREATE TABLE `race_registration` (
  `vehicle_id` int(11) unsigned NOT NULL,
  `race_id` int(11) unsigned NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`vehicle_id`,`race_id`),
  KEY `vehicle` (`vehicle_id`),
  KEY `race` (`race_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `race_qualification`;
CREATE TABLE `race_qualification` (
  `vehicle_id` int(11) unsigned NOT NULL,
  `race_id` int(11) unsigned NOT NULL,
  `time` time(3) NOT NULL,
  `status` enum('UNQUALIFIED','QUALIFIED','DISQUALIFIED') NOT NULL DEFAULT 'UNQUALIFIED',
  PRIMARY KEY (`vehicle_id`,`race_id`),
  KEY `vehicle` (`vehicle_id`),
  KEY `race` (`race_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `race_station`;
CREATE TABLE `race_station` (
  `race_id` int(11) unsigned NOT NULL,
  `station` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`race_id`,`station`),
  KEY `race` (`race_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `user` (`is_admin`, `driver_license`, `firstname`, `lastname`, `login`, `password`) VALUES
(1, 1, 'Lukas', 'Quast', 'quast', '123'),
(1, 1, 'Lukas', 'Kropp', 'kropp', '123');


DROP TABLE IF EXISTS `vehicle`;
CREATE TABLE `vehicle` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `year` int(4) unsigned NOT NULL,
  `capacity_ccm` int(5) unsigned NOT NULL,
  `power_kw` int(4) unsigned NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  `owner_id` int(11) unsigned NOT NULL,
  `driver_id` int(11) unsigned NOT NULL,
  `passenger_id` int(11) unsigned NOT NULL,
  `mechanic_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team` (`driver_id`,`passenger_id`,`mechanic_id`, `category_id`),
  KEY `category` (`category_id`),
  KEY `owner` (`owner_id`),
  KEY `driver` (`driver_id`),
  KEY `passenger` (`passenger_id`),
  KEY `mechanic` (`mechanic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `vehicle_category`;
CREATE TABLE `vehicle_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `race_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `qualifying_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;