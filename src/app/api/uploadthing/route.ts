import { createRouteHandler } from 'uploadthing/next';

import { gradualFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: gradualFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
