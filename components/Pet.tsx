'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Pet({ user, onTap }: { user: any; onTap: ()=>void }) {
  const [level, setLevel] = useState(user?.pet_level ?? 1);
  const [xp, setXp] = useState(user?.pet_xp ?? 0);

  useEffect(() => { setLevel(user?.pet_level ?? 1); setXp(user?.pet_xp ?? 0); }, [user]);

  return (
    <div className="rounded-3xl border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">уровень</div>
          <div className="text-4xl font-bold">{level}</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-70">опыт</div>
          <div className="text-xl font-semibold">{xp}</div>
        </div>
      </div>

      <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-2xl bg-white/90 shadow-inner">
        {/* Корги по центру */}
        <div className="absolute inset-0 grid place-items-center">
          <Image src="/pet/corgi.svg" alt="Rello the Corgi" width={240} height={240} priority />
        </div>
        {/* Невидимая зона клика поверх корги */}
        <button
          aria-label="tap corgi"
          onClick={onTap}
          className="absolute inset-0 cursor-pointer active:scale-[0.99]"
        />
      </div>
    </div>
  );
}
