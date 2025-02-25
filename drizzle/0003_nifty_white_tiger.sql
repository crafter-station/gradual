ALTER TABLE "module" RENAME TO "section";--> statement-breakpoint
ALTER TABLE "tasks" RENAME COLUMN "module_id" TO "section_id";--> statement-breakpoint
ALTER TABLE "section" DROP CONSTRAINT "module_unit_id_units_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_module_id_module_id_fk";
--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("id") ON DELETE no action ON UPDATE no action;