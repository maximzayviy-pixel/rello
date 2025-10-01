import { sql } from '@vercel/postgres';
import { SQL } from './schema';

export async function ensureSchema() {
  const statements = SQL.init.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await (sql as any).query(stmt);
  }
}

export const db = sql;
