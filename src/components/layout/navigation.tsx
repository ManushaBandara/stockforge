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
}

export default function Navigation({
  activePage,
  onNavigate,
}: NavigationProps) {
  return (
    <div className="px-4 pt-7">
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Workspace
      </p>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.label;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />

              <span className="flex-1">{item.label}</span>

              {item.label === "Assets" && (
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  128
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-0 pt-8">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Preferences
        </p>

        <button
          onClick={() => onNavigate("Settings")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
            activePage === "Settings"
              ? "bg-sidebar-accent text-white"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          }`}
        >
          <Settings2 size={17} />
          Settings
        </button>
      </div>
    </div>
  );
}
