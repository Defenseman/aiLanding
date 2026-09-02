const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  ttlMs: number,
): boolean {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || now >= current.resetAt) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + ttlMs,
    });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}
