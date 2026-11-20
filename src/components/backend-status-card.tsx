import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle2, Database, Loader2, XCircle } from "lucide-react";

interface DatabaseStatus {
  connected: boolean;
  sqliteVersion: string;
  tableCount: number;
}

export function BackendStatusCard() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkBackend() {
      try {
        const result = await invoke<DatabaseStatus>("get_database_status");

        if (!cancelled) {
          setStatus(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(String(err));
          setStatus(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Database className="size-5" />
        </div>

        <div>
          <h3 className="text-sm font-semibold">Backend & Database</h3>
          <p className="text-xs text-muted-foreground">
            Native Rust backend connectivity
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Connecting to backend...
            </span>
          </>
        ) : error ? (
          <>
            <XCircle className="size-4 text-destructive" />
            <span className="text-sm text-destructive">Connection failed</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              Connected
            </span>
          </>
        )}
      </div>

      {status && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">SQLite Version</p>
            <p className="mt-1 text-sm font-semibold">{status.sqliteVersion}</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Database Tables</p>
            <p className="mt-1 text-sm font-semibold">{status.tableCount}</p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 break-words text-xs text-muted-foreground">
          {error}
        </p>
      )}
    </div>
  );
}
