import { createClient } from '@vercel/kv';

const kv = process.env.KV_REST_API_URL && createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
});

export async function ratelimit(key: string, limit: number, windowMs: number) {
  if (!kv) return true; // allow if no KV configured
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const k = `${key}:${bucket}`;
  const c = await kv.incr(k);
  if (c === 1) await kv.expire(k, Math.ceil(windowMs / 1000));
  return c <= limit;
}
