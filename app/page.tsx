'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import Pet from '@/components/Pet';
import TapZone from '@/components/TapZone';

declare global { interface Window { Telegram?: any } }

export default function Home() {
  const [initData, setInitData] = useState<string>('');
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const data = tg?.initData || '';
    setInitData(data);
    tg?.expand?.();
    if (!data) { setError('Открой через Telegram: t.me/' + (process.env.NEXT_PUBLIC_WEBAPP_BOT||'your_bot') + '/app'); return; }
    fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: data }) })
      .then(async r => ({ ok: r.ok, body: await r.json() }))
      .then(j => { if (j.ok && j.body.ok) setMe(j.body.user); else setError('Не удалось авторизоваться. Запусти мини‑апп внутри Telegram.'); })
      .catch(() => setError('Проблема соединения'));
  }, []);

  async function createInvoice(amount_xtr = 100) {
    if (!initData) return;
    const r = await fetch('/api/invoice/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, amount_xtr }) });
    const j = await r.json();
    const tg = window.Telegram?.WebApp;
    const url = j?.link || j?.invoice?.invoice_url || j?.invoice?.link || j?.invoice?.url;
    if (url && tg?.openInvoice) { try { await tg.openInvoice(url); return; } catch {} }
    if (url) window.open(url, '_blank');
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">профиль</div>
          <div className="mt-1 text-base">{me ? (<>{me.first_name} {me.last_name||''} <span className="opacity-60">(id: {me.tg_id})</span></>) : '—'}</div>
          {!!error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>

        <Pet user={me} />

        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">баланс</div>
          <div className="text-2xl font-bold">{me?.balance_xtr ?? 0} XTR</div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[50,100,250,500].map(a => (
              <button key={a} onClick={() => createInvoice(a)} className="rounded-xl border px-3 py-2">+{a}</button>
            ))}
          </div>
        </div>

        <TapZone initData={initData} onUpdate={setMe} />
      </div>
    </AppShell>
  );
}
