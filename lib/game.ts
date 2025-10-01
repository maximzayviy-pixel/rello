import { db } from './db';
import { startOfWeek } from 'date-fns';

export async function getOrCreateUser(tg_id: number, profile: any) {
  const { rows } = await db`select * from users where tg_id=${tg_id}`;
  if (rows[0]) return rows[0];
  const r2 = await db`
    insert into users (tg_id, username, first_name, last_name)
    values (${tg_id}, ${profile?.username||null}, ${profile?.first_name||null}, ${profile?.last_name||null})
    returning *`;
  return r2.rows[0];
}

export async function addBalance(tg_id: number, amount_xtr: number) {
  const r = await db`update users set balance_xtr = balance_xtr + ${amount_xtr}, updated_at=now() where tg_id=${tg_id} returning *`;
  return r.rows[0];
}

export async function registerTap(tg_id: number, power = 1) {
  const r = await db`update users set pet_xp = pet_xp + ${power}, taps_today = taps_today + 1, updated_at=now() where tg_id=${tg_id} returning *`;
  const week = startOfWeek(new Date(), { weekStartsOn: 1 });
  await db`
    insert into growth_scores (tg_id, week_start, growth)
    values (${tg_id}, ${week}, ${power})
    on conflict (tg_id, week_start)
      do update set growth = growth_scores.growth + excluded.growth`;
  return r.rows[0];
}

export async function buyUpgrade(tg_id: number, code: string) {
  const u = await db`select * from upgrades where code=${code}`;
  const upg = u.rows[0];
  if (!upg) throw new Error('Unknown upgrade');
  const user = (await db`select * from users where tg_id=${tg_id}`).rows[0];
  if (user.balance_xtr < upg.price_xtr) throw new Error('Insufficient balance');
  const effect = upg.effect as any;
  const incPower = effect.tap_power ? user.tap_power + effect.tap_power : user.tap_power;
  const incMult = effect.tap_multiplier ? user.tap_multiplier + effect.tap_multiplier : user.tap_multiplier;
  const r = await db`
    update users
    set balance_xtr = balance_xtr - ${upg.price_xtr},
        tap_power = ${incPower},
        tap_multiplier = ${incMult},
        updated_at=now()
    where tg_id=${tg_id}
    returning *`;
  return r.rows[0];
}

export async function topLeaderboard(limit = 50) {
  const week = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekly = await db`select tg_id, growth from growth_scores where week_start=${week} order by growth desc limit ${limit}`;
  const allTime = await db`select tg_id, pet_xp as score from users order by pet_xp desc limit ${limit}`;
  return { weekly: weekly.rows, allTime: allTime.rows };
}

export async function currentPool() {
  const week = startOfWeek(new Date(), { weekStartsOn: 1 });
  const pool = await db`select * from weekly_pools where week_start=${week}`;
  return pool.rows[0] || { week_start: week, total_xtr: 0, prize_xtr: 0, distributed: false };
}
