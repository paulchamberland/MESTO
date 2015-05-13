ALTER TABLE `site` MODIFY COLUMN `latitude` varchar(11) NOT NULL DEFAULT '';
ALTER TABLE `site` MODIFY COLUMN `longitude` varchar(11) NOT NULL DEFAULT '';

ALTER TABLE `mtuser` 
    ADD `name` VARCHAR(45) NOT NULL ,
    ADD `email` VARCHAR(100) NOT NULL ,
    ADD `title` VARCHAR(45) NOT NULL ,
    ADD `supervisor` VARCHAR(45) NOT NULL ,
    ADD `role` VARCHAR(45) NOT NULL ,
    ADD `active` BOOLEAN NOT NULL ,
    ADD `address` VARCHAR(100) NOT NULL ,
    ADD `phone` VARCHAR(100) NOT NULL ,
    ADD `updateBy` VARCHAR(45) NOT NULL ,
    ADD `updateDate` DATE NOT NULL,
    ADD UNIQUE (`email`)
    CHANGE `password` `password` VARCHAR(100);