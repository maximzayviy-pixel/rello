const BOT_TOKEN = process.env.BOT_TOKEN!;

// Minimal wrapper for Stars (XTR): DO NOT send provider_token
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
    // IMPORTANT: no provider_token for Stars
    body: JSON.stringify({ ...opts })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'sendInvoice failed');
  return data.result;
}

// Optional: createInvoiceLink (can be opened inside WebApp)
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
    // IMPORTANT: no provider_token for Stars
    body: JSON.stringify({ ...opts })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'createInvoiceLink failed');
  // returns a URL string
  return data.result as string;
}
