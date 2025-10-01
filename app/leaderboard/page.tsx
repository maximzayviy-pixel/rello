'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';

type Entry = { tg_id: number; growth?: number; score?: number };

export default function Leaderboard() {
  const [weekly, setWeekly] = useState<Entry[]>([]);
  const [allTime, setAllTime] = useState<Entry[]>([]);
  const [pool, setPool] = useState<any>(null);

  useEffect(() => { fetch('/api/leaderboard').then(r=>r.json()).then(j => { setWeekly(j.weekly||[]); setAllTime(j.allTime||[]); setPool(j.pool); }); }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Приз недели (50% пула)</div>
          <div className="text-2xl font-bold">{pool?.prize_xtr || Math.floor((pool?.total_xtr||0)*0.5)} XTR</div>
          <div className="text-sm">Текущий пул: {pool?.total_xtr||0} XTR</div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Топ за неделю</h2>
          <ol className="space-y-1">
            {weekly.map((e,i)=>(<li key={e.tg_id} className="rounded-xl border p-3"><b>#{i+1}</b> — {e.tg_id} · рост {e.growth}</li>))}
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Топ общий</h2>
          <ol className="space-y-1">
            {allTime.map((e,i)=>(<li key={e.tg_id} className="rounded-xl border p-3"><b>#{i+1}</b> — {e.tg_id} · XP {e.score}</li>))}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
