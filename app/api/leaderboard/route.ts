import { NextRequest, NextResponse } from 'next/server';
import { topLeaderboard, currentPool } from '@/lib/game';

export async function GET() {
  const [tops, pool] = await Promise.all([topLeaderboard(50), currentPool()]);
  return NextResponse.json({ ok: true, ...tops, pool });
}
