import { Activity, Bug, Leaf, ShieldAlert } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { latestRows, topCounts } from '../utils/calculations';
import { pct, toNumber } from '../utils/formatters';

export function CropHealth({ data, summary }: PageProps) {
  const diseases = new Set(data.cropHealth.map((row) => row.DetectedDisease).filter(Boolean)).size;
  const highPest = data.cropHealth.filter((row) => row.PestRiskLevel === 'High').length;
  const scanRows = latestRows(data.cropHealth, 'ScanDate', 8);
  const diseaseBars = topCounts(data.cropHealth, 'DetectedDisease', 6);
  const healthTrend = latestRows(data.cropHealth, 'ScanDate', 24).reverse().map((row) => ({
    scan: row.ScanID,
    health: toNumber(row.CropHealthScore),
  }));

  return (
    <Page title="Crop Health & Vision Intelligence" eyebrow="Vision Intelligence Module">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Health Score" value={pct(summary.averageCropHealth)} detail="Average scan score" icon={Leaf} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Disease Signals" value={diseases} detail="Detected signals" icon={ShieldAlert} tone="rose" /></div>
        <div className="col-span-2"><StatCard label="High Pest Risk" value={highPest} detail="High-priority scans" icon={Bug} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Scan Records" value={data.cropHealth.length} detail="Vision records" icon={Activity} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Vision Module" value="Ready" detail="Image diagnosis" icon={Leaf} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Treatment Queue" value={scanRows.length} detail="Recent treatments" icon={ShieldAlert} tone="emerald" /></div>

        <Panel title="Crop Health Index" subtitle="Aggregate scan condition" className="col-span-4">
          <Gauge value={summary.averageCropHealth} label="Canopy condition" accent="#34d399" />
          <div className="mt-5 rounded-md border border-emerald-300/15 bg-emerald-300/8 p-4 text-sm font-bold text-emerald-50">
            {scanRows[0]?.RecommendedTreatment ?? 'Continue inspection schedule'}
          </div>
        </Panel>

        <Panel title="Health Trend" subtitle="Recent scan score movement" className="col-span-5">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend}>
                <XAxis dataKey="scan" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Line type="monotone" dataKey="health" stroke="#34d399" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Detected Signals" subtitle="Frequency by scan label" className="col-span-3">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseBars}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Bar dataKey="value" fill="#f472b6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Recent Scan Queue" subtitle="Treatment and pest risk review" className="col-span-12">
          <DataTable
            rows={scanRows}
            columns={[
              { key: 'ScanID', label: 'Scan' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'CropHealthScore', label: 'Score' },
              { key: 'DetectedDisease', label: 'Signal' },
              { key: 'PestRiskLevel', label: 'Pest Risk' },
              { key: 'RecommendedTreatment', label: 'Treatment' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
