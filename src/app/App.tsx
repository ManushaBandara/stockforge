import { useEffect, useState } from "react";
import LoadingScreen from "@/components/layout/loading-screen";
import AppShell from "@/components/layout/app-shell";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";

import AssetsPage from "@/features/assets/pages/assets-page";
import GenerationPage from "@/features/generation/pages/generation-page";
import MetadataPage from "@/features/metadata/pages/metadata-page";
import SubmissionPage from "@/features/submission/pages/submission-page";
import SettingsPage from "@/features/settings/pages/settings-page";

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  function renderPage() {
    switch (activePage) {
      case "Assets":
        return <AssetsPage initialSearch={search} />;

      case "Generation":
        return <GenerationPage />;

      case "Metadata":
        return <MetadataPage />;

      case "Submission":
        return <SubmissionPage />;

      case "Settings":
        return <SettingsPage />;

      case "Overview":
      default:
        return (
          <DashboardPage
            activePage={activePage}
            search={search}
            onNavigate={setActivePage}
          />
        );
    }
  }

  return (
    <AppShell
      activePage={activePage}
      search={search}
      onNavigate={setActivePage}
      onSearchChange={setSearch}
    >
      {renderPage()}
    </AppShell>
  );
}
