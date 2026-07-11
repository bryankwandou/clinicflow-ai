import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { username?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const username = (body.username ?? "").trim().toLowerCase();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!/^[a-z0-9_.-]{3,32}$/.test(username))
    return NextResponse.json({ error: "Username 3-32 karakter: huruf, angka, titik, garis bawah." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "Format email tidak dikenali." }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });

  await ensureSchema();

  const dupe = await sql`SELECT username, email FROM users WHERE username = ${username} OR email = ${email} LIMIT 1`;
  if (dupe.length) {
    const taken = (dupe[0] as { username: string }).username === username ? "Username" : "Email";
    return NextResponse.json({ error: `${taken} sudah terdaftar.` }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${hash})
    RETURNING id, username, email`;
  const user = rows[0] as { id: number; username: string; email: string };

  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } });
}
