import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

const courses = await db.query.course.findMany({
  with: {
    units: {
      with: {
        sections: {
          with: {
            tasks: true,
          },
        },
      },
    },
  },
});

for (const course of courses) {
  await db
    .update(schema.course)
    .set({
      unitCount: course.units.length,
      sectionCount: course.units.reduce(
        (acc, unit) => acc + unit.sections.length,
        0,
      ),
      taskCount: course.units.reduce(
        (acc, unit) =>
          acc +
          unit.sections.reduce((acc, section) => acc + section.tasks.length, 0),
        0,
      ),
    })
    .where(eq(schema.course.id, course.id));

  for (const unit of course.units) {
    await db
      .update(schema.unit)
      .set({
        sectionCount: unit.sections.length,
        taskCount: unit.sections.reduce(
          (acc, section) => acc + section.tasks.length,
          0,
        ),
      })
      .where(eq(schema.unit.id, unit.id));

    for (const section of unit.sections) {
      await db
        .update(schema.section)
        .set({
          taskCount: section.tasks.length,
        })
        .where(eq(schema.section.id, section.id));
    }
  }
}
