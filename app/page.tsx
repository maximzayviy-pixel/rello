'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import Pet from '@/components/Pet';
import TapZone from '@/components/TapZone';

declare global { interface Window { Telegram?: any } }

export default function Home() {
  const [initData, setInitData] = useState<string>('');
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const data = tg?.initData || '';
    setInitData(data);
    tg?.expand?.();
    fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: data }) })
      .then(r => r.json()).then(j => j.ok && setMe(j.user));
  }, []);

  return (
    <AppShell>
      <div className="space-y-4">
        <Pet user={me} />
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">баланс</div>
          <div className="text-2xl font-bold">{me?.balance_xtr ?? 0} XTR</div>
          <button onClick={createInvoice} className="mt-3 w-full rounded-xl border px-3 py-2">Пополнить XTR</button>
        </div>
        <TapZone initData={initData} onUpdate={setMe} />
      </div>
    </AppShell>
  );

  async function createInvoice() {
    if (!initData) return;
    const amount_xtr = 100;
    const r = await fetch('/api/invoice/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, amount_xtr }) });
    const j = await r.json();
    if (!j.ok) return;
    const tg = window.Telegram?.WebApp;
    const invoiceUrl = j?.invoice?.invoice_url || j?.invoice?.link || j?.invoice?.url;
    if (invoiceUrl && tg?.openInvoice) tg.openInvoice(invoiceUrl);
  }
}
