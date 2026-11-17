import { useState } from "react";
import type { ReactNode } from "react";
import {
  Settings,
  Palette,
  HardDrive,
  Sparkles,
  Globe,
  Workflow,
  Bell,
  Info,
  Save,
  FolderOpen,
  Check,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  PanelHeading,
  inputClass,
  buttonClass,
  primaryButtonClass,
} from "@/components/ui/page-ui";

const sections = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "ai", label: "AI providers", icon: Sparkles },
  { id: "browser", label: "Browser", icon: Globe },
  { id: "automation", label: "Automation", icon: Workflow },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "about", label: "About", icon: Info },
];

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#272B35] py-4 last:border-0">
      <div className="max-w-sm">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>
      <div className="w-full sm:max-w-xs">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[#8B7CFF]" : "bg-[#3A3F4A]"}`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [theme, setTheme] = useState("Dark");
  const [startup, setStartup] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [completionAlerts, setCompletionAlerts] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);
  const [workerLimit, setWorkerLimit] = useState("2");
  const [retryLimit, setRetryLimit] = useState("3");
  const [storagePath, setStoragePath] = useState("D:\\StockForge\\Assets");
  const [saved, setSaved] = useState(false);

  const active = sections.find((section) => section.id === activeSection)!;

  function update<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setSaved(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Application"
        title="Settings"
        description="Configure StockForge preferences, integrations, and automation."
        actions={
          <button className={primaryButtonClass} onClick={() => setSaved(true)}>
            <Save size={16} /> Save changes
          </button>
        }
      />

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <Check size={16} /> Settings saved in this preview session.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Panel className="h-fit p-2">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Preferences
          </p>
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeSection === section.id
                      ? "bg-[#302B46] font-medium text-[#C5BCFF]"
                      : "text-slate-400 hover:bg-[#222630] hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <PanelHeading
            title={active.label}
            description={`Manage your ${active.label.toLowerCase()} preferences.`}
          />
          <div className="px-5 py-2">
            {activeSection === "general" && (
              <>
                <Field
                  label="Application name"
                  description="The name displayed in the desktop application."
                >
                  <input className={inputClass} value="StockForge" readOnly />
                </Field>
                <Field
                  label="Launch on startup"
                  description="Open StockForge when you sign in to your computer."
                >
                  <Toggle
                    checked={startup}
                    onChange={(value) => update(setStartup, value)}
                  />
                </Field>
                <Field
                  label="Default workspace"
                  description="Choose the page displayed when the app opens."
                >
                  <select className={inputClass} defaultValue="Overview">
                    <option>Overview</option>
                    <option>Assets</option>
                    <option>Generation</option>
                    <option>Metadata</option>
                    <option>Submission</option>
                  </select>
                </Field>
              </>
            )}

            {activeSection === "appearance" && (
              <>
                <Field
                  label="Application theme"
                  description="Choose the appearance of StockForge."
                >
                  <select
                    className={inputClass}
                    value={theme}
                    onChange={(event) => update(setTheme, event.target.value)}
                  >
                    <option>Dark</option>
                    <option>Light</option>
                    <option>System</option>
                  </select>
                </Field>
                <Field
                  label="Accent color"
                  description="The highlight color used for primary actions and selected items."
                >
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-lg bg-[#8B7CFF]" />
                    <span className="text-sm text-slate-300">Violet</span>
                    <span className="text-xs text-slate-500">#8B7CFF</span>
                  </div>
                </Field>
              </>
            )}

            {activeSection === "storage" && (
              <>
                <Field
                  label="Asset storage directory"
                  description="Local directory where imported assets will be stored."
                >
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={storagePath}
                      onChange={(event) =>
                        update(setStoragePath, event.target.value)
                      }
                    />
                    <button
                      className={buttonClass}
                      aria-label="Browse storage directory"
                    >
                      <FolderOpen size={16} />
                    </button>
                  </div>
                </Field>
                <Field
                  label="Database"
                  description="StockForge's local application database."
                >
                  <p className="text-xs text-slate-400">
                    SQLite · Local storage
                  </p>
                </Field>
              </>
            )}

            {activeSection === "ai" && (
              <>
                <Field
                  label="AI provider"
                  description="Provider used for metadata assistance."
                >
                  <select className={inputClass} defaultValue="Gemini">
                    <option>Gemini</option>
                    <option>Local model (future)</option>
                  </select>
                </Field>
                <Field
                  label="API key"
                  description="Your provider key should be stored securely, not in plain-text configuration."
                >
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="Configure API key later"
                    disabled
                  />
                </Field>
                <Field
                  label="Model"
                  description="The text-generation model used for metadata."
                >
                  <input
                    className={inputClass}
                    placeholder="Model selection will be configured later"
                    disabled
                  />
                </Field>
              </>
            )}

            {activeSection === "browser" && (
              <>
                <Field
                  label="Browser engine"
                  description="Browser used for assisted Adobe Stock workflows."
                >
                  <input className={inputClass} value="Chromium" readOnly />
                </Field>
                <Field
                  label="Browser profile"
                  description="A dedicated profile keeps the automation session separate."
                >
                  <input
                    className={inputClass}
                    placeholder="Browser profile directory"
                    disabled
                  />
                </Field>
              </>
            )}

            {activeSection === "automation" && (
              <>
                <Field
                  label="Maximum concurrent workers"
                  description="Limit simultaneous background tasks."
                >
                  <select
                    className={inputClass}
                    value={workerLimit}
                    onChange={(event) =>
                      update(setWorkerLimit, event.target.value)
                    }
                  >
                    <option value="1">1 worker</option>
                    <option value="2">2 workers</option>
                    <option value="3">3 workers</option>
                    <option value="4">4 workers</option>
                  </select>
                </Field>
                <Field
                  label="Retry limit"
                  description="Number of retries for recoverable operations."
                >
                  <select
                    className={inputClass}
                    value={retryLimit}
                    onChange={(event) =>
                      update(setRetryLimit, event.target.value)
                    }
                  >
                    <option value="1">1 retry</option>
                    <option value="2">2 retries</option>
                    <option value="3">3 retries</option>
                    <option value="5">5 retries</option>
                  </select>
                </Field>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <Field
                  label="Notifications"
                  description="Enable application notifications."
                >
                  <Toggle
                    checked={notifications}
                    onChange={(value) => update(setNotifications, value)}
                  />
                </Field>
                <Field
                  label="Task completion"
                  description="Notify when a production task finishes."
                >
                  <Toggle
                    checked={completionAlerts}
                    onChange={(value) => update(setCompletionAlerts, value)}
                  />
                </Field>
                <Field
                  label="Errors and failures"
                  description="Notify when an operation needs attention."
                >
                  <Toggle
                    checked={errorAlerts}
                    onChange={(value) => update(setErrorAlerts, value)}
                  />
                </Field>
              </>
            )}

            {activeSection === "about" && (
              <div className="py-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#302B46]">
                    <Sparkles size={24} className="text-[#B9AEFF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">StockForge</h3>
                    <p className="text-xs text-slate-500">
                      Desktop asset production workspace
                    </p>
                  </div>
                </div>
                <div className="space-y-3 rounded-lg border border-[#303541] bg-[#111318] p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Version</span>
                    <span className="text-slate-200">0.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Desktop framework</span>
                    <span className="text-slate-200">Tauri 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frontend</span>
                    <span className="text-slate-200">React + TypeScript</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end border-t border-[#272B35] px-5 py-4">
            <button
              className={primaryButtonClass}
              onClick={() => setSaved(true)}
            >
              <Save size={15} /> Save changes
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
