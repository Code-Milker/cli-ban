-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`section` text DEFAULT 'TODO' NOT NULL,
	`created_at` numeric DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` numeric DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `task_attributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`task_id` integer NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tasks_section` ON `tasks` (`section`);--> statement-breakpoint
CREATE INDEX `idx_task_attributes_task_id` ON `task_attributes` (`task_id`);
*/