import { Layers, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Preparing your workspace...",
}: LoadingScreenProps) {
  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-[#111318]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B7CFF]/[0.07] blur-[120px]" />

      <div className="relative flex w-full max-w-sm flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className="relative mb-7">
          <div className="absolute inset-0 rounded-2xl bg-[#8B7CFF]/30 blur-xl" />

          <div className="relative flex size-[72px] items-center justify-center rounded-2xl border border-[#8B7CFF]/30 bg-[#29243D] shadow-2xl">
            <Layers size={34} strokeWidth={1.7} className="text-[#B9AEFF]" />
            <Sparkles
              size={15}
              className="absolute -right-1 -top-1 text-[#C8BFFF]"
            />
          </div>
        </div>

        {/* Branding */}
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Stock<span className="text-[#A99DFF]">Forge</span>
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Your creative production workspace
        </p>

        {/* Loading indicator */}
        <div className="mt-12 w-full">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{message}</span>
            <span className="size-2 animate-pulse rounded-full bg-[#A99DFF]" />
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-[#272B35]">
            <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-[#7160E8] via-[#B9AEFF] to-[#7160E8]" />
          </div>
        </div>

        {/* Footer */}
        <p className="absolute top-[calc(100vh-32px)] whitespace-nowrap text-[11px] tracking-wider text-slate-600">
          STOCKFORGE · VERSION 0.1.0
        </p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
