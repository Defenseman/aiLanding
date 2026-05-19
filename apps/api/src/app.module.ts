import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ContactModule } from './contact/contact.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      // 5 form submissions per minute per IP
      { name: 'contact', ttl: 60_000, limit: 5 },
      // 20 chat messages per minute per IP
      { name: 'chat', ttl: 60_000, limit: 20 },
    ]),
    ContactModule,
    ChatModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
