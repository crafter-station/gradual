import { z } from 'zod';

// A step where we introduce some new concept without going into details
// More like a story to engage the user
export const IntroductionStepContentSchema = z.object({
  type: z.literal('INTRODUCTION'),
  title: z.string(),
  body: z.string(),
});
