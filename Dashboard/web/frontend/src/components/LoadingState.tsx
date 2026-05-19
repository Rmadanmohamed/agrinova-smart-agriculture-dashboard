export function LoadingState() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <div className="panel w-full max-w-sm text-center">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
        <p className="text-sm font-black">Loading AgriNova data</p>
        <p className="mt-2 text-xs text-slate-400">Connecting to the CSV API</p>
      </div>
    </div>
  );
}
