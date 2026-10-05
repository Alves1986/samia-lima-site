CREATE TABLE `academy_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_feedback_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_feedback_user_lesson_idx` UNIQUE(`userId`,`lessonId`)
);
