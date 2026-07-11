import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Fetch one saved analysis in full (owner only). */
export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  await ensureSchema();
  const rows = await sql`
    SELECT result, created_at FROM analyses
    WHERE user_id = ${user.id} AND session_id = ${params.sessionId} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  return NextResponse.json(rows[0]);
}
