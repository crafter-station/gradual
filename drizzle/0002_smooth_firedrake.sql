CREATE TABLE "review_step_timing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"base_step_id" uuid NOT NULL,
	"base_task_id" uuid NOT NULL,
	"base_task_progress_id" uuid NOT NULL,
	"base_step_progress_id" uuid NOT NULL,
	"estimated_review_timestamp" timestamp with time zone NOT NULL,
	"reviewed_at" timestamp with time zone,
	"review_step_id" uuid,
	"review_task_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_base_step_id_step_id_fk" FOREIGN KEY ("base_step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_base_task_id_task_id_fk" FOREIGN KEY ("base_task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_base_task_progress_id_task_progress_id_fk" FOREIGN KEY ("base_task_progress_id") REFERENCES "public"."task_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_base_step_progress_id_step_progress_id_fk" FOREIGN KEY ("base_step_progress_id") REFERENCES "public"."step_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_review_step_id_step_id_fk" FOREIGN KEY ("review_step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_step_timing" ADD CONSTRAINT "review_step_timing_review_task_id_task_id_fk" FOREIGN KEY ("review_task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pending_reviews_by_user_idx" ON "review_step_timing" USING btree ("user_id","estimated_review_timestamp") WHERE "review_step_timing"."reviewed_at" is null;