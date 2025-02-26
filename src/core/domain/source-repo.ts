import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Source } from './source';

export class SourceRepo {
  async store(source: Source): Promise<void> {
    await db.insert(schema.source).values({
      id: source.id,
      type: 'URL',
      filePath: source.filePath,
      creatorId: source.creatorId,
      summary: source.summary,
      embedding: source.embedding,
      chunksCount: source.chunksCount,
    });
  }

  async updateCourseId(id: string, courseId: string): Promise<void> {
    await db
      .update(schema.source)
      .set({
        courseId: courseId,
      })
      .where(eq(schema.source.id, id));
  }
}
