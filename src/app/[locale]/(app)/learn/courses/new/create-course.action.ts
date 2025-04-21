'use server';

import type { ActionState } from '@/lib/utils';
import type { CreateCourseTask } from '@/trigger/create-course';
import { currentUser } from '@clerk/nextjs/server';
import { tasks } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export type CreateCourseActionState = ActionState<{
  file?: File;
  url?: string;
}>;

export async function createCourse(
  prevState: CreateCourseActionState | undefined,
  formData: FormData,
): Promise<CreateCourseActionState> {
  const rawFormData = Object.fromEntries(formData.entries()) as {
    file?: File;
    url?: string;
  };

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.privateMetadata.userId as string | undefined;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const form = z.object({
      url: z.string().url(),
    });

    const parsed = form.safeParse(rawFormData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    await tasks.trigger<typeof CreateCourseTask>('create-course', {
      url: parsed.data.url,
      userId,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      form: rawFormData,
    };
  }
}
