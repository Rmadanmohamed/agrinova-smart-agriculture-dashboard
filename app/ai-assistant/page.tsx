"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  MessageSquare,
  CheckCircle2,
  Target,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bot,
  User,
  Search,
  Cloud,
  Sun,
  CloudRain,
  Droplets,
  Wind,
  TrendingUp,
  AlertTriangle,
  Leaf,
  FileText,
  ArrowRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface AIRec {
  RecommendationID: string
  FarmID: string
  CropID: string
  RecommendationDate: string
  AssistantModule: string
  InteractionType: string
  FarmerQuestion: string
  RecommendationText: string
  AssistantAvailability: string
  Status: string
}

interface WeatherRec {
  FarmID: string
  Date: string
  TemperatureC: string
  HumidityPct: string
  WindSpeedKph: string
  RainfallMm: string
}

interface PriceRec {
  CropName: string
  Date: string
  CurrentMarketPriceEGP: string
  PredictedPrice60DaysEGP: string
}

const ALLOWED_CROPS = ["Tomato","Tomatoes","Potato","Bell Pepper","Cucumber","Strawberry","Mango","Apple","Grapes"]

const chatMessages = [
  {
    type: "user",
    time: "10:42 AM",
    message: "What should I do for the tomatoes today?",
  },
  {
    type: "ai",
    time: "10:42 AM",
    message: "Based on current conditions, I recommend the following for your tomatoes:",
    list: [
      "Soil moisture is optimal — no irrigation needed",
      "Temperature is ideal for growth (24.2°C)",
      "Consider applying organic fertilizer in 2 days",
      "Monitor for early blight — check leaves regularly",
    ],
    question: "Would you like me to schedule these tasks for you?",
  },
  {
    type: "user",
    time: "10:43 AM",
    message: "Should I be worried about the weather tomorrow?",
  },
  {
    type: "ai",
    time: "10:43 AM",
    message: "Tomorrow expects light rainfall with elevated humidity. No major concerns for your crops. I'll adjust irrigation schedule automatically.",
  },
]

const knowledgeBase = [
  { title: "Tomato Growing Guide", desc: "Best practices for tomato cultivation", views: "892 views" },
  { title: "Disease Prevention Tips", desc: "Common diseases and prevention methods", views: "654 views" },
  { title: "Soil Management", desc: "Improve soil health and fertility", views: "1.2K views" },
  { title: "Irrigation Best Practices", desc: "Efficient water management techniques", views: "743 views" },
]

const quickActions = [
  { icon: Leaf, label: "Analyze Crop", color: "text-emerald-400" },
  { icon: Cloud, label: "Weather Alert", color: "text-blue-400" },
  { icon: TrendingUp, label: "Price Check", color: "text-purple-400" },
  { icon: AlertTriangle, label: "Disease ID", color: "text-red-400" },
  { icon: Droplets, label: "Irrigation Calc", color: "text-cyan-400" },
  { icon: FileText, label: "Report Gen", color: "text-orange-400" },
]

export default function AIAssistantPage() {
  const [aiRecs, setAiRecs] = useState<AIRec[]>([])
  const [weather, setWeather] = useState<WeatherRec[]>([])
  const [prices, setPrices] = useState<PriceRec[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/ai-recommendations").then(r => r.json()),
      fetch("/api/weather-readings").then(r => r.json()),
      fetch("/api/price-predictions").then(r => r.json()),
    ]).then(([recs, wx, px]: [AIRec[], WeatherRec[], PriceRec[]]) => {
      setAiRecs(recs)
      setWeather(wx)
      setPrices(px.filter(p => ALLOWED_CROPS.some(c => p.CropName?.toLowerCase().includes(c.toLowerCase()))))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Latest weather reading (first entry = most recent in CSV)
  const latestWeather = weather[0] ?? null

  // AI Availability rate from CSV
  const availableCount = aiRecs.filter(r => r.AssistantAvailability === "Available").length
  const availabilityPct = aiRecs.length > 0 ? Math.round((availableCount / aiRecs.length) * 100) : 0

  // Market snapshot: tomatoes price trend
  const tomatoPrices = prices
    .filter(p => p.CropName?.toLowerCase().includes("tomato"))
    .slice(-6)
    .map(p => ({ date: p.Date?.slice(5) ?? "", price: parseFloat(p.CurrentMarketPriceEGP) || 0 }))

  const latestTomato = tomatoPrices[tomatoPrices.length - 1]

  // AI Recommendations from CSV
  const recentRecs = aiRecs.slice(0, 4)

  // AI insights derived from data
  const avgTemp = weather.length
    ? (weather.reduce((s, r) => s + parseFloat(r.TemperatureC || "0"), 0) / weather.length).toFixed(1)
    : "24.2"
  const avgHumidity = weather.length
    ? (weather.reduce((s, r) => s + parseFloat(r.HumidityPct || "0"), 0) / weather.length).toFixed(0)
    : "65"

  const aiInsights = [
    { title: "Smart Insights Score", value: "92/100", desc: "AgriNova AI performance index", icon: Leaf, color: "text-emerald-400" },
    { title: "Avg Temperature", value: `${avgTemp}°C`, desc: "Across all monitored farms", icon: Sun, color: "text-yellow-400" },
    { title: "Avg Humidity", value: `${avgHumidity}%`, desc: "Current farm conditions", icon: Droplets, color: "text-blue-400" },
    { title: "Risk Assessment", value: "Low Risk", desc: "Overall farm risk level", icon: AlertTriangle, color: "text-emerald-400" },
  ]

  // Commodity prices for snapshot
  const commoditySnapshot = prices
    .reduce((acc: Record<string, PriceRec>, p) => {
      if (!acc[p.CropName]) acc[p.CropName] = p
      return acc
    }, {})

  const commodityList = Object.values(commoditySnapshot).slice(0, 4)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Header
          pageNumber="08"
          title="AI Assistant"
          subtitle="Your intelligent agriculture companion — AgriNova AI"
        />

        {/* AI Greeting Banner */}
        <div className="flex items-center gap-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a1a0f]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Hello! I&apos;m AgriNova AI</h2>
            <p className="text-gray-400">Smart Insights — Vision Intelligence — AI Engine ready to optimize your farm</p>
          </div>
          <div className="ml-auto grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-emerald-500/10 rounded-lg p-2">
              <div className="text-emerald-400 font-semibold">{loading ? "—" : aiRecs.length}</div>
              <div className="text-gray-400">Recommendations</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <div className="text-blue-400 font-semibold">{loading ? "—" : weather.length}</div>
              <div className="text-gray-400">Weather Readings</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-2">
              <div className="text-purple-400 font-semibold">{loading ? "—" : prices.length}</div>
              <div className="text-gray-400">Price Records</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Insights Generated"
            value={loading ? "—" : aiRecs.length.toLocaleString()}
            trend="up"
            icon={<MessageSquare className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="Smart Response Score"
            value={loading ? "—" : `${availableCount}/${aiRecs.length}`}
            trend="up"
            icon={<CheckCircle2 className="h-5 w-5 text-blue-400" />}
            iconBg="bg-blue-500/20"
          />
          <StatCard
            title="AI Availability"
            value={loading ? "—" : `${availabilityPct}%`}
            subtitle="Operational"
            subtitleColor="text-emerald-400"
            icon={<Target className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title="User Satisfaction"
            value="4.9"
            valueSuffix="/5"
            icon={<Star className="h-5 w-5 text-yellow-400" />}
            iconBg="bg-yellow-500/20"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-4">
          {/* AI Chat */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">AI Chat</h3>
                <p className="text-gray-400 text-sm">AgriNova AI — Smart Insights Engine</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-80 mb-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.type === "user" ? "justify-end" : ""}`}>
                  {msg.type === "ai" && (
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.type === "user" ? "order-first" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${msg.type === "ai" ? "text-emerald-400" : "text-gray-300"}`}>
                        {msg.type === "ai" ? "AgriNova AI" : "You"}
                      </span>
                      <span className="text-gray-500 text-xs">{msg.time}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-gray-800 text-gray-200"
                        : "bg-emerald-500/10 border border-emerald-500/20"
                    }`}>
                      <p className="text-sm text-gray-200">{msg.message}</p>
                      {"list" in msg && msg.list && (
                        <ul className="mt-2 space-y-1">
                          {(msg.list as string[]).map((item, j) => (
                            <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {"question" in msg && msg.question && (
                        <p className="mt-2 text-sm text-gray-300">{msg.question as string}</p>
                      )}
                    </div>
                    {msg.type === "ai" && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="text-gray-500 hover:text-emerald-400"><ThumbsUp className="h-4 w-4" /></button>
                        <button className="text-gray-500 hover:text-red-400"><ThumbsDown className="h-4 w-4" /></button>
                        <button className="text-gray-500 hover:text-blue-400"><Copy className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                  {msg.type === "user" && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
              <input
                type="text"
                placeholder="Ask AgriNova AI anything..."
                className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-500 outline-none"
              />
              <button className="p-2 bg-emerald-500 rounded-full hover:bg-emerald-600">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Crop recommendations", "Weather impact", "Market price trends", "Irrigation advice"].map(prompt => (
                <button key={prompt} className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full hover:bg-gray-700">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Recommendations from CSV */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Smart Recommendations</h3>
              <p className="text-gray-400 text-sm">AgriNova AI — Real data insights</p>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading recommendations...</p>
              ) : recentRecs.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="p-2 rounded-lg bg-gray-800">
                    <Bot className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{rec.InteractionType}</h4>
                    <p className="text-gray-400 text-xs">{rec.RecommendationText}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-gray-500 text-xs">{rec.RecommendationDate?.slice(0, 10)}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        rec.AssistantAvailability === "Available"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>{rec.AssistantAvailability}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-emerald-400 text-sm border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10">
              View All Recommendations
            </button>
          </div>

          {/* Weather Overview */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Weather Overview</h3>
                <p className="text-gray-400 text-sm">
                  {loading ? "Loading..." : `Farm ${latestWeather?.FarmID ?? "—"}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-4">
                <Sun className="h-16 w-16 text-yellow-400" />
                <div>
                  <div className="text-4xl font-bold text-white">
                    {loading ? "—" : latestWeather?.TemperatureC ?? "24.2"}
                    <span className="text-xl">°C</span>
                  </div>
                  <div className="text-gray-400">Current Conditions</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Humidity</span>
                  <span className="text-white ml-auto">{loading ? "—" : `${latestWeather?.HumidityPct ?? "65"}%`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Wind Speed</span>
                  <span className="text-white ml-auto">{loading ? "—" : `${latestWeather?.WindSpeedKph ?? "18"} km/h`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Rainfall</span>
                  <span className="text-white ml-auto">{loading ? "—" : `${latestWeather?.RainfallMm ?? "0"} mm`}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-gray-400 text-xs mb-2">Avg Temperature Trend (Last Readings)</h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weather.slice(-7).map(w => ({
                    date: w.Date?.slice(5) ?? "",
                    temp: parseFloat(w.TemperatureC) || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={9} />
                    <YAxis stroke="#6b7280" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: "#0a1a0f", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Knowledge Base */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Knowledge Base</h3>
              <p className="text-gray-400 text-sm">AgriNova AI-curated knowledge</p>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm placeholder-gray-500 outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              {knowledgeBase.map((item, i) => (
                <div key={i} className="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-white text-sm font-medium">{item.title}</h4>
                  </div>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                  <span className="text-gray-500 text-xs">{item.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">AI Insights</h3>
              <p className="text-gray-400 text-sm">Smart Insights from real data</p>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{insight.title}</span>
                      <span className={`text-sm font-semibold ${insight.color}`}>{insight.value}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Snapshot */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Market Snapshot</h3>
            </div>
            <div className="mb-3">
              <div className="text-gray-400 text-sm">Tomatoes Price (EGP/kg)</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {loading ? "—" : latestTomato ? latestTomato.price.toFixed(2) : "N/A"}
                </span>
                <span className="text-emerald-400 text-sm">AI Market Insight</span>
              </div>
            </div>
            <div className="h-20 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tomatoPrices}>
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
                  <XAxis dataKey="date" hide />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                <p className="col-span-2 text-gray-500 text-xs">Loading prices...</p>
              ) : commodityList.map(item => (
                <div key={item.CropName} className="text-center">
                  <div className="text-gray-400 text-xs">{item.CropName}</div>
                  <div className="text-white text-sm font-semibold">
                    {parseFloat(item.CurrentMarketPriceEGP).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50"
                >
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <span className="text-gray-300 text-xs text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
