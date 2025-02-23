import type { helloWorldTask } from '@/trigger/example';
import { tasks } from '@trigger.dev/sdk/v3';

await tasks.trigger<typeof helloWorldTask>('hello-world', {
  name: 'Anthony',
});
