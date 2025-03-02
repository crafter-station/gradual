'use server';
import { db } from '@/db';
import { waitlist } from '@/db/schema/waitlist';
import { welcomeEmail } from '@/emails/helpers/waitlist-emails';
import { EMAIL_SENDER } from '@/lib/constants';
import type { ActionState } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

export type JoinWaitlistState = ActionState<{
  name: string;
  email: string;
}>;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(
  prevState: JoinWaitlistState | undefined,
  formData: FormData,
): Promise<JoinWaitlistState> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!email) return { success: false, error: 'Email is required' };

    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));

    if (existing.length > 0)
      return { success: false, error: 'Email already registered' };

    await db.insert(waitlist).values({ name, email }).execute();

    const emailTemplate = welcomeEmail(name);

    await resend.emails.send({
      from: EMAIL_SENDER,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Something went wrong' };
  }
}
