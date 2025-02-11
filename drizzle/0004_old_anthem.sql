ALTER TABLE "task_progress" RENAME COLUMN "current_step_id" TO "last_completed_step_id";--> statement-breakpoint
ALTER TABLE "task_progress" DROP CONSTRAINT "task_progress_current_step_id_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_last_completed_step_id_steps_id_fk" FOREIGN KEY ("last_completed_step_id") REFERENCES "public"."steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" DROP COLUMN "earned_experience_points";--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN "experience_points";