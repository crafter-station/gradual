CREATE TYPE "public"."SOURCE_TYPE_ENUM" AS ENUM('FILE', 'URL');--> statement-breakpoint
CREATE TYPE "public"."STEP_TYPE_ENUM" AS ENUM('INTRODUCTION', 'DEFINITION', 'ANALOGY', 'TUTORIAL', 'SOLVED_EXERCISE', 'FUN_FACT', 'QUOTE', 'QUESTION', 'FILL_IN_THE_BLANK', 'MULTIPLE_CHOICE', 'BINARY');--> statement-breakpoint
CREATE TYPE "public"."TASK_TYPE_ENUM" AS ENUM('LESSON', 'QUIZ', 'MULTISTEP');--> statement-breakpoint
CREATE TABLE "chunk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"summary" text DEFAULT 'Default summary' NOT NULL,
	"raw_content" text DEFAULT 'Default raw content' NOT NULL,
	"enriched_content" text DEFAULT 'Default enriched content' NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"creator_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"unit_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "SOURCE_TYPE_ENUM" NOT NULL,
	"file_path" text NOT NULL,
	"creator_id" uuid NOT NULL,
	"course_id" uuid,
	"summary" text NOT NULL,
	"chunks_count" integer DEFAULT 0 NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "step_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"step_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"task_progress_id" uuid NOT NULL,
	"state" jsonb,
	"is_correct" boolean,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "step" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"content" jsonb NOT NULL,
	"type" "STEP_TYPE_ENUM" NOT NULL,
	"task_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"last_completed_step_id" uuid,
	"steps_completed_count" integer DEFAULT 0 NOT NULL,
	"earned_experience_points" integer,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"type" "TASK_TYPE_ENUM" NOT NULL,
	"experience_points" integer DEFAULT 10 NOT NULL,
	"steps_count" integer NOT NULL,
	"section_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"avatar_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chunk" ADD CONSTRAINT "chunk_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source" ADD CONSTRAINT "source_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source" ADD CONSTRAINT "source_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_step_id_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_task_progress_id_task_progress_id_fk" FOREIGN KEY ("task_progress_id") REFERENCES "public"."task_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_last_completed_step_id_step_id_fk" FOREIGN KEY ("last_completed_step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chunks_source_id_order_index" ON "chunk" USING btree ("source_id","order");--> statement-breakpoint
CREATE INDEX "chunks_source_id_index" ON "chunk" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "chunks_embedding_index" ON "chunk" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "courses_embedding_index" ON "course" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "sections_unit_id_order_index" ON "section" USING btree ("unit_id","order");--> statement-breakpoint
CREATE INDEX "sections_unit_id_index" ON "section" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "sections_embedding_index" ON "section" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "source_type_index" ON "source" USING btree ("type");--> statement-breakpoint
CREATE INDEX "source_course_id_index" ON "source" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "source_chunks_count_index" ON "source" USING btree ("chunks_count");--> statement-breakpoint
CREATE INDEX "source_embedding_index" ON "source" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "steps_order_task_id_unique" ON "step" USING btree ("order","task_id");--> statement-breakpoint
CREATE INDEX "steps_for_task" ON "step" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "units_course_id_order_index" ON "units" USING btree ("course_id","order");--> statement-breakpoint
CREATE INDEX "units_course_id_index" ON "units" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "units_embedding_index" ON "units" USING hnsw ("embedding" vector_cosine_ops);