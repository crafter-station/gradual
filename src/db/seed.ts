import { faker } from '@faker-js/faker';
import { db } from '.'; // Assuming you have a db connection file
import {
  users,
  courses,
  sources,
  units,
  modules,
  tasks,
  enrollments,
  steps,
} from './schema';

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
  const unitIds = await Promise.all(
    createdCourses.map(async (course) => {
      const count = faker.number.int({ min: 3, max: 5 });
      const [unit] = await db
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
      return unit.id;
    }),
  );
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
  const taskIds = (
    await Promise.all(
      moduleIds.flatMap(async (moduleId) => {
        const count = faker.number.int({ min: 2, max: 4 });
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
              })),
          )
          .returning({ id: tasks.id });
        return createdTasks.map((task) => task.id);
      }),
    )
  ).flat();

  // Create steps for each task
  await Promise.all(
    taskIds.map(async (taskId) => {
      // Create 1 tutorial step
      await db.insert(steps).values({
        order: 1,
        taskId,
        type: 'TUTORIAL',
        content: {
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
              taskId,
              type: 'EXAMPLE',
              content: {
                body: faker.lorem.paragraphs(1),
                answer: faker.lorem.paragraphs(1),
              },
            }),
          ),
      );

      // Create 5-8 question steps
      const questionStepsCount = faker.number.int({ min: 5, max: 8 });
      await Promise.all(
        Array(questionStepsCount)
          .fill(null)
          .map((_, index) =>
            db.insert(steps).values({
              order: index + 4, // starts at 4 (after tutorial and 2 examples)
              taskId,
              type: 'QUESTION',
              content: {
                question: `${faker.lorem.sentence()}?`,
                choices: Array.from({ length: 4 }, (_, i) => ({
                  order: i + 1,
                  content: faker.lorem.sentence(),
                  explanation: faker.lorem.paragraph(),
                  isCorrect: faker.datatype.boolean(),
                })),
                answer: faker.number.int({ min: 1, max: 4 }),
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
          lastAccessedAt: faker.date.past(),
          lastStepId: faker.helpers.arrayElement(taskIds),
          lastStepType: faker.helpers.arrayElement([
            'LESSON',
            'QUIZ',
            'MULTISTEP',
          ]),
          startedAt: faker.date.past(),
          finishedAt: faker.helpers.maybe(() => faker.date.recent(), {
            probability: 0.3,
          }),
        }),
      ),
    ),
  );
}

// Run the seed function
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding completed');
    process.exit(0);
  });
