import { GenerateLessonStepsTaskById } from '@/trigger/example-2';

await GenerateLessonStepsTaskById.trigger({
  lessonId: 'c0d171e2-a318-4af3-a776-96d0f7cde183',
  courseId: '424cbc19-da6c-4111-ad9c-10a11b86eb7f',
});
