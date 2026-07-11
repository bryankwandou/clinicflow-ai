import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { sql, ensureSchema } from "./db";

const COOKIE = "ff_session";
const SESSION_DAYS = 30;

const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

/** Issue a session: store only the token hash, hand the raw token to the cookie. */
export async function createSession(userId: number): Promise<void> {
  await ensureSchema();
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await sql`INSERT INTO sessions (token_hash, user_id, expires_at)
            VALUES (${hashToken(token)}, ${userId}, ${expires.toISOString()})`;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function getUser(): Promise<AuthUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  await ensureSchema();
  const rows = await sql`
    SELECT u.id, u.username, u.email
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now()
    LIMIT 1`;
  return (rows[0] as AuthUser | undefined) ?? null;
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    await ensureSchema();
    await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  }
  cookies().delete(COOKIE);
}
