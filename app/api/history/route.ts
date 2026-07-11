import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** List the signed-in user's saved analyses (metadata only, newest first). */
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  await ensureSchema();
  const rows = await sql`
    SELECT session_id, industry, topic, final_score, classification, created_at
    FROM analyses WHERE user_id = ${user.id}
    ORDER BY created_at DESC LIMIT 50`;
  return NextResponse.json({ items: rows });
}

/** Save a completed analysis. Idempotent per session_id. */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  let body: {
    sessionId?: string;
    result?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  if (!body.sessionId || !body.result)
    return NextResponse.json({ error: "sessionId dan result wajib ada." }, { status: 400 });

  const r = body.result as {
    params?: { industryCategory?: string; topicSubField?: string };
    recommendation?: { feasibility_score?: { final_score?: number; classification?: string } };
  };

  await ensureSchema();
  await sql`
    INSERT INTO analyses (user_id, session_id, industry, topic, final_score, classification, result)
    VALUES (
      ${user.id}, ${body.sessionId},
      ${r.params?.industryCategory ?? null}, ${r.params?.topicSubField ?? null},
      ${r.recommendation?.feasibility_score?.final_score ?? null},
      ${r.recommendation?.feasibility_score?.classification ?? null},
      ${JSON.stringify(body.result)}
    )
    ON CONFLICT (session_id) DO NOTHING`;
  return NextResponse.json({ ok: true });
}
