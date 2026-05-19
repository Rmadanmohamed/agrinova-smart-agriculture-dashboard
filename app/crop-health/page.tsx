"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { FloatingPanel } from "@/components/dashboard/floating-panel"
import {
  Heart,
  Bug,
  MapPin,
  Image,
  AlertTriangle,
  TrendingUp,
  Check,
  X,
  Target,
  ChevronRight,
  Layers,
  Plus,
  Minus,
  Maximize2,
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

const diseaseDistribution = [
  { name: "Tomatoes", value: 32.1, cases: 2, color: "#ef4444" },
  { name: "Potatoes", value: 21.4, cases: 1, color: "#f97316" },
  { name: "Cucumbers", value: 17.9, cases: 1, color: "#22c55e" },
  { name: "Grapes", value: 14.3, cases: 1, color: "#3b82f6" },
  { name: "Peppers", value: 14.3, cases: 1, color: "#a855f7" },
]

const diseaseTrendData = [
  { date: "Apr 13", earlyBlight: 28, powderyMildew: 15, leafSpot: 22, bacterialWilt: 12 },
  { date: "Apr 18", earlyBlight: 32, powderyMildew: 18, leafSpot: 25, bacterialWilt: 15 },
  { date: "Apr 23", earlyBlight: 28, powderyMildew: 22, leafSpot: 20, bacterialWilt: 18 },
  { date: "Apr 28", earlyBlight: 35, powderyMildew: 25, leafSpot: 28, bacterialWilt: 20 },
  { date: "May 3", earlyBlight: 42, powderyMildew: 30, leafSpot: 32, bacterialWilt: 22 },
  { date: "May 8", earlyBlight: 38, powderyMildew: 28, leafSpot: 35, bacterialWilt: 25 },
  { date: "May 12", earlyBlight: 45, powderyMildew: 32, leafSpot: 38, bacterialWilt: 28 },
]

const cropHealthTrendData = [
  { date: "Apr 13", score: 75 },
  { date: "Apr 18", score: 72 },
  { date: "Apr 23", score: 68 },
  { date: "Apr 28", score: 65 },
  { date: "May 3", score: 62 },
  { date: "May 8", score: 58 },
  { date: "May 12", score: 55 },
]

const recentDetections = [
  { disease: "Early Blight", crop: "Tomatoes - Zone A", severity: "High", time: "10:30 AM" },
  { disease: "Powdery Mildew", crop: "Grapes - Zone C", severity: "Medium", time: "09:45 AM" },
  { disease: "Leaf Spot", crop: "Potatoes - Zone B", severity: "Medium", time: "09:20 AM" },
  { disease: "Bacterial Wilt", crop: "Peppers - Zone D", severity: "High", time: "08:50 AM" },
  { disease: "Healthy", crop: "Cucumbers - Zone E", severity: "Low", time: "08:15 AM" },
]

const topAffectedCrops = [
  { name: "Tomatoes", image: "🍅", incidence: "32.1%", trend: "+8.3%", trendType: "up" },
  { name: "Potatoes", image: "🥔", incidence: "21.4%", trend: "+5.6%", trendType: "up" },
  { name: "Cucumbers", image: "🥒", incidence: "17.9%", trend: "-2.1%", trendType: "down" },
  { name: "Grapes", image: "🍇", incidence: "14.3%", trend: "+3.7%", trendType: "up" },
  { name: "Peppers", image: "🌶️", incidence: "14.3%", trend: "+1.9%", trendType: "up" },
]

const recommendedActions = [
  { action: "Apply fungicide for Early Blight in Zone A", priority: "High" },
  { action: "Improve ventilation in greenhouses", priority: "Medium" },
  { action: "Reduce irrigation in Zone B", priority: "Medium" },
  { action: "Monitor Leaf Spot progression", priority: "Low" },
  { action: "Continue current treatment plan", priority: "Low" },
]

const healthScoreByZone = [
  { zone: "Zone A", score: 92, color: "#22c55e" },
  { zone: "Zone B", score: 85, color: "#22c55e" },
  { zone: "Zone C", score: 85, color: "#22c55e" },
  { zone: "Zone D", score: 67, color: "#f59e0b" },
  { zone: "Zone E", score: 91, color: "#22c55e" },
]

const severityLevels = [
  { level: "Critical", color: "#ef4444" },
  { level: "High", color: "#f97316" },
  { level: "Medium", color: "#f59e0b" },
  { level: "Low", color: "#3b82f6" },
  { level: "Healthy", color: "#22c55e" },
]

export default function CropHealthPage() {
  return (
    <DashboardLayout
      pageNumber="03"
      title="Crop Health & Vision Intelligence"
      subtitle="AI-powered crop analysis and disease detection"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Overall Health Score</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">88.4</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">Excellent</p>
            </div>
            <div className="rounded-lg bg-primary/20 p-2.5 text-primary">
              <Heart className="h-5 w-5" />
            </div>
          </div>
        </div>
        <StatCard
          title="Detected Diseases"
          value="7"
          change="16%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Bug}
          iconColor="text-red-400"
        />
        <StatCard
          title="Scanned Area (ha)"
          value="2,846"
          change="12.5%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={MapPin}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Images Analyzed"
          value="24,512"
          change="18.4%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={Image}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="High Risk Areas"
          value="12"
          change="2"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Treatment Success"
          value="92.3%"
          change="5.7%"
          changeType="increase"
          changeLabel="vs last 7 days"
          icon={TrendingUp}
          iconColor="text-primary"
        />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* Disease Distribution */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Disease Distribution</h3>
            <p className="text-xs text-muted-foreground">By Crop</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">7</span>
                <span className="text-[10px] text-muted-foreground">Diseases</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {diseaseDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}% ({item.cases})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disease Severity Map */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Disease Severity Map</h3>
              <p className="text-xs text-muted-foreground">Live Field View</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative">
            {/* Map visualization with heat spots */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 400 250" className="h-full w-full">
                {/* Grid */}
                {Array.from({ length: 17 }).map((_, i) => (
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
                    y2="250"
                    stroke="#1e3a1e"
                    strokeWidth="0.5"
                  />
                ))}
                
                {/* Field plots */}
                <rect x="20" y="20" width="100" height="80" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="0.5" rx="4" />
                <rect x="140" y="20" width="120" height="100" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="0.5" rx="4" />
                <rect x="280" y="20" width="100" height="90" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="0.5" rx="4" />
                <rect x="20" y="120" width="140" height="110" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="0.5" rx="4" />
                <rect x="180" y="140" width="100" height="90" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="0.5" rx="4" />
                <rect x="300" y="130" width="80" height="100" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="0.5" rx="4" />

                {/* Heat spots */}
                <defs>
                  <radialGradient id="hotspot1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="hotspot2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="230" cy="185" r="40" fill="url(#hotspot1)" />
                <circle cx="200" cy="70" r="30" fill="url(#hotspot2)" />
                <circle cx="330" cy="75" r="35" fill="url(#hotspot2)" />
                <circle cx="340" cy="180" r="25" fill="url(#hotspot1)" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-4 text-xs">
              {severityLevels.map((level, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: level.color }} />
                  <span className="text-muted-foreground">{level.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Detections */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Detections</h3>
              <p className="text-xs text-muted-foreground">Latest AI Scans</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {recentDetections.map((detection, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-2.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted/50" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{detection.disease}</p>
                    <p className="text-xs text-muted-foreground">{detection.crop}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      detection.severity === "High"
                        ? "bg-red-500/20 text-red-400"
                        : detection.severity === "Medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {detection.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">{detection.time}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View All Detections
          </Button>
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Disease Trend */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Disease Trend (30 Days)</h3>
              <p className="text-xs text-muted-foreground">Number of Detected Cases</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Early Blight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Powdery Mildew</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Leaf Spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Bacterial Wilt</span>
            </div>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diseaseTrendData}>
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
                  dataKey="earlyBlight"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="#ef4444"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="powderyMildew"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="#f59e0b"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="leafSpot"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="bacterialWilt"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="#22c55e"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Health Trend */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Crop Health Trend</h3>
              <p className="text-xs text-muted-foreground">Average Health Score</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>30 Days</option>
              <option>90 Days</option>
            </select>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cropHealthTrendData}>
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
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Diagnosis Summary */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">AI Diagnosis Summary</h3>
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">True Positives</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">1,248</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-400" />
                <span className="text-xs text-muted-foreground">False Positives</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">32</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">AI Confidence</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">98.7%</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-muted-foreground">Avg. Confidence</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">94.6%</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View Full Report
          </Button>
        </div>
      </div>

      {/* Third Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Top Affected Crops */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top Affected Crops</h3>
            <p className="text-xs text-muted-foreground">By Disease Incidence</p>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-3">
            {topAffectedCrops.map((crop, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg bg-secondary p-3">
                <span className="text-3xl">{crop.image}</span>
                <p className="mt-1 text-xs font-medium text-foreground">{crop.name}</p>
                <p className="text-xs text-muted-foreground">Incidence</p>
                <p className="text-sm font-bold text-foreground">{crop.incidence}</p>
                <p
                  className={`text-xs ${
                    crop.trendType === "up" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {crop.trendType === "up" ? "▲" : "▼"} {crop.trend}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recommended Actions</h3>
            <p className="text-xs text-muted-foreground">AI Suggested Treatments</p>
          </div>
          <div className="mt-4 space-y-2">
            {recommendedActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      action.priority === "High"
                        ? "bg-red-500"
                        : action.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                  />
                  <p className="text-xs text-foreground">{action.action}</p>
                </div>
                <span
                  className={`text-xs ${
                    action.priority === "High"
                      ? "text-red-400"
                      : action.priority === "Medium"
                      ? "text-amber-400"
                      : "text-green-400"
                  }`}
                >
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Score by Zone */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Health Score by Zone</h3>
              <p className="text-xs text-muted-foreground">Current Status</p>
            </div>
            <select className="rounded border border-border bg-secondary px-2 py-1 text-xs text-foreground">
              <option>All Zones</option>
            </select>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthScoreByZone} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="zone"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b8f6b", fontSize: 10 }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    border: "1px solid #1e3a1e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e8f5e8" }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {healthScoreByZone.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vision AI Engine Card */}
      <FloatingPanel
        title="Vision AI Engine"
        className="fixed bottom-6 left-56 hidden xl:block"
      >
        <div className="mt-1 flex items-center gap-3">
          <div className="relative h-16 w-16 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Model Status</p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">Active</span>
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Confidence</span>
            <span className="text-foreground">98.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Images Scanned</span>
            <span className="text-foreground">2.48M</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
          View Model Details
        </Button>
      </FloatingPanel>
    </DashboardLayout>
  )
}
