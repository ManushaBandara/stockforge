import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import PageContainer from "./page-container";

interface AppShellProps {
  children: ReactNode;
  activePage: string;
  search: string;
  onNavigate: (page: string) => void;
  onSearchChange: (value: string) => void;
}

export default function AppShell({
  children,
  activePage,
  search,
  onNavigate,
  onSearchChange,
}: AppShellProps) {
  return (
    <div className="dark min-h-screen bg-zinc-900 text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        <main className="ml-[248px] min-w-0 flex-1">
          <Header
            activePage={activePage}
            search={search}
            onSearchChange={onSearchChange}
          />

          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
