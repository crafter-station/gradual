import { db } from '@/db';
import { waitlist } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { WaitRecord } from './wait-record';

export class WaitRecordRepo {
  async store(waitRecord: WaitRecord): Promise<void> {
    await db
      .insert(waitlist)
      .values({
        id: waitRecord.id,
        name: waitRecord.name,
        email: waitRecord.email,
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
}
