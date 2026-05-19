import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose';
}

const tones = {
  emerald: 'from-emerald-400/18 to-cyan-400/8 text-emerald-200 border-emerald-300/20',
  cyan: 'from-cyan-400/18 to-blue-400/8 text-cyan-200 border-cyan-300/20',
  violet: 'from-violet-400/18 to-fuchsia-400/8 text-violet-200 border-violet-300/20',
  amber: 'from-amber-400/18 to-orange-400/8 text-amber-200 border-amber-300/20',
  rose: 'from-rose-400/18 to-pink-400/8 text-rose-200 border-rose-300/20',
};

export function StatCard({ label, value, detail, icon: Icon, tone = 'emerald' }: StatCardProps) {
  return (
    <article className={`stat-card bg-gradient-to-br ${tones[tone]}`}>
      <div className="metric-topline" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="metric-label">{label}</p>
          <div className="metric-value">{value}</div>
        </div>
        <div className="metric-icon">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {detail ? <p className="metric-detail">{detail}</p> : null}
    </article>
  );
}
