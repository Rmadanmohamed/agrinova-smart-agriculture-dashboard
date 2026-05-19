"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FloatingPanel } from "@/components/dashboard/floating-panel"
import {
  Bot,
  Plane,
  Activity,
  Battery,
  CheckCircle,
  MapPin,
  Clock,
  TrendingUp,
  Zap,
  Settings,
  PlayCircle,
  Home,
  AlertOctagon,
  Wrench,
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

const robotStatusData = [
  { name: "Active", value: 28, percent: "66.7%", color: "#22c55e" },
  { name: "Working", value: 8, percent: "19.0%", color: "#3b82f6" },
  { name: "Charging", value: 3, percent: "7.1%", color: "#f59e0b" },
  { name: "Maintenance", value: 2, percent: "4.8%", color: "#a855f7" },
  { name: "Offline", value: 1, percent: "2.4%", color: "#ef4444" },
]

const droneStatusData = [
  { name: "Active", value: 8, color: "#22c55e" },
  { name: "In Flight", value: 4, color: "#3b82f6" },
  { name: "Returning", value: 2, color: "#f59e0b" },
  { name: "Completed", value: 4, color: "#a855f7" },
  { name: "Offline", value: 2, color: "#ef4444" },
]

const robotMissions = [
  { id: "RBT-01", type: "Seeding", zone: "Zone A", progress: 85, status: "Working", start: "10:30 AM", eta: "11:45 AM" },
  { id: "RBT-02", type: "Weeding", zone: "Zone B", progress: 72, status: "Working", start: "09:15 AM", eta: "11:00 AM" },
  { id: "RBT-03", type: "Fertilizing", zone: "Zone C", progress: 100, status: "Completed", start: "07:45 AM", eta: "09:20 AM" },
  { id: "RBT-04", type: "Spraying", zone: "Zone D", progress: 63, status: "Working", start: "10:00 AM", eta: "11:30 AM" },
  { id: "RBT-05", type: "Harvesting", zone: "Zone E", progress: 40, status: "Working", start: "09:50 AM", eta: "12:10 PM" },
]

const droneMissions = [
  { id: "DRN-01", type: "Crop Scanning", area: "Field Alpha", coverage: "28.5 ha", status: "Completed", start: "08:00 AM", flight: "28 min" },
  { id: "DRN-02", type: "Thermal Mapping", area: "Field Beta", coverage: "32.1 ha", status: "In Flight", start: "10:20 AM", flight: "18 min" },
  { id: "DRN-03", type: "NDVI Survey", area: "Field Gamma", coverage: "25.0 ha", status: "Completed", start: "07:30 AM", flight: "24 min" },
  { id: "DRN-04", type: "Plant Counting", area: "Field Delta", coverage: "30.2 ha", status: "Returning", start: "09:40 AM", flight: "31 min" },
  { id: "DRN-05", type: "Boundary Scan", area: "Field Epsilon", coverage: "29.3 ha", status: "In Flight", start: "10:10 AM", flight: "16 min" },
]

const performanceData = [
  { date: "May 6", tasks: 85, efficiency: 92, coverage: 120 },
  { date: "May 7", tasks: 95, efficiency: 88, coverage: 135 },
  { date: "May 8", tasks: 78, efficiency: 95, coverage: 110 },
  { date: "May 9", tasks: 110, efficiency: 90, coverage: 145 },
  { date: "May 10", tasks: 125, efficiency: 85, coverage: 160 },
  { date: "May 11", tasks: 140, efficiency: 91, coverage: 175 },
  { date: "May 12", tasks: 155, efficiency: 94, coverage: 185 },
]

const maintenanceSchedule = [
  { id: "RBT-06", task: "Battery Check", date: "May 13, 2025", daysUntil: "2 days" },
  { id: "RBT-11", task: "Motor Service", date: "May 14, 2025", daysUntil: "3 days" },
  { id: "DRN-02", task: "Propeller Check", date: "May 13, 2025", daysUntil: "2 days" },
  { id: "DRN-07", task: "Camera Calibration", date: "May 15, 2025", daysUntil: "4 days" },
]

const energyConsumption = {
  total: 245.6,
  robots: { value: 156.8, percent: 63.8 },
  drones: { value: 58.3, percent: 23.8 },
  charging: { value: 30.5, percent: 12.4 },
}

const aerialAnalytics = [
  { metric: "NDVI Index", value: "0.78", status: "Healthy", color: "text-primary" },
  { metric: "Thermal Stress", value: "Low", status: "Stable", color: "text-blue-400" },
  { metric: "Plant Count", value: "98.4K", status: "Detected", color: "text-amber-400" },
  { metric: "Weed Density", value: "Low", status: "Optimal", color: "text-primary" },
]

const quickActions = [
  { name: "Deploy Robot", icon: Bot },
  { name: "Launch Drone", icon: Plane },
  { name: "Return All", icon: Home },
  { name: "Emergency Stop", icon: AlertOctagon },
]

export default function RoboticsPage() {
  return (
    <DashboardLayout
      pageNumber="04"
      title="Robotics & Drone Operations"
      subtitle="Autonomous field operations and aerial intelligence"
    >
      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Robots Fleet Overview */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Robots Fleet Overview</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Active Robots</p>
              <p className="text-2xl font-bold text-foreground">42<span className="text-sm text-muted-foreground">/48</span></p>
              <p className="text-xs text-primary">Online</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <div className="mx-auto h-10 w-10 relative">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#1e3a1e" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${78 * 0.88} 88`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">78%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Fleet Health</p>
              <p className="text-xs text-amber-400">Average</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Field Coverage</p>
              <p className="text-2xl font-bold text-foreground">68.4<span className="text-sm">ha</span></p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold text-foreground">126</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Efficiency Rate</p>
              <p className="text-2xl font-bold text-foreground">94.2%</p>
              <p className="text-xs text-primary">Optimal</p>
            </div>
          </div>
        </div>

        {/* Drones Fleet Overview */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-foreground">Drones Fleet Overview</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Active Drones</p>
              <p className="text-2xl font-bold text-foreground">18<span className="text-sm text-muted-foreground">/20</span></p>
              <p className="text-xs text-amber-400">90%</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <div className="mx-auto h-10 w-10 relative">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#1e3a1e" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${68 * 0.88} 88`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">68%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Battery Avg.</p>
              <p className="text-xs text-amber-400">Average</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Flights Today</p>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-primary">Completed</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="text-2xl font-bold text-foreground">245<span className="text-sm">ha</span></p>
              <p className="text-xs text-muted-foreground">Scanned</p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Avg. Flight Time</p>
              <p className="text-2xl font-bold text-foreground">32<span className="text-sm">min</span></p>
              <p className="text-xs text-muted-foreground">Per Flight</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Robot Deployment Map */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Robot Deployment Map</h3>
              <p className="text-xs text-muted-foreground">Live Field View</p>
            </div>
          </div>
          <div className="mt-4 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative">
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Minus className="h-3 w-3" />
              </Button>
            </div>
            <svg viewBox="0 0 200 200" className="h-full w-full">
              {/* Grid */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              
              {/* Field zones */}
              <rect x="20" y="20" width="70" height="60" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="110" y="20" width="70" height="70" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="20" y="100" width="80" height="80" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="120" y="110" width="60" height="70" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="0.5" rx="2" />
              
              {/* Robot icons */}
              {[
                { x: 55, y: 50, status: "active" },
                { x: 145, y: 55, status: "working" },
                { x: 60, y: 140, status: "active" },
                { x: 150, y: 145, status: "charging" },
                { x: 40, y: 165, status: "working" },
              ].map((robot, i) => (
                <g key={i}>
                  <circle
                    cx={robot.x}
                    cy={robot.y}
                    r="8"
                    fill={robot.status === "active" ? "#22c55e" : robot.status === "working" ? "#3b82f6" : "#f59e0b"}
                    fillOpacity="0.8"
                  />
                  <circle cx={robot.x} cy={robot.y} r="4" fill="#0d1410" />
                  <circle cx={robot.x} cy={robot.y} r="2" fill="#22c55e" />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {[
              { label: "Active", color: "bg-primary" },
              { label: "Working", color: "bg-blue-500" },
              { label: "Charging", color: "bg-amber-500" },
              { label: "Maintenance", color: "bg-purple-500" },
              { label: "Offline", color: "bg-red-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Robot Status Distribution */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Robot Status Distribution</h3>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-28 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={robotStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {robotStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">42</span>
                <span className="text-[10px] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="mt-3 w-full space-y-1.5">
              {robotStatusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drone Flight Map */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Drone Flight Map</h3>
              <p className="text-xs text-muted-foreground">Live Aerial Operations</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-card to-secondary relative">
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Minus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary/80">
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <svg viewBox="0 0 300 180" className="h-full w-full">
              {/* Grid */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 15} x2="300" y2={i * 15} stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 15} y1="0" x2={i * 15} y2="180" stroke="#1e3a1e" strokeWidth="0.5" />
              ))}
              
              {/* Field areas */}
              <rect x="20" y="15" width="80" height="60" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="120" y="15" width="90" height="70" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="230" y="15" width="50" height="55" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="0.5" rx="2" />
              <rect x="20" y="95" width="100" height="70" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              <rect x="140" y="100" width="80" height="65" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="0.5" rx="2" />
              <rect x="240" y="90" width="40" height="75" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="0.5" rx="2" />
              
              {/* Flight paths */}
              <path d="M60 45 L165 50 L255 42" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
              <path d="M70 130 L180 132 L260 128" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
              
              {/* Drones */}
              {[
                { x: 165, y: 50, status: "inFlight" },
                { x: 255, y: 42, status: "active" },
                { x: 70, y: 130, status: "completed" },
                { x: 180, y: 132, status: "returning" },
                { x: 260, y: 128, status: "offline" },
              ].map((drone, i) => (
                <g key={i}>
                  <circle
                    cx={drone.x}
                    cy={drone.y}
                    r="6"
                    fill={
                      drone.status === "active" ? "#22c55e" :
                      drone.status === "inFlight" ? "#3b82f6" :
                      drone.status === "returning" ? "#f59e0b" :
                      drone.status === "completed" ? "#a855f7" : "#ef4444"
                    }
                  />
                  <path
                    d={`M${drone.x - 8} ${drone.y} L${drone.x} ${drone.y - 3} L${drone.x + 8} ${drone.y} L${drone.x} ${drone.y + 3} Z`}
                    fill="none"
                    stroke={
                      drone.status === "active" ? "#22c55e" :
                      drone.status === "inFlight" ? "#3b82f6" :
                      drone.status === "returning" ? "#f59e0b" :
                      drone.status === "completed" ? "#a855f7" : "#ef4444"
                    }
                    strokeWidth="1"
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {[
              { label: "Active", color: "bg-primary" },
              { label: "In Flight", color: "bg-blue-500" },
              { label: "Returning", color: "bg-amber-500" },
              { label: "Completed", color: "bg-purple-500" },
              { label: "Offline", color: "bg-red-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aerial Analytics */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Aerial Analytics</h3>
              <p className="text-xs text-muted-foreground">{"Today's Overview"}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {aerialAnalytics.map((item, i) => (
              <div key={i} className="rounded-lg bg-secondary p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.metric}</p>
                    <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    <p className={`text-xs ${item.color}`}>{item.status}</p>
                  </div>
                  <div className="h-12 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { v: 20 }, { v: 35 }, { v: 28 }, { v: 45 }, { v: 38 }, { v: 52 }
                      ]}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={item.color.includes("primary") ? "#22c55e" : item.color.includes("blue") ? "#3b82f6" : "#f59e0b"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row - Mission Tables */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Recent Robot Missions */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Robot Missions</h3>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Robot ID</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Mission Type</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Field / Zone</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Progress</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Start Time</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">ETA</th>
                </tr>
              </thead>
              <tbody>
                {robotMissions.map((mission, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{mission.id}</td>
                    <td className="py-2 text-foreground">{mission.type}</td>
                    <td className="py-2 text-foreground">{mission.zone}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${mission.progress === 100 ? "bg-primary" : "bg-amber-500"}`}
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                        <span className="text-foreground">{mission.progress}%</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        mission.status === "Completed" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground">{mission.start}</td>
                    <td className="py-2 text-muted-foreground">{mission.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Drone Missions */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Drone Missions</h3>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Drone ID</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Mission Type</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Area / Field</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Coverage</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Start Time</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Flight Time</th>
                </tr>
              </thead>
              <tbody>
                {droneMissions.map((mission, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{mission.id}</td>
                    <td className="py-2 text-foreground">{mission.type}</td>
                    <td className="py-2 text-foreground">{mission.area}</td>
                    <td className="py-2 text-foreground">{mission.coverage}</td>
                    <td className="py-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        mission.status === "Completed" ? "bg-primary/20 text-primary" :
                        mission.status === "In Flight" ? "bg-blue-500/20 text-blue-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground">{mission.start}</td>
                    <td className="py-2 text-muted-foreground">{mission.flight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Health Summary */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">Fleet Health Summary</h3>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a1e" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${92 * 2.51} 251.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">92%</span>
                <span className="text-[10px] text-primary">Excellent</span>
              </div>
            </div>
            <div className="mt-3 w-full space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">All Systems Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">No Critical Alerts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Optimal Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Robots Performance Analytics */}
        <div className="col-span-5 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Robots Performance Analytics</h3>
              <p className="text-xs text-muted-foreground">7-Day Performance Trend</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Tasks Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Efficiency (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Field Coverage (ha)</span>
            </div>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
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
                <Line type="monotone" dataKey="tasks" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Maintenance Schedule</h3>
            <p className="text-xs text-muted-foreground">Upcoming Maintenance</p>
          </div>
          <div className="mt-4 space-y-2">
            {maintenanceSchedule.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-2">
                <div>
                  <p className="text-xs font-medium text-foreground">{item.id}</p>
                  <p className="text-[10px] text-muted-foreground">{item.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{item.date}</p>
                  <p className="text-xs text-amber-400">{item.daysUntil}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View Full Schedule
          </Button>
        </div>

        {/* Energy Consumption */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Energy Consumption</h3>
            <p className="text-xs text-muted-foreground">{"Today's Overview"}</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-24 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Robots", value: energyConsumption.robots.percent, color: "#22c55e" },
                      { name: "Drones", value: energyConsumption.drones.percent, color: "#3b82f6" },
                      { name: "Charging", value: energyConsumption.charging.percent, color: "#f59e0b" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-foreground">{energyConsumption.total}</span>
                <span className="text-[10px] text-muted-foreground">kWh</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Robots</span>
                </div>
                <span className="text-foreground">{energyConsumption.robots.value} kWh</span>
                <span className="text-muted-foreground">{energyConsumption.robots.percent}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Drones</span>
                </div>
                <span className="text-foreground">{energyConsumption.drones.value} kWh</span>
                <span className="text-muted-foreground">{energyConsumption.drones.percent}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Charging Stations</span>
                </div>
                <span className="text-foreground">{energyConsumption.charging.value} kWh</span>
                <span className="text-muted-foreground">{energyConsumption.charging.percent}%</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View Energy Report
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  action.name === "Emergency Stop"
                    ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                    : "border-border bg-secondary hover:border-primary hover:bg-primary/10"
                }`}
              >
                <action.icon
                  className={`h-6 w-6 ${
                    action.name === "Emergency Stop" ? "text-red-400" : "text-primary"
                  }`}
                />
                <span className="text-[10px] text-foreground">{action.name}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
            View All Operations
          </Button>
        </div>
      </div>

      {/* Robotics Center Card */}
      <FloatingPanel
        title="Robotics Center"
        className="fixed bottom-6 left-56 hidden xl:block"
      >
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">All Systems Operational</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex flex-col items-center">
            <Bot className="h-8 w-8 text-primary" />
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-primary" />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Plane className="h-8 w-8 text-cyan-400" />
            <div className="mt-1 flex gap-1">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-cyan-400" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground text-[10px]">Total Robots</p>
            <p className="text-lg font-bold text-foreground">42</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px]">Total Drones</p>
            <p className="text-lg font-bold text-foreground">18</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
          View All Assets
        </Button>
      </FloatingPanel>
    </DashboardLayout>
  )
}
