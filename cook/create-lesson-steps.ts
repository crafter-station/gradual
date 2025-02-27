import { GenerateLessonStepsTaskById } from '@/trigger/example-2';

await GenerateLessonStepsTaskById.trigger({
  lessonId: '4385ac58-b288-45c5-8550-01452d631e56',
  courseId: '0c05e7b1-22cb-4cee-93d7-9ec0923587fb',
});
