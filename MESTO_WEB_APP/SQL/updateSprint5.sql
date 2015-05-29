ALTER TABLE `site`
    ADD `techPoC` VARCHAR(55) NOT NULL AFTER `phoneNumberPoC`,
    ADD `phoneTechPoC` VARCHAR(10) NOT NULL AFTER `techPoC`,
    ADD `employesNumber` INT(11) NOT NULL AFTER `phoneTechPoC`,
    ADD `organization` VARCHAR(4) NOT NULL AFTER `employesNumber`;