'use client';
import { useEffect, useState } from 'react';

export default function Pet({ user, onTap }: { user: any; onTap: ()=>void }) {
  const [level, setLevel] = useState(user?.pet_level ?? 1);
  const [xp, setXp] = useState(user?.pet_xp ?? 0);

  useEffect(() => { setLevel(user?.pet_level ?? 1); setXp(user?.pet_xp ?? 0); }, [user]);

  return (
    <div className="rounded-3xl border p-4 text-center">
      <div className="text-sm opacity-70">уровень</div>
      <div className="text-4xl font-bold">{level}</div>
      <div className="mt-2 text-sm">опыт: {xp}</div>
      <div className="relative mt-4 aspect-square w-full rounded-2xl bg-white/80 shadow-inner grid place-items-center">
        <span className="text-6xl">🐾</span>
        <button aria-label="tap" onClick={onTap} className="absolute inset-0 cursor-pointer active:scale-[0.99]" />
      </div>
    </div>
  );
}
