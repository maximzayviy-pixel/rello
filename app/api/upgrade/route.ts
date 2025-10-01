export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { buyUpgrade } from '@/lib/game';

export async function POST(req: NextRequest) {
  const { initData, code } = await req.json();
  const u = requireUserFromInitData(initData);
  if (!u) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const user = await buyUpgrade(u.id, code);
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
