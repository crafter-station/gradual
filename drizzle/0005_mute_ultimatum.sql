ALTER TABLE "task_progress" ADD COLUMN "steps_completed_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "steps_count" integer NOT NULL;