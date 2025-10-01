'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const tabs = [
    { href: '/', label: 'Питомец' },
    { href: '/shop', label: 'Магазин' },
    { href: '/leaderboard', label: 'Топ' }
  ];
  return (
    <div className="space-y-4">
      <nav className="grid grid-cols-3 gap-2">
        {tabs.map(t => (
          <Link key={t.href} href={t.href} className={clsx('rounded-2xl border p-3 text-center', p===t.href && 'border-slate-900')}>{t.label}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
