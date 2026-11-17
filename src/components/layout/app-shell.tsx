import { useState } from "react";
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
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="dark min-h-screen bg-gradient-to-t from-zinc-900 via-black to-zinc-800 backdrop-blur-5xl text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main
          className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
            collapsed ? "ml-[72px]" : "ml-[248px]"
          }`}
        >
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
