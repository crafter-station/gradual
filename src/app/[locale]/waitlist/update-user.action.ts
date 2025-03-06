'use server';
import type { ActionState } from '@/lib/utils';
import { updateWaitlistUserStatus } from './helpers';

export type UpdateWaitlistUserForm = ActionState<{
  id: string;
  name: string;
  email: string;
  status: string;
  createAt?: Date;
}>;

export async function updateUserStatus(
  prevState: UpdateWaitlistUserForm | undefined,
  formData: FormData,
): Promise<UpdateWaitlistUserForm> {
  const rawFormData = Object.fromEntries(formData.entries()) as {
    id: string;
    name: string;
    email: string;
    status: string;
  };

  try {
    await updateWaitlistUserStatus(
      rawFormData.id,
      rawFormData.name,
      rawFormData.email,
      rawFormData.status as 'ACCEPTED' | 'REJECTED',
    );

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
