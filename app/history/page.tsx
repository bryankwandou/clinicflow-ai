"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, LogOut, Loader2 } from "lucide-react";

interface HistoryItem {
  session_id: string;
  industry: string | null;
  topic: string | null;
  final_score: string | null;
  classification: string | null;
  created_at: string;
}

interface Me { username: string; email: string }

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ user: null }));
      if (!meRes.user) {
        router.replace("/login");
        return;
      }
      setMe(meRes.user);
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      } else {
        setItems([]);
      }
      setLoading(false);
    })();
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const scoreTone = (s: number) =>
    s >= 75 ? "text-emerald-400" : s >= 60 ? "text-amber-300" : s >= 45 ? "text-orange-400" : "text-rose-400";

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors duration-150 focus-ring rounded">
              <ArrowLeft size={15} aria-hidden="true" /> Beranda
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight mt-2">Riwayat Analisis</h1>
            {me && <p className="text-sm text-faint mt-1">Masuk sebagai <span className="text-muted">{me.username}</span></p>}
          </div>
          <div className="flex gap-2">
            <Link href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-600 rounded-lg text-sm font-medium transition-[background-color,transform] duration-150 active:translate-y-px focus-ring">
              Analisis Baru <ArrowRight size={14} />
            </Link>
            <button onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-sm text-muted hover:text-fg transition-colors duration-150 focus-ring">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>

        {loading && (
          <div className="glass-card rounded-2xl p-10 flex items-center justify-center gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" /> Memuat riwayat...
          </div>
        )}

        {!loading && items?.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-muted">Belum ada analisis tersimpan.</p>
            <p className="text-faint text-sm mt-1">Jalankan analisis pertama — hasilnya otomatis tersimpan di sini.</p>
            <Link href="/analyze"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-600 rounded-xl text-sm font-medium transition-[background-color,transform] duration-150 active:translate-y-px focus-ring">
              Mulai Analisis <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {!loading && !!items?.length && (
          <div className="space-y-3">
            {items.map((it) => {
              const score = it.final_score != null ? Number(it.final_score) : null;
              return (
                <Link key={it.session_id} href={`/history/${it.session_id}`}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors duration-150 focus-ring block">
                  <div className={`text-2xl font-semibold tnum w-14 text-center ${score != null ? scoreTone(score) : "text-faint"}`}>
                    {score != null ? Math.round(score) : "—"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg truncate">
                      {it.topic ?? "Tanpa topik"} — {it.industry ?? "?"}
                    </p>
                    <p className="text-xs text-faint mt-0.5 flex items-center gap-1.5">
                      <Clock size={11} />
                      {new Date(it.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                      {it.classification && <span className="text-muted">· {it.classification}</span>}
                    </p>
                  </div>
                  <ArrowRight size={15} className="text-faint shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
