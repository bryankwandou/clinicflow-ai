import { callGroq, parseJson, CRITICAL_SCORING_GUIDE } from "./config";
import { search, formatResults } from "./search";
import type { StartupParams } from "./orchestrator";

const SYSTEM_PROMPT = `Anda adalah Market Research Intelligence Agent AI untuk startup Indonesia.
Analisis ukuran pasar, tren, dan potensi pertumbuhan berdasarkan data pencarian terkini.
Berikan market_score (0-100) sebagai bobot 20% dari skor final.
Sifat penilaian: ukuran TAM/SAM/SOM, tren pertumbuhan YoY, penetrasi digital, daya beli, timing pasar.
WAJIB: isi SEMUA field di bawah. Jika data pencarian tidak memuat angka pasti,
berikan estimasi kasar yang masuk akal untuk pasar Indonesia beserta asumsinya —
jangan pernah mengosongkan field.
Output JSON dengan struktur PERSIS berikut:
{
  "market_overview": "ringkasan pasar 2-3 kalimat",
  "tam": { "value": "mis. Rp 45 T", "description": "dasar estimasi" },
  "sam": { "value": "mis. Rp 6,8 T", "percentage_of_tam": "mis. 15%" },
  "som": { "year_1_target": "mis. Rp 12 M", "description": "asumsi penetrasi" },
  "growth_rate": "mis. 18% YoY",
  "market_maturity": "Emerging|Growing|Mature|Declining",
  "market_trends": ["array tren"],
  "key_market_drivers": ["array pendorong"],
  "regulatory_environment": "catatan regulasi singkat",
  "market_score": 75,
  "data_sources": ["sumber yang dipakai"]
}` + CRITICAL_SCORING_GUIDE;

export async function runMarketResearch(
  params: StartupParams,
  orchestratorMission: string
): Promise<Record<string, unknown>> {
  const queries = [
    `${params.industry_category} market size Indonesia 2024 2025 IDR growth`,
    `${params.startup_name} ${params.target_market} Indonesia market trend`,
    `${params.industry_category} startup Indonesia funding investment`,
  ];

  const searchResults = await Promise.all(queries.map((q) => search(q, 3)));
  const combinedSearch = searchResults
    .map((res, i) => `Query ${i + 1}: "${queries[i]}"\n${formatResults(res)}`)
    .join("\n\n---\n\n");

  const userMsg = `Analisis pasar untuk ${params.startup_name} (${params.industry_category}) di Indonesia:

Mission: ${orchestratorMission}
Target Pasar: ${params.target_market}
Deskripsi: ${params.product_description}
Modal Awal: ${params.initial_capital}

=== Data Pencarian Real-time ===
${combinedSearch}

Berdasarkan data pencarian di atas dan pengetahuan Anda tentang pasar Indonesia,
berikan analisis pasar komprehensif dengan skor market_score (0-100).`;

  const { content } = await callGroq([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMsg },
  ], { temperature: 0.5, maxTokens: 3072 });

  return parseJson(content);
}
