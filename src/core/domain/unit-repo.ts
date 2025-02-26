import { db } from '@/db';
import * as schema from '@/db/schema';
import type { Unit } from './unit';

export class UnitRepo {
  async storeMany(units: Unit[]) {
    await db.insert(schema.unit).values(
      units.map((unit: Unit) => ({
        id: unit.id,
        order: unit.order,
        title: unit.title,
        description: unit.description,
        embedding: unit.embedding,
        courseId: unit.courseId,
      })),
    );
  }
}
