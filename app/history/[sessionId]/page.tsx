"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FeasibilityScore } from "@/components/FeasibilityScore";
import { BMCDisplay } from "@/components/BMCDisplay";
import { MarketChart } from "@/components/MarketChart";
import { CompetitorTable } from "@/components/CompetitorTable";
import { SentimentPanel } from "@/components/SentimentPanel";
import { RiskMatrix } from "@/components/RiskMatrix";
import { RegulatoryPanel } from "@/components/RegulatoryPanel";
import { FinancialPanel } from "@/components/FinancialPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { PanelBoundary } from "@/components/PanelBoundary";
import { MethodologyPanel } from "@/components/MethodologyPanel";
import type { AnalysisResult } from "@/lib/types";

export default function SavedResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/history/${sessionId}`);
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) {
        setError("Analisis tidak ditemukan di riwayatmu.");
        return;
      }
      const data = await res.json();
      setResult(data.result as AnalysisResult);
      setSavedAt(data.created_at);
    })();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/history" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors duration-150 focus-ring rounded">
            <ArrowLeft size={15} aria-hidden="true" /> Riwayat
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-2">
            {result ? `${result.params?.topicSubField} — ${result.params?.industryCategory}` : "Memuat..."}
          </h1>
          {savedAt && (
            <p className="text-faint text-xs mt-1">
              Tersimpan {new Date(savedAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
            </p>
          )}
        </div>

        {error && (
          <div className="glass-card rounded-2xl p-8 text-center text-muted">{error}</div>
        )}

        {!result && !error && (
          <div className="glass-card rounded-2xl p-10 flex items-center justify-center gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" /> Memuat laporan...
          </div>
        )}

        {result && (
          <div className="space-y-5">
            {result.recommendation?.feasibility_score && (
              <PanelBoundary name="Skor Kelayakan">
                <FeasibilityScore data={result.recommendation.feasibility_score} />
              </PanelBoundary>
            )}
            {result.recommendation && (
              <PanelBoundary name="Rekomendasi Strategis">
                <RecommendationPanel rec={result.recommendation} />
              </PanelBoundary>
            )}
            {result.bmc && (
              <PanelBoundary name="Business Model Canvas">
                <BMCDisplay bmc={result.bmc} />
              </PanelBoundary>
            )}
            {result.market && (
              <PanelBoundary name="Market Research">
                <MarketChart market={result.market} />
              </PanelBoundary>
            )}
            {result.competitor && (
              <PanelBoundary name="Analisis Kompetitor">
                <CompetitorTable competitor={result.competitor} />
              </PanelBoundary>
            )}
            {result.sentiment && (
              <PanelBoundary name="Sentiment & Social Intelligence">
                <SentimentPanel sentiment={result.sentiment} />
              </PanelBoundary>
            )}
            {result.risk && (
              <PanelBoundary name="Analisis Risiko">
                <RiskMatrix risk={result.risk} />
              </PanelBoundary>
            )}
            {result.regulatory && (
              <PanelBoundary name="Regulatory Intelligence">
                <RegulatoryPanel regulatory={result.regulatory} />
              </PanelBoundary>
            )}
            {result.financial && (
              <PanelBoundary name="Financial Modeling">
                <FinancialPanel financial={result.financial} />
              </PanelBoundary>
            )}
            <PanelBoundary name="Dasar Penilaian">
              <MethodologyPanel />
            </PanelBoundary>
          </div>
        )}
      </div>
    </div>
  );
}
