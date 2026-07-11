import { neon } from "@neondatabase/serverless";

// Single Neon client per lambda instance. The pooled DATABASE_URL from the
// Vercel integration is safe for serverless usage.
export const sql = neon(process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "");

let schemaReady: Promise<void> | null = null;

/** Create tables on first touch — idempotent, cheap after the first call. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY,
          user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires_at TIMESTAMPTZ NOT NULL
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS analyses (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
          session_id TEXT UNIQUE NOT NULL,
          industry TEXT,
          topic TEXT,
          final_score NUMERIC,
          classification TEXT,
          result JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS analyses_user_idx ON analyses(user_id, created_at DESC)`;
    })();
  }
  return schemaReady;
}
