import { db } from '@/db';
import * as schema from '@/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

export const getFirstUser = db
  .select({ id: schema.user.id })
  .from(schema.user)
  .limit(1)
  .prepare('getFirstUser');

export const getCourses = db
  .select({ id: schema.course.id })
  .from(schema.course)
  .prepare('getCourses');

export const getCourse = db
  .select({
    id: schema.course.id,
    title: schema.course.title,
    description: schema.course.description,
    unitCount: schema.course.unitCount,
    creatorId: schema.course.creatorId,
  })
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

export const getStudents = db
  .select({
    id: schema.user.id,
    fullname: schema.user.fullname,
    avatarUrl: schema.user.avatarUrl,
    enrollmentDate: schema.enrollment.startedAt,
  })
  .from(schema.user)
  .innerJoin(schema.enrollment, eq(schema.user.id, schema.enrollment.userId))
  .where(eq(schema.enrollment.courseId, sql.placeholder('courseId')))
  .prepare('getStudents');

export const getTaskProgress = db
  .select({
    stepsCompletedCount: schema.taskProgress.stepsCompletedCount,
    earnedExperiencePoints: schema.taskProgress.earnedExperiencePoints,
  })
  .from(schema.taskProgress)
  .where(
    and(
      eq(schema.taskProgress.userId, sql.placeholder('userId')),
      eq(schema.taskProgress.taskId, sql.placeholder('taskId')),
    ),
  )
  .limit(1)
  .prepare('getTaskProgress');

export const getTasksOfUnitAndSection = db
  .select({
    id: schema.task.id,
    type: schema.task.type,
    order: schema.task.order,
    title: schema.task.title,
    description: schema.task.description,
    stepsCount: schema.task.stepsCount,
    experiencePoints: schema.task.experiencePoints,
    courseId: schema.task.courseId,
  })
  .from(schema.task)
  .innerJoin(schema.section, eq(schema.task.sectionId, schema.section.id))
  .innerJoin(schema.unit, eq(schema.section.unitId, schema.unit.id))
  .where(
    and(
      eq(schema.unit.courseId, sql.placeholder('courseId')),
      eq(schema.unit.order, sql.placeholder('unitOrder')),
      eq(schema.section.order, sql.placeholder('sectionOrder')),
    ),
  )
  .orderBy(asc(schema.task.order))
  .prepare('getTasksOfUnitAndSection');

export const getUnitAndSection = db
  .select({
    courseUnitCount: schema.course.unitCount,

    unitTitle: schema.unit.title,
    unitDescription: schema.unit.description,
    unitSectionCount: schema.unit.sectionCount,

    sectionTitle: schema.section.title,
    sectionDescription: schema.section.description,
  })
  .from(schema.unit)
  .innerJoin(schema.course, eq(schema.unit.courseId, schema.course.id))
  .leftJoin(
    schema.section,
    and(
      eq(schema.section.unitId, schema.unit.id),
      eq(schema.section.order, sql.placeholder('sectionOrder')),
    ),
  )
  .where(
    and(
      eq(schema.course.id, sql.placeholder('courseId')),
      eq(schema.unit.order, sql.placeholder('unitOrder')),
    ),
  )
  .prepare('getUnitAndSection');
