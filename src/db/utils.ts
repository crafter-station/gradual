import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export const getCurrentUser = db.query.user
  .findFirst()
  .prepare('getCurrentUser');

export const getCourses = db
  .select({ id: schema.course.id })
  .from(schema.course)
  .prepare('getCourses');

export const getCourse = db
  .select()
  .from(schema.course)
  .where(eq(schema.course.id, sql.placeholder('courseId')))
  .limit(1)
  .prepare('getCourse');

export const getFullCourse = db.query.course
  .findFirst({
    where: eq(schema.course.id, sql.placeholder('courseId')),
    columns: {
      id: true,
      title: true,
      description: true,
    },
    with: {
      units: {
        columns: {
          id: true,
          title: true,
          order: true,
        },
        with: {
          sections: {
            columns: {
              id: true,
              title: true,
              order: true,
            },
            with: {
              tasks: {
                columns: {
                  id: true,
                  title: true,
                  order: true,
                  stepsCount: true,
                  experiencePoints: true,
                  type: true,
                },
              },
            },
          },
        },
      },
      sources: {
        columns: {
          id: true,
          filePath: true,
        },
      },
    },
  })
  .prepare('getCourseWithSyllabus');
