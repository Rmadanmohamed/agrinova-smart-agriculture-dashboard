"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  Home,
  MapPin,
  Wifi,
  AlertTriangle,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Activity,
  Zap,
  Beaker,
  Sprout,
  Eye,
  ChevronRight,
  MoreVertical,
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
} from "recharts"

const soilConditionsData = [
  { date: "May 6", moisture: 30, temperature: 22, ph: 6.2 },
  { date: "May 7", moisture: 45, temperature: 23, ph: 6.3 },
  { date: "May 8", moisture: 55, temperature: 24, ph: 6.4 },
  { date: "May 9", moisture: 48, temperature: 25, ph: 6.3 },
  { date: "May 10", moisture: 60, temperature: 24, ph: 6.5 },
  { date: "May 11", moisture: 52, temperature: 25, ph: 6.4 },
  { date: "May 12", moisture: 65, temperature: 24.7, ph: 6.4 },
]

const sensorReadings = [
  { label: "Soil Moisture", value: "24.7%", status: "Optimal", icon: Droplets, color: "text-blue-400" },
  { label: "Soil Temp", value: "24.3°C", status: "Optimal", icon: Thermometer, color: "text-amber-400" },
  { label: "pH Level", value: "6.4", status: "Optimal", icon: Beaker, color: "text-green-400" },
  { label: "EC Level", value: "1.2 dS/m", status: "Optimal", icon: Zap, color: "text-purple-400" },
  { label: "Nitrogen (N)", value: "32 ppm", status: "Optimal", icon: Sprout, color: "text-blue-400" },
  { label: "Phosphorus (P)", value: "18 ppm", status: "Optimal", icon: Beaker, color: "text-pink-400" },
  { label: "Potassium (K)", value: "210 ppm", status: "Optimal", icon: Beaker, color: "text-amber-400" },
  { label: "Organic Matter", value: "2.8%", status: "Optimal", icon: Sprout, color: "text-green-400" },
]

const weatherForecast = [
  { day: "Today", temp: "24°/16°", condition: "Sunny", rain: "0%", icon: Sun },
  { day: "Wed", temp: "23°/15°", condition: "Partly Cloudy", rain: "10%", icon: Sun },
  { day: "Thu", temp: "22°/14°", condition: "Light Rain", rain: "60%", icon: CloudRain },
  { day: "Fri", temp: "25°/17°", condition: "Partly Cloudy", rain: "20%", icon: Sun },
  { day: "Sat", temp: "26°/18°", condition: "Sunny", rain: "0%", icon: Sun },
]

const irrigationData = {
  efficiency: 85,
  totalSystems: 64,
  activeNow: 54,
  scheduled: 8,
  offline: 2,
  waterUsage: "12,450 L",
  waterChange: "+8.3%",
}

const fieldPerformance = [
  { metric: "Crop Growth", value: 92, color: "bg-green-500" },
  { metric: "Yield Potential", value: 87, color: "bg-green-500" },
  { metric: "Resource Efficiency", value: 78, color: "bg-green-500" },
  { metric: "Pest Pressure", value: 32, color: "bg-amber-500" },
  { metric: "Disease Risk", value: 22, color: "bg-green-500" },
]

const recentActivity = [
  { event: "Irrigation started - Farm Alpha", time: "10:30 AM", icon: Droplets },
  { event: "Fertilizer applied - Farm Beta", time: "09:45 AM", icon: Sprout },
  { event: "Pest detected - Farm Delta", time: "09:20 AM", icon: AlertTriangle },
  { event: "Drone survey completed - Farm Gamma", time: "08:50 AM", icon: Eye },
  { event: "Weather alert - Heavy rain expected", time: "08:15 AM", icon: CloudRain },
]

const activeAlerts = [
  { message: "Low soil moisture - Farm Delta - Zone 3", time: "12 min ago", severity: "warning" },
  { message: "Pest infestation detected - Farm Epsilon", time: "25 min ago", severity: "critical" },
  { message: "High temperature alert - Farm Beta", time: "45 min ago", severity: "warning" },
  { message: "Irrigation system offline - Farm Zeta", time: "1 hour ago", severity: "critical" },
]

const farmStatus = {
  total: 128,
  active: { count: 98, percent: 76 },
  warning: { count: 22, percent: 17 },
  critical: { count: 6, percent: 5 },
  offline: { count: 2, percent: 2 },
}

export default function FarmMonitoringPage() {
  return (
    <DashboardLayout
      pageNumber="02"
      title="Smart Farm Monitoring"
      subtitle="Real-time Farm Intelligence"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        <StatCard
          title="Total Farms"
          value="128"
          change="12.5%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Home}
          iconColor="text-primary"
        />
        <StatCard
          title="Monitored Area (ha)"
          value="2,846"
          change="8.3%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={MapPin}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Active Sensors"
          value="3,742"
          change="7.1%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Wifi}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Sensor Reliability"
          value="98.6%"
          change="2.4%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Activity}
          iconColor="text-purple-400"
        />
        <StatCard
          title="Alerts"
          value="7"
          changeLabel="High Priority"
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Field Efficiency"
          value="86.4%"
          change="5.6%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={TrendingUp}
          iconColor="text-primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* Farm Overview Map */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Farm Overview Map</h3>
              <p className="text-xs text-muted-foreground">Real-time Field Status</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">2D View</Button>
              <Button variant="default" size="sm" className="text-xs">3D View</Button>
            </div>
          </div>
          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative">
            {/* Map visualization */}
            <div className="absolute inset-0 p-4">
              <svg viewBox="0 0 400 300" className="h-full w-full">
                {/* Grid lines */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 15}
                    x2="400"
                    y2={i * 15}
                    stroke="#1e3a1e"
                    strokeWidth="0.5"
                  />
                ))}
                {Array.from({ length: 27 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 15}
                    y1="0"
                    x2={i * 15}
                    y2="300"
                    stroke="#1e3a1e"
                    strokeWidth="0.5"
                  />
                ))}
                
                {/* Farm plots */}
                <rect x="30" y="40" width="80" height="60" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="1" rx="4" />
                <rect x="130" y="30" width="100" height="80" fill="#22c55e" fillOpacity="0.4" stroke="#22c55e" strokeWidth="1" rx="4" />
                <rect x="250" y="40" width="90" height="70" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" rx="4" />
                <rect x="40" y="120" width="120" height="90" fill="#22c55e" fillOpacity="0.5" stroke="#22c55e" strokeWidth="1" rx="4" />
                <rect x="180" y="130" width="80" height="100" fill="#22c55e" fillOpacity="0.35" stroke="#22c55e" strokeWidth="1" rx="4" />
                <rect x="280" y="130" width="70" height="80" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1" rx="4" />
                <rect x="50" y="230" width="100" height="50" fill="#22c55e" fillOpacity="0.4" stroke="#22c55e" strokeWidth="1" rx="4" />
                <rect x="170" y="250" width="90" height="40" fill="#f59e0b" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="1" rx="4" />
                
                {/* Sensor dots */}
                {[
                  { x: 70, y: 70, status: "healthy" },
                  { x: 180, y: 70, status: "healthy" },
                  { x: 295, y: 75, status: "warning" },
                  { x: 100, y: 165, status: "healthy" },
                  { x: 220, y: 180, status: "healthy" },
                  { x: 315, y: 170, status: "critical" },
                  { x: 100, y: 255, status: "healthy" },
                  { x: 215, y: 270, status: "warning" },
                ].map((sensor, i) => (
                  <g key={i}>
                    <circle
                      cx={sensor.x}
                      cy={sensor.y}
                      r="6"
                      fill={
                        sensor.status === "healthy"
                          ? "#22c55e"
                          : sensor.status === "warning"
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      fillOpacity="0.8"
                    />
                    <circle
                      cx={sensor.x}
                      cy={sensor.y}
                      r="10"
                      fill="none"
                      stroke={
                        sensor.status === "healthy"
                          ? "#22c55e"
                          : sensor.status === "warning"
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="1"
                      strokeOpacity="0.5"
                      className="animate-ping"
                      style={{ animationDuration: "2s" }}
                    />
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Farm info tooltips */}
            <div className="absolute left-8 top-12 rounded-md border border-border bg-card/90 px-2 py-1 text-xs">
              <p className="font-medium text-foreground">Farm Alpha</p>
              <p className="text-muted-foreground">Soil Moisture: 24.7%</p>
              <p className="text-muted-foreground">Crop: Tomatoes</p>
            </div>
            <div className="absolute right-8 top-12 rounded-md border border-border bg-card/90 px-2 py-1 text-xs">
              <p className="font-medium text-foreground">Farm Beta</p>
              <p className="text-muted-foreground">Soil Moisture: 32.1%</p>
              <p className="text-muted-foreground">Crop: Potatoes</p>
            </div>
            <div className="absolute bottom-16 left-8 rounded-md border border-border bg-card/90 px-2 py-1 text-xs">
              <p className="font-medium text-foreground">Farm Gamma</p>
              <p className="text-muted-foreground">Soil Moisture: 18.3%</p>
              <p className="text-muted-foreground">Crop: Lettuce</p>
            </div>
            <div className="absolute bottom-16 right-8 rounded-md border border-border bg-card/90 px-2 py-1 text-xs">
              <p className="font-medium text-foreground">Farm Delta</p>
              <p className="text-muted-foreground">Soil Moisture: 12.5%</p>
              <p className="text-muted-foreground">Crop: Onions</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-muted-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              <span className="text-muted-foreground">Offline</span>
            </div>
          </div>
        </div>

        {/* Soil & Field Conditions */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Soil & Field Conditions</h3>
              <p className="text-xs text-muted-foreground">7-Day Trend Analysis</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-muted-foreground">Soil Moisture (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Soil Temperature (°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-muted-foreground">pH Level</span>
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={soilConditionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                  domain={[0, 100]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    border: "1px solid #1e3a1e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e8f5e8" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="moisture"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 0, r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ph"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: "#a855f7", strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-end gap-4 text-xs">
            <div className="rounded bg-secondary px-2 py-1">
              <span className="text-muted-foreground">May 12, 2025</span>
            </div>
            <div className="text-primary">
              Moisture: <span className="font-medium">24.7%</span>
            </div>
            <div className="text-amber-400">
              Temp: <span className="font-medium">24.3°C</span>
            </div>
            <div className="text-purple-400">
              pH: <span className="font-medium">6.4</span>
            </div>
          </div>
        </div>

        {/* Current Environment */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">Current Environment</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">Temperature</span>
                </div>
                <span className="text-sm font-medium text-foreground">24.7°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <span className="text-sm font-medium text-foreground">61.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs text-muted-foreground">Wind Speed</span>
                </div>
                <span className="text-sm font-medium text-foreground">12.4 km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Rainfall (24h)</span>
                </div>
                <span className="text-sm font-medium text-foreground">0.0 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">Solar Radiation</span>
                </div>
                <span className="text-sm font-medium text-foreground">812 W/m²</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-muted-foreground">UV Index</span>
                </div>
                <span className="text-sm font-medium text-amber-400">5 Moderate</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Farm Activity</h3>
              <span className="text-xs text-muted-foreground">Live Feed</span>
            </div>
            <div className="mt-3 space-y-2">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <activity.icon className="mt-0.5 h-3 w-3 text-primary" />
                  <div className="flex-1">
                    <p className="text-foreground">{activity.event}</p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Live Sensor Readings */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Live Sensor Readings</h3>
              <p className="text-xs text-muted-foreground">Real-time Data Stream</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View All Sensors</Button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {sensorReadings.map((sensor, i) => (
              <div key={i} className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2">
                  <sensor.icon className={`h-4 w-4 ${sensor.color}`} />
                  <span className="text-xs text-muted-foreground">{sensor.label}</span>
                </div>
                <p className="mt-2 text-lg font-bold text-foreground">{sensor.value}</p>
                <p className="text-xs text-primary">{sensor.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weather Forecast</h3>
              <p className="text-xs text-muted-foreground">5-Day Outlook</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View Details</Button>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {weatherForecast.map((day, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 text-center ${
                  i === 0 ? "bg-primary/10 border border-primary/30" : "bg-secondary"
                }`}
              >
                <p className="text-xs font-medium text-foreground">{day.day}</p>
                <day.icon
                  className={`mx-auto my-2 h-8 w-8 ${
                    day.condition === "Sunny"
                      ? "text-amber-400"
                      : day.condition === "Light Rain"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <p className="text-sm font-medium text-foreground">{day.temp}</p>
                <p className="text-[10px] text-muted-foreground">{day.condition}</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-blue-400">
                  <Droplets className="h-2.5 w-2.5" />
                  {day.rain}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
              View All Alerts
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">High Priority</p>
          <div className="mt-3 space-y-2">
            {activeAlerts.map((alert, i) => (
              <div
                key={i}
                className={`rounded-lg p-2.5 ${
                  alert.severity === "critical" ? "bg-red-500/10" : "bg-amber-500/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className={`mt-0.5 h-3.5 w-3.5 ${
                      alert.severity === "critical" ? "text-red-400" : "text-amber-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        alert.severity === "critical" ? "text-red-400" : "text-amber-400"
                      }`}
                    >
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Farm Status */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">Farm Status</h3>
          <p className="text-xs text-muted-foreground">6-Day Outlook</p>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a1e" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${farmStatus.active.percent * 2.51} 251.3`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray={`${farmStatus.warning.percent * 2.51} 251.3`}
                  strokeDashoffset={`${-farmStatus.active.percent * 2.51}`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${farmStatus.critical.percent * 2.51} 251.3`}
                  strokeDashoffset={`${-(farmStatus.active.percent + farmStatus.warning.percent) * 2.51}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{farmStatus.total}</span>
                <span className="text-[10px] text-muted-foreground">Total Farms</span>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Active</span>
              </div>
              <span className="text-foreground">{farmStatus.active.count} ({farmStatus.active.percent}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">Warning</span>
              </div>
              <span className="text-foreground">{farmStatus.warning.count} ({farmStatus.warning.percent}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Critical</span>
              </div>
              <span className="text-foreground">{farmStatus.critical.count} ({farmStatus.critical.percent}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-gray-500" />
                <span className="text-muted-foreground">Offline</span>
              </div>
              <span className="text-foreground">{farmStatus.offline.count} ({farmStatus.offline.percent}%)</span>
            </div>
          </div>
        </div>

        {/* Irrigation Management */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Irrigation Management</h3>
            <p className="text-xs text-muted-foreground">System Overview</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a1e" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray={`${irrigationData.efficiency * 2.51} 251.3`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{irrigationData.efficiency}%</span>
                  <span className="text-[10px] text-primary">Efficient</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-secondary p-2 text-center">
                <p className="text-xs text-muted-foreground">Total Systems</p>
                <p className="text-lg font-bold text-foreground">{irrigationData.totalSystems}</p>
              </div>
              <div className="rounded bg-secondary p-2 text-center">
                <p className="text-xs text-muted-foreground">Active Now</p>
                <p className="text-lg font-bold text-foreground">{irrigationData.activeNow}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-secondary p-2 text-center">
                <p className="text-xs text-muted-foreground">Scheduled</p>
                <p className="text-lg font-bold text-foreground">{irrigationData.scheduled}</p>
              </div>
              <div className="rounded bg-red-500/10 p-2 text-center">
                <p className="text-xs text-muted-foreground">Offline</p>
                <p className="text-lg font-bold text-red-400">{irrigationData.offline}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Water Usage (Today)</p>
              <p className="text-lg font-bold text-foreground">{irrigationData.waterUsage}</p>
              <p className="text-xs text-primary">{irrigationData.waterChange} vs yesterday</p>
            </div>
            <div className="aspect-[2/1] rounded bg-secondary p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { time: "6AM", value: 20 },
                  { time: "9AM", value: 45 },
                  { time: "12PM", value: 80 },
                  { time: "3PM", value: 60 },
                  { time: "6PM", value: 30 },
                ]}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Field Performance */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Field Performance</h3>
              <p className="text-xs text-muted-foreground">This Season</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View Report</Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-3">
              {fieldPerformance.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.metric}</span>
                    <span className="text-foreground">{item.value}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-secondary p-4">
              <span className="text-xs text-muted-foreground">Overall Score</span>
              <span className="text-4xl font-bold text-foreground">86.4%</span>
              <span className="text-sm font-medium text-primary">Excellent</span>
            </div>
          </div>
        </div>

        {/* View All Sensors Button */}
        <div className="col-span-2 flex flex-col gap-4">
          <Button variant="outline" className="h-full w-full flex-col gap-2 text-sm">
            <Eye className="h-6 w-6 text-primary" />
            <span>View All Sensors</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
