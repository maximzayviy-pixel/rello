'use client';
import { useState } from 'react';

export default function TapZone({ initData, onUpdate }: { initData: string; onUpdate: (u:any)=>void }) {
  const [cool, setCool] = useState(false);

  async function tap() {
    if (cool) return;
    setCool(true);
    const r = await fetch('/api/tap', { method: 'POST', body: JSON.stringify({ initData }), headers: { 'Content-Type': 'application/json' } });
    setCool(false);
    const j = await r.json();
    if (j.ok) onUpdate(j.user);
  }

  return (
    <button onClick={tap} className="mt-4 w-full rounded-2xl bg-black px-6 py-4 text-white active:scale-95">клик!</button>
  );
}
