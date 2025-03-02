import { db } from '@/db';
import { waitlist } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { WaitRecord, type WaitRecordStatus } from './wait-record';

export class WaitRecordRepo {
  async store(waitRecord: WaitRecord): Promise<void> {
    await db
      .insert(waitlist)
      .values({
        id: waitRecord.id,
        name: waitRecord.name,
        email: waitRecord.email,
        status: waitRecord.status,
      })
      .execute();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));

    return existing.length > 0;
  }

  async listByStatus(status: WaitRecordStatus): Promise<WaitRecord[]> {
    const records = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.status, status))
      .orderBy(waitlist.createdAt);

    return records.map(
      (r) =>
        new WaitRecord(r.id, r.name, r.email, r.status, new Date(r.createdAt)),
    );
  }
}
