SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:00";
CREATE DATABASE IF NOT EXISTS mesto DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE mesto;

DROP TABLE IF EXISTS site;
CREATE TABLE IF NOT EXISTS site (
  id int(11) NOT NULL AUTO_INCREMENT,
  reference varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  latitude varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  longitude varchar(9) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  siteName varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  description text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  address varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  city varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  province varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  country varchar(55) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  postalCode varchar(7) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  startDate date DEFAULT NULL,
  endDate date DEFAULT NULL,
  updateBy varchar(100) NOT NULL,
  updateDate date NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY reference (reference),
  FULLTEXT KEY description (description)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

TRUNCATE TABLE site;
INSERT INTO site (id, reference, latitude, longitude, siteName, description, address, city, province, country, postalCode, startDate, endDate, updateBy, updateDate) VALUES
(1, 'ti38dk', '40.322399', '21.212199', 'a building test', 'long description about this building who gives some details that any other field could not give, like the purpose of the building, special caracteristics', '2020 Du finfin', 'Jackson', 'quebec', 'canada', 'H0H 0H0', '1999-01-01', '2099-01-01', 'sql data', '2015-03-20');
