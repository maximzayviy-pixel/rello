import { db } from './db';
import { startOfWeek, subDays } from 'date-fns';

// Run weekly via Vercel Cron (Monday 00:05 UTC suggested)
export async function distributeWeeklyPrize() {
  const week = startOfWeek(new Date(), { weekStartsOn: 1 });
  const lastWeek = subDays(week, 7);

  await db`
    insert into weekly_pools (week_start, total_xtr, prize_xtr, distributed)
    values (${lastWeek}, 0, 0, false)
    on conflict (week_start) do nothing`;

  const pool = (await db`select * from weekly_pools where week_start=${lastWeek}`).rows[0];
  if (pool?.distributed) return { status: 'already-distributed' };

  const scores = (await db`select tg_id, growth from growth_scores where week_start=${lastWeek} order by growth desc limit 100`).rows;
  if (!scores[0]) return { status: 'no-scores' };
  const prize = Math.floor(pool.total_xtr * 0.5);
  const winner = scores[0].tg_id;

  await db`update users set balance_xtr = balance_xtr + ${prize} where tg_id=${winner}`;
  await db`update weekly_pools set prize_xtr=${prize}, distributed=true where id=${pool.id}`;
  return { status: 'ok', prize, winner };
}
