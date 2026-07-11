"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, LogIn } from "lucide-react";

/** Session-aware nav actions: "Masuk" for guests, "Riwayat" for users. */
export function NavAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <span className="w-20" aria-hidden="true" />;

  return user ? (
    <Link
      href="/history"
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3.5 py-2 text-sm font-medium text-fg transition-colors duration-150 focus-ring"
    >
      <History size={14} aria-hidden="true" /> {user.username}
    </Link>
  ) : (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3.5 py-2 text-sm font-medium text-fg transition-colors duration-150 focus-ring"
    >
      <LogIn size={14} aria-hidden="true" /> Masuk
    </Link>
  );
}
