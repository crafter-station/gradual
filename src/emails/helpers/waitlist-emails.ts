import { generateWaitlistTemplate } from '../templates/waitlist';

export function welcomeEmail(name: string) {
  return {
    subject: '👋 Welcome Aboard!',
    html: generateWaitlistTemplate(
      'Welcome to Our Community!',
      `Hi ${name}, we're thrilled to have you here!`,
      'Stay tuned for amazing experiences ahead!',
    ),
  };
}

export function acceptedEmail(name: string) {
  return {
    subject: '🎉 You have access!',
    html: generateWaitlistTemplate(
      'Welcome to the platform!',
      `Congratulations, ${name}! You now have full access to our platform. 🎉`,
      'Enjoy your journey with us!',
    ),
  };
}

export function rejectedEmail(name: string) {
  return {
    subject: '⛔ Application Update',
    html: generateWaitlistTemplate(
      'Application Status Update',
      `Dear ${name}, unfortunately, we couldn't approve your request at this time.`,
      'Feel free to reapply in the future. Best wishes!',
    ),
  };
}
