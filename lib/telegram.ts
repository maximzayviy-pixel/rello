import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const SECRET = process.env.WEBAPP_SECRET || BOT_TOKEN; // per docs, HMAC SHA-256

export function verifyInitData(initData: string) {
  const url = new URLSearchParams(initData);
  const hash = url.get('hash');
  if (!hash) return null;
  url.delete('hash');
  const data_check_string = Array.from(url.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(SECRET).digest();
  const hmac = crypto.createHmac('sha256', secret).update(data_check_string).digest('hex');
  if (hmac !== hash) return null;
  const user = url.get('user');
  return user ? JSON.parse(user) : null;
}

export async function sendInvoice(opts: {
  chat_id: number;
  title: string;
  description: string;
  payload: string;
  currency: string; // 'XTR'
  prices: { label: string; amount: number }[]; // amount in XTR units
  provider_token?: string; // Stars provider
}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...opts, provider_token: opts.provider_token || process.env.PAYMENT_PROVIDER_TOKEN })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'sendInvoice failed');
  return data.result;
}
