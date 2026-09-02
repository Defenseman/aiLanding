import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export class MailerService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 465);
    const secure = (process.env.SMTP_SECURE ?? 'true') === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    this.from = process.env.MAIL_FROM ?? 'no-reply@example.com';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async send(payload: MailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });
  }
}
