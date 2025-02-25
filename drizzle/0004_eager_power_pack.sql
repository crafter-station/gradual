DROP INDEX "modules_unit_id_order_index";--> statement-breakpoint
DROP INDEX "modules_unit_id_index";--> statement-breakpoint
DROP INDEX "modules_embedding_index";--> statement-breakpoint
CREATE INDEX "sections_unit_id_order_index" ON "section" USING btree ("unit_id","order");--> statement-breakpoint
CREATE INDEX "sections_unit_id_index" ON "section" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "sections_embedding_index" ON "section" USING hnsw ("embedding" vector_cosine_ops);