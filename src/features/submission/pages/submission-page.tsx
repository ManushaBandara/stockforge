import { useMemo, useState } from "react";
import {
  Search,
  Send,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileImage,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  PanelHeading,
  StatCard,
  StatusBadge,
  inputClass,
  buttonClass,
  primaryButtonClass,
} from "@/components/ui/page-ui";

type SubmissionStatus =
  | "Ready"
  | "Queued"
  | "Submitted"
  | "Published"
  | "Rejected";

interface SubmissionAsset {
  id: number;
  name: string;
  title: string;
  type: string;
  status: SubmissionStatus;
  validation: "Passed" | "Warning" | "Failed";
  keywords: number;
}

const initialAssets: SubmissionAsset[] = [
  {
    id: 1,
    name: "minimalist-workspace.jpg",
    title: "Minimalist modern workspace",
    type: "JPEG",
    status: "Ready",
    validation: "Passed",
    keywords: 28,
  },
  {
    id: 2,
    name: "abstract-gradient.png",
    title: "Colorful abstract gradient background",
    type: "PNG",
    status: "Ready",
    validation: "Passed",
    keywords: 35,
  },
  {
    id: 3,
    name: "modern-architecture.jpg",
    title: "Modern architectural building",
    type: "JPEG",
    status: "Queued",
    validation: "Passed",
    keywords: 24,
  },
  {
    id: 4,
    name: "nature-background.jpg",
    title: "Green natural forest background",
    type: "JPEG",
    status: "Submitted",
    validation: "Passed",
    keywords: 31,
  },
  {
    id: 5,
    name: "creative-lighting.png",
    title: "Creative lighting composition",
    type: "PNG",
    status: "Ready",
    validation: "Warning",
    keywords: 12,
  },
  {
    id: 6,
    name: "business-concept.jpg",
    title: "Business and teamwork concept",
    type: "JPEG",
    status: "Rejected",
    validation: "Failed",
    keywords: 18,
  },
];

const tabs = ["All", "Ready", "Queued", "Submitted", "Published", "Rejected"];

export default function SubmissionPage() {
  const [assets, setAssets] = useState(initialAssets);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [reviewAsset, setReviewAsset] = useState<SubmissionAsset | null>(null);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesTab = activeTab === "All" || asset.status === activeTab;
        const matchesSearch =
          asset.name.toLowerCase().includes(search.toLowerCase()) ||
          asset.title.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
      }),
    [assets, activeTab, search],
  );

  function toggleSelected(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function queueSelected() {
    setAssets((current) =>
      current.map((asset) =>
        selectedIds.includes(asset.id) && asset.status === "Ready"
          ? { ...asset, status: "Queued" }
          : asset,
      ),
    );
    setSelectedIds([]);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title="Submission"
        description="Validate, review, and prepare assets for Adobe Stock submission."
        actions={
          <button
            className={primaryButtonClass}
            disabled={selectedIds.length === 0}
            onClick={queueSelected}
          >
            <Send size={16} /> Queue selected ({selectedIds.length})
          </button>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ready to submit"
          value="248"
          detail="Passed preparation checks"
          icon={CheckCircle2}
        />
        <StatCard
          label="In queue"
          value="36"
          detail="Waiting for submission"
          icon={Clock3}
        />
        <StatCard
          label="Submitted"
          value="684"
          detail="Awaiting marketplace review"
          icon={Send}
        />
        <StatCard
          label="Needs attention"
          value="12"
          detail="Warnings or rejected assets"
          icon={AlertCircle}
        />
      </div>

      <Panel>
        <PanelHeading
          title="Submission manager"
          description="Select assets to review and add to your submission queue."
          action={
            <div className="relative w-full sm:w-56">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                className={`${inputClass} py-2 pl-9 text-xs`}
                placeholder="Search submissions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          }
        />

        <div className="flex flex-wrap gap-1 border-b border-[#272B35] px-4 py-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                activeTab === tab
                  ? "bg-[#343044] text-[#B9AEFF]"
                  : "text-slate-500 hover:bg-[#222630] hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="w-10 pb-3">
                  <input
                    type="checkbox"
                    aria-label="Select all ready assets"
                    checked={
                      filteredAssets.filter((asset) => asset.status === "Ready")
                        .length > 0 &&
                      filteredAssets
                        .filter((asset) => asset.status === "Ready")
                        .every((asset) => selectedIds.includes(asset.id))
                    }
                    onChange={(event) => {
                      const readyIds = filteredAssets
                        .filter((asset) => asset.status === "Ready")
                        .map((asset) => asset.id);
                      setSelectedIds((current) =>
                        event.target.checked
                          ? [...new Set([...current, ...readyIds])]
                          : current.filter((id) => !readyIds.includes(id)),
                      );
                    }}
                  />
                </th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Keywords</th>
                <th className="pb-3 font-medium">Validation</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-t border-[#272B35]">
                  <td className="py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${asset.name}`}
                      disabled={asset.status !== "Ready"}
                      checked={selectedIds.includes(asset.id)}
                      onChange={() => toggleSelected(asset.id)}
                    />
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-white">{asset.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{asset.name}</p>
                  </td>
                  <td className="py-4 text-slate-400">{asset.type}</td>
                  <td className="py-4 text-slate-400">{asset.keywords}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        asset.validation === "Passed"
                          ? "text-emerald-400"
                          : asset.validation === "Warning"
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {asset.validation === "Passed" ? (
                        <CheckCircle2 size={14} />
                      ) : asset.validation === "Warning" ? (
                        <AlertCircle size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                      {asset.validation}
                    </span>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setReviewAsset(asset)}
                      className="text-slate-400 hover:text-white"
                      aria-label={`Review ${asset.name}`}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              No matching assets.
            </div>
          )}
        </div>
      </Panel>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-400" />
        <div>
          <p className="text-sm font-medium text-blue-300">
            Manual confirmation enabled
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            StockForge will assist with preparing submissions. Final marketplace
            submission will require your confirmation.
          </p>
        </div>
      </div>

      {reviewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#343946] bg-[#191C23] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Review asset</h2>
              <button
                onClick={() => setReviewAsset(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-slate-800">
              <FileImage size={48} className="text-white/50" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">
              {reviewAsset.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{reviewAsset.name}</p>
            <div className="mt-5 space-y-3 rounded-lg border border-[#303541] bg-[#111318] p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">File type</span>
                <span className="text-slate-200">{reviewAsset.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keywords</span>
                <span className="text-slate-200">{reviewAsset.keywords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validation</span>
                <span className="text-slate-200">{reviewAsset.validation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={reviewAsset.status} />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className={buttonClass}
                onClick={() => setReviewAsset(null)}
              >
                Close review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
