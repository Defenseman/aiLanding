import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from './contact.dto';
import { MailerService } from './mailer.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  async handle(dto: ContactDto): Promise<{ ok: true }> {
    // Honeypot: if a bot filled `website`, pretend everything is fine.
    if (dto.website && dto.website.length > 0) {
      return { ok: true };
    }

    const owner = this.config.get<string>('OWNER_EMAIL');
    if (!owner) {
      throw new BadRequestException('OWNER_EMAIL is not configured on server');
    }

    const safeComment = (dto.comment ?? '').slice(0, 2000);

    // 1. Letter to the owner
    await this.mailer.send({
      to: owner,
      replyTo: dto.email,
      subject: `Новая заявка с лендинга — ${dto.name}`,
      text: [
        `Имя: ${dto.name}`,
        `Телефон: ${dto.phone}`,
        `Email: ${dto.email}`,
        '',
        'Комментарий:',
        safeComment || '(пусто)',
      ].join('\n'),
      html: ownerHtml(dto.name, dto.phone, dto.email, safeComment),
    });

    // 2. Copy to the user
    await this.mailer.send({
      to: dto.email,
      subject: 'Спасибо за заявку — копия вашего сообщения',
      text: [
        `Здравствуйте, ${dto.name}!`,
        '',
        'Я получил вашу заявку и свяжусь с вами в ближайшее время.',
        'Ниже — копия отправленного сообщения.',
        '',
        `Телефон: ${dto.phone}`,
        `Email: ${dto.email}`,
        `Комментарий: ${safeComment || '(пусто)'}`,
      ].join('\n'),
      html: userHtml(dto.name, dto.phone, dto.email, safeComment),
    });

    return { ok: true };
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ownerHtml(
  name: string,
  phone: string,
  email: string,
  comment: string,
): string {
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0b0b0c;color:#eaeaea;border-radius:12px">
    <h2 style="margin:0 0 16px;font-size:18px;color:#7CFFB2">Новая заявка с лендинга</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;opacity:.6;width:120px">Имя</td><td>${esc(name)}</td></tr>
      <tr><td style="padding:6px 0;opacity:.6">Телефон</td><td>${esc(phone)}</td></tr>
      <tr><td style="padding:6px 0;opacity:.6">Email</td><td>${esc(email)}</td></tr>
    </table>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #2a2a2a">
      <div style="opacity:.6;font-size:12px;margin-bottom:6px">Комментарий</div>
      <div style="white-space:pre-wrap;font-size:14px">${esc(comment || '(пусто)')}</div>
    </div>
  </div>`;
}

function userHtml(
  name: string,
  phone: string,
  email: string,
  comment: string,
): string {
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 12px;font-size:20px">Здравствуйте, ${esc(name)}!</h2>
    <p style="margin:0 0 16px;color:#444;line-height:1.55">
      Спасибо за заявку — я получил ваше сообщение и свяжусь с вами в ближайшее время.
      Ниже копия отправленных данных.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;background:#fafafa;border-radius:8px;padding:12px">
      <tr><td style="padding:6px 12px;opacity:.6;width:120px">Телефон</td><td style="padding:6px 12px">${esc(phone)}</td></tr>
      <tr><td style="padding:6px 12px;opacity:.6">Email</td><td style="padding:6px 12px">${esc(email)}</td></tr>
      <tr><td style="padding:6px 12px;opacity:.6;vertical-align:top">Комментарий</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(comment || '(пусто)')}</td></tr>
    </table>
    <p style="margin-top:24px;color:#888;font-size:12px">Это автоматическое письмо, отвечать на него не нужно.</p>
  </div>`;
}
