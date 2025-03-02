import { PENDING_WAIT_RECORD_STATUS } from '../domain/wait-record';
import type { WaitRecordRepo } from '../domain/wait-record-repo';

export class ListPendingWaitlistUseCase {
  constructor(private waitRecordRepo: WaitRecordRepo) {}

  async execute(): Promise<
    {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    }[]
  > {
    const waitRecords = await this.waitRecordRepo.listByStatus(
      PENDING_WAIT_RECORD_STATUS,
    );

    return waitRecords.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      createdAt: r.createdAt,
      status: r.status,
    }));
  }
}
