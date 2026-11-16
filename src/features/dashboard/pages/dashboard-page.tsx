import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Command,
  FileImage,
  FolderOpen,
  Image,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const recentAssets = [
  {
    name: "Abstract gradient background",
    category: "Backgrounds",
    date: "Nov 16, 2026",
    status: "Ready",
    color: "from-violet-500/40 to-blue-500/30",
    icon: Sparkles,
  },
  {
    name: "Minimal workspace concept",
    category: "Technology",
    date: "Nov 15, 2026",
    status: "Processing",
    color: "from-cyan-500/40 to-emerald-500/30",
    icon: FolderOpen,
  },
  {
    name: "Geometric shapes collection",
    category: "Illustrations",
    date: "Nov 14, 2026",
    status: "Ready",
    color: "from-orange-500/40 to-pink-500/30",
    icon: FileImage,
  },
  {
    name: "Soft natural texture",
    category: "Textures",
    date: "Nov 13, 2026",
    status: "Draft",
    color: "from-emerald-500/40 to-teal-500/30",
    icon: Image,
  },
];

const stats = [
  {
    label: "Total assets",
    value: "128",
    change: "+12.8%",
    description: "vs. last month",
    icon: Image,
    trend: "up",
  },
  {
    label: "Ready to submit",
    value: "36",
    change: "+8.2%",
    description: "vs. last month",
    icon: CheckCircle2,
    trend: "up",
  },
  {
    label: "In production",
    value: "14",
    change: "4 active",
    description: "Currently processing",
    icon: Activity,
    trend: "neutral",
  },
  {
    label: "Submitted",
    value: "78",
    change: "+18.4%",
    description: "vs. last month",
    icon: Send,
    trend: "up",
  },
];

interface DashboardPageProps {
  activePage: string;
  search: string;
  onNavigate: (page: string) => void;
}

export default function DashboardPage({
  activePage,
  search,
  onNavigate,
}: DashboardPageProps) {
  const filteredAssets = recentAssets.filter((asset) =>
    `${asset.name} ${asset.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Page heading */}
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Workspace operational
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {activePage === "Overview" ? "Good to see you." : activePage}
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            {activePage === "Overview"
              ? "Here's what's happening with your creative assets."
              : `Manage your ${activePage.toLowerCase()} workspace.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Upload size={14} />
            Import assets
          </button>

          <button className="flex h-9 items-center gap-2 rounded-lg bg-violet-500 px-3.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/15 transition-colors hover:bg-violet-400">
            <Plus size={15} />
            New project
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-white/15"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>

                <div className="flex size-8 items-center justify-center rounded-lg bg-white/[0.05] text-muted-foreground">
                  <Icon size={16} />
                </div>
              </div>

              <div className="flex items-end justify-between gap-2">
                <span className="text-[28px] font-semibold tracking-tight">
                  {stat.value}
                </span>

                <span
                  className={`mb-1 flex items-center gap-1 text-[10px] font-medium ${
                    stat.trend === "up" ? "text-emerald-400" : "text-violet-300"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <Activity size={12} />
                  )}
                  {stat.change}
                </span>
              </div>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Production overview */}
      <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-violet-500/[0.08] blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Production overview
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Your creative pipeline
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Asset workflow status at a glance
              </p>
            </div>

            <button
              aria-label="Production overview options"
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="relative mt-8">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Overall production progress
              </span>
              <span className="font-semibold">68%</span>
            </div>

            <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="w-[42%] bg-violet-500" />
              <div className="w-[18%] bg-indigo-400" />
              <div className="w-[8%] bg-cyan-400" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                {
                  label: "Completed",
                  value: "78",
                  color: "bg-violet-500",
                },
                {
                  label: "Processing",
                  value: "14",
                  color: "bg-indigo-400",
                },
                {
                  label: "Pending",
                  value: "36",
                  color: "bg-cyan-400",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${item.color}`} />
                    <span className="text-[10px] text-muted-foreground">
                      {item.label}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Quick actions
              </p>

              <h2 className="mt-2 text-lg font-semibold">Get things done</h2>
            </div>

            <Command size={17} className="text-muted-foreground" />
          </div>

          <div className="mt-5 space-y-2">
            <QuickAction
              icon={Upload}
              title="Import new assets"
              description="Add images from your computer"
            />

            <QuickAction
              icon={WandSparkles}
              title="Generate metadata"
              description="Prepare titles and keywords"
            />

            <QuickAction
              icon={Send}
              title="Review submissions"
              description="Check assets ready to submit"
            />
          </div>
        </div>
      </section>

      {/* Recent assets */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Recent assets</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Your latest creative work
            </p>
          </div>

          <button
            onClick={() => onNavigate("Assets")}
            className="text-xs font-medium text-violet-400 hover:text-violet-300"
          >
            View all assets →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Modified</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => {
                const Icon = asset.icon;

                return (
                  <tr
                    key={asset.name}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${asset.color}`}
                        >
                          <Icon size={17} className="text-white/90" />
                        </div>

                        <span className="text-xs font-medium">
                          {asset.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {asset.category}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {asset.date}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={asset.status} />
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button
                        aria-label={`More options for ${asset.name}`}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-xs text-muted-foreground"
                  >
                    No assets match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span>StockForge · Local creative workspace</span>

        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          All systems operational
        </span>
      </footer>
    </>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <button className="group flex w-full items-center gap-3 rounded-lg border border-border/70 p-3 text-left transition-colors hover:border-violet-500/40 hover:bg-violet-500/[0.04]">
      <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.05] text-muted-foreground transition-colors group-hover:bg-violet-500/15 group-hover:text-violet-300">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{title}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Ready: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Processing: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    Draft: "border-white/10 bg-white/[0.05] text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium ${
        styles[status] ?? styles.Draft
      }`}
    >
      {status === "Processing" && <Clock3 size={11} className="mr-1.5" />}
      {status}
    </span>
  );
}
