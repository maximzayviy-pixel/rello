'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import UpgradeCard from '@/components/UpgradeCard';

type Upg = { code: string; title: string; description: string; price_xtr: number };

const CATALOG: Upg[] = [
  { code: 'tap_power_1', title: 'Сила клика +1', description: 'Каждый клик даёт больше XP', price_xtr: 50 },
  { code: 'mult_1', title: 'Множитель +1', description: 'Увеличивает общий множитель', price_xtr: 120 }
];

export default function Shop() {
  const [initData, setInitData] = useState('');
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const data = tg?.initData || '';
    setInitData(data);
    fetch('/api/me', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: data }) })
      .then(r => r.json()).then(j => j.ok && setMe(j.user));
  }, []);

  async function buy(code: string) {
    const r = await fetch('/api/upgrade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, code }) });
    const j = await r.json();
    if (j.ok) setMe(j.user);
    else alert(j.error || 'Ошибка');
  }

  return (
    <AppShell>
      <div className="space-y-3">
        {CATALOG.map(u => (
          <UpgradeCard key={u.code} code={u.code} title={u.title} desc={u.description} price={u.price_xtr} onBuy={buy} disabled={!me} />
        ))}
      </div>
    </AppShell>
  );
}
