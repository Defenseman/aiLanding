import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);
  private transporter!: Transporter;
  private from!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 465);
    const secure =
      (this.config.get<string>('SMTP_SECURE') ?? 'true') === 'true';
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');

    this.from =
      this.config.get<string>('MAIL_FROM') ?? 'no-reply@example.com';

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP creds are missing. Mailer will throw on send. Set SMTP_HOST / SMTP_USER / SMTP_PASSWORD.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async send(payload: MailPayload): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      });
      this.logger.log(`Mail sent to ${payload.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send mail to ${payload.to}: ${(err as Error).message}`,
      );
      throw new InternalServerErrorException('MAIL_SEND_FAILED');
    }
  }
}
