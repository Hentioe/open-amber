CREATE TABLE `records` (
	`id` integer PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`site_name` text NOT NULL,
	`site_domain` text NOT NULL,
	`site_home` text NOT NULL,
	`site_info` text,
	`site_owner` text NOT NULL,
	`site_status` text DEFAULT 'open' NOT NULL,
	`site_modify` integer NOT NULL,
	`owner_email` text NOT NULL,
	`review_status` text DEFAULT 'pending' NOT NULL,
	`inserted_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `records_siteId_unique` ON `records` (`site_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `records_siteDomain_unique` ON `records` (`site_domain`);