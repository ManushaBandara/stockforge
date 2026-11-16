import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");

  return (
    <AppShell
      activePage={activePage}
      search={search}
      onNavigate={setActivePage}
      onSearchChange={setSearch}
    >
      <DashboardPage
        activePage={activePage}
        search={search}
        onNavigate={setActivePage}
      />
    </AppShell>
  );
}
