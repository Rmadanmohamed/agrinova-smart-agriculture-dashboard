export function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function average(values: number[]) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function pct(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function egp(value: number) {
  return `${value.toFixed(2)} EGP`;
}

export function compact(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function shortDate(value?: string) {
  if (!value) return 'Current';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function statusTone(value?: string) {
  const text = value?.toLowerCase() ?? '';
  if (text.includes('critical') || text.includes('offline') || text.includes('open')) return 'danger';
  if (text.includes('attention') || text.includes('medium') || text.includes('pending') || text.includes('high')) return 'warning';
  if (text.includes('standby') || text.includes('busy') || text.includes('watch')) return 'neutral';
  return 'good';
}
