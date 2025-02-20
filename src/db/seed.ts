import { faker } from '@faker-js/faker';
import { db } from '.'; // Assuming you have a db connection file
import {
  courses,
  enrollments,
  modules,
  sources,
  stepProgress,
  steps,
  taskProgress,
  tasks,
  units,
  users,
} from './schema';

async function clear() {
  await db.delete(stepProgress);
  await db.delete(taskProgress);

  await db.delete(steps);
  await db.delete(tasks);
  await db.delete(modules);
  await db.delete(units);

  await db.delete(sources);
  await db.delete(enrollments);
  await db.delete(courses);
  await db.delete(users);
}

async function seed() {
  // Create 5 users
  const userIds = await Promise.all(
    Array(5)
      .fill(null)
      .map(async () => {
        const [user] = await db
          .insert(users)
          .values({
            fullname: faker.person.fullName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatar(),
          })
          .returning({ id: users.id });
        return user.id;
      }),
  );

  // Create 3 courses per user
  const createdCourses = await Promise.all(
    userIds.flatMap((userId) =>
      Array(3)
        .fill(null)
        .map(async () => {
          const [course] = await db
            .insert(courses)
            .values({
              title: faker.lorem.words(3),
              creatorId: userId,
              isPublic: faker.datatype.boolean(),
            })
            .returning();
          return course;
        }),
    ),
  );

  // Create 1-3 sources per course
  await Promise.all(
    createdCourses.flatMap(async (course) => {
      const count = faker.number.int({ min: 1, max: 3 });
      return Promise.all(
        Array(count)
          .fill(null)
          .map(() =>
            db.insert(sources).values({
              type: faker.helpers.arrayElement(['FILE', 'URL']),
              filePath: faker.system.filePath(),
              creatorId: course.creatorId,
              courseId: course.id,
            }),
          ),
      );
    }),
  );

  // Create 3-5 units per course
  const unitIds = (
    await Promise.all(
      createdCourses.flatMap(async (course) => {
        const count = faker.number.int({ min: 3, max: 5 });
        const createdUnits = await db
          .insert(units)
          .values(
            Array(count)
              .fill(null)
              .map((_, index) => ({
                title: faker.lorem.words(2),
                order: index + 1,
                experiencePoints: faker.number.int({ min: 50, max: 200 }),
                courseId: course.id,
              })),
          )
          .returning({ id: units.id });
        return createdUnits.map((unit) => unit.id);
      }),
    )
  ).flat();

  // Create 2-4 modules per unit
  const moduleIds = (
    await Promise.all(
      unitIds.flatMap(async (unitId) => {
        const count = faker.number.int({ min: 2, max: 4 });
        const createdModules = await db
          .insert(modules)
          .values(
            Array(count)
              .fill(null)
              .map((_, index) => ({
                title: faker.lorem.words(2),
                order: index + 1,
                unitId,
              })),
          )
          .returning({ id: modules.id });
        return createdModules.map((module) => module.id);
      }),
    )
  ).flat();

  // Create 2-4 tasks per module
  const createdTasks = (
    await Promise.all(
      moduleIds.flatMap(async (moduleId) => {
        const count = faker.number.int({ min: 1, max: 3 });
        const createdTasks = await db
          .insert(tasks)
          .values(
            Array(count)
              .fill(null)
              .map((_, index) => ({
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                order: index + 1,
                type: faker.helpers.arrayElement([
                  'LESSON',
                  'QUIZ',
                  'MULTISTEP',
                ]),
                moduleId,
                experiencePoints: faker.number.int({ min: 10, max: 20 }),
                stepsCount: faker.number.int({ min: 8, max: 12 }),
              })),
          )
          .returning();
        return createdTasks;
      }),
    )
  ).flat();

  // Create steps for each task
  await Promise.all(
    createdTasks.map(async (task) => {
      // Create 1 tutorial step
      await db.insert(steps).values({
        order: 1,
        taskId: task.id,
        type: 'TUTORIAL',
        content: {
          title: faker.lorem.words(3),
          body: faker.lorem.paragraphs(2),
        },
      });

      // Create 2 example steps
      await Promise.all(
        Array(2)
          .fill(null)
          .map((_, index) =>
            db.insert(steps).values({
              order: index + 2, // starts at 2 (after tutorial)
              taskId: task.id,
              type: 'EXAMPLE',
              content: {
                body: faker.lorem.paragraphs(1),
                answer: faker.lorem.paragraphs(1),
              },
            }),
          ),
      );

      // Create 5-8 question steps
      const questionStepsCount = task.stepsCount - 3;
      await Promise.all(
        Array(questionStepsCount)
          .fill(null)
          .map((_, index) =>
            db.insert(steps).values({
              order: index + 4, // starts at 4 (after tutorial and 2 examples)
              taskId: task.id,
              type: 'QUESTION',
              content: {
                question: `${faker.lorem.sentence()}?`,
                alternatives: Array.from({ length: 4 }, (_, i) => ({
                  order: i + 1,
                  content: faker.lorem.sentence(),
                  explanation: faker.lorem.paragraph(),
                })),
                correctAlternativeOrder: faker.number.int({ min: 1, max: 4 }),
              },
            }),
          ),
      );
    }),
  );

  // Create enrollments
  await Promise.all(
    createdCourses.flatMap((course) =>
      userIds.map((userId) =>
        db.insert(enrollments).values({
          courseId: course.id,
          userId,

          startedAt: faker.date.past(),
          finishedAt: faker.helpers.maybe(() => faker.date.recent(), {
            probability: 0.3,
          }),
        }),
      ),
    ),
  );
}

seed().then(() => {
  console.log('Seeded database');
});
