import { db } from '@/db';
import * as schema from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { EnrollButton } from './enroll-button';
import { enroll } from './enroll.action';

export const Enrollment = async ({ courseId }: { courseId: string }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  console.log('user', user);

  const userId = user.privateMetadata.userId as string;
  if (!userId) {
    throw new Error('User ID not found');
  }

  const [enrollment] = await db
    .select()
    .from(schema.enrollment)
    .where(
      and(
        eq(schema.enrollment.courseId, courseId),
        eq(schema.enrollment.userId, userId),
      ),
    );

  if (enrollment) {
    return (
      <div className="absolute right-16 w-max bg-accent p-2 text-muted-foreground text-sm">
        Enrolled
      </div>
    );
  }

  return (
    <form action={enroll} className="absolute right-16">
      <input type="hidden" name="courseId" value={courseId} />
      <EnrollButton />
    </form>
  );
};
