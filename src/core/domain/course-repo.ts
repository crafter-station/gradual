import { db } from '@/db';
import * as schema from '@/db/schema';
import type { Course } from './course';

export class CourseRepo {
  async store(course: Course): Promise<void> {
    await db.insert(schema.course).values({
      id: course.id,
      title: course.title,
      description: course.description,
      creatorId: course.creatorId,
      embedding: course.embedding,
      unitCount: course.unitCount,
      sectionCount: course.sectionCount,
      taskCount: course.taskCount,
    });
  }
}
