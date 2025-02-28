import { db } from '@/db';
import type { SelectStep, SelectStepProgress, StepType } from '@/db/schema';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { cache } from 'react';

export const getStepsQuery = db.query.step
  .findMany({
    where: eq(schema.step.type, sql.placeholder('type')),
    limit: 10,
  })
  .prepare('getSteps');

export const getSteps = cache(async <T extends StepType>(type: T) => {
  return (await getStepsQuery.execute({ type })) as (SelectStep & {
    type: T;
  })[];
});

export const getStepProgressQuery = db.query.stepProgress
  .findMany({
    where: sql`${schema.stepProgress.stepId} = ANY(${sql.placeholder('stepIds')}::uuid[])`,
  })
  .prepare('getStepProgress');

export const getStepProgress = cache(async (stepIds: string[]) => {
  return (await getStepProgressQuery.execute({
    stepIds,
  })) as SelectStepProgress[];
});
