import StockForgeLogo from "../ui/math-loader";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <StockForgeLogo size={140} />

        <h1 className="text-xl font-bold tracking-tight text-white">
          StockForge
        </h1>

        <p className="text-xs text-zinc-400">Creative production workspace</p>
      </div>
    </div>
  );
}
