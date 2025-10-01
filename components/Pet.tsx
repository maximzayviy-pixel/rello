'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Pet({ user }: { user: any }) {
  const [level, setLevel] = useState(user?.pet_level ?? 1);
  const [xp, setXp] = useState(user?.pet_xp ?? 0);

  useEffect(() => { setLevel(user?.pet_level ?? 1); setXp(user?.pet_xp ?? 0); }, [user]);

  return (
    <div className="rounded-3xl border p-4 text-center">
      <div className="text-sm opacity-70">уровень</div>
      <div className="text-4xl font-bold">{level}</div>
      <div className="mt-2 text-sm">опыт: {xp}</div>
      <div className="mt-4 aspect-square w-full rounded-2xl bg-white/80 shadow-inner grid place-items-center">
        <Image src="/pet/corgi.svg" alt="Rello the Corgi" width={160} height={160} />
      </div>
    </div>
  );
}
