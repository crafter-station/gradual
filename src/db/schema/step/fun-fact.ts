import { z } from 'zod';

// A step where we provide a fun fact
export const FunFactStepContentSchema = z.object({
  type: z.literal('FUN_FACT'),
  title: z.string(),
  body: z.string(),
});

export type FunFactStepContent = z.infer<typeof FunFactStepContentSchema>;
