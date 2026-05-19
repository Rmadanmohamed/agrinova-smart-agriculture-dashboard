import { statusTone } from '../utils/formatters';

interface StatusBadgeProps {
  label: string;
  status?: string;
}

const classes = {
  good: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
  danger: 'border-rose-300/30 bg-rose-400/12 text-rose-100',
  neutral: 'border-cyan-300/25 bg-cyan-400/10 text-cyan-100',
};

export function StatusBadge({ label, status }: StatusBadgeProps) {
  const tone = statusTone(status ?? label);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${classes[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
