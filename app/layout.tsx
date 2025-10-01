import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: process.env.NEXT_PUBLIC_WEBAPP_TITLE || 'Rello — Corgi Pet' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-gradient-to-b from-white to-slate-100 text-slate-900">
        <div className="mx-auto max-w-md p-4">{children}</div>
      </body>
    </html>
  );
}
