ALTER TABLE `site` ADD `isTemporary` BOOLEAN NOT NULL DEFAULT FALSE AFTER `postalCode`;
ALTER TABLE `site` ADD `role` varchar(4) NOT NULL DEFAULT '' AFTER `endDate`;
