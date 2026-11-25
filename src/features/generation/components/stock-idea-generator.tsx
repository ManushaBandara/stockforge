import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Sparkles,
  LoaderCircle,
  Save,
  Image,
  FileText,
  Tags,
  CheckCircle2,
} from "lucide-react";

import { notify } from "@/features/notifications/lib/notification";

import {
  Panel,
  PanelHeading,
  primaryButtonClass,
} from "@/components/ui/page-ui";

import { buildStockIdeaPrompt } from "../lib/stock-idea-prompt";
import { parseStockIdea } from "../lib/parse-stock-idea";

import type {
  GeminiGeneration,
  StockIdea,
  StockIdeaGeneration,
  TrendingNiche,
} from "../types/stock-idea.types";

interface StockIdeaGeneratorProps {
  niche: TrendingNiche;
}

export default function StockIdeaGenerator({ niche }: StockIdeaGeneratorProps) {
  const [generatedIdea, setGeneratedIdea] =
    useState<StockIdeaGeneration | null>(null);

  const [groundingMetadata, setGroundingMetadata] = useState<Record<
    string,
    unknown
  > | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedIdea, setSavedIdea] = useState<StockIdea | null>(null);
  const [error, setError] = useState("");

  async function generateIdea() {
    setLoading(true);
    setError("");
    setGeneratedIdea(null);
    setGroundingMetadata(null);
    setSavedIdea(null);

    try {
      const prompt = buildStockIdeaPrompt(niche);

      const response = await invoke<GeminiGeneration>("generate_ai_content", {
        prompt,
      });

      const idea = parseStockIdea(response.text);

      setGeneratedIdea(idea);
      setGroundingMetadata(response.groundingMetadata);

      notify.success("Stock idea generated successfully!");
    } catch (err) {
      const message = String(err);
      setError(message);

      notify.error("Stock idea generation failed", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveIdea() {
    if (!generatedIdea || saving || savedIdea) return;

    setSaving(true);

    try {
      const fullJson = JSON.stringify(
        {
          ...generatedIdea,
          groundingMetadata,
        },
        null,
        2,
      );

      const trendResearchJson = JSON.stringify(
        {
          selectedNiche: niche,
          generatedResearch: generatedIdea.trendResearch,
          groundingMetadata,
        },
        null,
        2,
      );

      const input = {
        name: generatedIdea.name,
        category: generatedIdea.category,
        trendResearchJson,
        imagePrompt: generatedIdea.imagePrompt,
        title: generatedIdea.metadata.title,
        description: generatedIdea.metadata.description,
        keywordsJson: JSON.stringify(generatedIdea.metadata.keywords),
        fullJson,
      };

      const saved = await invoke<StockIdea>("create_stock_idea", {
        input,
      });

      setSavedIdea(saved);

      notify.success("Stock idea saved to database!", {
        description: generatedIdea.name,
      });
    } catch (err) {
      notify.error("Could not save stock idea", {
        description: String(err),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <PanelHeading
        title="Stock Idea Generator"
        description="Generate an original image concept and Adobe Stock metadata from your selected niche."
        action={
          <button
            className={primaryButtonClass}
            onClick={generateIdea}
            disabled={loading || saving}
          >
            {loading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {loading
              ? "Generating..."
              : generatedIdea
                ? "Regenerate idea"
                : "Generate stock idea"}
          </button>
        }
      />

      <div className="space-y-5 p-5">
        <div className="rounded-lg border border-[#39334F] bg-[#1B1927] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Selected niche
          </p>

          <h3 className="mt-1 text-sm font-semibold text-white">
            {niche.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">{niche.category}</p>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {niche.description}
          </p>
        </div>

        {!generatedIdea && !loading && !error && (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <div className="rounded-xl border border-[#39334F] bg-[#211D30] p-4">
              <Sparkles size={25} className="text-[#A78BFA]" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Ready to create your stock idea
            </h3>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              Gemini will create an original image prompt, title, description
              and relevant keywords using the selected niche.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <LoaderCircle size={30} className="animate-spin text-[#A78BFA]" />

            <p className="mt-4 text-sm font-medium text-white">
              Creating your stock idea...
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Generating image prompt and Adobe Stock metadata.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400">
              Generation failed
            </p>

            <p className="mt-2 break-words text-xs text-slate-400">{error}</p>

            <button
              className="mt-3 text-xs font-medium text-white underline"
              onClick={generateIdea}
            >
              Try again
            </button>
          </div>
        )}

        {generatedIdea && !loading && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {generatedIdea.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {generatedIdea.category}
                </p>
              </div>

              {savedIdea && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 size={13} />
                  Saved
                </span>
              )}
            </div>

            {/* Image prompt */}
            <section className="rounded-lg border border-[#303541] bg-[#151820] p-4">
              <div className="flex items-center gap-2">
                <Image size={16} className="text-[#A78BFA]" />
                <h4 className="text-sm font-semibold text-white">
                  Image Generation Prompt
                </h4>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
                {generatedIdea.imagePrompt}
              </p>
            </section>

            {/* Metadata */}
            <section className="rounded-lg border border-[#303541] bg-[#151820] p-4">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#A78BFA]" />
                <h4 className="text-sm font-semibold text-white">
                  Adobe Stock Metadata
                </h4>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Title
                </p>

                <p className="mt-1 text-sm text-white">
                  {generatedIdea.metadata.title}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {generatedIdea.metadata.description}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tags size={14} className="text-slate-400" />
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Keywords
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {generatedIdea.metadata.keywords.length} keywords
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {generatedIdea.metadata.keywords.map((keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded-md border border-[#303541] bg-[#1D202A] px-2 py-1 text-[11px] text-slate-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Trend research */}
            <section className="rounded-lg border border-[#303541] bg-[#151820] p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#A78BFA]" />
                <h4 className="text-sm font-semibold text-white">
                  Trend Research
                </h4>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {generatedIdea.trendResearch.summary}
              </p>

              <div className="mt-4 space-y-3">
                {generatedIdea.trendResearch.trends.map((trend, index) => (
                  <div
                    key={`${trend.trend}-${index}`}
                    className="rounded-lg bg-[#1D202A] p-3"
                  >
                    <p className="text-xs font-medium text-white">
                      {trend.trend}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {trend.reason}
                    </p>

                    {trend.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {trend.sources.map((source, sourceIndex) => {
                          try {
                            const url = new URL(source);

                            if (
                              url.protocol !== "https:" &&
                              url.protocol !== "http:"
                            ) {
                              return null;
                            }

                            return (
                              <a
                                key={`${source}-${sourceIndex}`}
                                href={url.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#A78BFA] hover:underline"
                              >
                                Source {sourceIndex + 1}
                              </a>
                            );
                          } catch {
                            return null;
                          }
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Save actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303541] pt-4">
              <p className="text-xs text-slate-500">
                Review the generated content before saving it.
              </p>

              <button
                className={primaryButtonClass}
                onClick={saveIdea}
                disabled={saving || Boolean(savedIdea)}
              >
                {saving ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : savedIdea ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Save size={15} />
                )}

                {saving
                  ? "Saving..."
                  : savedIdea
                    ? "Saved to database"
                    : "Approve & Save"}
              </button>
            </div>

            {savedIdea && (
              <p className="text-right text-[11px] text-emerald-400">
                Stock idea ID: {savedIdea.id}
              </p>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}
