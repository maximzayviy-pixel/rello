'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import Pet from '@/components/Pet';
import TapZone from '@/components/TapZone';

declare global { interface Window { Telegram?: any } }

export default function Home() {
  const [initData, setInitData] = useState<string>('');
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const data = tg?.initData || '';
    setInitData(data);
    tg?.expand?.();
    fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: data }) })
      .then(r => r.json()).then(j => j.ok && setMe(j.user));
  }, []);

  async function onTap() {
    if (!initData || loading) return;
    setLoading(true);
    try {
      const r = await fetch('/api/tap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData }) });
      const j = await r.json();
      if (j.ok) setMe(j.user);
    } finally {
      setLoading(false);
    }
  }

  async function createInvoice(amount_xtr = 100) {
    if (!initData) return;
    const r = await fetch('/api/invoice/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, amount_xtr }) });
    const j = await r.json();
    if (!j.ok) return;
    const tg = window.Telegram?.WebApp;
    const invoiceUrl = j?.link || j?.invoice?.invoice_url || j?.invoice?.link || j?.invoice?.url;
    const slug = j?.invoice?.slug || j?.invoice?.provider_data || j?.invoice?.start_parameter;
    // Открываем самым совместимым способом
    if (tg?.openInvoice && (invoiceUrl || slug)) {
      try { await tg.openInvoice(slug || invoiceUrl); return; } catch {}
    }
    if (invoiceUrl) window.open(invoiceUrl, '_blank');
  }

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Профиль */}
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">профиль</div>
          <div className="mt-1 text-base">
            {me?.first_name || 'Гость'} {me?.last_name || ''}{' '}
            <span className="opacity-60">(id: {me?.tg_id || '—'})</span>
          </div>
        </div>

        {/* Питомец: кликаем по КОРГИ */}
        <Pet user={me} onTap={onTap} />

        {/* Баланс и быстрые пополнения */}
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">баланс</div>
          <div className="text-2xl font-bold">{me?.balance_xtr ?? 0} XTR</div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[50,100,250,500].map(a => (
              <button key={a} onClick={() => createInvoice(a)} className="rounded-xl border px-3 py-2">+{a}</button>
            ))}
          </div>
        </div>

        {/* Резервная кнопка (если надо) */}
        <TapZone onTap={onTap} disabled={!me || loading} />
      </div>
    </AppShell>
  );
}
