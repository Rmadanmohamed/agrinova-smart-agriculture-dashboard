import { useMemo, useState } from 'react';
import { Cpu, Radio, Router, WifiOff } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { SelectControl } from '../components/SelectControl';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { average, pct, toNumber } from '../utils/formatters';

export function IoTNetwork({ data, summary }: PageProps) {
  const sensorTypes = useMemo(() => ['All', ...new Set(data.sensors.map((row) => row.SensorType).filter(Boolean))], [data.sensors]);
  const [type, setType] = useState('All');
  const sensors = type === 'All' ? data.sensors : data.sensors.filter((row) => row.SensorType === type);
  const online = sensors.filter((row) => row.Status === 'Online').length;
  const offline = sensors.length - online;
  const gateways = new Set(sensors.map((row) => row.EdgeGateway).filter(Boolean)).size;
  const packetRate = average(sensors.map((row) => toNumber(row.PacketRate)));
  const communication = average(sensors.map((row) => toNumber(row.CommunicationHealth)));
  const chartRows = sensors.slice(0, 30).map((row) => ({
    sensor: row.SensorID,
    packetRate: toNumber(row.PacketRate),
    health: toNumber(row.CommunicationHealth),
  }));

  return (
    <Page
      title="IoT Sensor Network"
      eyebrow="Connected farm telemetry"
      actions={<SelectControl label="Sensor type" value={type} options={sensorTypes} onChange={setType} />}
    >
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Online Sensors" value={online} detail={`${summary.activeSensors} all farms`} icon={Radio} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Offline Sensors" value={offline} detail="Attention count" icon={WifiOff} tone="rose" /></div>
        <div className="col-span-2"><StatCard label="Gateways" value={gateways} detail="Edge gateways" icon={Router} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Packet Rate" value={packetRate.toFixed(1)} detail="Average packets" icon={Cpu} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Communication" value={pct(communication)} detail="Link health" icon={Radio} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Sensor Types" value={sensorTypes.length - 1} detail="Device classes" icon={Cpu} tone="emerald" /></div>

        <Panel title="Network Health" subtitle="Communication quality across selected sensors" className="col-span-4">
          <Gauge value={communication} label="Communication health" accent="#22d3ee" />
          <div className="mt-5 rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm font-bold text-cyan-50">
            {pct(online / Math.max(sensors.length, 1) * 100)} of selected sensors are reporting online.
          </div>
        </Panel>

        <Panel title="Packet Flow" subtitle="Packet rate and link health" className="col-span-8">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRows}>
                <XAxis dataKey="sensor" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Line type="monotone" dataKey="packetRate" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="health" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Latest Sensor Registry" subtitle="Device-level status and gateway assignments" className="col-span-12">
          <DataTable
            rows={sensors.slice(0, 10)}
            columns={[
              { key: 'SensorID', label: 'Sensor' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'Zone', label: 'Zone' },
              { key: 'SensorType', label: 'Type' },
              { key: 'PacketRate', label: 'Packet' },
              { key: 'CommunicationHealth', label: 'Health' },
              { key: 'EdgeGateway', label: 'Gateway' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
