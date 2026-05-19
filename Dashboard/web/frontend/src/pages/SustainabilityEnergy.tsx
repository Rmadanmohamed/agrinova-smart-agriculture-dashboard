import { Battery, Droplets, Leaf, SunMedium, Zap } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { PageProps } from '../services/types';
import { latestRows } from '../utils/calculations';
import { average, pct, toNumber } from '../utils/formatters';

export function SustainabilityEnergy({ data, summary }: PageProps) {
  const latest = latestRows(data.energy, 'Date', 12);
  const battery = average(latest.map((row) => toNumber(row.BatteryLevelPct)));
  const carbon = latest.reduce((sum, row) => sum + toNumber(row.CarbonReductionKg), 0);
  const consumption = latest.reduce((sum, row) => sum + toNumber(row.EnergyConsumptionKwh), 0);
  const waterSaving =
    (data.soilReadings.filter((row) => row.IrrigationStatus === 'Optimal').length / Math.max(data.soilReadings.length, 1)) * 100;
  const chartRows = latest
    .slice()
    .reverse()
    .map((row) => ({
      date: row.Date?.slice(5),
      renewable: toNumber(row.RenewableEnergyUsagePct),
      battery: toNumber(row.BatteryLevelPct),
      consumption: toNumber(row.EnergyConsumptionKwh),
    }));

  return (
    <Page title="Sustainability & Energy" eyebrow="Resource efficiency command">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Renewable Usage" value={pct(summary.renewableEnergyPercentage)} detail="Renewable share" icon={SunMedium} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Carbon Reduction" value={`${carbon.toFixed(0)} kg`} detail="Latest records" icon={Leaf} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Battery Level" value={pct(battery)} detail="Average charge" icon={Battery} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Water Saving" value={pct(waterSaving)} detail="Optimal irrigation" icon={Droplets} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Solar Status" value={latest[0]?.SolarPowerStatus ?? 'Active'} detail="Solar field" icon={SunMedium} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Consumption" value={`${consumption.toFixed(0)} kWh`} detail="Latest window" icon={Zap} tone="rose" /></div>

        <Panel title="Sustainability Gauge" subtitle="Renewable and storage balance" className="col-span-4">
          <Gauge value={average([summary.renewableEnergyPercentage, battery, waterSaving])} label="Sustainability index" accent="#34d399" />
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusBadge label={`Solar ${latest[0]?.SolarPowerStatus ?? 'Active'}`} status={latest[0]?.SolarPowerStatus} />
            <StatusBadge label={latest[0]?.OffGridOperationStatus ?? 'Stable'} status={latest[0]?.OffGridOperationStatus} />
          </div>
        </Panel>

        <Panel title="Energy Flow" subtitle="Renewable energy, storage, and consumption" className="col-span-8">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRows}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Area type="monotone" dataKey="renewable" stroke="#34d399" fill="#34d399" fillOpacity={0.15} />
                <Area type="monotone" dataKey="battery" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} />
                <Area type="monotone" dataKey="consumption" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.08} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Energy Operations" subtitle={`${consumption.toFixed(1)} kWh across latest records`} className="col-span-12">
          <DataTable
            rows={latest}
            columns={[
              { key: 'EnergyID', label: 'Energy ID' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'SolarPowerStatus', label: 'Solar' },
              { key: 'BatteryLevelPct', label: 'Battery' },
              { key: 'RenewableEnergyUsagePct', label: 'Renewable' },
              { key: 'EnergyConsumptionKwh', label: 'kWh' },
              { key: 'RobotChargingStatus', label: 'Robots' },
              { key: 'DroneChargingStatus', label: 'Drones' },
            ]}
          />
        </Panel>

        <div className="col-span-4">
          <StatCard label="Energy Consumption" value={`${consumption.toFixed(1)} kWh`} detail="Latest energy window" icon={Zap} tone="rose" />
        </div>
      </section>
    </Page>
  );
}
