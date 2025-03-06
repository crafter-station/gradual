import type { WaitRecordRepo } from '@/core/domain/wait-record-repo';
import { acceptedEmail, rejectedEmail } from '@/emails/helpers/waitlist-emails';
import { EMAIL_SENDER } from '@/lib/constants';
import type { MailSender } from '../domain/mail-sender';

export class UpdateWaitlistStatusUseCase {
  constructor(
    private mailSender: MailSender,
    private waitRecordRepo: WaitRecordRepo,
  ) {}

  async execute(
    id: string,
    name: string,
    email: string,
    status: 'ACCEPTED' | 'REJECTED',
  ): Promise<void> {
    await this.waitRecordRepo.updateStatus(id, status);

    let emailTemplate: { subject: string; html: string } | null = null;

    if (status === 'ACCEPTED') {
      emailTemplate = acceptedEmail(name);
    } else if (status === 'REJECTED') {
      emailTemplate = rejectedEmail(name);
    }

    if (emailTemplate) {
      await this.mailSender.send({
        from: EMAIL_SENDER,
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }
  }
}
