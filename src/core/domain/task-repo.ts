import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Embedding } from './embedding';
import type { Task } from './task';

export class TaskRepo {
  async storeMany(tasks: Task[]) {
    await db.insert(schema.task).values(
      tasks.map((task: Task) => ({
        id: task.id,
        type: task.type,
        title: task.title,
        description: task.description,
        embedding: task.embedding,
        order: task.order,
        stepsCount: task.stepsCount,
        sectionId: task.sectionId,
        courseId: task.courseId,
      })),
    );
  }

  async findEmbedding(taskId: string): Promise<Embedding> {
    const [record] = await db
      .select({ embedding: schema.task.embedding })
      .from(schema.task)
      .where(eq(schema.task.id, taskId));

    return record.embedding;
  }

  async updateStepsCount(taskId: string, stepsCount: number): Promise<void> {
    await db
      .update(schema.task)
      .set({
        stepsCount: stepsCount,
      })
      .where(eq(schema.task.id, taskId));
  }
}
