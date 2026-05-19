"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { FloatingPanel } from "@/components/dashboard/floating-panel"
import {
  Leaf,
  Zap,
  Sun,
  Droplets,
  Recycle,
  TreePine,
  Factory,
  TrendingUp,
} from "lucide-react"
import {
  BarChart,
  Bar,
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
  AreaChart,
  Area,
} from "recharts"

interface EnergyRecord {
  EnergyID: string
  FarmID: string
  Date: string
  SolarPowerStatus: string
  BatteryLevelPct: string
  RenewableEnergyUsagePct: string
  CarbonReductionKg: string
  OffGridOperationStatus: string
  EnergyConsumptionKwh: string
  RobotChargingStatus: string
  DroneChargingStatus: string
}

const energyMix = [
  { name: "Solar", value: 45, color: "#fbbf24" },
  { name: "Wind", value: 15, color: "#3b82f6" },
  { name: "Biomass", value: 8, color: "#10b981" },
  { name: "Grid Power", value: 32, color: "#6b7280" },
]

const sustainabilityGoals = [
  { name: "Carbon Neutral", desc: "Reduce carbon footprint by 50%", progress: 72, target: "Dec 2025" },
  { name: "100% Renewable Energy", desc: "Achieve 100% renewable energy usage", progress: 68, target: "Dec 2026" },
  { name: "Water Conservation", desc: "Reduce water usage by 40%", progress: 32, target: "Dec 2026" },
  { name: "Zero Waste", desc: "Achieve zero waste to landfill", progress: 65, target: "Dec 2025" },
  { name: "Biodiversity Protection", desc: "Enhance biodiversity by 30%", progress: 38, target: "Dec 2026" },
]

const sustainabilityInitiatives = [
  { name: "Solar Energy Installation", desc: "Rooftop solar panels for clean energy", status: "Active", impact: "CO₂ Reduced" },
  { name: "Drip Irrigation System", desc: "Water efficient irrigation technology", status: "Active", impact: "Water Saved" },
  { name: "Organic Farming", desc: "Chemical-free farming practices", status: "Active", impact: "Soil Health" },
  { name: "Waste Composting", desc: "Convert organic waste to compost", status: "Active", impact: "Waste Recycled" },
  { name: "Tree Plantation Drive", desc: "Increase green cover and biodiversity", status: "Active", impact: "CO₂ Sequestered" },
]

export default function SustainabilityPage() {
  const [energyData, setEnergyData] = useState<EnergyRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/energy")
      .then(r => r.json())
      .then((data: EnergyRecord[]) => {
        setEnergyData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Compute aggregated KPIs
  const totalKwh = energyData.reduce((s, r) => s + parseFloat(r.EnergyConsumptionKwh || "0"), 0)
  const totalCarbonReduction = energyData.reduce((s, r) => s + parseFloat(r.CarbonReductionKg || "0"), 0)
  const avgRenewable = energyData.length
    ? (energyData.reduce((s, r) => s + parseFloat(r.RenewableEnergyUsagePct || "0"), 0) / energyData.length).toFixed(1)
    : null
  const avgBattery = energyData.length
    ? (energyData.reduce((s, r) => s + parseFloat(r.BatteryLevelPct || "0"), 0) / energyData.length).toFixed(1)
    : null

  // Energy trend by date
  const energyTrend = (() => {
    const map: Record<string, { kwh: number; carbon: number; count: number }> = {}
    energyData.forEach(r => {
      const d = r.Date?.slice(0, 10) ?? "unknown"
      if (!map[d]) map[d] = { kwh: 0, carbon: 0, count: 0 }
      map[d].kwh += parseFloat(r.EnergyConsumptionKwh || "0")
      map[d].carbon += parseFloat(r.CarbonReductionKg || "0")
      map[d].count++
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, v]) => ({ date: date.slice(5), kwh: parseFloat(v.kwh.toFixed(1)), co2: parseFloat((v.carbon / 1000).toFixed(2)) }))
  })()

  // Renewable by farm
  const renewableByFarm = energyData.reduce((acc: Record<string, number[]>, r) => {
    if (!acc[r.FarmID]) acc[r.FarmID] = []
    acc[r.FarmID].push(parseFloat(r.RenewableEnergyUsagePct || "0"))
    return acc
  }, {})
  const farmRenewable = Object.entries(renewableByFarm).slice(0, 5).map(([farm, vals]) => ({
    name: farm,
    pct: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)),
  }))

  const impactSummary = [
    { icon: Factory, label: "CO₂ Reduced", value: loading ? "—" : `${(totalCarbonReduction / 1000).toFixed(1)}`, unit: "tCO₂e" },
    { icon: Droplets, label: "Water Saved", value: "45.6K", unit: "Liters" },
    { icon: Zap, label: "Energy Used", value: loading ? "—" : `${(totalKwh).toFixed(0)}`, unit: "kWh" },
    { icon: Recycle, label: "Waste Recycled", value: "2.8", unit: "tons" },
    { icon: TreePine, label: "Trees Equivalent", value: "184", unit: "trees" },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Header
          pageNumber="09"
          title="Sustainability & Energy"
          subtitle="Sustainable farming for a greener future"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard
            title="Carbon Reduction"
            value={loading ? "—" : `${(totalCarbonReduction / 1000).toFixed(2)}`}
            valueSuffix=" tCO₂e"
            trend="up"
            icon={<Factory className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Energy Consumption"
            value={loading ? "—" : `${totalKwh.toFixed(0)}`}
            valueSuffix=" kWh"
            trend="up"
            icon={<Zap className="h-5 w-5 text-yellow-400" />}
            iconBg="bg-yellow-500/20"
          />
          <StatCard
            title="Renewable Energy"
            value={loading ? "—" : avgRenewable ? `${avgRenewable}%` : "—"}
            subtitle="of total consumption"
            trend="up"
            icon={<Sun className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Battery Level"
            value={loading ? "—" : avgBattery ? `${avgBattery}%` : "—"}
            subtitle="Avg across farms"
            trend="up"
            icon={<Zap className="h-5 w-5 text-blue-400" />}
            iconBg="bg-blue-500/20"
          />
          <StatCard
            title="Waste Recycled"
            value="1.25"
            valueSuffix=" tons"
            trend="up"
            icon={<Recycle className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Trees Equivalent"
            value="184"
            valueSuffix=" trees"
            trend="up"
            icon={<TreePine className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Environmental Impact Overview */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Environmental Impact Overview</h3>
              <p className="text-gray-400 text-sm">Real-time environmental metrics</p>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={farmRenewable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}
                    formatter={(v: number) => [`${v}%`, "Renewable"]}
                  />
                  <Bar dataKey="pct" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { icon: Leaf, label: "Air Quality", value: "Good", sub: "AQI 42", color: "text-emerald-400" },
                { icon: Leaf, label: "Soil Health", value: "Excellent", sub: "87/100", color: "text-emerald-400" },
                { icon: TreePine, label: "Biodiversity", value: "High", sub: "76/100", color: "text-yellow-400" },
                { icon: Droplets, label: "Water Quality", value: "Good", sub: "72/100", color: "text-emerald-400" },
              ].map((m, i) => (
                <div key={i} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                    <span className="text-gray-400 text-xs">{m.label}</span>
                  </div>
                  <div className={`${m.color} text-sm font-semibold`}>{m.value}</div>
                  <div className="text-gray-500 text-xs">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Consumption Trend */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Energy Consumption Trend</h3>
                <p className="text-gray-400 text-sm">Daily energy usage from CSV data</p>
              </div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kwh"
                    stroke="#10b981"
                    fill="rgba(16, 185, 129, 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-2 bg-emerald-500/10 rounded-lg flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total from data</span>
              <div>
                <span className="text-emerald-400 font-semibold">
                  {loading ? "—" : `${totalKwh.toFixed(1)} kWh`}
                </span>
                <span className="text-emerald-400 text-sm ml-2">avg {avgRenewable}% renewable</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <div className="text-gray-400">Farms Monitored</div>
                <div className="text-white font-semibold">{loading ? "—" : new Set(energyData.map(r => r.FarmID)).size}</div>
              </div>
              <div>
                <div className="text-gray-400">Avg Renewable</div>
                <div className="text-white font-semibold">{loading ? "—" : avgRenewable ? `${avgRenewable}%` : "—"}</div>
              </div>
              <div>
                <div className="text-gray-400">Solar Active</div>
                <div className="text-white font-semibold">
                  {loading ? "—" : energyData.filter(r => r.SolarPowerStatus === "Active").length}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Off-Grid</div>
                <div className="text-emerald-400 font-semibold">
                  {loading ? "—" : energyData.filter(r => r.OffGridOperationStatus === "Stable").length}
                </div>
              </div>
            </div>
          </div>

          {/* Renewable Energy Mix */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Renewable Energy Mix</h3>
              <p className="text-gray-400 text-sm">Energy sources distribution</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={energyMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {energyMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {loading ? "—" : avgRenewable ? `${avgRenewable}%` : "—"}
                  </span>
                  <span className="text-xs text-gray-400">Renewable</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {energyMix.map(source => (
                <div key={source.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-gray-300">{source.name}</span>
                  </div>
                  <span className="text-gray-400">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Carbon Reduction Trend */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Carbon Reduction Trend</h3>
              <p className="text-gray-400 text-sm">Daily CO₂ reduction from data</p>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}
                    formatter={(v: number) => [`${v} tCO₂e`, "Carbon Reduction"]}
                  />
                  <Bar dataKey="co2" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-2 bg-emerald-500/10 rounded-lg flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Carbon Reduced</span>
              <span className="text-emerald-400 font-semibold">
                {loading ? "—" : `${(totalCarbonReduction / 1000).toFixed(2)} tCO₂e`}
              </span>
            </div>
          </div>

          {/* Water Usage Chart */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Battery Storage Levels</h3>
              <p className="text-gray-400 text-sm">Farm battery status from energy data</p>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData.slice(0, 10).map((r, i) => ({
                  farm: r.FarmID,
                  battery: parseFloat(r.BatteryLevelPct) || 0,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="farm" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}
                    formatter={(v: number) => [`${v}%`, "Battery"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="battery"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-2 bg-blue-500/10 rounded-lg flex items-center justify-between">
              <span className="text-gray-400 text-sm">Avg Battery Level</span>
              <span className="text-blue-400 font-semibold">
                {loading ? "—" : avgBattery ? `${avgBattery}%` : "—"}
              </span>
            </div>
          </div>

          {/* Sustainability Initiatives */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Sustainability Initiatives</h3>
                <p className="text-gray-400 text-sm">Active sustainability programs</p>
              </div>
            </div>
            <div className="space-y-2">
              {sustainabilityInitiatives.map((init, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="text-white text-sm">{init.name}</div>
                      <div className="text-gray-500 text-xs">{init.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-xs">{init.status}</span>
                    <div className="text-gray-400 text-xs">{init.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sustainability Goals Progress */}
        <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-white font-semibold">Sustainability Goals Progress</h3>
            <p className="text-gray-400 text-sm">Progress towards sustainability goals</p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {sustainabilityGoals.map((goal, i) => (
              <div key={i} className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {i === 0 ? <Factory className="h-4 w-4 text-emerald-400" /> :
                   i === 1 ? <Sun className="h-4 w-4 text-yellow-400" /> :
                   i === 2 ? <Droplets className="h-4 w-4 text-blue-400" /> :
                   i === 3 ? <Recycle className="h-4 w-4 text-purple-400" /> :
                   <TreePine className="h-4 w-4 text-emerald-400" />}
                  <span className="text-emerald-400 text-xs font-semibold">{goal.name}</span>
                </div>
                <p className="text-gray-500 text-xs mb-2">{goal.desc}</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? "bg-emerald-500" :
                        i === 1 ? "bg-yellow-500" :
                        i === 2 ? "bg-blue-500" :
                        i === 3 ? "bg-purple-500" :
                        "bg-emerald-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-semibold">{goal.progress}%</span>
                </div>
                <div className="text-gray-500 text-xs">Target: {goal.target}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact Summary */}
        <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-white font-semibold">Environmental Impact Summary</h3>
            <p className="text-gray-400 text-sm">Overall impact of our sustainability efforts</p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {impactSummary.map((item, i) => (
              <div key={i} className="text-center p-4 bg-gray-800/30 rounded-lg">
                <item.icon className={`h-8 w-8 mx-auto mb-2 ${
                  i === 0 ? "text-emerald-400" :
                  i === 1 ? "text-blue-400" :
                  i === 2 ? "text-yellow-400" :
                  i === 3 ? "text-purple-400" :
                  "text-emerald-400"
                }`} />
                <div className="text-gray-400 text-xs mb-1">{item.label}</div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-gray-500 text-xs">{item.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Score Sidebar */}
      <FloatingPanel
        title="Sustainability Score"
        className="fixed left-4 bottom-24 w-44 hidden xl:block"
      >
        <div className="relative w-24 h-24 mx-auto my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
            <circle
              cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="none"
              strokeDasharray={`${93 * 2.51} ${100 * 2.51}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-emerald-400">
              {loading ? "—" : avgRenewable ? `${avgRenewable}%` : "—"}
            </span>
            <span className="text-[10px] text-emerald-400">Renewable</span>
          </div>
        </div>
        <div className="text-center text-emerald-400 text-xs my-2 flex items-center justify-center">
          <TrendingUp className="h-3.5 w-3.5 mr-1" />
          Energy Efficient
        </div>
        <button className="w-full py-1.5 text-emerald-400 text-[10px] border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-colors">
          View Sustainability Report
        </button>
      </FloatingPanel>
    </DashboardLayout>
  )
}
