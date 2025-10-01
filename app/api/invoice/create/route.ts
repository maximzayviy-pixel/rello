export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { sendInvoice } from '@/lib/telegram';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { initData, amount_xtr } = await req.json();
  const u = requireUserFromInitData(initData);
  if (!u) return NextResponse.json({ ok: false }, { status: 401 });

  const payload = `xtr:${u.id}:${Date.now()}:${amount_xtr}`;
  const invoice = await sendInvoice({
    chat_id: u.id,
    title: 'Rello: Пополнение Stars',
    description: 'Баланс XTR для роста корги',
    payload,
    currency: 'XTR',
    prices: [{ label: 'XTR', amount: amount_xtr }]
  });
  await db`insert into payments (tg_id, invoice_payload, amount_xtr, status) values (${u.id}, ${payload}, ${amount_xtr}, 'pending')`;
  return NextResponse.json({ ok: true, invoice });
}
