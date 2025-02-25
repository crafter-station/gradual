import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function formatSyllabus(syllabus: {
  title: string;
  units: {
    order: number;
    title: string;
    sections: {
      order: number;
      title: string;
      lessons: {
        order: number;
        title: string;
      }[];
    }[];
  }[];
}): string {
  let output = `Course: ${syllabus.title}\n\n`;

  for (const unit of syllabus.units) {
    output += `${unit.order}. ${unit.title}\n`;

    for (const section of unit.sections) {
      output += `   ${unit.order}.${section.order}. ${section.title}\n`;

      for (const lesson of section.lessons) {
        output += `      ${unit.order}.${section.order}.${lesson.order}. ${lesson.title}\n`;
      }
    }
  }

  return output;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
