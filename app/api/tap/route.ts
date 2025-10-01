import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { registerTap } from '@/lib/game';
import { ratelimit } from '@/util/ratelimit';

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  const u = requireUserFromInitData(initData);
  if (!u) return NextResponse.json({ ok: false }, { status: 401 });
  const key = `tap:${u.id}`;
  const allowed = await ratelimit(key, 8, 1000); // max 8 taps/second
  if (!allowed) return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });
  const updated = await registerTap(u.id, 1);
  return NextResponse.json({ ok: true, user: updated });
}
