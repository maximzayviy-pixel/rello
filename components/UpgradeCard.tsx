'use client';

export default function UpgradeCard({ code, title, desc, price, onBuy, disabled }: any) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-70">{desc}</div>
      <div className="mt-2 text-sm">Цена: {price} XTR</div>
      <button disabled={disabled} onClick={() => onBuy(code)} className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50">Купить</button>
    </div>
  );
}
