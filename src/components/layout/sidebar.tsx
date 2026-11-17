import {
  Layers,
  Mango,
  MoreHorizontal,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Navigation from "./navigation";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-sidebar-border bg-black transition-all duration-300 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[248px]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-[68px] shrink-0 items-center border-b border-sidebar-border ${
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        }`}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-700 text-white shadow-lg shadow-violet-500/20">
          <Mango size={19} strokeWidth={3} />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight">
              StockForge
            </p>
            <p className="text-[11px] text-muted-foreground">
              Creative workspace
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Navigation
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={collapsed}
        />
      </div>

      {/* Bottom Section */}
      <div className="mt-auto shrink-0 p-3">
        {!collapsed && (
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
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mt-3 flex w-full items-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground ${
            collapsed ? "justify-center" : "justify-start px-2"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span className="ml-3 text-xs">Collapse sidebar</span>
            </>
          )}
        </button>

        {/* Workspace Account */}
        <button
          title={collapsed ? "My Workspace" : undefined}
          className={`mt-2 flex w-full items-center rounded-lg py-2 text-left transition-colors hover:bg-sidebar-accent ${
            collapsed ? "justify-center" : "gap-3 px-2"
          }`}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-white-600 text-xs font-semibold text-white">
            SF
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">My Workspace</p>
                <p className="text-[10px] text-muted-foreground">
                  Local account
                </p>
              </div>

              <MoreHorizontal size={16} className="text-muted-foreground" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
