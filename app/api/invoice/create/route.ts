import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { createInvoiceLink, sendInvoice } from '@/lib/telegram';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { initData, amount_xtr } = await req.json();
  const u = requireUserFromInitData(initData);
  if (!u) return NextResponse.json({ ok: false }, { status: 401 });

  const payload = `xtr:${u.id}:${Date.now()}:${amount_xtr}`;

  // Preferred: create link (works great in WebApps via tg.openInvoice(link))
  let link: string | null = null;
  try {
    link = await createInvoiceLink({
      title: 'Top-up Stars',
      description: 'Balance top-up for Rello',
      payload,
      currency: 'XTR',
      prices: [{ label: 'XTR', amount: amount_xtr }]
    });
  } catch {}

  let invoice: any = null;
  if (!link) {
    // Fallback: sendInvoice (user must have chat open with the bot)
    invoice = await sendInvoice({
      chat_id: u.id,
      title: 'Top-up Stars',
      description: 'Balance top-up for Rello',
      payload,
      currency: 'XTR',
      prices: [{ label: 'XTR', amount: amount_xtr }]
    });
  }

  await db`insert into payments (tg_id, invoice_payload, amount_xtr, status) values (${u.id}, ${payload}, ${amount_xtr}, 'pending')`;

  return NextResponse.json({ ok: true, invoice, link });
}
