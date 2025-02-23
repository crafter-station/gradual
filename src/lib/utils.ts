import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Syllabus } from './schemas';

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

export function formatSyllabus(syllabus: Syllabus): string {
  let output = `Course: ${syllabus.title}\n\n`;

  for (const unit of syllabus.units) {
    output += `${unit.order}. ${unit.title}\n`;

    for (const module of unit.modules) {
      output += `   ${unit.order}.${module.order}. ${module.title}\n`;

      for (const lesson of module.lessons) {
        output += `      ${unit.order}.${module.order}.${lesson.order}. ${lesson.title}\n`;
      }
    }
  }

  return output;
}
