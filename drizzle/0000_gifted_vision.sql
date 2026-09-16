CREATE TABLE `academy_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`eyebrow` varchar(120),
	`description` text NOT NULL,
	`coverUrl` text,
	`level` varchar(80) NOT NULL DEFAULT 'Essencial',
	`durationLabel` varchar(80) NOT NULL DEFAULT 'Conteúdo sob demanda',
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `academy_lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`videoUrl` text,
	`durationLabel` varchar(80),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPreview` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_lessons_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_lessons_course_order_idx` UNIQUE(`courseId`,`sortOrder`)
);
--> statement-breakpoint
CREATE TABLE `academy_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`materialType` enum('pdf','checklist','template','link') NOT NULL DEFAULT 'pdf',
	`url` text,
	`storageKey` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `academy_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `academy_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('active','trial','paused','cancelled') NOT NULL DEFAULT 'active',
	`planName` varchar(120) NOT NULL DEFAULT 'Academy Samia Lima',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_memberships_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_memberships_user_status_idx` UNIQUE(`userId`,`status`)
);
--> statement-breakpoint
CREATE TABLE `academy_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academy_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `academy_progress_user_lesson_idx` UNIQUE(`userId`,`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
