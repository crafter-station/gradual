import { db } from '@/db';
import { user } from '@/db/schema/user';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local',
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  if (evt.type === 'user.created') {
    const fullname = `${evt.data.first_name} ${evt.data.last_name}`;
    const email = evt.data.email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id,
    )?.email_address;

    if (!email) {
      throw new Error('Email not found');
    }

    const userId = uuidv4();
    const clerkId = evt.data.id;

    await db.insert(user).values({
      id: userId,
      clerkId,
      fullname,
      email,
      avatarUrl: evt.data.image_url,
    });

    const client = await clerkClient();

    await client.users.updateUserMetadata(clerkId, {
      privateMetadata: {
        userId,
      },
    });
  }

  return new Response('Webhook received', { status: 200 });
}
