import { AlertOctagon, AlertTriangle, ClipboardList, FileText } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { PageProps } from '../services/types';
import { latestRows, topCounts } from '../utils/calculations';

export function AlertsReports({ data, summary }: PageProps) {
  const warnings = data.alerts.filter((row) => ['High', 'Medium'].includes(row.PriorityLevel)).length;
  const recentAlerts = latestRows(data.alerts, 'AlertDate', 8);
  const alertTypes = topCounts(data.alerts, 'AlertType', 7);
  const resolution = topCounts(data.alerts, 'ResolutionStatus', 5);
  const openShare = data.alerts.length ? (summary.activeAlerts / data.alerts.length) * 100 : 0;
  const primaryAction = recentAlerts[0]?.RecommendedAction ?? 'Review active alerts and assign response owner';

  return (
    <Page title="Alerts & Reports" eyebrow="Operations review center">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Active Alerts" value={summary.activeAlerts} detail="Open and in-progress" icon={AlertTriangle} tone="rose" /></div>
        <div className="col-span-2"><StatCard label="Critical" value={summary.criticalAlerts} detail="Immediate attention" icon={AlertOctagon} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Warnings" value={warnings} detail="High and medium" icon={ClipboardList} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Reports" value={summary.generatedReports} detail="Report catalog" icon={FileText} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Open Load" value={`${openShare.toFixed(0)}%`} detail="Alert pressure" icon={AlertTriangle} tone="rose" /></div>
        <div className="col-span-2"><StatCard label="Recent Queue" value={recentAlerts.length} detail="Latest alerts" icon={ClipboardList} tone="emerald" /></div>

        <Panel title="Alert Pressure" subtitle="Active alert share" className="col-span-4">
          <Gauge value={openShare} label="Open alert load" accent="#fb7185" />
          <div className="mt-5 rounded-md border border-rose-300/15 bg-rose-300/8 p-4 text-sm font-bold text-rose-50">
            {primaryAction}
          </div>
        </Panel>

        <Panel title="Alert Types" subtitle="Signals by operating area" className="col-span-4">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTypes}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Bar dataKey="value" fill="#fb7185" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Resolution State" subtitle="Current alert workflow" className="col-span-4">
          <div className="grid gap-3">
            {resolution.map((item) => (
              <div key={item.name} className="rounded-md border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-sm font-black text-white">
                  <span>{item.name}</span>
                  <StatusBadge label={String(item.value)} status={item.name} />
                </div>
                <div className="signal-line"><span style={{ width: `${(item.value / data.alerts.length) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Alerts" subtitle="Latest operational alerts" className="col-span-12">
          <DataTable
            rows={recentAlerts}
            columns={[
              { key: 'AlertID', label: 'Alert' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'AlertDate', label: 'Date' },
              { key: 'AlertType', label: 'Type' },
              { key: 'PriorityLevel', label: 'Priority' },
              { key: 'ResolutionStatus', label: 'Resolution' },
              { key: 'RecommendedAction', label: 'Action' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
