"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { FloatingPanel } from "@/components/dashboard/floating-panel"
import {
  Wifi,
  WifiOff,
  Database,
  Signal,
  Router,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Search,
  Download,
  Settings,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const sensorTypeData = [
  { name: "Soil Sensors", value: 1264, percent: "33.8%", color: "#22c55e" },
  { name: "Weather Stations", value: 645, percent: "17.2%", color: "#3b82f6" },
  { name: "Camera Traps", value: 436, percent: "11.6%", color: "#a855f7" },
  { name: "Drone Sensors", value: 312, percent: "8.3%", color: "#f59e0b" },
  { name: "Other Sensors", value: 1085, percent: "29.1%", color: "#6b7280" },
]

const liveSensorFeed = [
  { id: "SEN-001", type: "Soil Moisture", location: "Zone A", status: "Online", signal: 4, lastUpdate: "10:45:21 AM", value: "24.7%" },
  { id: "SEN-002", type: "Soil Temp.", location: "Zone A", status: "Online", signal: 4, lastUpdate: "10:45:18 AM", value: "24.3°C" },
  { id: "SEN-003", type: "pH Sensor", location: "Zone B", status: "Online", signal: 4, lastUpdate: "10:45:22 AM", value: "6.4" },
  { id: "SEN-004", type: "Weather Station", location: "Farm Alpha", status: "Online", signal: 4, lastUpdate: "10:45:20 AM", value: "24°C" },
  { id: "SEN-005", type: "EC Sensor", location: "Zone C", status: "Online", signal: 3, lastUpdate: "10:45:19 AM", value: "1.2 dS/m" },
  { id: "SEN-006", type: "Camera Trap", location: "Zone D", status: "Online", signal: 3, lastUpdate: "10:45:17 AM", value: "Active" },
  { id: "SEN-007", type: "NPK Sensor", location: "Zone E", status: "Weak", signal: 2, lastUpdate: "10:45:10 AM", value: "210 ppm" },
  { id: "SEN-008", type: "Leaf Wetness", location: "Zone B", status: "Online", signal: 4, lastUpdate: "10:45:16 AM", value: "31%" },
]

const dataTransmissionData = [
  { time: "12 AM", value: 50000 },
  { time: "4 AM", value: 180000 },
  { time: "8 AM", value: 850000 },
  { time: "12 PM", value: 1200000 },
  { time: "4 PM", value: 950000 },
  { time: "8 PM", value: 600000 },
  { time: "12 PM", value: 1840000 },
]

const dataTrendsData = [
  { date: "May 6", soil: 800000, weather: 400000, image: 1200000, other: 300000 },
  { date: "May 7", soil: 950000, weather: 450000, image: 1350000, other: 350000 },
  { date: "May 8", soil: 1100000, weather: 500000, image: 1500000, other: 400000 },
  { date: "May 9", soil: 1000000, weather: 480000, image: 1400000, other: 380000 },
  { date: "May 10", soil: 1200000, weather: 520000, image: 1600000, other: 420000 },
  { date: "May 11", soil: 1350000, weather: 550000, image: 1750000, other: 450000 },
  { date: "May 12", soil: 1500000, weather: 600000, image: 1900000, other: 500000 },
]

const edgeGateways = [
  { id: "GW-01", location: "Farm Alpha", sensors: 312, status: "Online", uptime: "99.9%" },
  { id: "GW-02", location: "Farm Beta", sensors: 298, status: "Online", uptime: "99.8%" },
  { id: "GW-03", location: "Farm Gamma", sensors: 287, status: "Online", uptime: "100%" },
  { id: "GW-04", location: "Farm Delta", sensors: 301, status: "Online", uptime: "99.9%" },
  { id: "GW-05", location: "Farm Epsilon", sensors: 276, status: "Online", uptime: "99.7%" },
]

const sensorAlerts = [
  { message: "Low battery - Soil Sensor SEN-123", detail: "Zone C • Battery 15%", time: "10:42 AM", type: "warning" },
  { message: "Signal weak - Weather Station WS-07", detail: "Farm Beta • Signal -85 dBm", time: "10:40 AM", type: "warning" },
  { message: "Sensor offline - Camera Trap CAM-12", detail: "Zone D • No data received", time: "10:38 AM", type: "critical" },
  { message: "Calibration due - pH Sensor SEN-045", detail: "Zone B • Last calibration 30 days ago", time: "10:35 AM", type: "info" },
]

const networkPerformance = [
  { metric: "Bandwidth Usage", value: "78%", status: "Optimal", color: "text-primary" },
  { metric: "Response Time", value: "28ms", status: "Excellent", color: "text-primary" },
  { metric: "Data Reliability", value: "99.8%", status: "Excellent", color: "text-primary" },
  { metric: "Packet Success", value: "99.6%", status: "Excellent", color: "text-primary" },
]

const sensorDistributionByType = [
  { type: "Soil", count: 1264, color: "#22c55e" },
  { type: "Weather", count: 645, color: "#3b82f6" },
  { type: "Camera", count: 436, color: "#a855f7" },
  { type: "Drone", count: 312, color: "#f59e0b" },
  { type: "Other", count: 1085, color: "#6b7280" },
]

const quickActions = [
  { name: "Add Sensor", icon: Plus },
  { name: "Scan Network", icon: Search },
  { name: "Check Health", icon: RefreshCw },
  { name: "Export Data", icon: Download },
]

export default function IoTNetworkPage() {
  return (
    <DashboardLayout
      pageNumber="05"
      title="IoT Sensor Network"
      subtitle="Real-time sensor connectivity and intelligent monitoring"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        <StatCard
          title="Total Sensors"
          value="3,742"
          change="7.1%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Wifi}
          iconColor="text-primary"
        />
        <StatCard
          title="Online Sensors"
          value="3,612"
          changeLabel="96.5% Online"
          icon={CheckCircle}
          iconColor="text-primary"
        />
        <StatCard
          title="Offline Sensors"
          value="130"
          changeLabel="3.5% Offline"
          icon={WifiOff}
          iconColor="text-red-400"
        />
        <StatCard
          title="Data Points Today"
          value="1.84M"
          change="12.3%"
          changeType="increase"
          changeLabel="vs yesterday"
          icon={Database}
          iconColor="text-blue-400"
        />
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Avg. Signal Strength</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">-65</span>
                <span className="text-sm text-muted-foreground">dBm</span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">Good</p>
            </div>
            <div className="rounded-lg bg-primary/20 p-2.5 text-primary">
              <Signal className="h-5 w-5" />
            </div>
          </div>
        </div>
        <StatCard
          title="Edge Gateways"
          value="24"
          changeLabel="Online"
          icon={Router}
          iconColor="text-cyan-400"
        />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* Sensor Network Map */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Sensor Network Map</h3>
              <p className="text-xs text-muted-foreground">Live Connectivity View</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>All Farms</option>
            </select>
          </div>
          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative">
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Minus className="h-3 w-3" />
              </Button>
            </div>
            <svg viewBox="0 0 300 225" className="h-full w-full">
              {/* Grid */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 15} x2="300" y2={i * 15} stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 15} y1="0" x2={i * 15} y2="225" stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              
              {/* Connection lines */}
              <line x1="150" y1="112" x2="60" y2="60" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="150" y1="112" x2="240" y2="45" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="150" y1="112" x2="75" y2="165" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="150" y1="112" x2="225" y2="180" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="150" y1="112" x2="165" y2="195" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3" />
              
              {/* Central gateway */}
              <circle cx="150" cy="112" r="12" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="1" />
              <circle cx="150" cy="112" r="6" fill="#22c55e" />
              
              {/* Sensors */}
              {[
                { x: 60, y: 60, signal: "strong" },
                { x: 240, y: 45, signal: "strong" },
                { x: 75, y: 165, signal: "strong" },
                { x: 225, y: 180, signal: "good" },
                { x: 165, y: 195, signal: "weak" },
                { x: 45, y: 105, signal: "strong" },
                { x: 255, y: 120, signal: "strong" },
                { x: 120, y: 45, signal: "good" },
                { x: 195, y: 75, signal: "strong" },
                { x: 90, y: 195, signal: "offline" },
              ].map((sensor, i) => (
                <g key={i}>
                  <circle
                    cx={sensor.x}
                    cy={sensor.y}
                    r="5"
                    fill={
                      sensor.signal === "strong" ? "#22c55e" :
                      sensor.signal === "good" ? "#3b82f6" :
                      sensor.signal === "weak" ? "#f59e0b" : "#ef4444"
                    }
                  />
                  <circle
                    cx={sensor.x}
                    cy={sensor.y}
                    r="8"
                    fill="none"
                    stroke={
                      sensor.signal === "strong" ? "#22c55e" :
                      sensor.signal === "good" ? "#3b82f6" :
                      sensor.signal === "weak" ? "#f59e0b" : "#ef4444"
                    }
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {[
              { label: "Strong Signal", color: "bg-primary" },
              { label: "Good Signal", color: "bg-blue-500" },
              { label: "Weak Signal", color: "bg-amber-500" },
              { label: "Offline", color: "bg-red-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Status by Type */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sensor Status by Type</h3>
            <p className="text-xs text-muted-foreground">Real-time Overview</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sensorTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sensorTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">3,742</span>
                <span className="text-[10px] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {sensorTypeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value.toLocaleString()} ({item.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Sensor Feed */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Live Sensor Feed</h3>
              <p className="text-xs text-muted-foreground">Real-time Data Stream</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View All Sensors</Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Sensor ID</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Type</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Location</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Signal</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Last Update</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {liveSensorFeed.map((sensor, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{sensor.id}</td>
                    <td className="py-2 text-foreground">{sensor.type}</td>
                    <td className="py-2 text-foreground">{sensor.location}</td>
                    <td className="py-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        sensor.status === "Online" ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {sensor.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-1 rounded-sm ${
                              level <= sensor.signal ? "bg-primary" : "bg-secondary"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-2 text-muted-foreground">{sensor.lastUpdate}</td>
                    <td className="py-2 text-foreground">{sensor.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Sensor Connectivity Heatmap */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sensor Connectivity Heatmap</h3>
            <p className="text-xs text-muted-foreground">Signal Strength Distribution</p>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const strength = Math.random()
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor:
                      strength > 0.8 ? "#22c55e" :
                      strength > 0.6 ? "#3b82f6" :
                      strength > 0.4 ? "#f59e0b" :
                      strength > 0.2 ? "#f97316" : "#ef4444",
                    opacity: 0.3 + strength * 0.7,
                  }}
                />
              )
            })}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>

        {/* Data Transmission */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Data Transmission (Today)</h3>
              <p className="text-xs text-muted-foreground">Real-time Data Flow</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <span className="text-2xl font-bold text-foreground">1.84M</span>
            <span className="text-xs text-muted-foreground">Data Points</span>
          </div>
          <div className="mt-2 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTransmissionData}>
                <defs>
                  <linearGradient id="dataGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" vertical={false} />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    border: "1px solid #1e3a1e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e8f5e8" }}
                  formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, "Data Points"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#dataGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Performance */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Network Performance</h3>
            <p className="text-xs text-muted-foreground">Performance Metrics</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {networkPerformance.map((item, i) => (
              <div key={i} className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.metric}</span>
                </div>
                <p className="mt-1 text-xl font-bold text-foreground">{item.value}</p>
                <p className={`text-xs ${item.color}`}>{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Alerts */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Sensor Alerts</h3>
              <p className="text-xs text-muted-foreground">Critical & Warning Alerts</p>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
              View All Alerts
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {sensorAlerts.map((alert, i) => (
              <div
                key={i}
                className={`rounded-lg p-2.5 ${
                  alert.type === "critical" ? "bg-red-500/10" :
                  alert.type === "warning" ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`mt-0.5 h-3.5 w-3.5 ${
                        alert.type === "critical" ? "text-red-400" :
                        alert.type === "warning" ? "text-amber-400" : "text-blue-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          alert.type === "critical" ? "text-red-400" :
                          alert.type === "warning" ? "text-amber-400" : "text-blue-400"
                        }`}
                      >
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{alert.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Data Trends Overview */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Data Trends Overview</h3>
              <p className="text-xs text-muted-foreground">7-Day Data Collection Trend</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {[
              { label: "Soil Data", color: "bg-primary" },
              { label: "Weather Data", color: "bg-blue-500" },
              { label: "Image Data", color: "bg-amber-500" },
              { label: "Other Data", color: "bg-purple-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    border: "1px solid #1e3a1e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e8f5e8" }}
                />
                <Area type="monotone" dataKey="soil" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.1} />
                <Area type="monotone" dataKey="weather" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="image" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b" fillOpacity={0.1} />
                <Area type="monotone" dataKey="other" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Edge Gateways Status */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Edge Gateways Status</h3>
              <p className="text-xs text-muted-foreground">All Gateways Overview</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View All Gateways</Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Gateway ID</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Location</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Connected Sensors</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {edgeGateways.map((gateway, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{gateway.id}</td>
                    <td className="py-2 text-foreground">{gateway.location}</td>
                    <td className="py-2 text-foreground">{gateway.sensors}</td>
                    <td className="py-2">
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-primary/20 text-primary">
                        {gateway.status}
                      </span>
                    </td>
                    <td className="py-2 text-foreground">{gateway.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sensor Distribution by Type */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sensor Distribution by Type</h3>
            <p className="text-xs text-muted-foreground">Distribution Overview</p>
          </div>
          <div className="mt-4 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sensorDistributionByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" horizontal={false} />
                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    border: "1px solid #1e3a1e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e8f5e8" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {sensorDistributionByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Network Management</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary p-3 transition-colors hover:border-primary hover:bg-primary/10"
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-foreground">{action.name}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View All Actions
          </Button>
        </div>
      </div>

      {/* Network Status Card */}
      <FloatingPanel
        title="Network Status"
        className="fixed bottom-6 left-56 hidden xl:block"
      >
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">All Systems Connected</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="relative">
            <Wifi className="h-12 w-12 text-primary" />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              3.7k
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="h-3 w-3" /> Uptime
            </span>
            <span className="text-foreground">99.9%</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Signal className="h-3 w-3" /> Latency
            </span>
            <span className="text-foreground">28ms</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Database className="h-3 w-3" /> Packet Loss
            </span>
            <span className="text-foreground">0.2%</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
          View Network Health
        </Button>
      </FloatingPanel>
    </DashboardLayout>
  )
}
