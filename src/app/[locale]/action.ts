'use server';
import { useCase } from '@/core/usecases/container';
import { JoinWaitlistUseCase } from '@/core/usecases/join-waitlist.usecase';
import type { ActionState } from '@/lib/utils';

export type JoinWaitlistState = ActionState<{
  name: string;
  email: string;
}>;

export async function joinWaitlist(
  prevState: JoinWaitlistState | undefined,
  formData: FormData,
): Promise<JoinWaitlistState> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    return await useCase(JoinWaitlistUseCase).execute(name, email);
  } catch (error) {
    return { success: false, error: 'Something went wrong' };
  }
}
