import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 10;

// Distribusi antar-instance via Upstash Redis bila env tersedia;
// fallback in-memory (per-instance) saat env belum di-set (lokal/dev).
let upstash: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  upstash = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_PER_WINDOW, "60 s"),
    prefix: "statslab:rl",
  });
}

const ipBuckets = new Map<string, { count: number; resetAt: number }>();

export async function isRateLimited(identifier: string): Promise<boolean> {
  if (upstash) {
    const { success } = await upstash.limit(identifier);
    return !success;
  }

  const now = Date.now();
  const bucket = ipBuckets.get(identifier);
  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_PER_WINDOW;
}
