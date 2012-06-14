ALTER TABLE `questions` ADD `project` INT NOT NULL AFTER `id`;
ALTER TABLE `questions` ADD INDEX ( `project` );