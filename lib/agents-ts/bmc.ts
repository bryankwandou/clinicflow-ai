import { callGroq, parseJson, CRITICAL_SCORING_GUIDE } from "./config";
import type { StartupParams } from "./orchestrator";

const SYSTEM_PROMPT = `Anda adalah Business Model Canvas Specialist AI untuk startup Indonesia.
Analisis dan validasi Business Model Canvas dengan 9 building blocks standar Osterwalder.
Berikan business_model_score (0-100) berdasarkan kekuatan dan koherensi model bisnis.
Pertimbangkan konteks Indonesia: perilaku konsumen lokal, infrastruktur digital, daya beli IDR.
WAJIB: isi SEMUA sub-field di bawah — jika masukan pengguna samar, susun draf terbaik
dari kategori industri dan tandai sebagai asumsi; jangan pernah mengosongkan field.
Output JSON dengan struktur PERSIS berikut:
{
  "value_propositions": { "core_value": "...", "differentiator": "...", "pain_relievers": ["..."], "gain_creators": ["..."] },
  "customer_segments": { "primary_segment": "...", "customer_profile": "...", "estimated_size": "...", "secondary_segments": ["..."] },
  "revenue_streams": { "primary_revenue": "...", "revenue_model": "...", "pricing_strategy": "...", "estimated_monthly_revenue_year1": "..." },
  "channels": { "primary_channels": ["..."], "channel_strategy": "...", "digital_presence": "..." },
  "key_resources": { "human_resources": ["..."], "intellectual_resources": ["..."], "financial_requirements": "..." },
  "business_model_score": 60,
  "bmc_summary": "ringkasan koherensi model 2-3 kalimat",
  "value_proposition_strength": "...",
  "time_to_first_revenue": "...",
  "revenue_model_risk": "...",
  "critical_assumptions": ["..."]
}` + CRITICAL_SCORING_GUIDE;

export async function runBMC(params: StartupParams, orchestratorMission: string): Promise<Record<string, unknown>> {
  const userMsg = `Analisis BMC untuk ${params.startup_name} (${params.industry_category}):

Mission dari Orchestrator: ${orchestratorMission}

Data Startup:
- Produk: ${params.product_description}
- Target: ${params.target_market}
- UVP: ${params.unique_value_proposition}
- Model Bisnis: ${params.business_model}
- Modal: ${params.initial_capital}
- Founder: ${params.founder_background}

Buat Business Model Canvas lengkap dan berikan skor kelayakan model bisnis (0-100).`;

  const { content } = await callGroq([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMsg },
  ], { temperature: 0.65, maxTokens: 3072 });

  return parseJson(content);
}
