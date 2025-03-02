import type { MailSender } from '@/core/domain/mail-sender';
import {
  PENDING_WAIT_RECORD_STATUS,
  WaitRecord,
} from '@/core/domain/wait-record';
import type { WaitRecordRepo } from '@/core/domain/wait-record-repo';
import { welcomeEmail } from '@/emails/helpers/waitlist-emails';
import { EMAIL_SENDER } from '@/lib/constants';
import { v4 as uuidv4 } from 'uuid';

export class JoinWaitlistUseCase {
  constructor(
    private waitRecordRepo: WaitRecordRepo,
    private mailSender: MailSender,
  ) {}

  async execute(
    name: string,
    email: string,
  ): Promise<{ success: boolean; error: string } | { success: true }> {
    if (!email) return { success: false, error: 'Email is required' };

    const existsByEmail = await this.waitRecordRepo.existsByEmail(email);

    if (existsByEmail)
      return { success: false, error: 'Email already registered' };

    await this.waitRecordRepo.store(
      new WaitRecord(
        uuidv4(),
        name,
        email,
        PENDING_WAIT_RECORD_STATUS,
        new Date(),
      ),
    );

    const emailTemplate = welcomeEmail(name);

    await this.mailSender.send({
      from: EMAIL_SENDER,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return { success: true };
  }
}
