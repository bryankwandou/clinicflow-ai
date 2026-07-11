"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mendaftar.");
      router.push("/history");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar.");
      setBusy(false);
    }
  };

  const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-fg placeholder:text-faint focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/35 transition-[border-color,box-shadow] duration-150";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors duration-150 mb-6 focus-ring rounded">
          <ArrowLeft size={15} aria-hidden="true" /> Beranda
        </Link>
        <div className="glass-card rounded-2xl p-7">
          <h1 className="text-xl font-semibold tracking-tight mb-1">Daftar</h1>
          <p className="text-sm text-muted mb-6">Satu akun untuk menyimpan semua hasil analisismu.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)}
                autoComplete="username" required minLength={3} maxLength={32}
                className={inputCls} placeholder="huruf kecil, angka, titik" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" required className={inputCls} placeholder="nama@contoh.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Kata sandi</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" required minLength={8} className={inputCls} placeholder="minimal 8 karakter" />
            </div>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-rose-300 text-sm">{error}</div>
            )}
            <button type="submit" disabled={busy}
              className="w-full py-2.5 bg-accent hover:bg-accent-600 disabled:opacity-40 rounded-xl font-medium flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 active:translate-y-px focus-ring">
              {busy ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={17} />} Buat Akun
            </button>
          </form>
          <p className="mt-5 text-sm text-muted text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-accent-fg hover:underline focus-ring rounded">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
