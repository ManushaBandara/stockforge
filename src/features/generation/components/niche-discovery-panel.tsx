
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Search,
  Sparkles,
  LoaderCircle,
  TrendingUp,
  ExternalLink,
  Target,
} from "lucide-react";

import { notify } from "@/features/notifications/lib/notification";
import {
  Panel,
  PanelHeading,
  primaryButtonClass,
} from "@/components/ui/page-ui";

import { buildNicheDiscoveryPrompt } from "../lib/niche-discovery-prompt";
import { parseNicheDiscovery } from "../lib/parse-niche-discovery";

import type {
  GeminiGeneration,
  NicheDiscoveryResult,
  TrendingNiche,
} from "../types/stock-idea.types";

interface NicheDiscoveryPanelProps {
  onSelectNiche: (niche: TrendingNiche) => void;
}

export default function NicheDiscoveryPanel({
  onSelectNiche,
}: NicheDiscoveryPanelProps) {
  const [result, setResult] = useState<NicheDiscoveryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function discoverNiches() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prompt = buildNicheDiscoveryPrompt();

      const response = await invoke<GeminiGeneration>(
        "generate_ai_content",
        { prompt }
      );

      const discovery = parseNicheDiscovery(response.text);

      setResult(discovery);

      notify.success("Trending niches discovered!", {
        description: `${discovery.niches.length} niche opportunities found.`,
      });
    } catch (err) {
      const message = String(err);
      setError(message);

      notify.error("Niche discovery failed", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  function getPotentialStyle(potential: string) {
    switch (potential) {
      case "high":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "medium":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  }

  return (
    <Panel>
      <PanelHeading
        title="AI Trend Discovery"
        description="Research current stock-content opportunities using Gemini and Google Search."
        action={
          <button
            className={primaryButtonClass}
            onClick={discoverNiches}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? "Researching..." : "Discover trends"}
          </button>
        }
      />

      <div className="p-5">
        {!result && !loading && !error && (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-xl border border-[#39334F] sf-accent-soft p-4">
              <Sparkles size={26} className="text-white" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              Discover new stock opportunities
            </h3>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              Gemini will research recent market trends and identify
              commercially promising stock-content niches.
            </p>

            <p className="mt-3 text-[11px] text-slate-600">
              Research results are estimates, not verified sales data.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <LoaderCircle
              size={30}
              className="animate-spin text-[#A78BFA]"
            />
            <p className="mt-4 text-sm font-medium text-white">
              Researching current trends...
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Gemini is searching for stock-content opportunities.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              This may take a little while.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400">
              Could not discover niches
            </p>
            <p className="mt-2 break-words text-xs text-slate-400">
              {error}
            </p>
            <button
              className="mt-4 text-xs font-medium text-white underline"
              onClick={discoverNiches}
            >
              Try again
            </button>
          </div>
        )}

        {result && !loading && (
          <div>
            <div className="mb-5 rounded-lg border border-[#343044] bg-[#171522] p-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#A78BFA]" />
                <p className="text-xs font-semibold text-white">
                  Market overview
                </p>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {result.marketSummary}
              </p>

              <p className="mt-3 text-[11px] text-slate-600">
                Researched: {result.researchedAt}
              </p>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Discovered niches
              </h3>
              <span className="text-xs text-slate-500">
                {result.niches.length} opportunities
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {result.niches.map((niche, index) => (
                <div
                  key={`${niche.name}-${index}`}
                  className="rounded-xl border border-[#303541] bg-[#151820] p-4 transition hover:border-[#6256A8]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {niche.category}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-white">
                        {niche.name}
                      </h4>
                    </div>

                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] font-medium capitalize ${getPotentialStyle(niche.commercialPotential)}`}
                    >
                      {niche.commercialPotential} potential
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {niche.description}
                  </p>

                  <div className="mt-3 rounded-lg bg-[#1D202A] p-3">
                    <p className="text-[11px] font-medium text-slate-300">
                      Why it's trending
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {niche.trendReason}
                    </p>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-1.5">
                      <Target size={13} className="text-slate-500" />
                      <p className="text-[11px] font-medium text-slate-400">
                        Potential buyers
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {niche.targetBuyers.map((buyer) => (
                        <span
                          key={buyer}
                          className="rounded-md border border-[#303541] px-2 py-1 text-[10px] text-slate-400"
                        >
                          {buyer}
                        </span>
                      ))}
                    </div>
                  </div>

                  {niche.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {niche.sources.map((source, sourceIndex) => {
                        const safeUrl = (() => {
                          try {
                            const url = new URL(source);
                            return ["https:", "http:"].includes(url.protocol)
                              ? url.href
                              : null;
                          } catch {
                            return null;
                          }
                        })();

                        return safeUrl ? (
                          <a
                            key={`${safeUrl}-${sourceIndex}`}
                            href={safeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#A78BFA] hover:underline"
                          >
                            Source {sourceIndex + 1}
                            <ExternalLink size={11} />
                          </a>
                        ) : null;
                      })}
                    </div>
                  )}

                  <button
                    className={`${primaryButtonClass} mt-4 w-full`}
                    onClick={() => onSelectNiche(niche)}
                  >
                    Select this niche
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
