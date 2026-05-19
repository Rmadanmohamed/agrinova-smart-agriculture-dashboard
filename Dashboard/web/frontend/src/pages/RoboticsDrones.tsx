import { BatteryCharging, Bot, Plane, Route, ShieldAlert } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { average, pct, toNumber } from '../utils/formatters';

export function RoboticsDrones({ data, summary }: PageProps) {
  const robotBattery = average(data.robotMissions.map((row) => toNumber(row.BatteryPct)));
  const droneBattery = average(data.droneMissions.map((row) => toNumber(row.BatteryPct)));
  const routeProgress = average(data.robotMissions.map((row) => toNumber(row.RouteProgressPct)));
  const obstacleAlerts = data.robotMissions.reduce((sum, row) => sum + toNumber(row.ObstacleAlerts), 0);
  const coverage = data.droneMissions.map((row) => ({ unit: row.DroneID, coverage: toNumber(row.FlightCoveragePct) }));
  const fleetRows = [
    ...data.robotMissions.map((row) => ({ ...row, UnitID: row.RobotID, UnitType: 'Robot', UnitStatus: row.RobotStatus, Coverage: row.FieldCoveragePct })),
    ...data.droneMissions.map((row) => ({ ...row, UnitID: row.DroneID, UnitType: 'Drone', UnitStatus: row.DroneFlightStatus, Coverage: row.FlightCoveragePct })),
  ];

  return (
    <Page title="Robotics & Drone Operations" eyebrow="Autonomous field operations">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Active Robots" value={summary.activeRobots} detail="Ground missions" icon={Bot} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Active Drones" value={summary.activeDrones} detail="Aerial missions" icon={Plane} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Robot Battery" value={pct(robotBattery)} detail="Average charge" icon={BatteryCharging} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Drone Battery" value={pct(droneBattery)} detail="Average charge" icon={BatteryCharging} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Route Progress" value={pct(routeProgress)} detail="Robot routing" icon={Route} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Obstacle Alerts" value={obstacleAlerts} detail="Fleet signals" icon={ShieldAlert} tone="amber" /></div>

        <Panel title="Fleet Battery" subtitle="Robot and drone power levels" className="col-span-4">
          <Gauge value={average([robotBattery, droneBattery])} label="Fleet charge index" accent="#a78bfa" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard label="Robots" value={pct(robotBattery)} icon={BatteryCharging} tone="emerald" />
            <StatCard label="Drones" value={pct(droneBattery)} icon={BatteryCharging} tone="cyan" />
          </div>
        </Panel>

        <Panel title="Drone Coverage" subtitle="Current aerial field coverage" className="col-span-8">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverage}>
                <XAxis dataKey="unit" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Bar dataKey="coverage" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Mission Control" subtitle="Robot and drone status table" className="col-span-12">
          <DataTable
            rows={fleetRows.slice(0, 10)}
            columns={[
              { key: 'UnitType', label: 'Type' },
              { key: 'UnitID', label: 'Unit' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'MissionState', label: 'Mission' },
              { key: 'UnitStatus', label: 'Status' },
              { key: 'BatteryPct', label: 'Battery' },
              { key: 'Coverage', label: 'Coverage' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
