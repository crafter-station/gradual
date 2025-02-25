ALTER TABLE "step_progress" ADD COLUMN "state" jsonb;--> statement-breakpoint
ALTER TABLE "step_progress" DROP COLUMN "selected_alternative_order";