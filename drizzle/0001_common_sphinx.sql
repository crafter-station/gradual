ALTER TABLE "course" ADD COLUMN "unit_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "section_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "task_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ADD COLUMN "task_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "section_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "task_count" integer DEFAULT 0 NOT NULL;