'use client';

export default function TapZone({ onTap, disabled }: { onTap: ()=>void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={onTap}
      className="mt-4 w-full rounded-2xl bg-black px-6 py-4 text-white disabled:opacity-50"
    >клик!</button>
  );
}
