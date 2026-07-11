"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import {
  INDUSTRY_CATEGORIES, SUBTOPICS, PLATFORMS,
  CAPITAL_OPTIONS, READINESS_LEVELS, TEAM_EXPERTISE,
  RISK_PROFILES, DYNAMIC_SCENARIOS,
} from "@/lib/constants";
import { startAnalysis } from "@/lib/api";
import type { StartupParameters } from "@/lib/types";

const schema = z.object({
  industryCategory: z.string().min(1, "Pilih kategori industri"),
  topicSubField: z.string().min(1, "Pilih sub-bidang"),
  operatingModel: z.enum(["Daring", "Luring", "Hibrida"]),
  location: z.string().optional(),
  platform: z.string().optional(),
  initialCapital: z.string().min(1, "Pilih modal awal"),
  readinessLevel: z.string().min(1, "Pilih tingkat kesiapan"),
  teamExpertise: z.array(z.string()).min(1, "Pilih minimal 1 keahlian tim"),
  riskProfile: z.string().min(1, "Pilih profil risiko"),
  dynamicScenarios: z.array(z.string()).optional(),
  ideaDescription: z.string().min(50, "Deskripsi minimal 50 karakter").max(2000),
});

type FormData = z.infer<typeof schema>;

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      operatingModel: "Daring",
      teamExpertise: [],
      dynamicScenarios: [],
    },
  });

  const selectedIndustry = watch("industryCategory");
  const selectedModel = watch("operatingModel");
  const selectedExpertise = watch("teamExpertise") || [];
  const selectedScenarios = watch("dynamicScenarios") || [];
  const descText = watch("ideaDescription") || "";

  const subtopics = selectedIndustry ? SUBTOPICS[selectedIndustry] || [] : [];

  const toggleArray = (field: "teamExpertise" | "dynamicScenarios", value: string) => {
    const current = field === "teamExpertise" ? selectedExpertise : selectedScenarios;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next);
  };

  // Force-submit: NEVER blocked by validation. Any field left empty is filled
  // with a sensible default so the button always fires ("wajib nyala").
  const buildParams = (): StartupParameters => {
    const v = getValues();
    const industry = v.industryCategory || INDUSTRY_CATEGORIES[0];
    const subs = SUBTOPICS[industry] || [];
    const desc = (v.ideaDescription || "").trim();
    return {
      industryCategory: industry,
      topicSubField: v.topicSubField || subs[0] || "Umum",
      operatingModel: v.operatingModel || "Daring",
      location: v.location || "",
      platform: v.platform || "",
      initialCapital: v.initialCapital || CAPITAL_OPTIONS[1],
      readinessLevel: v.readinessLevel || READINESS_LEVELS[0],
      teamExpertise: v.teamExpertise?.length ? v.teamExpertise : [TEAM_EXPERTISE[0]],
      riskProfile: v.riskProfile || RISK_PROFILES[1],
      dynamicScenarios: v.dynamicScenarios || [],
      ideaDescription: desc.length >= 20
        ? desc
        : `${desc || "Ide startup"} — deskripsi belum lengkap; analisis dijalankan dengan informasi terbatas.`,
    } as StartupParameters;
  };

  const forceSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const { sessionId } = await startAnalysis(buildParams());
      router.push(`/analyze/${sessionId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-fg placeholder:text-faint focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/35 transition-[border-color,box-shadow] duration-150";
  const labelCls = "block text-sm font-medium text-muted mb-2";
  const errCls = "text-rose-400 text-xs mt-1.5";
  const stepLabels = ["Informasi Industri", "Tim & Modal", "Deskripsi Ide"];

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-9">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors duration-150 mb-5 focus-ring rounded">
            <ArrowLeft size={15} aria-hidden="true" /> Beranda
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">Analisis Kelayakan Startup</h1>
          <p className="text-muted mt-2.5 text-[15px]">Isi parameter idemu — sembilan agen akan mengerjakan sisanya.</p>
        </div>

        {/* Progress */}
        <div className="mb-9">
          <div className="flex items-center justify-between mb-2.5">
            {stepLabels.map((label, i) => (
              <span key={label} className={`text-xs font-medium transition-colors duration-150 ${i + 1 <= step ? "text-accent-fg" : "text-faint"}`}>
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-accent" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); forceSubmit(); }} className="space-y-6">

          {/* Step 1: Industry */}
          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h2 className="text-[16px] font-semibold text-fg mb-1">Langkah 1: Informasi Industri</h2>

              <div>
                <label className={labelCls}>Kategori Industri *</label>
                <select {...register("industryCategory")} className={inputCls}>
                  <option value="">Pilih kategori...</option>
                  {INDUSTRY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.industryCategory && <p className={errCls}>{errors.industryCategory.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Sub-bidang / Topik *</label>
                <select {...register("topicSubField")} className={inputCls} disabled={!selectedIndustry}>
                  <option value="">Pilih sub-bidang...</option>
                  {subtopics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.topicSubField && <p className={errCls}>{errors.topicSubField.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Model Operasi *</label>
                <div className="flex gap-3">
                  {(["Daring", "Luring", "Hibrida"] as const).map((m) => (
                    <label key={m} className="flex-1 cursor-pointer">
                      <input type="radio" value={m} {...register("operatingModel")} className="sr-only" />
                      <div className={`text-center py-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedModel === m ? "bg-accent border-accent text-white" : "bg-white/[0.03] border-white/10 text-muted hover:border-white/25"
                      }`}>{m}</div>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedModel === "Luring" || selectedModel === "Hibrida") && (
                <div>
                  <label className={labelCls}>Lokasi Usaha</label>
                  <input {...register("location")} placeholder="e.g. Makassar, Sulawesi Selatan" className={inputCls} />
                </div>
              )}

              {(selectedModel === "Daring" || selectedModel === "Hibrida") && (
                <div>
                  <label className={labelCls}>Platform / Ekosistem</label>
                  <select {...register("platform")} className={inputCls}>
                    <option value="">Pilih platform...</option>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-accent hover:bg-accent-600 rounded-xl font-medium flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 active:translate-y-px focus-ring"
              >
                Lanjut ke Langkah 2 <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Team & Capital */}
          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h2 className="text-[16px] font-semibold text-fg mb-1">Langkah 2: Tim & Modal</h2>

              <div>
                <label className={labelCls}>Modal Awal *</label>
                <select {...register("initialCapital")} className={inputCls}>
                  <option value="">Pilih rentang modal...</option>
                  {CAPITAL_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.initialCapital && <p className={errCls}>{errors.initialCapital.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Tingkat Kesiapan *</label>
                <div className="grid grid-cols-2 gap-2">
                  {READINESS_LEVELS.map((r) => (
                    <label key={r} className="cursor-pointer">
                      <input type="radio" value={r} {...register("readinessLevel")} className="sr-only" />
                      <div className={`text-center py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        watch("readinessLevel") === r ? "bg-accent border-accent text-white" : "bg-white/[0.03] border-white/10 text-muted hover:border-white/25"
                      }`}>{r}</div>
                    </label>
                  ))}
                </div>
                {errors.readinessLevel && <p className={errCls}>{errors.readinessLevel.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Keahlian Tim * (multi-pilih)</label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_EXPERTISE.map((e) => (
                    <button
                      key={e} type="button"
                      onClick={() => toggleArray("teamExpertise", e)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedExpertise.includes(e)
                          ? "bg-accent border-accent text-white"
                          : "bg-white/[0.03] border-white/10 text-muted hover:border-white/25"
                      }`}
                    >{e}</button>
                  ))}
                </div>
                {errors.teamExpertise && <p className={errCls}>{errors.teamExpertise.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Profil Risiko *</label>
                <div className="flex gap-3">
                  {RISK_PROFILES.map((r) => (
                    <label key={r} className="flex-1 cursor-pointer">
                      <input type="radio" value={r} {...register("riskProfile")} className="sr-only" />
                      <div className={`text-center py-3 rounded-lg border text-sm font-medium transition-colors ${
                        watch("riskProfile") === r ? "bg-accent border-accent text-white" : "bg-white/[0.03] border-white/10 text-muted hover:border-white/25"
                      }`}>{r}</div>
                    </label>
                  ))}
                </div>
                {errors.riskProfile && <p className={errCls}>{errors.riskProfile.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Skenario Dinamis (opsional)</label>
                <div className="flex flex-wrap gap-2">
                  {DYNAMIC_SCENARIOS.map((s) => (
                    <button
                      key={s} type="button"
                      onClick={() => toggleArray("dynamicScenarios", s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedScenarios.includes(s)
                          ? "bg-accent/80 border-accent/60 text-white"
                          : "bg-white/[0.03] border-white/10 text-muted hover:border-white/25"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl font-medium text-muted hover:text-fg flex items-center justify-center gap-2 transition-colors duration-150 active:translate-y-px focus-ring">
                  <ArrowLeft size={18} /> Kembali
                </button>
                <button type="button" onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-accent hover:bg-accent-600 rounded-xl font-medium flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 active:translate-y-px focus-ring">
                  Lanjut ke Langkah 3 <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description & Submit */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h2 className="text-[16px] font-semibold text-fg mb-1">Langkah 3: Deskripsi Ide</h2>

              <div>
                <div className="flex justify-between mb-2">
                  <label className={labelCls + " mb-0"}>Deskripsi Ide Startup *</label>
                  <span className={`text-xs tnum ${descText.length < 50 ? "text-rose-400" : "text-faint"}`}>
                    {descText.length}/2000
                  </span>
                </div>
                <textarea
                  {...register("ideaDescription")}
                  rows={8}
                  placeholder="Ceritakan ide startup kamu secara detail: masalah yang diselesaikan, target pengguna, solusi yang ditawarkan, keunggulan kompetitif, rencana awal monetisasi, dan konteks lainnya yang relevan. Minimal 50 karakter."
                  className={inputCls + " resize-none"}
                />
                {errors.ideaDescription && <p className={errCls}>{errors.ideaDescription.message}</p>}

                {/* Live input-quality gauge — mirrors the input-quality penalty
                    the scoring pipeline applies, so users see the consequence
                    of a vague description before submitting. */}
                {(() => {
                  const t = descText.toLowerCase();
                  // Broad synonym nets — the gauge should recognize an element
                  // however the founder phrases it, not demand magic words.
                  const checks = [
                    {
                      label: "Masalah yang diselesaikan",
                      hint: "sebutkan kesulitan nyata yang dialami calon pengguna hari ini",
                      ok: /masalah|problem|kesulitan|kendala|keluhan|sulit|mahal|lambat|tidak (ada|bisa|aman|transparan)|belum (ada|tersedia)|rentan|rawan|hilang|bocor|terbatas|akses/.test(t),
                    },
                    {
                      label: "Target pengguna",
                      hint: "siapa pemakainya: pasien, dokter, siswa, UMKM, klinik...",
                      ok: /target|pengguna|pelanggan|user|konsumen|segmen|pasien|dokter|perawat|rumah sakit|klinik|siswa|mahasiswa|guru|petani|umkm|merchant|penjual|pembeli|orang tua|karyawan|perusahaan|founder/.test(t),
                    },
                    {
                      label: "Solusi yang ditawarkan",
                      hint: "apa yang dibangun dan cara kerjanya singkat",
                      ok: /solusi|aplikasi|platform|layanan|produk|sistem|blockchain|website|dashboard|marketplace|bot|ai|otomatis|integrasi|fitur|teknologi|penyimpanan|database/.test(t),
                    },
                    {
                      label: "Rencana pendapatan",
                      hint: "dari mana uang masuk: langganan, komisi, lisensi, iklan...",
                      ok: /monetisasi|pendapatan|harga|langganan|komisi|revenue|bayar|biaya|lisensi|subscription|fee|iklan|premium|freemium|b2b|jual|tarif|paket|sewa/.test(t),
                    },
                  ];
                  const hit = checks.filter((c) => c.ok).length;
                  const score = hit + (descText.length >= 150 ? 1 : 0);
                  const verdict = score >= 4 ? { label: "Kuat", cls: "text-emerald-400" }
                    : score >= 2 ? { label: "Sedang", cls: "text-amber-300" }
                    : { label: "Lemah", cls: "text-rose-400" };
                  const missing = checks.filter((c) => !c.ok);
                  return (
                    <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs font-medium text-muted">Kualitas masukan</span>
                        <span className={`text-xs font-semibold ${verdict.cls}`}>{verdict.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {checks.map((c) => (
                          <span key={c.label} className={`text-[11px] ${c.ok ? "text-emerald-400" : "text-faint"}`}>
                            {c.ok ? "✓" : "○"} {c.label}
                          </span>
                        ))}
                      </div>
                      {missing.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] space-y-1">
                          <p className="text-[11px] font-medium text-amber-300">Yang perlu ditambahkan:</p>
                          {missing.map((c) => (
                            <p key={c.label} className="text-[11px] text-muted leading-relaxed">
                              · <span className="text-fg">{c.label}</span> — {c.hint}
                            </p>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const tpl = `${descText.trim()}\n\nMasalah: [kesulitan nyata yang dialami pengguna saat ini]\nTarget pengguna: [siapa yang memakai dan siapa yang membayar]\nSolusi: [apa yang dibangun dan cara kerjanya]\nMonetisasi: [sumber pendapatan, contoh: langganan Rp X/bulan]\nKeunggulan: [kenapa lebih baik dari yang sudah ada]`;
                              setValue("ideaDescription", tpl.slice(0, 2000), { shouldValidate: true });
                            }}
                            className="mt-1.5 text-[11px] text-accent-fg hover:underline focus-ring rounded"
                          >
                            Sisipkan kerangka 5 unsur ke deskripsi →
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] text-faint mt-2 leading-relaxed">
                        Indikator ini pratinjau heuristik; penilaian resmi dilakukan
                        Orchestrator saat analisis. Deskripsi samar tetap dianalisis,
                        tetapi skor akhir dikenai penalti kualitas masukan.
                      </p>
                    </div>
                  );
                })()}
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 text-rose-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl font-medium text-muted hover:text-fg flex items-center justify-center gap-2 transition-colors duration-150 active:translate-y-px focus-ring">
                  <ArrowLeft size={18} /> Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-accent hover:bg-accent-600 disabled:opacity-40 rounded-xl font-medium flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 active:translate-y-px focus-ring"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Memulai Analisis...</>
                  ) : (
                    <>Analisis Sekarang <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
