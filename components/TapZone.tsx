'use client';
import { useState } from 'react';

type TapByHandler = { onTap: () => void; disabled?: boolean };
type TapByInitData = { initData: string; onUpdate: (u:any)=>void };

type Props = TapByHandler | TapByInitData;

export default function TapZone(props: Props) {
  const [cool, setCool] = useState(false);

  async function doTap() {
    if ('onTap' in props) {
      if (!props.disabled) props.onTap();
      return;
    }
    if (cool) return;
    setCool(true);
    try {
      const r = await fetch('/api/tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: props.initData })
      });
      const j = await r.json();
      if (j.ok) props.onUpdate(j.user);
    } finally {
      setCool(false);
    }
  }

  const disabled = ('onTap' in props) ? !!props.disabled : cool;

  return (
    <button
      onClick={doTap}
      disabled={disabled}
      className="mt-4 w-full rounded-2xl bg-black px-6 py-4 text-white disabled:opacity-50 active:scale-95"
    >
      клик!
    </button>
  );
}
