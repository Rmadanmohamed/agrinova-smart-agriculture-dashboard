"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  Home,
  MapPin,
  Wifi,
  Bot,
  Plane,
  Activity,
  AlertTriangle,
  Lightbulb,
  Cloud,
  Plus,
  Settings,
  FileText,
  Brain,
  ChevronRight,
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
} from "recharts"

const cropHealthData = [
  { date: "May 6", score: 65 },
  { date: "May 7", score: 68 },
  { date: "May 8", score: 62 },
  { date: "May 9", score: 70 },
  { date: "May 10", score: 85 },
  { date: "May 11", score: 82 },
  { date: "May 12", score: 88.4 },
]

const kpiTrendData = [
  { date: "Apr 13", health: 72, moisture: 45, production: 38, revenue: 52 },
  { date: "Apr 16", health: 75, moisture: 48, production: 42, revenue: 55 },
  { date: "Apr 19", health: 68, moisture: 52, production: 45, revenue: 48 },
  { date: "Apr 22", health: 78, moisture: 55, production: 52, revenue: 58 },
  { date: "Apr 25", health: 82, moisture: 58, production: 55, revenue: 62 },
  { date: "Apr 28", health: 75, moisture: 48, production: 48, revenue: 55 },
  { date: "May 1", health: 85, moisture: 62, production: 58, revenue: 68 },
  { date: "May 4", health: 78, moisture: 55, production: 52, revenue: 58 },
  { date: "May 7", health: 88, moisture: 65, production: 62, revenue: 72 },
  { date: "May 10", health: 82, moisture: 58, production: 55, revenue: 65 },
  { date: "May 12", health: 90, moisture: 68, production: 65, revenue: 75 },
]

const topZones = [
  { rank: 1, name: "Zone A", score: 92.1 },
  { rank: 2, name: "Zone B", score: 89.3 },
  { rank: 3, name: "Zone C", score: 87.7 },
  { rank: 4, name: "Zone D", score: 84.2 },
  { rank: 5, name: "Zone E", score: 81.9 },
]

const alertsSummary = {
  total: 32,
  critical: 4,
  highPriority: 11,
  open: 17,
}

const recommendations = [
  { text: "Irrigation recommended for Farm Alpha - Zone 3", priority: "High", icon: "💧" },
  { text: "Fertilizer adjustment suggested for Tomatoes", priority: "Medium", icon: "🌱" },
  { text: "Pest detection in Farm Delta - Block A", priority: "High", icon: "🐛" },
  { text: "Market price for Tomatoes expected to rise 8%", priority: "Medium", icon: "📈" },
]

const insights = [
  { text: "Crop yields are 15% higher compared to last month.", trend: "up" },
  { text: "Tomato production is optimal in Zone A.", trend: "up" },
  { text: "Water usage efficiency improved by 12%.", trend: "up" },
  { text: "Market demand for Potatoes is increasing.", trend: "up" },
]

const quickActions = [
  { name: "Add Farm", icon: Plus },
  { name: "Manage Sensors", icon: Settings },
  { name: "Generate Report", icon: FileText },
  { name: "AI Analysis", icon: Brain },
]

export default function OverviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const currentFarms = data?.totalFarms ?? 128
  const activeSensors = data?.activeSensors ?? 3742
  const activeRobots = data?.activeRobots ?? 42
  const activeDrones = data?.activeDrones ?? 18
  const healthIndex = data?.systemHealthIndex ?? "88.4"

  const currentAlerts = data?.alerts ?? {
    total: 32,
    critical: 4,
    highPriority: 11,
    open: 17,
  }

  return (
    <DashboardLayout
      pageNumber="01"
      title="AgriNova Overview"
      subtitle="Executive Command Center"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        <StatCard
          title="Total Farms"
          value={loading ? "—" : String(currentFarms)}
          change="12.5%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Home}
          iconColor="text-primary"
        />
        <StatCard
          title="Total Area (ha)"
          value="2,846"
          change="8.3%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={MapPin}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Active IoT Sensors"
          value={loading ? "—" : String(activeSensors)}
          change="7.1%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Wifi}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Active Robots"
          value={loading ? "—" : String(activeRobots)}
          change="5.2%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Bot}
          iconColor="text-purple-400"
        />
        <StatCard
          title="Active Drones"
          value={loading ? "—" : String(activeDrones)}
          change="2.7%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Plane}
          iconColor="text-amber-400"
        />
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">System Health Index</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {loading ? "—" : healthIndex}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <p className="mt-1 text-sm font-medium text-primary">Excellent</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* Farm Distribution Map */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Farm Distribution Map</h3>
              <p className="text-xs text-muted-foreground">Live Overview</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="mt-4 aspect-[4/3] rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative overflow-hidden">
            {/* Simulated world map with dots */}
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 400 300" className="h-full w-full">
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Simplified continent shapes */}
                <path
                  d="M50 80 Q80 60 120 70 L140 90 Q160 100 150 120 L130 140 Q100 150 70 130 Z"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <path
                  d="M180 60 Q220 50 260 60 L280 80 Q300 100 290 130 L260 150 Q220 160 190 140 L170 110 Q160 80 180 60 Z"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <path
                  d="M300 80 Q340 70 370 90 L380 120 Q385 150 360 170 L330 180 Q300 175 290 150 L295 110 Z"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </svg>
            </div>
            {/* Activity dots */}
            {[
              { x: 25, y: 30, size: "lg", activity: "high" },
              { x: 35, y: 45, size: "md", activity: "medium" },
              { x: 50, y: 35, size: "lg", activity: "high" },
              { x: 65, y: 50, size: "sm", activity: "low" },
              { x: 75, y: 40, size: "md", activity: "medium" },
              { x: 45, y: 60, size: "lg", activity: "high" },
              { x: 55, y: 70, size: "md", activity: "medium" },
              { x: 80, y: 55, size: "sm", activity: "low" },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              >
                <div
                  className={`rounded-full ${
                    dot.activity === "high"
                      ? "bg-primary"
                      : dot.activity === "medium"
                      ? "bg-amber-400"
                      : "bg-blue-400"
                  } ${
                    dot.size === "lg" ? "h-3 w-3" : dot.size === "md" ? "h-2 w-2" : "h-1.5 w-1.5"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">High Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-muted-foreground">Medium Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-muted-foreground">Low Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              <span className="text-muted-foreground">Inactive</span>
            </div>
          </div>
        </div>

        {/* Crop Health Score */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Crop Health Score (7 Days)</h3>
              <p className="text-xs text-muted-foreground">Average Trend</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>7 Days</option>
              <option>30 Days</option>
              <option>90 Days</option>
            </select>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cropHealthData}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 100]}
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
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#healthGradient)"
                  dot={{ fill: "#22c55e", strokeWidth: 0, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-xs">
            <span className="rounded bg-primary/20 px-2 py-0.5 font-medium text-primary">88.4</span>
          </div>
        </div>

        {/* Top Performing Zones */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Performing Zones</h3>
              <p className="text-xs text-muted-foreground">By Health Score</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {topZones.map((zone) => (
              <div key={zone.rank} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                  {zone.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{zone.name}</span>
                    <span className="font-medium text-primary">{zone.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${zone.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full text-xs">
            View All Zones
          </Button>
        </div>

        {/* System Health Gauge */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">System Health Gauge</h3>
            <p className="text-xs text-muted-foreground">Live Status</p>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-32 w-32">
              {/* Gauge background */}
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e3a1e"
                  strokeWidth="8"
                  strokeDasharray="188.5 251.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${88.4 * 1.885} 251.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">88.4</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Excellent</span>
            </div>
            <div className="mt-2 flex w-full justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Alerts Summary */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Alerts Summary</h3>
            <p className="text-xs text-muted-foreground">Real-time Overview</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground">
                {loading ? "—" : currentAlerts.total}
              </p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3 text-center">
              <p className="text-xs text-red-400">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-400">
                {loading ? "—" : currentAlerts.critical}
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/10 p-3 text-center">
              <p className="text-xs text-amber-400">High Priority</p>
              <p className="text-2xl font-bold text-amber-400">
                {loading ? "—" : currentAlerts.highPriority}
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3 text-center">
              <p className="text-xs text-blue-400">Open Alerts</p>
              <p className="text-2xl font-bold text-blue-400">
                {loading ? "—" : currentAlerts.open}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full text-xs">
            View All Alerts
          </Button>
        </div>

        {/* AI Recommendation Feed */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Recommendation Feed</h3>
              <p className="text-xs text-muted-foreground">Smart Suggestions</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-secondary p-2.5"
              >
                <Lightbulb className={`mt-0.5 h-4 w-4 ${rec.priority === "High" ? "text-red-400" : "text-amber-400"}`} />
                <div className="flex-1">
                  <p className="text-xs text-foreground">{rec.text}</p>
                  <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    rec.priority === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View All Recommendations
          </Button>
        </div>

        {/* Key Insights */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
              <p className="text-xs text-muted-foreground">AI Generated Insights</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-2.5"
              >
                <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                  <Activity className="h-2.5 w-2.5 text-primary" />
                </div>
                <p className="text-xs text-foreground">{insight.text}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View All Insights
          </Button>
        </div>

        {/* Weather Overview */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weather Overview</h3>
              <p className="text-xs text-muted-foreground">Current Conditions</p>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
              View Full Forecast
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Cloud className="h-12 w-12 text-amber-400" />
              <div>
                <p className="text-3xl font-bold text-foreground">24°C</p>
                <p className="text-xs text-muted-foreground">Partly Cloudy</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-semibold text-foreground">61%</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="text-sm font-semibold text-foreground">12 km/h</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Rainfall</p>
              <p className="text-sm font-semibold text-foreground">0 mm</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            Detailed Forecast
          </Button>
        </div>
      </div>

      {/* Third Row - KPI Trend & Quick Actions */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Executive KPI Trend */}
        <div className="col-span-9 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Executive KPI Trend</h3>
              <p className="text-xs text-muted-foreground">Multi-metric Performance (30 Days)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Crop Health Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-muted-foreground">Soil Moisture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  <span className="text-muted-foreground">Production Volume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-muted-foreground">Revenue</span>
                </div>
              </div>
              <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
                <option>30 Days</option>
                <option>90 Days</option>
              </select>
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 100]}
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
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Frequently Used</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary p-4 transition-colors hover:border-primary hover:bg-primary/10"
              >
                <action.icon className="h-6 w-6 text-primary" />
                <span className="text-xs text-foreground">{action.name}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full text-xs">
            All Actions
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
