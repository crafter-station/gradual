import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { chunk } from './chunk';
import { course } from './course';
import { user } from './user';

export const sourceTypeEnum = pgEnum('SOURCE_TYPE_ENUM', ['FILE', 'URL']);

export const source = pgTable(
  'source',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    type: sourceTypeEnum('type').notNull(),
    filePath: text('file_path').notNull(),

    creatorId: uuid('creator_id')
      .notNull()
      .references(() => user.id),
    courseId: uuid('course_id').references(() => course.id),
    summary: text('summary').notNull(),
    chunksCount: integer('chunks_count').notNull().default(0),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('source_type_index').on(table.type),
    index('source_course_id_index').on(table.courseId),
    index('source_chunks_count_index').on(table.chunksCount),
    index('source_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

export const sourceRelations = relations(source, ({ one, many }) => ({
  course: one(course, {
    fields: [source.courseId],
    references: [course.id],
  }),
  chunks: many(chunk),
}));
