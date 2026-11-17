import {
  Image,
  LayoutDashboard,
  Send,
  Settings2,
  Tags,
  WandSparkles,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Assets", icon: Image },
  { label: "Generation", icon: WandSparkles },
  { label: "Metadata", icon: Tags },
  { label: "Submission", icon: Send },
];

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
}

export default function Navigation({
  activePage,
  onNavigate,
  collapsed = false,
}: NavigationProps) {
  return (
    <div className={`pt-7 ${collapsed ? "px-2" : "px-4"}`}>
      {/* Workspace Heading */}
      {!collapsed && (
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
      )}

      {/* Main Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.label;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              title={collapsed ? item.label : undefined}
              className={`group relative flex w-full items-center rounded-lg py-2.5 text-[13px] transition-all duration-200 ${
                collapsed ? "justify-center px-0" : "gap-3 px-3 text-left"
              } ${
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} className="shrink-0" />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>

                  {item.label === "Assets" && (
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      128
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Preferences */}
      <div className="pt-8">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Preferences
          </p>
        )}

        <button
          onClick={() => onNavigate("Settings")}
          title={collapsed ? "Settings" : undefined}
          className={`flex w-full items-center rounded-lg py-2.5 text-[13px] transition-all duration-200 ${
            collapsed ? "justify-center px-0" : "gap-3 px-3 text-left"
          } ${
            activePage === "Settings"
              ? "bg-sidebar-accent text-white"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          }`}
        >
          <Settings2 size={19} strokeWidth={1.8} className="shrink-0" />

          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}
