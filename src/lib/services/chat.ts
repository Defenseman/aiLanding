import OpenAI from 'openai';
import { PERSONA } from '../persona';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
}

export function validateChatRequest(
  value: unknown,
): { ok: true; value: ChatRequestBody } | { ok: false; errors: string[] } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, errors: ['Invalid payload'] };
  }

  const body = value as Record<string, unknown>;
  const messages = body.messages;
  const errors: string[] = [];

  if (!Array.isArray(messages)) {
    return { ok: false, errors: ['messages must be an array'] };
  }

  if (messages.length === 0) {
    return { ok: false, errors: ['messages must not be empty'] };
  }

  if (messages.length > 20) {
    return { ok: false, errors: ['messages must contain at most 20 items'] };
  }

  const normalized: ChatMessage[] = [];

  for (let i = 0; i < messages.length; i += 1) {
    const item = messages[i];

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`messages[${i}] must be an object`);
      continue;
    }

    const record = item as Record<string, unknown>;
    const role = record.role;
    const content = record.content;

    if (role !== 'user' && role !== 'assistant') {
      errors.push(`messages[${i}].role must be "user" or "assistant"`);
    }

    if (typeof content !== 'string') {
      errors.push(`messages[${i}].content must be a string`);
      continue;
    }

    const trimmed = content.trim();

    if (trimmed.length < 1 || trimmed.length > 2000) {
      errors.push(`messages[${i}].content must be between 1 and 2000 characters`);
      continue;
    }

    normalized.push({
      role: role as 'user' | 'assistant',
      content: trimmed,
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { messages: normalized } };
}

export class ChatService {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

    if (!apiKey) {
      this.client = null;
      return;
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
    });
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

  async reply(dto: ChatRequestBody): Promise<{ reply: string }> {
    if (!this.client) {
      throw new Error('AI provider is not configured');
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          ...dto.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      });

      const reply =
        completion.choices[0]?.message?.content?.trim() ??
        'Не удалось сформировать ответ. Попробуйте ещё раз.';

      return { reply };
    } catch (error) {
      const providerError = error as {
        status?: number;
        error?: { code?: string; message?: string };
        message?: string;
      };

      console.error('OpenAI call failed', providerError);

      if (providerError?.error?.code === 'model_not_found') {
        throw new Error('MODEL_NOT_FOUND_OR_UNAVAILABLE');
      }

      throw new Error('AI_REQUEST_FAILED');
    }
  }
}
