import { useState } from "react";
import {
  Plus,
  Images,
  Layers,
  Clock3,
  AlertCircle,
  Target,
} from "lucide-react";

import {
  PageHeader,
  Panel,
  StatCard,
  buttonClass,
  primaryButtonClass,
  inputClass,
} from "@/components/ui/page-ui";

import NicheDiscoveryPanel from "../components/niche-discovery-panel";
import StockIdeaGenerator from "../components/stock-idea-generator";
import type { TrendingNiche } from "../types/stock-idea.types";
import SavedStockIdeas from "../components/saved-stock-ideas";

const initialBatches = [
  {
    id: "B-1042",
    name: "Abstract backgrounds — November",
    assets: 48,
    completed: 42,
    status: "Processing",
    date: "Nov 17, 2026",
  },
  {
    id: "B-1041",
    name: "Workspace photography",
    assets: 32,
    completed: 32,
    status: "Ready",
    date: "Nov 16, 2026",
  },
  {
    id: "B-1040",
    name: "Nature collection",
    assets: 24,
    completed: 18,
    status: "Failed",
    date: "Nov 15, 2026",
  },
];

export default function GenerationPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState("");
  const [batches, setBatches] = useState(initialBatches);
  const [showCreate, setShowCreate] = useState(false);

  const [selectedNiche, setSelectedNiche] = useState<TrendingNiche | null>(
    null,
  );

  function createBatch() {
    if (!batchName.trim()) return;

    setBatches((current) => [
      {
        id: `B-${1043 + current.length - initialBatches.length}`,
        name: batchName.trim(),
        assets: files.length,
        completed: 0,
        status: "Pending",
        date: new Date().toLocaleDateString(),
      },
      ...current,
    ]);

    setBatchName("");
    setFiles([]);
    setShowCreate(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Production"
        title="Generation"
        description="Discover stock-content opportunities, generate creative ideas and organize production assets."
        actions={
          <button
            className={primaryButtonClass}
            onClick={() => setShowCreate(true)}
          >
            <Plus size={16} />
            New batch
          </button>
        }
      />
      {/* GENERATION STATISTICS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total batches"
          value="24"
          detail="Across all production"
          icon={Layers}
        />

        <StatCard
          label="Active batches"
          value="3"
          detail="Currently processing"
          icon={Clock3}
        />

        <StatCard
          label="Assets imported"
          value="1,284"
          detail="All batches combined"
          icon={Images}
        />

        <StatCard
          label="Needs attention"
          value="2"
          detail="Failed or incomplete"
          icon={AlertCircle}
        />
      </div>

      {/* AI TREND DISCOVERY */}
      <div className="mb-5">
        <NicheDiscoveryPanel
          onSelectNiche={(niche) => setSelectedNiche(niche)}
        />
      </div>

      {/* SELECTED NICHE */}

      {/* SELECTED NICHE */}
      {selectedNiche && (
        <>
          <Panel className="mb-5">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-[#39334F] sf-accent-soft p-3">
                  <Target size={20} className="text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Selected stock niche</p>

                  <h3 className="mt-1 text-sm font-semibold text-white">
                    {selectedNiche.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {selectedNiche.category}
                  </p>

                  <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
                    {selectedNiche.description}
                  </p>

                  <span className="mt-3 inline-flex rounded-full border border-[#39334F] sf-accent-soft px-2.5 py-1 text-[10px] font-medium capitalize text-white">
                    {selectedNiche.commercialPotential} commercial potential
                  </span>
                </div>
              </div>

              <button
                className={buttonClass}
                onClick={() => setSelectedNiche(null)}
              >
                Change selection
              </button>
            </div>
          </Panel>

          <div className="mb-5">
            <StockIdeaGenerator niche={selectedNiche} />
          </div>
        </>
      )}

      {/* SAVED STOCK IDEAS */}

      <div className="mb-5">
        <SavedStockIdeas />
      </div>
      {/* IMPORT AND WORKFLOW
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <PanelHeading
            title="Import assets"
            description="Select images from your computer to prepare a production batch."
          />

          <div className="p-5 bg-card border-border">
            <label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#45405F] sf-accent-soft px-6 text-center transition hover:border-[#8B7CFF] hover:bg-[#1D1B2A]">
              <div className="mb-4 rounded-xl border border-[#39334F] sf-accent-soft p-4">
                <Upload size={25} className="text-white" />
              </div>

              <p className="text-sm font-semibold text-white">
                Drop your images here
              </p>

              <p className="mt-1 text-xs text-slate-500">
                or browse files from your computer
              </p>

              <span className="mt-4 rounded-lg border border-[#39334F] px-3 py-2 text-xs font-medium text-slate-300">
                Choose images
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) =>
                  setFiles(Array.from(event.target.files ?? []))
                }
              />
            </label>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Supported: PNG, JPG, JPEG, WebP</span>
              <span>{files.length} selected</span>
            </div>

            {files.length > 0 && (
              <div className="mt-4 rounded-lg border border-[#303541] bg-[#111318] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-white">
                    Selected files
                  </p>

                  <button
                    onClick={() => setFiles([])}
                    className="text-xs text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 text-xs text-slate-400"
                    >
                      <Images size={14} />

                      <span className="min-w-0 flex-1 truncate">
                        {file.name}
                      </span>

                      <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeading
            title="Production workflow"
            description="How assets move through StockForge."
          />

          <div className="space-y-4 p-5">
            {[
              [
                "01",
                "Import images",
                "Bring externally created images into StockForge.",
                Upload,
              ],
              [
                "02",
                "Validate files",
                "Check file types, dimensions, and duplicates.",
                CheckCircle2,
              ],
              [
                "03",
                "Prepare metadata",
                "Send assets to Metadata Studio.",
                Images,
              ],
              [
                "04",
                "Review submission",
                "Prepare approved assets for Adobe Stock.",
                FolderOpen,
              ],
            ].map(([number, title, description, Icon]) => {
              const StepIcon = Icon as typeof Upload;

              return (
                <div key={number as string} className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg sf-accent-soft text-xs font-semibold text-white">
                    {number as string}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {title as string}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {description as string}
                    </p>
                  </div>

                  <StepIcon
                    size={16}
                    className="ml-auto mt-1 shrink-0 text-slate-500"
                  />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>*/}

      {/* RECENT BATCHES
      <Panel className="mt-5">
        <PanelHeading
          title="Recent batches"
          description="Monitor your imported asset collections."
          action={
            <button className={buttonClass} onClick={() => setShowCreate(true)}>
              <Plus size={15} />
              Create batch
            </button>
          }
        />

        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Batch</th>
                <th className="pb-3 font-medium">Assets</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>

            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-t border-[#272B35]">
                  <td className="py-4">
                    <p className="font-medium text-white">{batch.name}</p>

                    <p className="mt-1 text-xs text-slate-500">{batch.id}</p>
                  </td>

                  <td className="py-4 text-slate-300">{batch.assets}</td>

                  <td className="py-4">
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                        <span>
                          {batch.completed}/{batch.assets}
                        </span>

                        <span>
                          {batch.assets
                            ? Math.round((batch.completed / batch.assets) * 100)
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-[#303541]">
                        <div
                          className="h-full rounded-full bg-[#8B7CFF]"
                          style={{
                            width: `${
                              batch.assets
                                ? (batch.completed / batch.assets) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 text-xs text-slate-400">{batch.date}</td>

                  <td className="py-4">
                    <StatusBadge status={batch.status} />
                  </td>

                  <td className="py-4 text-right">
                    <button
                      className="text-slate-500 hover:text-white"
                      aria-label={`Open ${batch.name}`}
                    >
                      <ArrowRight size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
*/}
      {/* CREATE BATCH MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#343946] bg-[#191C23] p-5 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">
              Create production batch
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Give this collection a name and select its images.
            </p>

            <label className="mt-5 block text-xs font-medium text-slate-400">
              Batch name
            </label>

            <input
              className={`${inputClass} mt-2`}
              placeholder="e.g. November abstract collection"
              value={batchName}
              onChange={(event) => setBatchName(event.target.value)}
              autoFocus
            />

            <p className="mt-3 text-xs text-slate-500">
              {files.length} image(s) currently selected for this batch.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className={buttonClass}
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>

              <button
                className={primaryButtonClass}
                disabled={!batchName.trim()}
                onClick={createBatch}
              >
                Create batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
