import { Activity, AlertTriangle, Radio, ShieldCheck, Sprout, Zap } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { latestRows, topCounts } from '../utils/calculations';
import { compact, pct, toNumber } from '../utils/formatters';

export function Overview({ data, summary }: PageProps) {
  const soilSeries = latestRows(data.soilReadings, 'Date', 18)
    .reverse()
    .map((row) => ({
      label: row.Time || row.Date,
      moisture: toNumber(row.SoilMoisturePct),
      humidity: toNumber(row.HumidityPct),
    }));
  const alertTypes = topCounts(data.alerts, 'AlertType', 6);

  return (
    <Page title="Overview" eyebrow="AgriNova enterprise command center">
      <section className="dashboard-grid">
        <div className="col-span-2">
          <StatCard label="Farms" value={summary.totalFarms} detail={`${summary.onlineFarms} online farms`} icon={Sprout} tone="emerald" />
        </div>
        <div className="col-span-2">
          <StatCard label="Active Sensors" value={compact(summary.activeSensors)} detail={`${summary.totalSensors} total sensor units`} icon={Radio} tone="cyan" />
        </div>
        <div className="col-span-2">
          <StatCard label="Active Robots" value={summary.activeRobots} detail="Ground automation" icon={Activity} tone="violet" />
        </div>
        <div className="col-span-2">
          <StatCard label="Active Drones" value={summary.activeDrones} detail="Aerial automation" icon={Zap} tone="cyan" />
        </div>
        <div className="col-span-2">
          <StatCard label="Active Alerts" value={summary.activeAlerts} detail={`${summary.criticalAlerts} critical alerts`} icon={AlertTriangle} tone="rose" />
        </div>
        <div className="col-span-2">
          <StatCard label="System Health" value={pct(summary.systemHealthIndex, 1)} detail="Executive index" icon={ShieldCheck} tone="emerald" />
        </div>

        <Panel title="System Health" subtitle="Calculated from farms, sensors, and crop scan records" className="col-span-4">
          <Gauge value={summary.systemHealthIndex} label="Operational index" accent="#22d3ee" />
          <div className="mt-5 grid gap-3">
            <div>
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-300">
                <span>Crop health</span>
                <span>{pct(summary.averageCropHealth)}</span>
              </div>
              <div className="signal-line"><span style={{ width: `${summary.averageCropHealth}%` }} /></div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-300">
                <span>Communication</span>
                <span>{pct(summary.averageCommunicationHealth)}</span>
              </div>
              <div className="signal-line"><span style={{ width: `${summary.averageCommunicationHealth}%` }} /></div>
            </div>
          </div>
        </Panel>

        <Panel title="Soil & Humidity Trend" subtitle="Latest environmental readings" className="col-span-5">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilSeries}>
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Area type="monotone" dataKey="moisture" stroke="#34d399" fill="#34d399" fillOpacity={0.16} />
                <Area type="monotone" dataKey="humidity" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Alert Distribution" subtitle="Open operational pressure points" className="col-span-3">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTypes}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Bar dataKey="value" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Farm Network" subtitle="Live farm roster" className="col-span-8">
          <DataTable
            rows={data.farms.slice(0, 6)}
            columns={[
              { key: 'FarmName', label: 'Farm' },
              { key: 'Governorate', label: 'Governorate' },
              { key: 'IrrigationType', label: 'Irrigation' },
              { key: 'EnergyMode', label: 'Energy' },
              { key: 'Status', label: 'Status' },
            ]}
          />
        </Panel>

        <Panel title="Security & Automation" subtitle="Cross-system operating picture" className="col-span-4">
          <div className="grid gap-4">
            <StatCard label="Verified Ledger" value={pct(summary.blockchainVerificationRate)} detail="Validated records share" icon={ShieldCheck} tone="cyan" />
            <StatCard label="Robotics Fleet" value={summary.activeRobots + summary.activeDrones} detail={`${summary.activeRobots} robots · ${summary.activeDrones} drones`} icon={Activity} tone="emerald" />
          </div>
        </Panel>
      </section>
    </Page>
  );
}
