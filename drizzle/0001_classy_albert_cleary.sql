ALTER TABLE "step_progress" ADD COLUMN "response_duration" real;--> statement-breakpoint
ALTER TABLE "step" ADD COLUMN "parent_step_id" uuid;--> statement-breakpoint
ALTER TABLE "step" ADD COLUMN "correct_response_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "step" ADD COLUMN "incorrect_response_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "step" ADD COLUMN "total_response_duration" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "step" ADD COLUMN "difficulty_score" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "task_progress" ADD COLUMN "correct_steps_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "task_progress" ADD COLUMN "total_response_duration" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "task_progress" ADD COLUMN "relative_difficulty_score" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_parent_step_id_step_id_fk" FOREIGN KEY ("parent_step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;