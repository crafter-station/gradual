import { useCase } from '@/core/usecases/container';
import { ListPendingWaitlistUseCase } from '@/core/usecases/list-pending-waitlist.usecase';
import { db } from '@/db';
import { waitlist } from '@/db/schema';
import { acceptedEmail, rejectedEmail } from '@/emails/helpers/waitlist-emails';
import { EMAIL_SENDER } from '@/lib/constants';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getWaitlistUser() {
  return await useCase(ListPendingWaitlistUseCase).execute();
}

export async function updateWaitlistUserStatus(
  userId: string,
  name: string,
  email: string,
  status: 'ACCEPTED' | 'REJECTED',
) {
  await db.update(waitlist).set({ status }).where(eq(waitlist.id, userId));

  let emailTemplate: { subject: string; html: string } | null = null;

  if (status === 'ACCEPTED') {
    emailTemplate = acceptedEmail(name);
  } else if (status === 'REJECTED') {
    emailTemplate = rejectedEmail(name);
  }

  if (emailTemplate) {
    await resend.emails.send({
      from: EMAIL_SENDER,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
  }
}
