import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const username = (body.username ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!username || !password)
    return NextResponse.json({ error: "Username dan kata sandi wajib diisi." }, { status: 400 });

  await ensureSchema();
  const rows = await sql`SELECT id, username, email, password_hash FROM users WHERE username = ${username} LIMIT 1`;
  const user = rows[0] as { id: number; username: string; email: string; password_hash: string } | undefined;

  // Constant-shape failure: same message whether the user or password is wrong.
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return NextResponse.json({ error: "Username atau kata sandi salah." }, { status: 401 });

  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } });
}
