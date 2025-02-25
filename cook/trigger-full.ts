import { getCurrentUser } from '@/db/utils';
import type { CreateCourseTask } from '@/trigger/create-course';
import { tasks } from '@trigger.dev/sdk/v3';

const currentUser = await getCurrentUser();

if (!currentUser) {
  throw new Error('Current user not found');
}

await tasks.trigger<typeof CreateCourseTask>('create-course', {
  url: 'https://rauchg.com/2014/7-principles-of-rich-web-applications',
  userId: currentUser.id,
});
