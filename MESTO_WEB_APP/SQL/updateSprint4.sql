ALTER TABLE `site` MODIFY COLUMN `latitude` varchar(11) NOT NULL DEFAULT '';
ALTER TABLE `site` MODIFY COLUMN `longitude` varchar(11) NOT NULL DEFAULT '';

ALTER TABLE `mtuser` 
    ADD `name` VARCHAR(45) NOT NULL ,
    ADD `email` VARCHAR(100) NOT NULL ,
    ADD `title` VARCHAR(45) NOT NULL ,
    ADD `supervisor` VARCHAR(45) NOT NULL ,
    ADD `fk_userRoleId` INT NOT NULL ,
    ADD `active` BOOLEAN NOT NULL ,
    ADD `address` VARCHAR(100) NOT NULL ,
    ADD `phone` VARCHAR(100) NOT NULL ,
    ADD `updateBy` VARCHAR(45) NOT NULL ,
    ADD `updateDate` DATE NOT NULL,
    ADD UNIQUE (`email`)
    CHANGE `password` `password` VARCHAR(100);
    
CREATE TABLE IF NOT EXISTS `userrole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `list_permissions` text COLLATE utf8_unicode_ci NOT NULL,
  `updateBy` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;