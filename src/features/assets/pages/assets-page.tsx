import { useMemo, useState } from "react";
import {
  Search,
  Upload,
  Grid2X2,
  List,
  Filter,
  Image,
  MoreHorizontal,
  Eye,
  FileImage,
  X,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  PanelHeading,
  StatusBadge,
  buttonClass,
  inputClass,
  primaryButtonClass,
} from "@/components/ui/page-ui";

const initialAssets = [
  {
    id: 1,
    name: "minimalist-workspace.jpg",
    type: "JPEG",
    size: "4.2 MB",
    dimensions: "4000 × 3000",
    status: "Ready",
    category: "Workspace",
    color: "from-indigo-500/30 to-slate-700",
  },
  {
    id: 2,
    name: "abstract-gradient.png",
    type: "PNG",
    size: "2.8 MB",
    dimensions: "3000 × 3000",
    status: "Processing",
    category: "Abstract",
    color: "from-fuchsia-500/30 to-violet-900",
  },
  {
    id: 3,
    name: "modern-architecture.jpg",
    type: "JPEG",
    size: "5.1 MB",
    dimensions: "5000 × 3300",
    status: "Published",
    category: "Architecture",
    color: "from-cyan-500/30 to-slate-800",
  },
  {
    id: 4,
    name: "nature-background.jpg",
    type: "JPEG",
    size: "3.6 MB",
    dimensions: "4000 × 2600",
    status: "Draft",
    category: "Nature",
    color: "from-emerald-500/30 to-slate-800",
  },
  {
    id: 5,
    name: "creative-lighting.png",
    type: "PNG",
    size: "6.3 MB",
    dimensions: "4500 × 3000",
    status: "Ready",
    category: "Abstract",
    color: "from-amber-500/30 to-rose-900",
  },
  {
    id: 6,
    name: "business-concept.jpg",
    type: "JPEG",
    size: "3.9 MB",
    dimensions: "4000 × 3000",
    status: "Rejected",
    category: "Business",
    color: "from-blue-500/30 to-slate-800",
  },
];

const filters = [
  "All",
  "Draft",
  "Processing",
  "Ready",
  "Published",
  "Rejected",
];

export default function AssetsPage({
  initialSearch = "",
}: {
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selected, setSelected] = useState<
    (typeof initialAssets)[number] | null
  >(null);

  const assets = useMemo(
    () =>
      initialAssets.filter((asset) => {
        const matchesSearch = asset.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesFilter = filter === "All" || asset.status === filter;
        return matchesSearch && matchesFilter;
      }),
    [search, filter],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Assets"
        description="Manage, organize, and track all your stock assets."
        actions={
          <button
            className={primaryButtonClass}
            onClick={() => document.getElementById("asset-upload")?.click()}
          >
            <Upload size={16} /> Import assets
          </button>
        }
      />

      <input
        id="asset-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const count = event.target.files?.length ?? 0;
          if (count)
            window.alert(
              `${count} file(s) selected. Import workflow will be connected later.`,
            );
          event.target.value = "";
        }}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total assets", "1,284"],
          ["Ready", "248"],
          ["Processing", "32"],
          ["Published", "684"],
        ].map(([label, value]) => (
          <Panel key={label} className="px-4 py-3 bg-card">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-white">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card border-[#272B35] p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className={`${inputClass} pl-9 bg-card`}
              placeholder="Search assets..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ">
            <button className={buttonClass} onClick={() => setFilter("All")}>
              <Filter size={15} /> Filters
            </button>
            <div className="flex rounded-lg border border-[#303541] p-1">
              <button
                className={`rounded-md p-2 ${view === "grid" ? "bg-[#343044] text-white" : "text-slate-500"}`}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid2X2 size={16} />
              </button>
              <button
                className={`rounded-md p-2 ${view === "list" ? "bg-[#343044] text-white" : "text-slate-500"}`}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b bg-card border-[#272B35] px-4 py-3">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === item
                  ? "sf-accent-soft text-white"
                  : "text-slate-500 hover:bg-[#222630] hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="p-4 bg-card">
          {assets.length === 0 ? (
            <div className="py-16 text-center">
              <Image size={30} className="mx-auto text-slate-600" />
              <p className="mt-3 text-sm font-medium text-white">
                No assets found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="group overflow-hidden rounded-xl border border-[#2B303B] bg-card"
                >
                  <div
                    className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${asset.color}`}
                  >
                    <FileImage size={42} className="text-white/50" />
                    <button
                      onClick={() => setSelected(asset)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Eye size={16} className="mr-2" /> Preview asset
                    </button>
                    <div className="absolute right-2 top-2">
                      <button
                        className="rounded-md bg-black/40 p-2 text-white hover:bg-black/70"
                        aria-label="More asset actions"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-white">
                      {asset.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {asset.type} · {asset.size} · {asset.dimensions}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusBadge status={asset.status} />
                      <span className="text-xs text-slate-500">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium">Format</th>
                    <th className="pb-3 font-medium">Dimensions</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-t border-[#272B35]">
                      <td className="py-3 font-medium text-white">
                        {asset.name}
                      </td>
                      <td className="py-3 text-slate-400">{asset.type}</td>
                      <td className="py-3 text-slate-400">
                        {asset.dimensions}
                      </td>
                      <td className="py-3 text-slate-400">{asset.size}</td>
                      <td className="py-3">
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelected(asset)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Panel>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#343946] bg-[#191C23] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Asset preview</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            <div
              className={`flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br ${selected.color}`}
            >
              <FileImage size={56} className="text-white/60" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">
              {selected.name}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {selected.type} · {selected.size} · {selected.dimensions}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={selected.status} />
              <button className={buttonClass} onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
