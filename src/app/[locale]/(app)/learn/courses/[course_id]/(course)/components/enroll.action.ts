'use server';

import * as schema from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';

export async function enroll(formData: FormData) {
  const courseId = formData.get('courseId');
  const user = await currentUser();

  if (!courseId || !user) {
    return;
  }

  const userId = user.privateMetadata.userId as string;
  if (!userId) {
    throw new Error('User ID not found');
  }

  await db.insert(schema.enrollment).values({
    courseId: courseId as string,
    userId,
    startedAt: new Date(),
  });

  revalidatePath(`/learn/courses/${courseId}/students`);
}
