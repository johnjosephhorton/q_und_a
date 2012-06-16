ALTER TABLE `answers` ADD `user` INT NOT NULL AFTER `question`;
ALTER TABLE `answers` ADD INDEX ( `user` );