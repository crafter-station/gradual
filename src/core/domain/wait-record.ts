export type WaitRecordStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export const PENDING_WAIT_RECORD_STATUS: WaitRecordStatus = 'PENDING';

export class WaitRecord {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly status: WaitRecordStatus,
    public readonly createdAt: Date,
  ) {}
}
