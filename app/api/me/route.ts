export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  const user = requireUserFromInitData(initData);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const r = await db`select * from users where tg_id=${user.id}`;
  return NextResponse.json({ ok: true, user: r.rows[0] });
}
