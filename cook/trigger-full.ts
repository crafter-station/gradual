import type { CreateCourseTask } from '@/trigger/create-course';
import { tasks } from '@trigger.dev/sdk/v3';

await tasks.trigger<typeof CreateCourseTask>('create-course', {
  url: 'https://rauchg.com/2014/7-principles-of-rich-web-applications',
});
