import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatRequestDto } from './chat.dto';
import { PERSONA } from './persona';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: OpenAI | null = null;
  private model = 'gpt-4o-mini';

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    const baseURL = this.config.get<string>('OPENAI_BASE_URL');
    this.model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not set. /api/chat will return 503 until configured.',
      );
      return;
    }
    this.client = new OpenAI({ apiKey, baseURL });
  }

  buildSystemPrompt(): string {
    return [
      'Ты — AI-ассистент на личном лендинге разработчика.',
      'Отвечай ТОЛЬКО на основе данных в блоке "PERSONA" ниже.',
      'Если вопрос не про этого разработчика, его опыт, стек, проекты или контакты — вежливо переведи разговор обратно.',
      'Если данных нет — честно скажи "этого нет в моём профиле, лучше напишите мне напрямую через форму".',
      'Отвечай кратко, по делу, тем же языком, на котором задал вопрос пользователь.',
      'Не выдумывай факты, проекты, компании или цифры.',
      '',
      '--- PERSONA ---',
      PERSONA,
      '--- END PERSONA ---',
    ].join('\n');
  }

  async reply(dto: ChatRequestDto): Promise<{ reply: string }> {
    if (!this.client) {
      throw new ServiceUnavailableException('AI provider is not configured');
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          ...dto.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      });

      const reply =
        completion.choices[0]?.message?.content?.trim() ??
        'Не удалось сформировать ответ. Попробуйте ещё раз.';

      return { reply };
    } catch (err) {
      this.logger.error(`OpenAI call failed: ${(err as Error).message}`);
      throw new InternalServerErrorException('AI_REQUEST_FAILED');
    }
  }
}
