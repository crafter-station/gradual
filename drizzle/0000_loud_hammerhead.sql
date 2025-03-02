CREATE EXTENSION IF NOT EXISTS vector;

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
	"unit_count" integer NOT NULL,
	"section_count" integer NOT NULL,
	"task_count" integer NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"creator_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"completed_units" integer DEFAULT 0 NOT NULL,
	"completed_sections" integer DEFAULT 0 NOT NULL,
	"completed_tasks" integer DEFAULT 0 NOT NULL,
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
	"task_count" integer NOT NULL,
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
	"steps_completed_count" integer DEFAULT 0 NOT NULL,
	"earned_experience_points" integer,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"type" "TASK_TYPE_ENUM" NOT NULL,
	"experience_points" integer DEFAULT 0 NOT NULL,
	"steps_count" integer DEFAULT 0 NOT NULL,
	"section_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"section_count" integer NOT NULL,
	"task_count" integer NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar NOT NULL,
	"fullname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"avatar_url" text NOT NULL,
	CONSTRAINT "user_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "chunk" ADD CONSTRAINT "chunk_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source" ADD CONSTRAINT "source_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source" ADD CONSTRAINT "source_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_step_id_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_progress" ADD CONSTRAINT "step_progress_task_progress_id_task_progress_id_fk" FOREIGN KEY ("task_progress_id") REFERENCES "public"."task_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit" ADD CONSTRAINT "unit_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
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
CREATE INDEX "units_course_id_order_index" ON "unit" USING btree ("course_id","order");--> statement-breakpoint
CREATE INDEX "units_course_id_index" ON "unit" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "units_embedding_index" ON "unit" USING hnsw ("embedding" vector_cosine_ops);