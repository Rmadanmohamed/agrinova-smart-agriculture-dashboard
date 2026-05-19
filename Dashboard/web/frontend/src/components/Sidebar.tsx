import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  Gauge,
  Leaf,
  LineChart,
  Network,
  ShieldCheck,
  Sprout,
  Zap,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Overview', icon: Gauge },
  { to: '/smart-farm-monitoring', label: 'Smart Farm', icon: Sprout },
  { to: '/crop-health', label: 'Crop Health', icon: Leaf },
  { to: '/robotics-drones', label: 'Robotics', icon: Bot },
  { to: '/iot-network', label: 'IoT Network', icon: Network },
  { to: '/price-prediction', label: 'Prices', icon: LineChart },
  { to: '/blockchain-security', label: 'Blockchain', icon: ShieldCheck },
  { to: '/ai-assistant', label: 'Assistant', icon: BrainCircuit },
  { to: '/sustainability-energy', label: 'Energy', icon: Zap },
  { to: '/alerts-reports', label: 'Alerts', icon: AlertTriangle },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <div className="brand-mark">
          <Sprout className="h-7 w-7" />
        </div>
        <div>
          <div className="text-2xl font-black text-white">AgriNova</div>
          <div className="text-xs font-semibold text-cyan-200/70">AI Smart Agriculture Platform</div>
        </div>
      </div>
      <div className="sidebar-status">
        <div className="flex items-center justify-between">
          <span>Network</span>
          <strong>LIVE</strong>
        </div>
        <div className="sidebar-meter"><span /></div>
      </div>
      <nav className="nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
