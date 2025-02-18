ALTER TABLE "chunks" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "source_id_order_index" ON "chunks" USING btree ("source_id","order");