interface GaugeProps {
  value: number;
  label: string;
  accent?: string;
}

export function Gauge({ value, label, accent = '#22d3ee' }: GaugeProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="gauge-wrap">
      <div
        className="gauge-ring"
        style={{
          background: `conic-gradient(${accent} ${safeValue * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
          boxShadow: `0 0 36px ${accent}28`,
        }}
      >
        <div className="gauge-core">
          <span className="text-2xl font-black text-white">{safeValue.toFixed(0)}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-black text-white">{label}</p>
        <p className="mt-1 text-xs font-medium text-slate-400">Calculated from operational data</p>
      </div>
    </div>
  );
}
