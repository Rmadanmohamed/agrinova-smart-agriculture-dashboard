import { useMemo, useState } from 'react';
import { Droplets, FlaskConical, Radio, ThermometerSun } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { SelectControl } from '../components/SelectControl';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { average, pct, toNumber } from '../utils/formatters';

export function SmartFarmMonitoring({ data }: PageProps) {
  const [farmId, setFarmId] = useState(data.farms[0]?.FarmID ?? '');
  const farm = data.farms.find((row) => row.FarmID === farmId) ?? data.farms[0];
  const soil = useMemo(() => data.soilReadings.filter((row) => row.FarmID === farm?.FarmID), [data.soilReadings, farm]);
  const sensors = data.sensors.filter((row) => row.FarmID === farm?.FarmID);
  const weather = data.weatherReadings.find((row) => row.FarmID === farm?.FarmID);
  const moisture = average(soil.map((row) => toNumber(row.SoilMoisturePct)));
  const ph = average(soil.map((row) => toNumber(row.PH)));
  const humidity = average(soil.map((row) => toNumber(row.HumidityPct)));
  const chartRows = soil.slice(-26).map((row) => ({
    label: row.Time,
    moisture: toNumber(row.SoilMoisturePct),
    ph: toNumber(row.PH) * 10,
    humidity: toNumber(row.HumidityPct),
  }));

  return (
    <Page
      title="Smart Farm Monitoring"
      eyebrow={farm?.FarmName ?? 'Farm telemetry'}
      actions={<SelectControl label="Farm" value={farm?.FarmID ?? ''} options={data.farms.map((row) => row.FarmID)} onChange={setFarmId} />}
    >
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Soil Moisture" value={pct(moisture)} detail="Average selected farm" icon={Droplets} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="pH Balance" value={ph.toFixed(2)} detail="Root-zone average" icon={FlaskConical} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Humidity" value={pct(humidity)} detail="Environmental average" icon={ThermometerSun} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Live Sensors" value={`${sensors.filter((row) => row.Status === 'Online').length}/${sensors.length}`} detail="Online devices" icon={Radio} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Temperature" value={`${weather?.TemperatureC ?? '--'} C`} detail="Weather station" icon={ThermometerSun} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Irrigation" value={soil[0]?.IrrigationStatus ?? '--'} detail={farm?.IrrigationType ?? 'Smart irrigation'} icon={Droplets} tone="emerald" /></div>

        <Panel title="Farm Vital Signs" subtitle={`${farm?.Governorate ?? ''} · ${farm?.IrrigationType ?? ''}`} className="col-span-4">
          <Gauge value={moisture} label="Moisture balance" accent="#34d399" />
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold text-slate-300">
            <span>Temperature: {weather?.TemperatureC ?? '--'} C</span>
            <span>Weather risk: {weather?.WeatherRisk ?? '--'}</span>
            <span>Irrigation: {soil[0]?.IrrigationStatus ?? '--'}</span>
            <span>Fertigation: {soil[0]?.FertilizationStatus ?? '--'}</span>
          </div>
        </Panel>

        <Panel title="Sensor Readings" subtitle="Moisture, pH, and humidity movement" className="col-span-8">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRows}>
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Area type="monotone" dataKey="moisture" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.14} />
                <Area type="monotone" dataKey="humidity" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} />
                <Area type="monotone" dataKey="ph" stroke="#34d399" fill="#34d399" fillOpacity={0.08} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Sensor Fleet" subtitle="Selected farm device health" className="col-span-12">
          <DataTable
            rows={sensors.slice(0, 8)}
            columns={[
              { key: 'SensorID', label: 'Sensor' },
              { key: 'Zone', label: 'Zone' },
              { key: 'SensorType', label: 'Type' },
              { key: 'CommunicationHealth', label: 'Health' },
              { key: 'EdgeGateway', label: 'Gateway' },
              { key: 'Status', label: 'Status' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
