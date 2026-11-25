import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Database,
  RefreshCw,
  LoaderCircle,
  Image,
  Tags,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import { Panel, PanelHeading } from "@/components/ui/page-ui";

import type { StockIdea } from "../types/stock-idea.types";

export default function SavedStockIdeas() {
  const [ideas, setIdeas] = useState<StockIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIdeas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await invoke<StockIdea[]>("get_stock_ideas");
      setIdeas(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIdeas();
  }, [loadIdeas]);

  return (
    <Panel className="mt-5">
      <PanelHeading
        title="Saved Stock Ideas"
        description="Your previously generated and approved stock concepts."
        action={
          <button
            onClick={loadIdeas}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#343946] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-[#6256A8] hover:text-white disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </button>
        }
      />

      <div className="p-5">
        {loading && (
          <div className="flex min-h-[120px] items-center justify-center gap-3">
            <LoaderCircle size={20} className="animate-spin text-[#A78BFA]" />
            <p className="text-xs text-slate-400">Loading saved ideas...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400" />
              <p className="text-sm font-medium text-red-400">
                Could not load saved ideas
              </p>
            </div>

            <p className="mt-2 break-words text-xs text-slate-400">{error}</p>

            <button
              onClick={loadIdeas}
              className="mt-3 text-xs text-white underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && ideas.length === 0 && (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <div className="rounded-xl border border-[#39334F] bg-[#211D30] p-4">
              <Database size={25} className="text-[#A78BFA]" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No saved ideas yet
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
              Generate a stock idea and approve it to see it here.
            </p>
          </div>
        )}

        {!loading && !error && ideas.length > 0 && (
          <div className="space-y-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {ideas.length} saved {ideas.length === 1 ? "idea" : "ideas"}
              </p>
            </div>

            {ideas.map((idea) => {
              let keywords: string[] = [];

              try {
                const parsed: unknown = JSON.parse(idea.keywordsJson);
                if (
                  Array.isArray(parsed) &&
                  parsed.every((item) => typeof item === "string")
                ) {
                  keywords = parsed;
                }
              } catch {
                keywords = [];
              }

              return (
                <details
                  key={idea.id}
                  className="group rounded-xl border border-[#303541] bg-[#151820]"
                >
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg border border-[#39334F] sf-accent-soft p-2.5">
                        <Image size={17} className="sf-accent-text" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-white">
                          {idea.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {idea.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays size={13} />
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </div>
                  </summary>

                  <div className="space-y-4 border-t border-[#303541] p-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Adobe Stock Title
                      </p>
                      <p className="mt-1 text-sm text-white">{idea.title}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Description
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {idea.description}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        <Tags size={13} />
                        Keywords ({keywords.length})
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {keywords.map((keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="rounded-md border border-[#303541] px-2 py-1 text-[10px] text-slate-400"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <details className="rounded-lg bg-[#1D202A] p-3">
                      <summary className="cursor-pointer text-xs font-medium text-slate-300">
                        View image generation prompt
                      </summary>

                      <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
                        {idea.imagePrompt}
                      </p>
                    </details>

                    <p className="break-all text-[10px] text-slate-600">
                      ID: {idea.id}
                    </p>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}
