"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Scale, FlaskConical, Library } from "lucide-react";

/**
 * Dasar teoretis penilaian — diambil langsung dari Bab III proposal tugas akhir
 * (Kwandou, 2026): formula skor tertimbang, tujuh sifat penilaian, ambang
 * klasifikasi, protokol evaluasi, dan daftar rujukan utama.
 */

const DIMENSIONS = [
  { key: "Market", label: "Validasi Pasar", weight: 20, why: "Ketiadaan kebutuhan pasar nyata adalah penyebab kegagalan startup nomor satu — 42% kasus (CB Insights, 2024)." },
  { key: "BM", label: "Model Bisnis", weight: 18, why: "Lima blok inti BMC menguji keberlanjutan pendapatan dan struktur biaya (Osterwalder & Pigneur, 2010)." },
  { key: "Risk", label: "Profil Risiko", weight: 17, why: "Dihitung sebagai (100 − overall_risk_score); risiko rendah berkontribusi positif ke skor akhir." },
  { key: "CA", label: "Posisi Kompetitif", weight: 15, why: "Keunggulan kompetitif menentukan daya tahan di pasar yang padat (teori manajemen strategis)." },
  { key: "Fin", label: "Keberlanjutan Finansial", weight: 12, why: "Kehabisan dana menyumbang 29% kegagalan; proyeksi runway IDR menjadi indikator utama." },
  { key: "Demand", label: "Validasi Demand Publik", weight: 10, why: "Sentimen sosial dari matriks scraping 7×7 (49 konfigurasi) menangkap sinyal permintaan riil." },
  { key: "Reg", label: "Kelayakan Regulasi", weight: 8, why: "Basis regulasi OJK/BPOM/Kementan — aspek yang paling sering luput dalam validasi konvensional." },
];

const THRESHOLDS = [
  { range: "≥ 75", label: "Sangat Layak (GO)", tone: "text-emerald-400" },
  { range: "60–74", label: "Layak dengan Syarat (CONDITIONAL GO)", tone: "text-amber-300" },
  { range: "45–59", label: "Perlu Revisi Major", tone: "text-orange-400" },
  { range: "< 45", label: "Tidak Layak (NO-GO)", tone: "text-rose-400" },
];

const EVALUATION = [
  { metric: "Content Validity Index", target: "> 0,80", detail: "Validasi isi oleh 3 pakar terhadap 10 ide uji; ambang lazim untuk panel pakar berjumlah kecil." },
  { metric: "F1-score", target: "≥ 0,75", detail: "Akurasi klasifikasi kelayakan; lebih ketat dari akurasi sederhana pada distribusi kelas tak seimbang." },
  { metric: "System Usability Scale", target: "> 68", detail: "Kuesioner 10 item, 20 responden; 68 adalah rata-rata industri (Brooke, 1996)." },
];

const REFERENCES = [
  "Osterwalder, A., & Pigneur, Y. (2010). Business Model Generation. John Wiley & Sons.",
  "Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2022). ReAct: Synergizing Reasoning and Acting in Language Models. arXiv:2210.03629.",
  "Watanabe, M., & Uchihira, N. (2024). Digital Business Model Analysis Using a Large Language Model. arXiv:2406.05741.",
  "Guo, T., et al. (2024). Large Language Model Based Multi-Agents: A Survey of Progress and Challenges. arXiv.",
  "Yu, Y., et al. (2024). FinCon: A Synthesized LLM Multi-Agent System for Enhanced Financial Decision Making. arXiv:2407.06567.",
  "Wang, Z., & Zhang, J. (2025). From Bits to Boardrooms: A Multi-Agent LLM Framework for Business Excellence. arXiv:2508.15447.",
  "Belcak, P., et al. (2025). Small Language Models are the Future of Agentic AI. arXiv:2506.02153.",
  "Qi, J., et al. (2026). Towards Trustworthy Agentic AI: A Comprehensive Survey. arXiv:2605.23989.",
  "V, A., R., G. G., & Buyya, R. (2026). Agentic AI: Architectures, Taxonomies, and Evaluation of LLM Agents. arXiv:2601.12560.",
  "CB Insights. (2024). The Top Reasons Startups Fail.",
  "Ries, E. (2011). The Lean Startup. Crown Business.",
  "Blank, S., & Dorf, B. (2012). The Startup Owner's Manual. K&S Ranch.",
];

function Section({ icon: Icon, title, children, defaultOpen = false }: {
  icon: typeof BookOpen; title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/[0.07] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors focus-ring"
      >
        <Icon size={15} className="text-accent-fg shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium text-fg flex-1">{title}</span>
        <ChevronDown size={15} className={`text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

export function MethodologyPanel() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-1">Dasar Penilaian &amp; Rujukan</h3>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        Setiap skor pada laporan ini dihitung dari formula tertimbang yang dirancang dalam
        proposal tugas akhir — bukan keluaran bebas model bahasa. Buka tiap bagian untuk
        melihat bobot, ambang klasifikasi, protokol evaluasi, dan rujukan pustakanya.
      </p>

      <div className="space-y-2">
        <Section icon={Scale} title="Formula skor & bobot tujuh sifat penilaian" defaultOpen>
          <p className="font-mono text-[11px] text-accent-fg bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 mb-3 leading-relaxed">
            Skor = (Market×0,20) + (BM×0,18) + (Risk×0,17) + (CA×0,15) + (Fin×0,12) + (Demand×0,10) + (Reg×0,08)
          </p>
          <div className="space-y-2">
            {DIMENSIONS.map((d) => (
              <div key={d.key} className="flex gap-3 text-xs">
                <span className="font-mono tnum text-accent-fg w-9 shrink-0 text-right">{d.weight}%</span>
                <div>
                  <span className="text-fg font-medium">{d.label}</span>
                  <p className="text-faint mt-0.5 leading-relaxed">{d.why}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={FlaskConical} title="Ambang klasifikasi & protokol evaluasi">
          <div className="space-y-1.5 mb-4">
            {THRESHOLDS.map((t) => (
              <div key={t.range} className="flex justify-between text-xs">
                <span className="font-mono tnum text-muted">{t.range}</span>
                <span className={`font-medium ${t.tone}`}>{t.label}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-3 space-y-2.5">
            {EVALUATION.map((e) => (
              <div key={e.metric} className="text-xs">
                <div className="flex justify-between">
                  <span className="text-fg font-medium">{e.metric}</span>
                  <span className="font-mono tnum text-accent-fg">{e.target}</span>
                </div>
                <p className="text-faint mt-0.5 leading-relaxed">{e.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Library} title="Daftar rujukan utama (APA 7)">
          <ol className="space-y-2 list-decimal list-inside">
            {REFERENCES.map((r) => (
              <li key={r} className="text-[11px] text-muted leading-relaxed">{r}</li>
            ))}
          </ol>
        </Section>

        <Section icon={BookOpen} title="Kedudukan dalam penelitian">
          <p className="text-xs text-muted leading-relaxed">
            Sistem ini merupakan prototipe penelitian Research and Development dengan model
            Prototyping (Sugiyono, 2019). Sembilan agen otonom — Orchestrator, BMC, Market
            Research, Competitor, Sentiment &amp; Social Intelligence, Risk, Regulatory,
            Financial, dan Recommendation — berkolaborasi dalam pipeline enam fase.
            Skenario dinamis (penambahan modal, pembukaan outlet, ekspansi wilayah)
            dipetakan langsung ke komponen skor terkait sehingga laporan mencerminkan
            dampak keputusan strategis, bukan kondisi statis awal. Hasil tidak dimaksudkan
            sebagai rekomendasi investasi maupun nasihat hukum.
          </p>
        </Section>
      </div>
    </div>
  );
}
