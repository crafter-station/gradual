CREATE TABLE "chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"summary" text,
	"raw_content" text,
	"enriched_content" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sources" ALTER COLUMN "course_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "source_id_index" ON "chunks" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "source_type_index" ON "sources" USING btree ("type");--> statement-breakpoint
CREATE INDEX "source_course_id_index" ON "sources" USING btree ("course_id");