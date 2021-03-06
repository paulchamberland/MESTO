SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `activitystream` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `userTitle` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `action` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `concern` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `concernObject` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `concernUnique` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `parent_role` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `parent_info` varchar(55) COLLATE utf8_unicode_ci NOT NULL,
  `isRestrain` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serialNumber` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `barCode` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `manufacturer` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `model` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `configHW` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `configSW` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(4) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `fk_roomId` int(11) NOT NULL,
  `fk_siteId` int(11) NOT NULL,
  `updateBy` varchar(100) NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serialNumber` (`serialNumber`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

INSERT INTO `equipment` (`id`, `serialNumber`, `barCode`, `manufacturer`, `model`, `configHW`, `configSW`, `type`, `fk_roomId`, `fk_siteId`, `updateBy`, `updateDate`) VALUES
(1, 'keep it Alone!', 'keep it Alone!', 'Don''t touch!', 'Don''t touch!', 'Trepasser', 'will be shoot', 'HUB', 0, 0, 'APPs', '2015-05-05');


CREATE TABLE IF NOT EXISTS `mtuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `supervisor` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `fk_userRoleId` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `address` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updateBy` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

INSERT INTO `mtuser` (`username`, `password`, `name`, `email`, `title`, `supervisor`, `fk_userRoleId`, `active`, `approved`, `address`, `phone`, `updateBy`, `updateDate`) VALUES
('tester', '$2y$10$/Fv/DJJPa6x5.qeEUG5GlOzh88tjrcrTkhjKsiA9DUNRl0PIYOOTW', 'Protractor', 'test@mesto.qc.ca', 'e2e engine', 'admin', 1, 1, 1, '', '', 'APPs', '2015-06-10'),
('admin', '$2y$10$6hT4.sStVXVO3G7vJbZRgeTk8yBOHtKjZPtxMOJBF8mA6FwM3Xzua', 'Administrator', 'admin@mesto.qc.ca', 'Main logger', '', 1, 1, 1, '', '', 'APPs', '2015-05-27'),
('jobeen', '$2y$10$11G28nlN.NcW6XtKNS8x0Od3Mi8/fjrFte0DvUixLp18gxQk.fEri', 'Jonathan', 'jonathan-lefebvre_mdn@hotmail.com', 'Developer', '', 1, 1, 1, '', '555-555-1010', 'APPs', '2015-06-18');

CREATE TABLE IF NOT EXISTS `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomID` varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `pointOfContact` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `technicalPointOfContact` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(4) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `roomSize` int(11) NOT NULL,
  `fk_siteId` int(11) NOT NULL,
  `updateBy` varchar(100) NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roomID` (`roomID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

INSERT INTO `room` (`roomID`, `pointOfContact`, `technicalPointOfContact`, `role`, `roomSize`, `fk_siteId`, `updateBy`, `updateDate`) VALUES
('Keep it Alone!', 'Keep it Alone!', 'Keep it Alone!', 'MTC', 0, 0, 'APPs', '2015-05-28');

CREATE TABLE IF NOT EXISTS `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(11) NOT NULL DEFAULT '',
  `longitude` varchar(11) NOT NULL DEFAULT '',
  `siteName` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `province` varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `postalCode` varchar(7) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `isTemporary` tinyint(1) NOT NULL DEFAULT '0',
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `role` varchar(4) NOT NULL DEFAULT '',
  `pointOfContact` varchar(45) DEFAULT NULL,
  `phoneNumberPoC` varchar(13) DEFAULT NULL,
  `techPoC` varchar(55) NOT NULL,
  `phoneTechPoC` varchar(13) NOT NULL,
  `employesNumber` int(11) NOT NULL,
  `organization` varchar(4) NOT NULL,
  `updateBy` varchar(100) NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference` (`reference`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

INSERT INTO `site` (`siteName`, `address`, `city`, `postalCode`, `province`, `organization`, `employesNumber`, `reference`, `latitude`, `longitude`, `pointOfContact`, `phoneNumberPoC`, `techPoC`, `phoneTechPoC`, `role`, `updateBy`, `updateDate`) VALUES
('Gaspe-Reine-01', '98 rue de la Reine', 'Gaspe', 'G4X 3B3', 'QC', 'TC', '2', 'GASPER1', '48.830924', '-64.481599', 'Simon Pelletier', '418-368-2444', 'Eric D''Amours', '418-368-1635', 'ED', 'DUMP', now()),
('Quebec-101Champlain-02', '101 boul. Champlain', 'Quebec', 'G1K 4H9', 'QC', 'TC', '21', 'QUEASR1A', '46.809376', '-71.203283', 'Josee Brousseau', '418-648-7486', 'eric C', '418-648-3235', 'ED', 'DUMP', now()),
('Quebec-D''Estimauville-02', '1550 D''Estimauville Ave.', 'Quebec', 'G1J 0C8', 'QC', 'TC', '100', 'QUESTR1', '46.843433', '-71.212510', 'Guy Asselin', '418-640-2925', 'Help Desk', '418-648-7400', 'ED', 'DUMP', now()),
('SeptIsles-Airport-02', 'Lat 50? 13'' 24 N  Long -66? 15'' 56" W', 'Sept-Iles', 'G4R 4K2', 'QC', 'TC', '17', 'SEPTIR2A', '50.223333', '-66.265556', 'Karen Young', '418-962-8212', 'Pascal Gagnon', '418-962-8211', 'ED', 'DUMP', now()),
('Blaineville-duLandais-01', '100 rue du Landais', 'Blainville', 'J7C 5C9', 'QC', 'TC', '3', 'BLASDR1A', '45.696536', '-73.867033', 'Quoc-Nam Tran', '450-430-7270', 'Lucie Perreault', '450-430-6968', 'ED', 'DUMP', now()),
('Longueuil-StCharles03', '1111 rue St. Charles O.', 'Longueuil', 'J4K 5G4', 'QC', 'TC', '5', 'LONASR1', '45.526284', '-73.519726', 'Carole Lanthier', '450-928-4375', 'Edith Caron', '450-928-4374', 'ED', 'DUMP', now()),
('Dorval-AlbertNiverville-01', '590 rue Albert-de-Niveville', 'Dorval', 'H4Y 1G6', 'QC', 'TC', '21', 'DORVLR3A', '45.452568', '-73.752558', 'Suzanne Gallant', '514-633-3412', 'Pierre Senneville', '514-633-3410', 'ED', 'DUMP', now()),
('Dorval-LeighCapreol-0B Primary', '700 rue Leigh Capreol', 'Dorval', 'H4Y 1G7', 'QC', 'TC', '305', 'DORVLR1B', '45.454486', '-73.752176', 'Stephane Tellier', '514-633-3954', 'Help Desk', '514-633-3121', 'ED', 'DUMP', now()),
('Dorval-LeighCapreol-0B Back-up', '700 rue Leigh Capreol', 'Dorval', 'H4Y 1G7', 'QC', 'TC', '305', 'DORVLR2A', '45.454486', '-73.752176', 'Stephane Tellier', '514-633-3954', 'Help Desk', '514-633-3121', 'ED', 'DUMP', now()),
('Montreal-999Universite-05', '999 Ave. Universite', 'Montreal', 'H3B 1X9', 'QC', 'TC', '7', 'MICAOR1A', '45.509265', '-73.609668', 'Sylvie Gendron', '514-954-5802', 'Mourad Touhami', '514-283-0080', 'ED', 'DUMP', now()),
('Rimouski-180Cathedral-3', '180 Ave. de la Cathedrale', 'Rimouski', 'G5L5H9', 'QC', 'TC', '12', 'RMSKIR1A', '48.449823', '-68.525553', 'Robert Fecteau', '418-722-3172', 'Brigitte Pouliot', '418-722-3041', 'ED', 'DUMP', now()),
('SeptIles-701Laure-2', '701 boul. Laure', 'Sept-Iles', 'G4R 1X8', 'QC', 'TC', '5', 'SEPTIR1B', '50.218541', '-66.383208', 'Sindie Wright', '418-968-4991', 'Denis Rodrigue', '418-968-4898', 'ED', 'DUMP', now()),
('Montreal-800ReneLevesque-2', '800 boul. Rene Levesque O.', 'Montreal', 'H3B 1X9', 'QC', 'TC', '65', 'MONTRR1A', '45.500951', '-73.567595', 'Mourad Touhami', '514-283-0080', 'Pierre Plamondon', '514-496-2094', 'ED', 'DUMP', now()),
('Alma-100StJoseph-01', '100 rue St-Joseph Bureau 6 Complexe Jacques Gagnon', 'Alma', 'G8B 7A6', 'QC', 'TC', '2', 'ALMAR2', '48.549912', '-71.652221', 'Nicole Baron', '418-669-0529', 'Bruno Landry', '418-669-0333', 'ED', 'DUMP', now()),
('CapauxMeules-264 du Quai-01', '264 Chemin du Quai', 'Cap aux Meules', 'G4T 1J4', 'QC', 'TC', '4', 'CAPAUR1', '47.379637', '-61.859865', 'Johanne Lebel', '418-937-7635', 'Ginette Gallant', '418-986-3785', 'ED', 'DUMP', now()),
('3R22eR', '366 rue Chass', 'Saint-Gabriel-de-valcartier', 'G0A 4Z0', 'QC', 'DND', '240', '3R22eR', '46.895874', '-71.481882', '', '', '', '', 'ED', 'DUMP', now()),
('Garnison Valcartier', '', '', '', 'QC', 'DND', '6000', 'Garnison Valcartier', '46.892648', '-71.494036', '', '', '', '', 'ED', 'DUMP', now()),
('334-Noeud-Principal-Valcartier', 'Rue du General tremblay', 'CFB Valcartier', 'G0A 4Z0', 'QC', 'DND', '', '334-Noeud-Principal-Valcartier', '46.892142', '-71.496533', '', '', '', '', 'ED', 'DUMP', now()),
('Garnison Montreal', '', '', '', 'QC', 'DND', '', 'Garnison Montreal', '45.575760', '-73.527934', '', '', '', '', 'ED', 'DUMP', now()),
('Garnison st-Jean', '', '', '', 'QC', 'DND', '', 'Garnison st-Jean', '45.300775', '-73.281156', '', '', '', '', 'ED', 'DUMP', now()),
('Garnison Farnham', '', 'Sainte-brigitte-d''iberville', 'J0J 1X0', 'QC', 'DND', '', 'Garnison Farnham', '45.304780', '-73.010355', '', '', '', '', 'ED', 'DUMP', now()),
('CFB Bagotville', '7000 Chemin de l''aeroport', 'LaBaie', 'G7B 0E4', 'QC', 'DND', '', 'CFB Bagotville', '48.333124', '-70.995511', '', '', '', '', 'ED', 'DUMP', now()),
('QG 35 GBC', '3 Cote de la Citadelle', 'Quebec', 'G1R 3R2', 'QC', 'DND', '', 'QG 35 GBC', '46.808737', '-71.211135', '', '', '', '', 'ED', 'DUMP', now()),
('QG RESERVE Navale', '144 Rue Dalhousie', 'Quebec', 'G1K 4C4', 'QC', 'DND', '', 'QG RESERVE Navale', '46.817649', '-71.202243', '', '', '', '', 'ED', 'DUMP', now()),
('QG 2 Div', '', '', '', 'QC', 'DND', '', 'QG 2 Div', '45.578296', '-73.530962', '', '', '', '', 'ED', 'DUMP', now()),
('25 DAFC', '', '', '', 'QC', 'DND', '', '25 DAFC', '45.574500', '-73.526344', '', '', '', '', 'ED', 'DUMP', now()),
('202 Workshop', '', '', '', 'QC', 'DND', '', '202 Workshop', '45.577489', '-73.524743', '', '', '', '', 'ED', 'DUMP', now()),
('3CSU', '', '', '', 'QC', 'DND', '', '3CSU', '45.576296', '-73.522617', '', '', '', '', 'ED', 'DUMP', now()),
('438 ETAH', '5700 Route de l''aeroport', 'Longueuil', 'J3Y 8Y9', 'QC', 'DND', '60', '438 ETAH', '45.518030', '-73.425044', '', '', '', '', 'ED', 'DUMP', now()),
('CRFC Quebec', 'Boulv Laurier', 'Sainte-Foy', '', 'QC', 'DND', '100', 'CRFC Quebec', '46.766088', '-71.292551', '', '', '', '', 'ED', 'DUMP', now()),
('2R22eR-Citadelle', 'Cote de la Citadelle', 'Quebec', 'G1R 3R2', 'QC', 'DND', '50', '2R22eR-Citadelle', '46.806749', '-71.206372', '', '', '', '', 'ED', 'DUMP', now()),
('5 BNS du Canada', '', 'CFB Valcartier', 'G0A 4Z0', 'QC', 'DND', '', '5 BNS du Canada', '46.895565', '-71.485512', '', '', '', '', 'ED', 'DUMP', now()),
('QG RCMP Div C', '4225 Rue Dochester', 'Westmount', '', 'QC', 'RCMP', '', 'QG RCMP Div C', '45.485515', '-73.587733', '', '', '', '', 'ED', 'DUMP', now()),
('Agence Spatiale Canadiene', '6767, Route de l''aeroport', 'Saint-Hubert', '', 'QC', 'ASC', '700', 'Agence Spatiale Canadiene', '45.520051', '-73.393554', '', '', '', '', 'ED', 'DUMP', now()),
('Centre de formation federal - SCC', '205 montee St-Francois', 'Laval', '', 'QC', 'CSC', '', 'Centre de formation federal - SCC', '45.619574', '-73.645257', '', '', '', '', 'ED', 'DUMP', now()),
('Etablissement St-Francois', '600 Montee St-Francois', 'Laval', 'H7C 1S5', 'QC', 'CSC', '', 'Etablissement St-Francois', '45.619424', '-73.650740', '', '', '', '', 'ED', 'DUMP', now()),
('Etablissement de Donnacona (Max.)', '1537 route 138', 'Donnacona', 'G3M 1C9', 'QC', 'CSC', '', 'Etablissement de Donnacona (Max.)', '46.680334', '-71.672106', '', '', '', '', 'ED', 'DUMP', now()),
('Etablissement de Port-Cartier (Max.)', 'Chemin de l''aeroport', 'Port-Cartier', '', 'QC', 'CSC', '', 'Etablissement de Port-Cartier (Max.)', '50.054753', '-66.885925', '', '', '', '', 'ED', 'DUMP', now());

CREATE TABLE IF NOT EXISTS `userrole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `list_permissions` text COLLATE utf8_unicode_ci NOT NULL,
  `updateBy` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `updateDate` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=372 ;

INSERT INTO `userrole` (`id`, `name`, `description`, `list_permissions`, `updateBy`, `updateDate`) VALUES
(1, 'Admin', 'Admin get all access everywhere in Mesto', 'adminAccess,deleteRole,deleteUser,deleteEquip,deleteRoom,deleteSite,updateRole,chgPWDUser,updateUser,updateEquip,updateRoom,updateSite,createRole,createUser,createEquip,createRoom,createSite,detailRoom,detailEquip,detailSite', 'apps', '2015-05-27');
