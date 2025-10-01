import { NextRequest, NextResponse } from 'next/server';
import { distributeWeeklyPrize } from '@/lib/payout';

export const dynamic = 'force-dynamic';

export async function GET() {
  const r = await distributeWeeklyPrize();
  return NextResponse.json(r);
}
