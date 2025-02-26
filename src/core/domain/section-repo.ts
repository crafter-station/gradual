import { db } from '@/db';
import * as schema from '@/db/schema';
import type { Section } from './section';

export class SectionRepo {
  async storeMany(tasks: Section[]) {
    await db.insert(schema.section).values(
      tasks.map((section: Section) => ({
        id: section.id,
        order: section.order,
        title: section.title,
        description: section.description,
        embedding: section.embedding,
        unitId: section.unitId,
      })),
    );
  }
}
