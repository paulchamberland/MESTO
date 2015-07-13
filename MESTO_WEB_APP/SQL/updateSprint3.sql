CREATE TABLE IF NOT EXISTS mtuser (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  password varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username (username)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

INSERT INTO mtuser (username, password) VALUES
('tester', '$2y$10$/Fv/DJJPa6x5.qeEUG5GlOzh88tjrcrTkhjKsiA9DUNRl0PIYOOTW');

ALTER TABLE `site` ADD `pointOfContact` varchar(45) NULL AFTER `role`;
ALTER TABLE `site` ADD `phoneNumberPoC` varchar(12) NULL AFTER `pointOfContact`;

ALTER TABLE `room` ADD `fk_siteId` INT NOT NULL AFTER `roomSize`;

ALTER TABLE `equipment` ADD `fk_roomId` INT NOT NULL AFTER `type`;
ALTER TABLE `equipment` ADD `fk_siteId` INT NOT NULL AFTER `fk_roomId`;