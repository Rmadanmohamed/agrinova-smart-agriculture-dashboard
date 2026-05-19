interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
      <div className="panel max-w-lg text-center">
        <h1 className="text-2xl font-black">Dashboard data is unavailable</h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
        <p className="mt-4 text-xs text-slate-500">Start the backend API, then refresh the frontend.</p>
      </div>
    </div>
  );
}
