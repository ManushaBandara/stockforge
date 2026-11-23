import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Command,
  Image,
  MoreHorizontal,
  Plus,
  Send,
  Upload,
  WandSparkles,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { BackendStatusCard } from "@/components/backend-status-card";

// Types

interface DashboardStats {
  totalAssets: number;
  readyToSubmit: number;
  inProduction: number;
  submitted: number;
}

interface DashboardPipeline {
  completed: number;
  processing: number;
  pending: number;
  failed: number;
  rejected: number;
}

interface RecentAsset {
  id: string;
  name: string;
  category: string;
  status: string;
  submissionStatus: string;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  pipeline: DashboardPipeline;
  recentAssets: RecentAsset[];
}

// Defaults

const EMPTY_DASHBOARD: DashboardData = {
  stats: {
    totalAssets: 0,
    readyToSubmit: 0,
    inProduction: 0,
    submitted: 0,
  },
  pipeline: {
    completed: 0,
    processing: 0,
    pending: 0,
    failed: 0,
    rejected: 0,
  },
  recentAssets: [],
};

// Component

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
  const [dashboard, setDashboard] = useState<DashboardData>(EMPTY_DASHBOARD);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Load dashboard data from SQLite through the Tauri command

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setDashboardError(null);

        const data = await invoke<DashboardData>("get_dashboard_data");

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (error) {
        if (!cancelled) {
          setDashboardError(
            error instanceof Error ? error.message : String(error),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // Derived database values

  const { stats, pipeline, recentAssets } = dashboard;

  const filteredAssets = recentAssets.filter((asset) =>
    `${asset.name} ${asset.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const getPercentage = (value: number) =>
    stats.totalAssets > 0
      ? Math.min((value / stats.totalAssets) * 100, 100)
      : 0;

  const overallProgress =
    stats.totalAssets > 0
      ? Math.round((pipeline.completed / stats.totalAssets) * 100)
      : 0;

  // Statistics cards

  const statCards = [
    {
      label: "Total assets",
      value: stats.totalAssets,
      change: "In library",
      description: "Stored in your workspace",
      icon: Image,
    },
    {
      label: "Ready to submit",
      value: stats.readyToSubmit,
      change: "Ready",
      description: "Awaiting submission",
      icon: CheckCircle2,
    },
    {
      label: "In production",
      value: stats.inProduction,
      change: "Active",
      description: "Currently processing",
      icon: Activity,
    },
    {
      label: "Submitted",
      value: stats.submitted,
      change: "Submitted",
      description: "Submission lifecycle",
      icon: Send,
    },
  ];

  // Pipeline data

  const pipelineItems = [
    {
      label: "Completed",
      value: pipeline.completed,
      color: "bg-violet-500",
    },
    {
      label: "Processing",
      value: pipeline.processing,
      color: "bg-indigo-400",
    },
    {
      label: "Pending",
      value: pipeline.pending,
      color: "bg-cyan-400",
    },
  ];

  // Render

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
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Upload size={14} />
            Import assets
          </button>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg bg-red-500 px-3.5 text-xs font-semibold text-white shadow-lg shadow-red-500/15 transition-colors hover:bg-red-400"
          >
            <Plus size={15} />
            New project
          </button>
        </div>
      </section>

      {/* Database status */}
      <div className="mb-5">
        <BackendStatusCard />
      </div>

      {/* Dashboard error */}
      {dashboardError && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <p className="text-xs font-medium text-red-400">
            Dashboard data could not be loaded
          </p>

          <p className="mt-1 break-words text-[11px] text-muted-foreground">
            {dashboardError}
          </p>
        </div>
      )}

      {/* Statistics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
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

                <div className="flex size-8 items-center justify-center rounded-lg sf-accent-soft text-muted-foreground">
                  <Icon size={16} />
                </div>
              </div>

              <div className="flex items-end justify-between gap-2">
                <span className="text-[28px] font-semibold tracking-tight">
                  {loading ? "—" : stat.value.toLocaleString()}
                </span>

                <span className="mb-1 text-[10px] font-medium text-muted-foreground">
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
        {/* Pipeline */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-green-500/[0.08] blur-3xl" />

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
              type="button"
              aria-label="Production overview options"
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="relative mt-8">
            {/* Overall progress */}
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Overall production progress
              </span>

              <span className="font-semibold">
                {loading ? "—" : `${overallProgress}%`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${getPercentage(pipeline.completed)}%` }}
              />

              <div
                className="bg-yellow-400 transition-all duration-500"
                style={{ width: `${getPercentage(pipeline.processing)}%` }}
              />

              <div
                className="bg-cyan-400 transition-all duration-500"
                style={{ width: `${getPercentage(pipeline.pending)}%` }}
              />
            </div>

            {/* Pipeline stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {pipelineItems.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${item.color}`} />

                    <span className="text-[10px] text-muted-foreground">
                      {item.label}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold">
                    {loading ? "—" : item.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional counts */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/60 pt-4">
              <span className="text-[10px] text-muted-foreground">
                Failed:{" "}
                <span className="font-medium text-foreground">
                  {loading ? "—" : pipeline.failed}
                </span>
              </span>

              <span className="text-[10px] text-muted-foreground">
                Rejected:{" "}
                <span className="font-medium text-foreground">
                  {loading ? "—" : pipeline.rejected}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
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
            type="button"
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
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-border/60 last:border-0 transition-colors hover:bg-white/[0.02]"
                >
                  {/* Asset name */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30">
                        <Image size={17} className="text-white/90" />
                      </div>

                      <span className="text-xs font-medium">{asset.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {asset.category}
                  </td>

                  {/* Created date */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(asset.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.status} />
                  </td>

                  {/* Options */}
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`More options for ${asset.name}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty / loading / error state */}
              {filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-xs text-muted-foreground"
                  >
                    {loading
                      ? "Loading assets..."
                      : dashboardError
                        ? "Unable to load assets."
                        : search
                          ? "No assets match your search."
                          : "No assets in your library yet. Import your first assets to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
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

// Quick action component

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
    <button
      type="button"
      className="group flex w-full items-center gap-3 rounded-lg border border-border/70 p-3 text-left transition-colors hover:border-violet-500/40 hover:bg-violet-500/[0.04]"
    >
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

// Status badge

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    imported: "border-white/10 bg-white/[0.05] text-muted-foreground",

    processing: "border-blue-500/20 bg-blue-500/10 text-blue-400",

    metadata_pending: "border-blue-500/20 bg-blue-500/10 text-blue-400",

    metadata_review: "border-amber-500/20 bg-amber-500/10 text-amber-400",

    ready_to_submit: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    queued: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",

    submitting: "border-violet-500/20 bg-violet-500/10 text-violet-400",

    submitted: "border-sky-500/20 bg-sky-500/10 text-sky-400",

    published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    rejected: "border-orange-500/20 bg-orange-500/10 text-orange-400",

    failed: "border-red-500/20 bg-red-500/10 text-red-400",

    archived: "border-white/10 bg-white/[0.03] text-muted-foreground",
  };

  const label = status.replace(/_/g, " ");

  const activeStatuses = [
    "processing",
    "metadata_pending",
    "queued",
    "submitting",
  ];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium capitalize ${
        styles[status] ?? styles.imported
      }`}
    >
      {activeStatuses.includes(status) && (
        <Clock3 size={11} className="mr-1.5" />
      )}

      {status === "published" && <CheckCircle2 size={11} className="mr-1.5" />}

      {label}
    </span>
  );
}

// Date formatting

function formatDate(dateString: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
