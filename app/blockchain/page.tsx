"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  Shield,
  Lock,
  CheckCircle2,
  FileText,
  Activity,
  Globe,
  Cpu,
  Clock,
  Zap,
  Link2,
  Database,
  Eye,
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

interface TxRecord {
  TransactionID: string
  BlockIndex: string
  FarmID: string
  TransactionDate: string
  RecordType: string
  BlockchainNetworkStatus: string
  VerifiedFarmRecords: string
  SecureTransactions: string
  SmartContractStatus: string
  DataIntegrityStatus: string
  HashPreview: string
  PreviousHashPreview: string
  ValidationState: string
  Status: string
}

const PIE_COLORS: Record<string, string> = {
  "Robot Mission": "#10b981",
  "Crop Scan": "#3b82f6",
  "Energy Record": "#8b5cf6",
  "Soil Data": "#f59e0b",
  "Drone Mission": "#ef4444",
  "Weather Data": "#06b6d4",
  "Sensor Update": "#ec4899",
}

const securityItems = [
  { name: "Data Integrity", status: "Secure" },
  { name: "Block Validation", status: "Secure" },
  { name: "Transaction Encryption", status: "Secure" },
  { name: "Access Control", status: "Secure" },
  { name: "Consensus Mechanism", status: "Secure" },
  { name: "Network Security", status: "Secure" },
]

export default function BlockchainSecurityPage() {
  const [txData, setTxData] = useState<TxRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blockchain")
      .then(r => r.json())
      .then((data: TxRecord[]) => {
        setTxData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Block creation trend: group by date
  const blockTrend = (() => {
    const map: Record<string, number> = {}
    txData.forEach(r => {
      const d = r.TransactionDate?.slice(0, 10) ?? "unknown"
      map[d] = (map[d] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, blocks]) => ({ date: date.slice(5), blocks }))
  })()

  // Transaction type distribution
  const typeDist = (() => {
    const map: Record<string, number> = {}
    txData.forEach(r => {
      const t = r.RecordType || "Other"
      map[t] = (map[t] || 0) + 1
    })
    const total = txData.length || 1
    return Object.entries(map).slice(0, 6).map(([name, count]) => ({
      name,
      value: parseFloat(((count / total) * 100).toFixed(1)),
      color: PIE_COLORS[name] ?? "#6b7280",
    }))
  })()

  // Recent transactions
  const recentTx = txData.slice(0, 6)

  // KPIs
  const totalBlocks = txData.length
  const verifiedCount = txData.filter(r => r.DataIntegrityStatus === "Verified").length
  const verifiedRate = totalBlocks > 0 ? ((verifiedCount / totalBlocks) * 100).toFixed(1) : "0"
  const activeContracts = txData.filter(r => r.SmartContractStatus === "Active").length
  const onlineNodes = txData.filter(r => r.BlockchainNetworkStatus === "Operational").length

  const smartContracts = [
    { name: "Supply Chain", count: Math.ceil(activeContracts * 0.33), status: "Active" },
    { name: "Crop Insurance", count: Math.ceil(activeContracts * 0.25), status: "Active" },
    { name: "Payment Escrow", count: Math.ceil(activeContracts * 0.17), status: "Active" },
    { name: "Quality Verification", count: Math.ceil(activeContracts * 0.17), status: "Active" },
    { name: "Carbon Credits", count: Math.ceil(activeContracts * 0.08), status: "Active" },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Header
          pageNumber="07"
          title="Blockchain Security"
          subtitle="Immutable records, secure transactions, trusted agriculture"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard
            title="Total Blocks"
            value={loading ? "—" : totalBlocks.toLocaleString()}
            trend="up"
            icon={<Database className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Total Transactions"
            value={loading ? "—" : totalBlocks.toLocaleString()}
            trend="up"
            icon={<Link2 className="h-5 w-5 text-blue-400" />}
            iconBg="bg-blue-500/20"
          />
          <StatCard
            title="Verified Records"
            value={loading ? "—" : `${verifiedRate}%`}
            subtitle="Integrity Rate"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Smart Contracts"
            value={loading ? "—" : activeContracts.toString()}
            subtitle="Active"
            icon={<FileText className="h-5 w-5 text-purple-400" />}
            iconBg="bg-purple-500/20"
          />
          <StatCard
            title="Security Score"
            value="99.2"
            valueSuffix="/100"
            subtitle="Excellent"
            subtitleColor="text-emerald-400"
            icon={<Shield className="h-5 w-5 text-cyan-400" />}
            iconBg="bg-cyan-500/20"
          />
          <StatCard
            title="Network Health"
            value={loading ? "—" : totalBlocks > 0 ? "100%" : "0%"}
            subtitle="Operational"
            subtitleColor="text-emerald-400"
            icon={<Activity className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
            valueColor="text-emerald-400"
          />
        </div>

        {/* Network Overview and Block Creation */}
        <div className="grid grid-cols-12 gap-4">
          {/* Blockchain Network Overview */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Blockchain Network Overview</h3>
              <p className="text-gray-400 text-sm">Live Network Visualization</p>
            </div>
            <div className="relative h-64 bg-gradient-to-b from-[#061a0a] to-[#0a1a0f] rounded-lg overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <ellipse cx="100" cy="80" rx="40" ry="30" fill="none" stroke="#10b981" strokeWidth="0.5" />
                  <ellipse cx="200" cy="70" rx="50" ry="35" fill="none" stroke="#10b981" strokeWidth="0.5" />
                  <ellipse cx="300" cy="90" rx="45" ry="40" fill="none" stroke="#10b981" strokeWidth="0.5" />
                </svg>
              </div>
              <svg className="absolute inset-0 w-full h-full">
                <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                <line x1="50%" y1="50%" x2="80%" y2="40%" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                <line x1="30%" y1="60%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              </svg>
              <div className="absolute top-[28%] left-[18%] w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="absolute top-[48%] left-[48%] w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute top-[38%] left-[78%] w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="absolute top-[58%] left-[28%] w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute top-[68%] left-[68%] w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-gray-400">Active Nodes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-gray-400">Syncing</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-400 text-xs">Network Nodes</span>
                </div>
                <div className="text-2xl font-bold text-white">{loading ? "—" : onlineNodes}</div>
                <div className="text-emerald-400 text-xs">Online</div>
              </div>
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-400 text-xs">Block Time</span>
                </div>
                <div className="text-2xl font-bold text-white">2.3</div>
                <div className="text-gray-400 text-xs">sec Average</div>
              </div>
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-400 text-xs">Network Latency</span>
                </div>
                <div className="text-2xl font-bold text-white">28</div>
                <div className="text-emerald-400 text-xs">ms Optimal</div>
              </div>
            </div>
          </div>

          {/* Block Creation Trend */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Block Creation Trend</h3>
              <p className="text-gray-400 text-sm">Last 7 Days</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={blockTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a1a0f",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="blocks"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-gray-400">Total Blocks</div>
                <div className="text-white font-semibold">{loading ? "—" : totalBlocks.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Verified</div>
                <div className="text-white font-semibold">{loading ? "—" : verifiedCount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Integrity</div>
                <div className="text-emerald-400 font-semibold">{loading ? "—" : `${verifiedRate}%`}</div>
              </div>
            </div>
          </div>

          {/* Transaction Types */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Transaction Types</h3>
              <p className="text-gray-400 text-sm">Distribution (All Data)</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {typeDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{loading ? "—" : totalBlocks}</span>
                  <span className="text-xs text-gray-400">Total</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {typeDist.map(type => (
                <div key={type.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-gray-300 text-xs">{type.name}</span>
                  </div>
                  <span className="text-gray-400">{type.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Recent Transactions */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Recent Blockchain Transactions</h3>
              <p className="text-gray-400 text-sm">Latest Verified Transactions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left py-2">TX Hash</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Farm</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-4 text-center text-gray-500">Loading...</td></tr>
                  ) : recentTx.map((tx, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-2 text-blue-400 font-mono text-xs">{`0x${tx.HashPreview?.slice(0, 8)}...`}</td>
                      <td className="py-2 text-gray-300 text-xs">{tx.RecordType}</td>
                      <td className="py-2 text-gray-400 text-xs">{tx.FarmID}</td>
                      <td className="py-2 text-gray-400 text-xs">{tx.TransactionDate?.slice(0, 10)}</td>
                      <td className="py-2">
                        <span className={`flex items-center gap-1 text-xs ${
                          tx.ValidationState === "Verified" ? "text-emerald-400" : "text-yellow-400"
                        }`}>
                          <CheckCircle2 className="h-3 w-3" />
                          {tx.ValidationState}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 text-gray-400 text-sm border border-gray-700 rounded-lg hover:bg-gray-800">
              View All Transactions
            </button>
          </div>

          {/* Smart Contracts Overview */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Smart Contracts Overview</h3>
              <p className="text-gray-400 text-sm">Active & Deployed</p>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#1f2937" strokeWidth="12" fill="none" />
                  <circle
                    cx="72" cy="72" r="60" stroke="#10b981" strokeWidth="12" fill="none"
                    strokeDasharray={`${100 * 3.77} ${100 * 3.77}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{loading ? "—" : activeContracts}</span>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {smartContracts.map(contract => (
                <div key={contract.name} className="flex items-center justify-between py-2 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300 text-sm">{contract.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{contract.count}</span>
                    <span className="text-emerald-400 text-xs">{contract.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Integrity + Audit */}
          <div className="col-span-3 space-y-4">
            <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-sm">Security & Integrity</h3>
                <p className="text-gray-400 text-xs">Real-time Monitoring</p>
              </div>
              <div className="space-y-2">
                {securityItems.map(item => (
                  <div key={item.name} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-emerald-400" />
                      <span className="text-gray-300 text-xs">{item.name}</span>
                    </div>
                    <span className="text-emerald-400 text-xs">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-sm">Audit & Compliance</h3>
                <p className="text-gray-400 text-xs">Last Audit: Recent</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#1f2937" strokeWidth="6" fill="none" />
                    <circle
                      cx="40" cy="40" r="35" stroke="#10b981" strokeWidth="6" fill="none"
                      strokeDasharray={`${100 * 2.2} ${100 * 2.2}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-emerald-400">100%</span>
                    <span className="text-[10px] text-gray-400">Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Shield, color: "text-red-400", bg: "bg-red-500/20", title: "Immutable Records", desc: "All agricultural records are permanently stored and cannot be altered." },
            { icon: Eye, color: "text-emerald-400", bg: "bg-emerald-500/20", title: "Transparency", desc: "Complete transparency in the agricultural supply chain." },
            { icon: Lock, color: "text-orange-400", bg: "bg-orange-500/20", title: "Trust & Security", desc: "End-to-end security ensures data trust and reliability." },
            { icon: Globe, color: "text-purple-400", bg: "bg-purple-500/20", title: "Decentralized Network", desc: "Distributed network ensures high availability and resilience." },
          ].map((f, i) => (
            <div key={i} className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className={`p-3 ${f.bg} rounded-full`}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <div>
                <h4 className={`${f.color} font-semibold text-sm`}>{f.title}</h4>
                <p className="text-gray-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
