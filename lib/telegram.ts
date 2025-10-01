import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const SECRET = process.env.WEBAPP_SECRET || BOT_TOKEN; // HMAC key seed

// Verify Telegram WebApp initData (HMAC-SHA256)
export function verifyInitData(initData: string) {
  const url = new URLSearchParams(initData || '');
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

// Stars (XTR): no provider_token
export async function createInvoiceLink(opts: {
  title: string;
  description: string;
  payload: string;
  currency: 'XTR';
  prices: { label: string; amount: number }[];
}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...opts })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'createInvoiceLink failed');
  return data.result as string;
}

export async function sendInvoice(opts: {
  chat_id: number;
  title: string;
  description: string;
  payload: string;
  currency: 'XTR';
  prices: { label: string; amount: number }[];
}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...opts }) // no provider_token for XTR
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'sendInvoice failed');
  return data.result;
}
