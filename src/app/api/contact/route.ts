import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../lib/rate-limit';
import {
  handleContactSubmission,
  validateContactRequest,
} from '../../../lib/services/contact';

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

  if (!checkRateLimit(`contact:${ip}`, 5, 60_000)) {
    return errorResponse(request, 429, 'THROTTLED', 'Too many requests');
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(request, 400, 'BAD_REQUEST', 'Request body must be valid JSON');
  }

  const validation = validateContactRequest(payload);
  if (!validation.ok) {
    return errorResponse(request, 400, 'VALIDATION_ERROR', validation.errors);
  }

  try {
    const result = await handleContactSubmission(validation.value);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (message === 'OWNER_EMAIL is not configured on server') {
      return errorResponse(request, 400, 'BAD_REQUEST', message);
    }

    if (message === 'MAIL_SEND_FAILED') {
      return errorResponse(request, 500, 'INTERNAL_ERROR', message);
    }

    return errorResponse(request, 500, 'INTERNAL_ERROR', message);
  }
}
