import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  AlertCircle,
  Check,
  Clock3,
  FileImage,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  Panel,
  PanelHeading,
  StatusBadge,
  inputClass,
  buttonClass,
} from "@/components/ui/page-ui";

interface Batch {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  style: string | null;
  targetCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  assetCount: number;
}

interface ManualAssetDraft {
  id: string;
  sourcePath: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  keywordsText: string;
}

interface ManualAssetInput {
  sourcePath: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
}

const categories = [
  "Animals",
  "Architecture",
  "Business",
  "Drinks",
  "Environment",
  "Food",
  "Health",
  "Industry",
  "Landscape",
  "Lifestyle",
  "Nature",
  "Objects",
  "People",
  "Science",
  "Technology",
  "Travel",
];

function getFilename(path: string) {
  return path.split(/[\\/]/).pop() ?? path;
}

function getKeywords(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  ];
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export default function ManualBatchWorkspace() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchName, setBatchName] = useState("");
  const [assets, setAssets] = useState<ManualAssetDraft[]>([]);

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBatches = useCallback(async () => {
    const result = await invoke<Batch[]>("get_batches");
    setBatches(result);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        setLoading(true);
        setError(null);

        const result = await invoke<Batch[]>("get_batches");

        if (active) {
          setBatches(result);
        }
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

    initialize();

    return () => {
      active = false;
    };
  }, []);

  async function handleSelectImages() {
    if (selecting) return;

    try {
      setSelecting(true);
      setError(null);

      const selectedPaths = await open({
        multiple: true,
        directory: false,
        title: "Select your photographs",
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "jpeg", "png", "webp", "tif", "tiff"],
          },
        ],
      });

      if (!selectedPaths) return;

      const paths = Array.isArray(selectedPaths)
        ? selectedPaths
        : [selectedPaths];

      setAssets((current) => {
        const existingPaths = new Set(current.map((asset) => asset.sourcePath));

        const additions = paths
          .filter((path) => !existingPaths.has(path))
          .map((path) => {
            const filename = getFilename(path);
            const title = filename
              .replace(/\.[^.]+$/, "")
              .replace(/[_-]+/g, " ");

            return {
              id: crypto.randomUUID(),
              sourcePath: path,
              filename,
              title,
              description: "",
              category: "",
              keywordsText: "",
            };
          });

        return [...current, ...additions];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSelecting(false);
    }
  }

  function updateAsset(
    id: string,
    field: keyof Omit<ManualAssetDraft, "id" | "sourcePath" | "filename">,
    value: string,
  ) {
    setAssets((current) =>
      current.map((asset) =>
        asset.id === id ? { ...asset, [field]: value } : asset,
      ),
    );
  }

  function removeAsset(id: string) {
    setAssets((current) => current.filter((asset) => asset.id !== id));
  }

  async function handleSaveBatch() {
    if (saving) return;

    const name = batchName.trim();

    if (!name) {
      setError("Enter a batch name.");
      return;
    }

    if (assets.length === 0) {
      setError("Select at least one photograph.");
      return;
    }

    const incomplete = assets.find(
      (asset) => !asset.title.trim() || !asset.category.trim(),
    );

    if (incomplete) {
      setError(`Complete the title and category for "${incomplete.filename}".`);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Create the batch first.
      const batch = await invoke<Batch>("create_batch", {
        input: {
          name,
          targetCount: assets.length,
        },
      });

      // Import originals and their manually entered metadata.
      const importAssets: ManualAssetInput[] = assets.map((asset) => ({
        sourcePath: asset.sourcePath,
        title: asset.title.trim(),
        description: asset.description.trim(),
        category: asset.category.trim(),
        keywords: getKeywords(asset.keywordsText),
      }));

      const importedIds = await invoke<string[]>("import_manual_batch_assets", {
        batchId: batch.id,
        assets: importAssets,
      });

      await loadBatches();

      setBatchName("");
      setAssets([]);

      setSuccess(
        `Successfully imported ${importedIds.length} photographs into "${batch.name}".`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="min-w-0 flex-1 break-words">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <Check size={16} />
          <p>{success}</p>
        </div>
      )}

      <Panel className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Create a manual batch
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Import your own photographs and enter their Adobe Stock metadata.
            </p>
          </div>

          <span className="rounded-full border border-[#45405F] bg-[#29243D] px-3 py-1 text-[11px] text-[#C5BCFF]">
            Manual workflow
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-300">
              Batch name
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Sri Lanka nature photography"
              value={batchName}
              onChange={(event) => setBatchName(event.target.value)}
              maxLength={120}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className={buttonClass}
              onClick={handleSelectImages}
              disabled={selecting || saving}
            >
              {selecting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ImagePlus size={15} />
              )}
              {selecting ? "Opening..." : "Select photographs"}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#303541] bg-[#111318] px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileImage size={16} />
            <span>
              {assets.length} photograph{assets.length === 1 ? "" : "s"}{" "}
              selected
            </span>
          </div>

          {assets.length > 0 && (
            <button
              type="button"
              onClick={() => setAssets([])}
              disabled={saving}
              className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      </Panel>

      {assets.length > 0 && (
        <Panel>
          <PanelHeading
            title="Photograph metadata"
            description="Enter metadata separately for every photograph."
          />

          <div className="divide-y divide-[#272B35]">
            {assets.map((asset, index) => (
              <div key={asset.id} className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#303541] bg-[#191C24]">
                    <FileImage size={18} className="text-[#A99BFF]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white">
                      Photograph {index + 1}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      {asset.filename}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAsset(asset.id)}
                    disabled={saving}
                    className="rounded-md p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    aria-label={`Remove ${asset.filename}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Title *
                    </label>
                    <input
                      className={inputClass}
                      value={asset.title}
                      onChange={(event) =>
                        updateAsset(asset.id, "title", event.target.value)
                      }
                      placeholder="Enter the stock image title"
                      maxLength={200}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Description
                    </label>
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      value={asset.description}
                      onChange={(event) =>
                        updateAsset(asset.id, "description", event.target.value)
                      }
                      placeholder="Describe the photograph..."
                      maxLength={2000}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Category *
                    </label>
                    <select
                      className={inputClass}
                      value={asset.category}
                      onChange={(event) =>
                        updateAsset(asset.id, "category", event.target.value)
                      }
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Keywords
                    </label>
                    <textarea
                      className={`${inputClass} min-h-20 resize-y`}
                      value={asset.keywordsText}
                      onChange={(event) =>
                        updateAsset(
                          asset.id,
                          "keywordsText",
                          event.target.value,
                        )
                      }
                      placeholder="nature, landscape, tropical, forest"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Separate keywords with commas. Maximum 50 unique keywords.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#272B35] p-5">
            <p className="text-xs text-slate-500">
              {assets.length} photograph{assets.length === 1 ? "" : "s"} ready
              for import
            </p>

            <button
              type="button"
              className={buttonClass}
              onClick={handleSaveBatch}
              disabled={saving}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving batch..." : "Save batch and photographs"}
            </button>
          </div>
        </Panel>
      )}

      <Panel>
        <PanelHeading
          title="Existing batches"
          description={`${batches.length} saved batches`}
        />

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-xs text-slate-500">
            <Loader2 size={15} className="animate-spin" />
            Loading batches...
          </div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center">
            <Clock3 size={26} className="mx-auto text-slate-600" />
            <p className="mt-3 text-sm text-slate-300">No batches yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Create your first manual batch above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#272B35]">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {batch.name}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Created {formatDate(batch.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {batch.assetCount}
                    </p>
                    <p className="text-[10px] text-slate-500">Photographs</p>
                  </div>
                  <StatusBadge status={batch.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
