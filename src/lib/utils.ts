import { db } from '@/db';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ActionState<
  TForm extends object = Record<string, unknown>,
  TData = void,
> = {
  form?: TForm;
} & (
  | ({
      success: true;
    } & (TData extends void ? Record<never, never> : { data: TData }))
  | {
      success: false;
      error: string;
    }
);

export async function getCurrentUser() {
  return db.query.users.findFirst();
}

export const syllabusSchema = z.object({
  title: z.string(),
  units: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      modules: z.array(
        z.object({
          order: z.number(),
          title: z.string(),
          description: z.string(),
          topics: z.array(
            z.object({
              order: z.number(),
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
});
export type Syllabus = typeof syllabusSchema._type;

export function formatSyllabus(syllabus: Syllabus): string {
  let output = `Course: ${syllabus.title}\n\n`;

  for (const unit of syllabus.units) {
    output += `${unit.order}. ${unit.title}\n`;

    for (const module of unit.modules) {
      output += `   ${unit.order}.${module.order}. ${module.title}\n`;

      for (const topic of module.topics) {
        output += `      ${unit.order}.${module.order}.${topic.order}. ${topic.title}\n`;
      }
    }
  }

  return output;
}
