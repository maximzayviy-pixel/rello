export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addBalance } from '@/lib/game';

export async function POST(req: NextRequest) {
  const update = await req.json();
  const success = update?.pre_checkout_query || update?.message?.successful_payment;
  if (!success) return NextResponse.json({ ok: true });

  const tg_id = update.message?.from?.id;
  const payload = update.message?.successful_payment?.invoice_payload;
  const amount = update.message?.successful_payment?.total_amount; // XTR units

  if (tg_id && payload && amount) {
    await db`update payments set status='paid' where invoice_payload=${payload}`;
    await addBalance(tg_id, amount);
    await db`insert into weekly_pools (week_start, total_xtr) values (date_trunc('week', now()), ${amount})
             on conflict (week_start) do update set total_xtr = weekly_pools.total_xtr + excluded.total_xtr`;
  }

  return NextResponse.json({ ok: true });
}
