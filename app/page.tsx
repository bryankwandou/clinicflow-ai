import Link from "next/link";
import { ArrowRight, Brain, BarChart3, Shield, Zap } from "lucide-react";
import { Reveal, RevealList, RevealItem, WeightBar } from "@/components/Reveal";

const AGENTS = [
  { name: "Orchestrator", desc: "Membaca parameter masukan lalu menentukan urutan dan prioritas analisis" },
  { name: "Business Model Canvas", desc: "Menyusun lima blok inti model bisnis dari deskripsi ide" },
  { name: "Market Research", desc: "Menghitung TAM/SAM/SOM dan membaca tren pasar lewat pencarian web" },
  { name: "Competitor Analysis", desc: "Memetakan minimal tiga pesaing terdekat beserta posisinya" },
  { name: "Sentiment & Social Intelligence", desc: "Matriks scraping 7×7 — tujuh metode berbeda per kategori industri" },
  { name: "Risk Analysis", desc: "Menimbang risiko empat dimensi termasuk dampak tiap skenario" },
  { name: "Regulatory Intelligence", desc: "Memeriksa kesesuaian regulasi lewat basis data OJK, BPOM, dan Kementan" },
  { name: "Financial Modeling", desc: "Memproyeksikan arus kas dan runway dalam rupiah" },
  { name: "Recommendation", desc: "Merangkum semua temuan menjadi skor 0–100 dan langkah berikutnya" },
];

const STEPS = [
  { icon: Brain, step: "01", title: "Isi parameter ide", desc: "Kategori industri, model operasi, modal, kesiapan tim, profil risiko, sampai skenario seperti penambahan modal atau buka outlet." },
  { icon: Zap, step: "02", title: "Sembilan agen bekerja", desc: "Tiap agen memegang satu bidang — riset pasar, pesaing, sentimen, regulasi, keuangan — lalu saling bertukar temuan dalam enam fase." },
  { icon: BarChart3, step: "03", title: "Terima laporan terukur", desc: "Skor kelayakan berikut rinciannya: dari mana angka itu berasal, bobotnya berapa, dan apa yang perlu dibenahi." },
];

const WEIGHTS = [
  { label: "Validasi Pasar", weight: 20, note: "penyebab kegagalan startup terbesar: tidak ada kebutuhan pasar (CB Insights, 2024)" },
  { label: "Model Bisnis", weight: 18, note: "lima blok inti BMC menguji keberlanjutan pendapatan (Osterwalder & Pigneur, 2010)" },
  { label: "Profil Risiko", weight: 17, note: "dihitung terbalik — risiko rendah menaikkan skor" },
  { label: "Posisi Kompetitif", weight: 15, note: "seberapa kuat diferensiasi terhadap pesaing terdekat" },
  { label: "Keberlanjutan Finansial", weight: 12, note: "kehabisan dana menyumbang 29% kegagalan" },
  { label: "Validasi Demand Publik", weight: 10, note: "sinyal permintaan dari sentimen media sosial" },
  { label: "Kelayakan Regulasi", weight: 8, note: "aspek yang paling sering luput saat validasi manual" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-white/[0.07] bg-base/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight">
            FeasiFlow <span className="gradient-text">AI</span>
          </span>
          <Link
            href="/analyze"
            className="rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-4 py-2 text-sm font-medium text-fg transition-colors duration-150 focus-ring"
          >
            Mulai Analisis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20">
        <Reveal className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-muted mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
            </span>
            Sembilan agen otonom · prototipe tugas akhir
          </div>
          <h1 className="text-[40px] leading-[1.05] md:text-6xl md:leading-[1.05] font-semibold tracking-tight">
            Uji kelayakan ide startup
            <br />
            <span className="gradient-text">sebelum keluar modal</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Sembilan dari sepuluh startup tumbang bukan karena produknya jelek,
            melainkan karena pasarnya tidak pernah divalidasi. Sistem ini mengerjakan
            validasi itu untukmu: model bisnis, riset pasar, pesaing, sentimen publik,
            regulasi, dan proyeksi keuangan — dirangkum jadi satu skor yang bisa
            dipertanggungjawabkan.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/analyze"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-glow transition-[transform,box-shadow] duration-150 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_10px_36px_-8px_rgba(99,102,241,0.5)] active:translate-y-px focus-ring"
            >
              Coba Analisis
              <ArrowRight size={17} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-faint">Tanpa registrasi · laporan selesai di bawah tiga menit</p>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="px-6">
        <Reveal delay={0.1} className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.015] py-7">
          {[
            { value: "9", label: "Agen Otonom" },
            { value: "7", label: "Sifat Penilaian" },
            { value: "49", label: "Konfigurasi Riset Sentimen" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-2">
              <div className="text-3xl font-semibold tracking-tight tnum gradient-text">{value}</div>
              <div className="mt-1 text-[13px] text-faint">{label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">Cara kerja</h2>
          <p className="mt-2 text-center text-muted">Tiga langkah, dari ide mentah sampai laporan kelayakan.</p>
        </Reveal>
        <RevealList className="mt-12 grid md:grid-cols-3 gap-4">
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <RevealItem key={step} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                  <Icon size={18} className="text-accent-fg" aria-hidden="true" />
                </span>
                <span className="text-sm font-mono text-faint tnum">{step}</span>
              </div>
              <h3 className="text-[15px] font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{desc}</p>
            </RevealItem>
          ))}
        </RevealList>
      </section>

      {/* Methodology — the formula is public, not a black box */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">
            Skornya bukan angka ajaib
          </h2>
          <p className="mt-2 text-center text-muted max-w-2xl mx-auto">
            Setiap laporan dihitung dari tujuh sifat penilaian dengan bobot yang
            ditetapkan di muka — masing-masing punya alasan dan rujukan pustakanya.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 glass-card rounded-2xl p-6 md:p-8">
          <p className="font-mono text-[12px] md:text-sm text-accent-fg bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-7 overflow-x-auto whitespace-nowrap">
            Skor = (Market×0,20) + (BM×0,18) + (Risk×0,17) + (CA×0,15) + (Fin×0,12) + (Demand×0,10) + (Reg×0,08)
          </p>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            {WEIGHTS.map((w, i) => (
              <div key={w.label}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm font-medium text-fg">{w.label}</span>
                  <span className="text-sm font-mono tnum text-accent-fg">{w.weight}%</span>
                </div>
                <WeightBar weight={w.weight} delay={i * 0.06} />
                <p className="mt-1.5 text-xs text-faint leading-relaxed">{w.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.06] grid sm:grid-cols-3 gap-4 text-center">
            {[
              { v: "CVI > 0,80", l: "validasi tiga pakar" },
              { v: "F1 ≥ 0,75", l: "akurasi klasifikasi" },
              { v: "SUS > 68", l: "usabilitas 20 responden" },
            ].map(({ v, l }) => (
              <div key={v}>
                <div className="text-base font-mono tnum text-fg">{v}</div>
                <div className="mt-0.5 text-xs text-faint">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Agents */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">Sembilan agen, satu laporan</h2>
          <p className="mt-2 text-center text-muted">Tiap agen memegang satu bidang analisis, lalu temuannya digabung.</p>
        </Reveal>
        <RevealList className="mt-10 grid sm:grid-cols-2 gap-3">
          {AGENTS.map(({ name, desc }, i) => (
            <RevealItem key={name} className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
              <span className="flex-shrink-0 h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 text-accent-fg font-mono text-sm font-medium flex items-center justify-center tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{name}</p>
                <p className="mt-0.5 text-[13px] text-muted leading-snug">{desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <Reveal>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-5">
            <Shield className="h-5 w-5 text-accent-fg" aria-hidden="true" />
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Punya ide yang belum sempat diuji?</h2>
          <p className="mt-3 text-muted">Tanpa registrasi. Laporan kelayakan selesai sebelum kopimu dingin.</p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-glow transition-[transform] duration-150 active:translate-y-px focus-ring"
          >
            Mulai sekarang <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] py-10 text-center">
        <p className="text-sm font-medium text-muted">FeasiFlow AI</p>
        <p className="mt-1.5 text-[13px] text-faint">
          Penerapan Sistem Agentic AI untuk Analisis Kelayakan Ide Startup · Tugas Akhir TI, Universitas Atma Jaya Makassar, 2026
        </p>
        <p className="mt-0.5 text-[13px] text-faint">Vincentius Bryan Kwandou · 2361021</p>
      </footer>
    </main>
  );
}
