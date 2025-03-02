import { Resend } from 'resend';

export interface MailSender {
  send(config: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}

export class ResendMailSender implements MailSender {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async send(config: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: config.from,
      to: config.to,
      subject: config.subject,
      html: config.html,
    });
  }
}
