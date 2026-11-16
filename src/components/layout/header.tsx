import { Bell, ChevronDown, Search } from "lucide-react";

interface HeaderProps {
  activePage: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Header({
  activePage,
  search,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-border bg-background/90 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Workspace</span>
        <span>/</span>
        <span className="font-medium text-foreground">{activePage}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden w-[240px] sm:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search assets..."
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-12 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60"
          />

          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
            /
          </kbd>
        </div>

        <button
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400" />
        </button>

        <div className="h-6 w-px bg-border" />

        <button
          aria-label="Workspace account menu"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-semibold text-violet-300">
            SF
          </div>
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
