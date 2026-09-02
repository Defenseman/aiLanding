import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../lib/rate-limit';
import { ChatService, validateChatRequest } from '../../../lib/services/chat';

function errorResponse(
  request: NextRequest,
  status: number,
  code: string,
  message: string | string[],
) {
  return NextResponse.json(
    {
      ok: false,
      statusCode: status,
      code,
      message,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(`chat:${ip}`, 20, 60_000)) {
    return errorResponse(request, 429, 'THROTTLED', 'Too many requests');
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(request, 400, 'BAD_REQUEST', 'Request body must be valid JSON');
  }

  const validation = validateChatRequest(payload);
  if (!validation.ok) {
    return errorResponse(request, 400, 'VALIDATION_ERROR', validation.errors);
  }

  try {
    const service = new ChatService();
    const result = await service.reply(validation.value);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI_REQUEST_FAILED';

    if (message === 'AI provider is not configured') {
      return errorResponse(request, 503, 'SERVICE_UNAVAILABLE', message);
    }

    if (message === 'MODEL_NOT_FOUND_OR_UNAVAILABLE') {
      return errorResponse(
        request,
        500,
        'MODEL_NOT_FOUND_OR_UNAVAILABLE',
        'Configured AI model is unavailable for this provider account.',
      );
    }

    if (message === 'AI_REQUEST_FAILED') {
      return errorResponse(request, 500, 'INTERNAL_ERROR', message);
    }

    return errorResponse(request, 500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
