CREATE TYPE "public"."step_type" AS ENUM('TUTORIAL', 'EXAMPLE', 'QUESTION');--> statement-breakpoint
CREATE TABLE "steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "step_type" NOT NULL,
	"order" integer NOT NULL,
	"content" jsonb NOT NULL,
	"task_id" uuid NOT NULL
);
--> statement-breakpoint
DROP TABLE "example_steps" CASCADE;--> statement-breakpoint
DROP TABLE "question_steps" CASCADE;--> statement-breakpoint
DROP TABLE "tutorial_steps" CASCADE;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "steps_order_task_id_unique" ON "steps" USING btree ("order","task_id");