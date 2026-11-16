import { Layers, MoreHorizontal, Sparkles } from "lucide-react";
import Navigation from "./navigation";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[248px] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-[68px] items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/20">
          <Layers size={19} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-tight">StockForge</p>
          <p className="text-[11px] text-muted-foreground">
            Creative workspace
          </p>
        </div>
      </div>

      <Navigation activePage={activePage} onNavigate={onNavigate} />

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-sidebar-border bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
              <Sparkles size={15} />
            </div>
            <span className="text-xs font-medium">StockForge Pro</span>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Your creative production workspace is ready.
          </p>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-violet-500" />
          </div>

          <p className="mt-2 text-[10px] text-muted-foreground">
            Workspace initialized
          </p>
        </div>

        <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-sidebar-accent">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-xs font-semibold text-white">
            SF
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">My Workspace</p>
            <p className="text-[10px] text-muted-foreground">Local account</p>
          </div>

          <MoreHorizontal size={16} className="text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}
