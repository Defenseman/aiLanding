import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatRequestDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ chat: { limit: 20, ttl: 60_000 } })
  async send(@Body() dto: ChatRequestDto): Promise<{ reply: string }> {
    return this.chat.reply(dto);
  }
}
