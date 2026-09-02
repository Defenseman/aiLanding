const BASE = '';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: string | string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    const err: ApiError = new Error('Сервер недоступен. Проверьте соединение.');
    err.code = 'NETWORK';
    throw err;
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* response without body */
  }

  if (!res.ok) {
    const err: ApiError = new Error(
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message ?? `Ошибка сервера (${res.status})`,
    );
    err.status = res.status;
    err.code = data?.code;
    err.details = data?.message;
    throw err;
  }

  return data as T;
}

export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  comment?: string;
  website?: string; // honeypot
}

export const api = {
  contact: (payload: ContactPayload) =>
    request<{ ok: true }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  chat: (messages: { role: 'user' | 'assistant'; content: string }[]) =>
    request<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
};
