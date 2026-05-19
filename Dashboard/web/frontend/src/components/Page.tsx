import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bell, CalendarDays, CheckCircle2, Clock, Search, ShieldCheck, UserRound } from 'lucide-react';
import { getReferenceByTitle } from '../design/referenceMap';

interface PageProps {
  title: string;
  eyebrow: string;
  children: ReactNode;
  actions?: ReactNode;
  signal?: string;
}

export function Page({ title, eyebrow, actions, children, signal = 'Live CSV Intelligence' }: PageProps) {
  const reference = getReferenceByTitle(title);

  return (
    <motion.main
      className="page-shell"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <header className="page-header">
        <div className="page-title-cluster">
          <div className="page-number">{reference?.pageNumber ?? '--'}</div>
          <div className="min-w-0">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{eyebrow}</p>
          </div>
        </div>
        <div className="page-topbar">
          <div className="page-meta">
            <CalendarDays className="h-3.5 w-3.5" />
            May 12, 2025
          </div>
          <div className="page-meta">
            <Clock className="h-3.5 w-3.5" />
            10:45 AM
          </div>
          <span className="reference-pill reference-pill-green">
            <CheckCircle2 className="h-3.5 w-3.5" />
            System: Online
          </span>
          <span className="reference-pill reference-pill-cyan">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security: Verified
          </span>
          <span className="reference-pill reference-pill-violet">Mode: Executive</span>
          <div className="header-icons">
            <button aria-label="Search" type="button">
              <Search className="h-4 w-4" />
            </button>
            <button aria-label="Alerts" type="button" className="relative">
              <Bell className="h-4 w-4" />
              <span className="notification-dot">3</span>
            </button>
            <button aria-label="Profile" type="button">
              <UserRound className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="reference-action-row">
        <div className="page-signal">
          <span />
          {signal}
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      {children}
    </motion.main>
  );
}
