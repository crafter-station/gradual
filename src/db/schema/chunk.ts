import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';
import { source } from './source';

export const chunk = pgTable(
  'chunk',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    sourceId: uuid('source_id')
      .notNull()
      .references(() => source.id),

    order: integer('order').notNull(),
    summary: text('summary').notNull().default('Default summary'),
    rawContent: text('raw_content').notNull().default('Default raw content'),
    enrichedContent: text('enriched_content')
      .notNull()
      .default('Default enriched content'),
    embedding: vector('embedding', { dimensions: 1536 }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chunks_source_id_order_index').on(table.sourceId, table.order),
    index('chunks_source_id_index').on(table.sourceId),
    index('chunks_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export type SelectChunk = typeof chunk.$inferSelect;
export type InsertChunk = typeof chunk.$inferInsert;

export const chunkRelations = relations(chunk, ({ one }) => ({
  source: one(source, {
    fields: [chunk.sourceId],
    references: [source.id],
  }),
}));
