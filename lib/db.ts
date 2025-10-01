import { sql } from '@vercel/postgres';
import { SQL } from './schema';

export async function ensureSchema() {
  await sql.raw(SQL.init);
}

export const db = sql;
