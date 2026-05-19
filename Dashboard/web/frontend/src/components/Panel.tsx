import { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, subtitle, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      {title ? (
        <div className="panel-heading">
          <div>
            <h2 className="text-sm font-black text-white">{title}</h2>
            {subtitle ? <p className="mt-1 text-xs font-medium text-slate-400">{subtitle}</p> : null}
          </div>
          <span className="panel-corner" />
        </div>
      ) : null}
      {children}
    </section>
  );
}
