import { db } from '@/db';
import * as schema from '@/db/schema';
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
      })),
    );
  }
}
