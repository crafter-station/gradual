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
