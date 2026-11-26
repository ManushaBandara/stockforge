import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";

import { ACCENT_COLORS, type AccentColor } from "../accent-colors";

export interface AppPreferences {
  startup: boolean;
  defaultWorkspace: string;
  theme: string;
  accentColor: AccentColor;
  storagePath: string;
  aiProvider: string;
  workerLimit: string;
  retryLimit: string;
  notifications: boolean;
  completionAlerts: boolean;
  errorAlerts: boolean;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  startup: true,
  defaultWorkspace: "Overview",
  theme: "Dark",
  accentColor: "violet",
  storagePath: "",
  aiProvider: "Gemini",
  workerLimit: "2",
  retryLimit: "3",
  notifications: true,
  completionAlerts: true,
  errorAlerts: true,
};

interface PreferencesContextValue {
  preferences: AppPreferences;
  loadingPreferences: boolean;
  updatePreference: <K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K],
  ) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isAccentColor(value: unknown): value is AccentColor {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(ACCENT_COLORS, value)
  );
}

function applyAccentColor(accentColor: AccentColor) {
  const color = ACCENT_COLORS[accentColor];
  const root = document.documentElement;

  root.style.setProperty("--sf-accent", color.hex);
  root.style.setProperty("--sf-accent-foreground", color.foreground);
  root.style.setProperty("--sf-accent-soft", color.soft);
  root.style.setProperty("--sf-accent-border", color.border);
}

function normalizePreferences(
  stored: Partial<AppPreferences> | null,
): AppPreferences {
  const preferences = {
    ...DEFAULT_PREFERENCES,
    ...stored,
  };

  return {
    ...preferences,
    accentColor: isAccentColor(preferences.accentColor)
      ? preferences.accentColor
      : DEFAULT_PREFERENCES.accentColor,
  };
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);

  const [loadingPreferences, setLoadingPreferences] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        const stored = await invoke<Partial<AppPreferences> | null>(
          "get_setting",
          { key: "app.preferences" },
        );

        if (cancelled) return;

        const loadedPreferences = normalizePreferences(stored);

        setPreferences(loadedPreferences);
        applyAccentColor(loadedPreferences.accentColor);
      } catch (error) {
        console.error("Failed to load application preferences:", error);

        if (!cancelled) {
          applyAccentColor(DEFAULT_PREFERENCES.accentColor);
        }
      } finally {
        if (!cancelled) {
          setLoadingPreferences(false);
        }
      }
    }

    void loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    applyAccentColor(preferences.accentColor);
  }, [preferences.accentColor]);

  const updatePreference = useCallback(
    <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
      setPreferences((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loadingPreferences,
        updatePreference,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
