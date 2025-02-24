import { z } from 'zod';

// A step where we provide a quote
export const QuoteStepContentSchema = z.object({
  type: z.literal('QUOTE'),
  body: z.string(),
  author: z.string(),
});

export type QuoteStepContent = z.infer<typeof QuoteStepContentSchema>;
