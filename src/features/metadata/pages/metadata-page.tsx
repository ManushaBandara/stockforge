import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  AlertCircle,
  Check,
  Clock3,
  Image as ImageIcon,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import {
  PageHeader,
  Panel,
  PanelHeading,
  StatusBadge,
  inputClass,
  buttonClass,
} from "@/components/ui/page-ui";

interface MetadataStudioItem {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  keywords: string[];
  imagePrompt: string;
  assetId: string | null;
  imagePath: string | null;
  imageGenerationStatus: string;
  metadataStatus: string;
  submissionStatus: string;
  createdAt: string;
}

interface MetadataStudioData {
  items: MetadataStudioItem[];
  total: number;
  missingImages: number;
  imagesReady: number;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function getImageStatus(item: MetadataStudioItem) {
  if (item.imagePath) return "Ready";

  switch (item.imageGenerationStatus) {
    case "queued":
    case "pending":
      return "Queued";
    case "running":
      return "Generating";
    case "failed":
      return "Failed";
    default:
      return "Missing image";
  }
}

export default function MetadataPage() {
  const [data, setData] = useState<MetadataStudioData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMetadataStudio() {
      try {
        setLoading(true);
        setError(null);

        const result = await invoke<MetadataStudioData>(
          "get_metadata_studio_data",
        );

        if (!active) return;

        setData(result);

        setSelectedId((current) => {
          if (current && result.items.some((item) => item.id === current)) {
            return current;
          }

          return result.items[0]?.id ?? null;
        });
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMetadataStudio();

    return () => {
      active = false;
    };
  }, []);

  const items = data?.items ?? [];

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      [item.name, item.category, item.title, item.description, ...item.keywords]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  const selectedAsset = items.find((item) => item.id === selectedId) ?? null;

  const missingImageItems = items.filter((item) => !item.imagePath);

  const selectedMissingCount = selectedIds.size;

  function toggleSelection(item: MetadataStudioItem) {
    if (item.imagePath) return;

    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }

      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((current) => {
      const allSelected = missingImageItems.every((item) =>
        current.has(item.id),
      );

      if (allSelected) {
        return new Set();
      }

      return new Set(missingImageItems.map((item) => item.id));
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  return (
    <div>
      <PageHeader
        eyebrow="Optimization"
        title="Metadata Studio"
        description="Review Gemini-generated metadata and prepare your stock ideas for image generation."
      />

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Unable to load Metadata Studio</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Panel className="p-4">
          <p className="text-xs text-slate-400">Unpublished ideas</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {data?.total ?? "—"}
          </p>
        </Panel>

        <Panel className="p-4">
          <p className="text-xs text-slate-400">Missing images</p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">
            {data?.missingImages ?? "—"}
          </p>
        </Panel>

        <Panel className="p-4">
          <p className="text-xs text-slate-400">Images ready</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {data?.imagesReady ?? "—"}
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        {/* Asset list */}
        <Panel className="h-fit">
          <PanelHeading
            title="Stock ideas"
            description={`${filteredItems.length} ideas`}
          />

          <div className="border-b border-[#272B35] p-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                className={`${inputClass} py-2 pl-8 text-xs`}
                placeholder="Search ideas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleSelectAll}
                disabled={missingImageItems.length === 0}
                className="text-xs text-[#A99BFF] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {missingImageItems.length > 0 &&
                missingImageItems.every((item) => selectedIds.has(item.id))
                  ? "Deselect all"
                  : "Select missing images"}
              </button>

              <span className="text-[11px] text-slate-500">
                {selectedMissingCount} selected
              </span>
            </div>
          </div>

          <div className="max-h-[650px] space-y-1 overflow-y-auto p-2">
            {loading ? (
              <p className="p-4 text-center text-xs text-slate-500">
                Loading stock ideas...
              </p>
            ) : filteredItems.length === 0 ? (
              <p className="p-4 text-center text-xs text-slate-500">
                No stock ideas found.
              </p>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedId === item.id;
                const isChecked = selectedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2 rounded-lg p-3 transition ${
                      isSelected ? "bg-[#302B46]" : "hover:bg-[#222630]"
                    }`}
                  >
                    {!item.imagePath && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelection(item)}
                        aria-label={`Select ${item.name} for image generation`}
                        className="mt-1 size-3.5 shrink-0 accent-[#8B7CFF]"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <ImageIcon
                          size={17}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-slate-200">
                            {item.name}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-slate-500">
                            {item.category}
                          </p>

                          <div className="mt-2">
                            <StatusBadge status={getImageStatus(item)} />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        {/* Metadata details */}
        <div className="min-w-0 space-y-4">
          <Panel>
            <PanelHeading
              title="Asset preview"
              description={selectedAsset?.name ?? "Select a stock idea"}
            />

            <div className="flex aspect-[16/7] flex-col items-center justify-center gap-3 bg-gradient-to-br from-indigo-500/10 via-[#25283A] to-slate-900">
              {selectedAsset?.imagePath ? (
                <>
                  <Check size={36} className="text-emerald-400" />
                  <p className="text-sm text-emerald-300">Image file linked</p>
                  <p className="max-w-[80%] break-all text-center text-[11px] text-slate-500">
                    {selectedAsset.imagePath}
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon size={48} className="text-white/30" />
                  <p className="text-xs text-slate-500">
                    No generated image yet
                  </p>
                </>
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeading
              title="Generated metadata"
              description="Information saved from Gemini"
            />

            {selectedAsset ? (
              <div className="space-y-5 p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">
                      Title
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {selectedAsset.title.length} characters
                    </span>
                  </div>

                  <textarea
                    readOnly
                    className={`${inputClass} min-h-20 resize-y`}
                    value={selectedAsset.title}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">
                      Description
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {selectedAsset.description.length} characters
                    </span>
                  </div>

                  <textarea
                    readOnly
                    className={`${inputClass} min-h-32 resize-y`}
                    value={selectedAsset.description}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">
                      Keywords
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {selectedAsset.keywords.length} keywords
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-lg border border-[#303541] bg-[#111318] p-3">
                    {selectedAsset.keywords.map((keyword, index) => (
                      <span
                        key={`${keyword}-${index}`}
                        className="rounded-md border border-[#45405F] bg-[#29243D] px-2 py-1 text-xs text-[#C5BCFF]"
                      >
                        {keyword}
                      </span>
                    ))}

                    {selectedAsset.keywords.length === 0 && (
                      <p className="text-xs text-slate-500">
                        No keywords available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="p-5 text-xs text-slate-500">
                Select a stock idea to view its metadata.
              </p>
            )}
          </Panel>
        </div>

        {/* Details and image generation */}
        <div className="space-y-4">
          <Panel>
            <PanelHeading
              title="Image generation"
              description="Saved Gemini image prompt"
            />

            <div className="p-4">
              {selectedAsset ? (
                <>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#C5BCFF]">
                    <Sparkles size={16} />
                    Image prompt
                  </div>

                  <textarea
                    readOnly
                    className={`${inputClass} min-h-44 resize-y text-xs leading-relaxed`}
                    value={selectedAsset.imagePrompt}
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Image status</span>
                    <StatusBadge status={getImageStatus(selectedAsset)} />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Select an idea to view its image prompt.
                </p>
              )}
            </div>
          </Panel>

          <Panel className="p-4">
            <h3 className="text-sm font-semibold text-white">Bulk selection</h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Select multiple ideas without images from the list. They will be
              available for bulk image generation.
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Selected ideas</span>
              <span className="text-sm font-semibold text-white">
                {selectedMissingCount}
              </span>
            </div>

            {selectedMissingCount > 0 && (
              <button
                type="button"
                className={`${buttonClass} mt-3 w-full`}
                onClick={clearSelection}
              >
                <X size={14} />
                Clear selection
              </button>
            )}

            <div className="mt-3 rounded-lg border border-[#303541] bg-[#111318] p-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock3 size={14} />
                Image generation queue will be implemented next.
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <h3 className="text-sm font-semibold text-white">
              Idea information
            </h3>

            {selectedAsset ? (
              <div className="mt-3 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Category</span>
                  <span className="text-right text-slate-200">
                    {selectedAsset.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Created</span>
                  <span className="text-right text-slate-200">
                    {formatDate(selectedAsset.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Metadata status</span>
                  <StatusBadge status={selectedAsset.metadataStatus} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">No idea selected.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
