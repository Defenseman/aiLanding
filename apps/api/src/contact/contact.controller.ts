import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ contact: { limit: 5, ttl: 60_000 } })
  async submit(@Body() dto: ContactDto): Promise<{ ok: true }> {
    return this.contact.handle(dto);
  }
}
