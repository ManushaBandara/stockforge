import { useState } from "react";
import {
  Sparkles,
  Image,
  Save,
  WandSparkles,
  RefreshCw,
  Check,
  Plus,
  X,
  Search,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  PanelHeading,
  StatusBadge,
  inputClass,
  buttonClass,
  primaryButtonClass,
} from "@/components/ui/page-ui";

const metadataAssets = [
  { id: 1, name: "minimalist-workspace.jpg", status: "Pending" },
  { id: 2, name: "abstract-gradient.png", status: "Ready" },
  { id: 3, name: "modern-architecture.jpg", status: "Ready" },
  { id: 4, name: "nature-background.jpg", status: "Pending" },
];

export default function MetadataPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [title, setTitle] = useState(
    "Minimalist modern workspace with laptop and natural lighting",
  );
  const [description, setDescription] = useState(
    "A clean and minimal modern workspace featuring a laptop on a desk with soft natural lighting. Suitable for business, productivity, and technology concepts.",
  );
  const [keywords, setKeywords] = useState([
    "workspace",
    "office",
    "laptop",
    "minimalist",
    "desk",
    "productivity",
    "business",
    "technology",
    "modern",
    "interior",
  ]);
  const [keywordInput, setKeywordInput] = useState("");
  const [saved, setSaved] = useState(false);
  const selectedAsset = metadataAssets.find(
    (asset) => asset.id === selectedId,
  )!;

  function addKeyword() {
    const value = keywordInput.trim().toLowerCase();
    if (value && !keywords.includes(value)) {
      setKeywords((current) => [...current, value]);
      setKeywordInput("");
      setSaved(false);
    }
  }

  function removeKeyword(value: string) {
    setKeywords((current) => current.filter((keyword) => keyword !== value));
    setSaved(false);
  }

  function generateSuggestions() {
    setTitle("Modern minimalist workspace with laptop on a clean desk");
    setDescription(
      "A modern minimalist workspace featuring a laptop on a clean desk in a bright, naturally lit environment. Ideal for concepts related to remote work, productivity, business, and technology.",
    );
    setKeywords([
      "workspace",
      "minimalist",
      "laptop",
      "remote work",
      "office",
      "productivity",
      "technology",
      "business",
      "desk",
      "modern",
      "workplace",
      "computer",
    ]);
    setSaved(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Optimization"
        title="Metadata Studio"
        description="Create, edit, and validate titles, descriptions, and keywords for your assets."
        actions={
          <>
            <button className={buttonClass} onClick={generateSuggestions}>
              <WandSparkles size={16} /> Generate suggestions
            </button>
            <button
              className={primaryButtonClass}
              onClick={() => setSaved(true)}
            >
              <Save size={16} /> Save metadata
            </button>
          </>
        }
      />

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <Check size={16} /> Metadata saved in this preview session.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[230px_minmax(0,1fr)_260px]">
        <Panel className="h-fit">
          <PanelHeading
            title="Assets"
            description={`${metadataAssets.length} assets to review`}
          />
          <div className="border-b border-[#272B35] p-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                className={`${inputClass} py-2 pl-8 text-xs`}
                placeholder="Find an asset..."
              />
            </div>
          </div>
          <div className="space-y-1 p-2">
            {metadataAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedId(asset.id);
                  setSaved(false);
                }}
                className={`w-full rounded-lg p-3 text-left transition ${
                  selectedId === asset.id
                    ? "bg-[#302B46]"
                    : "hover:bg-[#222630]"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Image size={17} className="mt-0.5 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-200">
                      {asset.name}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={asset.status} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeading
              title="Asset preview"
              description={selectedAsset.name}
            />
            <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-indigo-500/20 via-[#25283A] to-slate-900">
              <Image size={52} className="text-white/40" />
            </div>
          </Panel>

          <Panel>
            <PanelHeading
              title="Metadata editor"
              description="Edit the information associated with this asset."
            />
            <div className="space-y-5 p-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Title
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {title.length} characters
                  </span>
                </div>
                <input
                  className={inputClass}
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setSaved(false);
                  }}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Description
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setSaved(false);
                  }}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Keywords
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {keywords.length} keywords
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 rounded-lg border border-[#303541] bg-[#111318] p-3">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 rounded-md border border-[#45405F] bg-[#29243D] px-2 py-1 text-xs text-[#C5BCFF]"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        aria-label={`Remove ${keyword}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <form
                    className="flex min-w-[130px] flex-1 items-center gap-1"
                    onSubmit={(event) => {
                      event.preventDefault();
                      addKeyword();
                    }}
                  >
                    <input
                      className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                      placeholder="Add keyword..."
                      value={keywordInput}
                      onChange={(event) => setKeywordInput(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="text-slate-400 hover:text-white"
                      aria-label="Add keyword"
                    >
                      <Plus size={15} />
                    </button>
                  </form>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Review keyword relevance and marketplace requirements before
                  submission.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeading
              title="AI assistant"
              description="Metadata suggestions"
            />
            <div className="p-4">
              <div className="mb-4 rounded-lg border border-[#45405F] bg-[#29243D]/60 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#C5BCFF]">
                  <Sparkles size={16} /> AI assistance
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Generate metadata suggestions and review them before applying
                  changes.
                </p>
              </div>
              <button
                className={`${primaryButtonClass} w-full`}
                onClick={generateSuggestions}
              >
                <Sparkles size={15} /> Generate all
              </button>
              <div className="mt-3 space-y-2">
                <button
                  className={`${buttonClass} w-full`}
                  onClick={() =>
                    setTitle(
                      "Modern minimalist workspace with laptop on a clean desk",
                    )
                  }
                >
                  <RefreshCw size={14} /> Regenerate title
                </button>
                <button
                  className={`${buttonClass} w-full`}
                  onClick={() =>
                    setDescription(
                      "A bright, modern workspace with a minimalist desk setup and laptop, representing productivity and remote work.",
                    )
                  }
                >
                  <RefreshCw size={14} /> Regenerate description
                </button>
                <button
                  className={`${buttonClass} w-full`}
                  onClick={() =>
                    setKeywords((current) => [
                      ...new Set([
                        ...current,
                        "creative workspace",
                        "office setup",
                        "work environment",
                      ]),
                    ])
                  }
                >
                  <Plus size={14} /> Suggest keywords
                </button>
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <h3 className="text-sm font-semibold text-white">Validation</h3>
            <div className="mt-3 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Title provided</span>
                <Check
                  size={15}
                  className={title.trim() ? "text-emerald-400" : "text-red-400"}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Description provided</span>
                <Check
                  size={15}
                  className={
                    description.trim() ? "text-emerald-400" : "text-red-400"
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Keywords added</span>
                <span className="text-slate-300">{keywords.length}</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
