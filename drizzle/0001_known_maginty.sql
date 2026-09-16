CREATE TABLE `academy_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `academy_modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_modules_course_order_idx` UNIQUE(`courseId`,`sortOrder`)
);
--> statement-breakpoint
ALTER TABLE `academy_lessons` ADD `moduleId` int NOT NULL;