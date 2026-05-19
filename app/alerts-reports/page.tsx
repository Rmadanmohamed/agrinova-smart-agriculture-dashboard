"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  FileText,
  CheckCircle2,
  Download,
  Eye,
  ChevronRight,
  ChevronLeft,
  Droplets,
  Bug,
  CloudRain,
  Wrench,
  Leaf,
  Zap,
  Clock,
} from "lucide-react"
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

interface AlertRecord {
  AlertID: string
  FarmID: string
  AlertDate: string
  AlertType: string
  PriorityLevel: string
  AlertMessage: string
  RecommendedAction: string
  ResolutionStatus: string
  Status: string
}

interface ReportRecord {
  ReportID: string
  ReportName: string
  ReportCategory: string
  GeneratedDate: string
  ExportFormat: string
  Owner: string
  RefreshStatus: string
  DecisionSupportSummary: string
  Status: string
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#3b82f6",
}

const TYPE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "Market Price": Droplets,
  "Energy": Zap,
  "Critical Soil": Leaf,
  "Pest": Bug,
  "Weather": CloudRain,
  "Equipment": Wrench,
}

function getCategoryIcon(type: string) {
  const Icon = TYPE_ICON_MAP[type] ?? AlertTriangle
  return Icon
}

export default function AlertsReportsPage() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [notifPage, setNotifPage] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch("/api/alerts").then(r => r.json()),
      fetch("/api/reports").then(r => r.json()),
    ]).then(([al, rp]: [AlertRecord[], ReportRecord[]]) => {
      setAlerts(al)
      setReports(rp)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // KPI counts
  const totalAlerts = alerts.length
  const criticalAlerts = alerts.filter(a => a.PriorityLevel === "Critical").length
  const warnings = alerts.filter(a => a.PriorityLevel === "High" || a.PriorityLevel === "Medium").length
  const autoResolved = alerts.filter(a => a.ResolutionStatus === "Resolved").length

  // Severity distribution for pie
  const severityDist = (() => {
    const map: Record<string, number> = {}
    alerts.forEach(a => {
      map[a.PriorityLevel] = (map[a.PriorityLevel] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      percentage: totalAlerts > 0 ? `${((value / totalAlerts) * 100).toFixed(0)}%` : "0%",
      color: SEVERITY_COLORS[name] ?? "#6b7280",
    }))
  })()

  // Trend by date
  const alertTrend = (() => {
    const map: Record<string, { critical: number; high: number; medium: number; low: number }> = {}
    alerts.forEach(a => {
      const d = a.AlertDate?.slice(0, 10) ?? "unknown"
      if (!map[d]) map[d] = { critical: 0, high: 0, medium: 0, low: 0 }
      if (a.PriorityLevel === "Critical") map[d].critical++
      else if (a.PriorityLevel === "High") map[d].high++
      else if (a.PriorityLevel === "Medium") map[d].medium++
      else map[d].low++
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, v]) => ({ date: date.slice(5), ...v }))
  })()

  // Category distribution
  const categoryDist = (() => {
    const map: Record<string, number> = {}
    alerts.forEach(a => {
      map[a.AlertType] = (map[a.AlertType] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalAlerts > 0 ? Math.round((count / totalAlerts) * 100) : 0,
        color: "#ef4444",
      }))
  })()

  // Smart notifications (recent alerts as notification cards)
  const notifPerPage = 4
  const notifTotal = Math.ceil(alerts.slice(0, 12).length / notifPerPage)
  const currentNotifs = alerts.slice(notifPage * notifPerPage, (notifPage + 1) * notifPerPage)

  const prevNotif = useCallback(() => setNotifPage(p => Math.max(0, p - 1)), [])
  const nextNotif = useCallback(() => setNotifPage(p => Math.min(notifTotal - 1, p + 1)), [notifTotal])

  const notifColors: Record<string, string> = {
    Critical: "bg-red-500/20 text-red-400",
    High: "bg-orange-500/20 text-orange-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Low: "bg-blue-500/20 text-blue-400",
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Header
          pageNumber="10"
          title="Alerts & Reports"
          subtitle="Real-time alerts and intelligent reporting for proactive farm management"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard
            title="Total Active Alerts"
            value={loading ? "—" : totalAlerts.toString()}
            trend="up"
            icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
            iconBg="bg-red-500/20"
          />
          <StatCard
            title="Critical Issues"
            value={loading ? "—" : criticalAlerts.toString()}
            subtitle="Requires immediate attention"
            icon={<AlertCircle className="h-5 w-5 text-red-400" />}
            iconBg="bg-red-500/20"
          />
          <StatCard
            title="Warnings"
            value={loading ? "—" : warnings.toString()}
            subtitle="Monitor closely"
            icon={<Bell className="h-5 w-5 text-yellow-400" />}
            iconBg="bg-yellow-500/20"
          />
          <StatCard
            title="Generated Reports"
            value={loading ? "—" : reports.length.toString()}
            trend="up"
            icon={<FileText className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Auto-Resolved"
            value={loading ? "—" : autoResolved.toString()}
            subtitle="AI handled"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Active Alerts Pie */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Active Alerts Overview</h3>
              <p className="text-gray-400 text-sm">Alert distribution by severity</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {severityDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{loading ? "—" : totalAlerts}</span>
                  <span className="text-xs text-gray-400">Total Alerts</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {severityDist.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{item.value}</span>
                    <span className="text-gray-500">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Trend */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Alerts Trend (Last 7 Days)</h3>
            </div>
            <div className="flex gap-4 mb-3 text-xs">
              {Object.entries(SEVERITY_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-gray-400">{name}</span>
                </div>
              ))}
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                  <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} />
                  <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} dot={{ fill: "#eab308", r: 3 }} />
                  <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts by Category */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Alerts by Category</h3>
              <p className="text-gray-400 text-sm">Distribution by alert type</p>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : categoryDist.map(item => {
                const Icon = getCategoryIcon(item.category)
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm">{item.category}</span>
                        <span className="text-white text-sm">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm w-10 text-right">{item.percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Recent Alerts Table */}
          <div className="col-span-6 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Recent Alerts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left py-2">Alert Message</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Severity</th>
                    <th className="text-left py-2">Farm</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-4 text-center text-gray-500">Loading alerts...</td></tr>
                  ) : alerts.slice(0, 6).map((alert, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            alert.PriorityLevel === "Critical" ? "text-red-400" :
                            alert.PriorityLevel === "High" ? "text-orange-400" :
                            alert.PriorityLevel === "Medium" ? "text-yellow-400" : "text-blue-400"
                          }`} />
                          <div>
                            <div className="text-white text-xs">{alert.AlertMessage}</div>
                            <div className="text-gray-500 text-xs">{alert.RecommendedAction}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300 text-xs">{alert.AlertType}</td>
                      <td className="py-3">
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: `${SEVERITY_COLORS[alert.PriorityLevel] ?? "#6b7280"}33` }}
                        >
                          <span style={{ color: SEVERITY_COLORS[alert.PriorityLevel] ?? "#9ca3af" }}>
                            {alert.PriorityLevel}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">{alert.FarmID}</td>
                      <td className="py-3 text-gray-400 text-xs">{alert.AlertDate?.slice(0, 10)}</td>
                      <td className="py-3">
                        <span className={`flex items-center gap-1 text-xs ${
                          alert.ResolutionStatus === "Resolved" ? "text-emerald-400" :
                          alert.ResolutionStatus === "In Progress" ? "text-yellow-400" : "text-red-400"
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {alert.ResolutionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 text-gray-400 text-sm border border-gray-700 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
              View All Alerts <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Recent Reports Table */}
          <div className="col-span-6 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Recent Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left py-2">Report Name</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Generated</th>
                    <th className="text-left py-2">Format</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-4 text-center text-gray-500">Loading reports...</td></tr>
                  ) : reports.map((report, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-emerald-400" />
                          <span className="text-white text-xs">{report.ReportName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">{report.ReportCategory}</td>
                      <td className="py-3 text-gray-400 text-xs">{report.GeneratedDate?.slice(0, 10)}</td>
                      <td className="py-3 text-gray-400 text-xs">{report.ExportFormat}</td>
                      <td className="py-3">
                        <span className={`text-xs ${
                          report.RefreshStatus === "Ready" ? "text-emerald-400" : "text-yellow-400"
                        }`}>
                          {report.RefreshStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-800 rounded">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-800 rounded">
                            <Download className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reports.length > 0 && (
              <div className="mt-2 p-2 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400 text-xs text-center italic">
                  {reports[0]?.DecisionSupportSummary ?? "No summary available"}
                </p>
              </div>
            )}
            <button className="w-full mt-3 py-2 text-gray-400 text-sm border border-gray-700 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
              View All Reports <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Smart Notifications and Quick Actions */}
        <div className="grid grid-cols-12 gap-4">
          {/* Smart Notifications */}
          <div className="col-span-8 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Smart Notifications</h3>
                <p className="text-gray-400 text-sm">Real-time alert notifications from CSV data</p>
              </div>
              <div className="flex gap-2">
                <button onClick={prevNotif} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </button>
                <button onClick={nextNotif} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-800/30 animate-pulse h-24" />
                ))
              ) : currentNotifs.map((alert, i) => {
                const colorClass = notifColors[alert.PriorityLevel] ?? "bg-gray-500/20 text-gray-400"
                const bgClass = colorClass.split(" ")[0]
                const textClass = colorClass.split(" ")[1]
                const Icon = getCategoryIcon(alert.AlertType)
                return (
                  <div key={i} className={`p-4 rounded-xl ${bgClass}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${textClass}`} />
                      <span className={`text-sm font-medium ${textClass}`}>{alert.AlertType}</span>
                    </div>
                    <p className="text-white text-xs mb-2 line-clamp-2">{alert.AlertMessage}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="h-3 w-3" />
                      {alert.AlertDate?.slice(0, 10)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FileText, label: "Generate Report", desc: "Create new report", color: "text-emerald-400" },
                { icon: AlertTriangle, label: "Alert Settings", desc: "Configure alerts", color: "text-blue-400" },
                { icon: Download, label: "Export Data", desc: "Export farm data", color: "text-purple-400" },
                { icon: Bell, label: "Notification Log", desc: "View all notifications", color: "text-orange-400" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50"
                >
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <span className="text-white text-sm font-medium">{action.label}</span>
                  <span className="text-gray-500 text-xs">{action.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
