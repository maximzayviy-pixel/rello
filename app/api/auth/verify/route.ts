import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromInitData } from '@/lib/auth';
import { ensureSchema } from '@/lib/db';
import { getOrCreateUser } from '@/lib/game';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await ensureSchema();
  const { initData } = await req.json();
  const user = requireUserFromInitData(initData);
  if (!user) return NextResponse.json({ ok: false, reason: 'bad-init' }, { status: 401 });
  const u = await getOrCreateUser(user.id, user);
  return NextResponse.json({ ok: true, user: u });
}
