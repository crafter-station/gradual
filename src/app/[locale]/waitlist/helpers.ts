import { useCase } from '@/core/usecases/container';
import { ListPendingWaitlistUseCase } from '@/core/usecases/list-pending-waitlist.usecase';
import { UpdateWaitlistStatusUseCase } from '@/core/usecases/update-waitlist-status.usecase';

export async function getWaitlistUser() {
  return await useCase(ListPendingWaitlistUseCase).execute();
}

export async function updateWaitlistUserStatus(
  userId: string,
  name: string,
  email: string,
  status: 'ACCEPTED' | 'REJECTED',
) {
  return await useCase(UpdateWaitlistStatusUseCase).execute(
    userId,
    name,
    email,
    status,
  );
}
