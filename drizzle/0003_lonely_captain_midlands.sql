ALTER TABLE "review_step_timing" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "review_step_timing" CASCADE;--> statement-breakpoint
ALTER TABLE "step_progress" ALTER COLUMN "response_duration" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "step" ALTER COLUMN "task_id" DROP NOT NULL;