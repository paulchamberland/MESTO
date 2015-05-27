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

--
-- Contenu de la table `mtuser`
--

INSERT INTO `mtuser` (`id`, `username`, `password`, `name`, `email`, `title`, `supervisor`, `fk_userRoleId`, `active`, `address`, `phone`, `updateBy`, `updateDate`) VALUES
(9, 'tester', '$2y$10$/Fv/DJJPa6x5.qeEUG5GlOzh88tjrcrTkhjKsiA9DUNRl0PIYOOTW', 'Protractor', 'test@mesto.qc.ca', 'e2e engine', '', 1, 1, '', '', 'apps', '2015-05-20'),
(121, 'admin', '$2y$10$6hT4.sStVXVO3G7vJbZRgeTk8yBOHtKjZPtxMOJBF8mA6FwM3Xzua', 'Administrator', 'admin@mesto.qc.ca', 'Main logger', '', 1, 1, '', '', 'apps', '2015-05-27');

INSERT INTO `userrole` (`id`, `name`, `description`, `list_permissions`, `updateBy`, `updateDate`) VALUES
(1, 'Admin', 'Admin get all access everywhere in Mesto', 'adminAccess,deleteRole,deleteUser,deleteEquip,deleteRoom,deleteSite,updateRole,chgPWDUser,updateUser,updateEquip,updateRoom,updateSite,createRole,createUser,createEquip,createRoom,createSite,detailRoom,detailEquip,detailSite', 'apps', '2015-05-27');
