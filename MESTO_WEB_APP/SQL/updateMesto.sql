ALTER TABLE `site` ADD `isTemporary` BOOLEAN NOT NULL DEFAULT FALSE AFTER `postalCode`;
ALTER TABLE `site` ADD `role` varchar(4) NOT NULL DEFAULT '' AFTER `endDate`;

DROP TABLE IF EXISTS room;
CREATE TABLE IF NOT EXISTS room (
  id int(11) NOT NULL AUTO_INCREMENT,
  roomID varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  pointOfContact varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  technicalPointOfContact varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  role varchar(4) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  roomSize int(11) NOT NULL,
  updateBy varchar(100) NOT NULL,
  updateDate date NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY roomID (roomID)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;