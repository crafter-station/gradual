import { z } from 'zod';

// A step where we define formally a new concept
export const DefinitionStepContentSchema = z.object({
  type: z.literal('DEFINITION'),
  term: z.string(),
  definition: z.string(),
});
