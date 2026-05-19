"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { FloatingPanel } from "@/components/dashboard/floating-panel"
import {
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  BarChart3,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

const priceTrajectoryData = [
  { date: "Apr 13", actual: 38, predicted: null, upper: null, lower: null },
  { date: "Apr 20", actual: 40, predicted: null, upper: null, lower: null },
  { date: "Apr 27", actual: 42, predicted: null, upper: null, lower: null },
  { date: "May 4", actual: 41, predicted: null, upper: null, lower: null },
  { date: "May 11", actual: 43, predicted: null, upper: null, lower: null },
  { date: "May 18", actual: 42.85, predicted: 42.85, upper: 45, lower: 40 },
  { date: "May 25", actual: null, predicted: 44, upper: 47, lower: 41 },
  { date: "Jun 1", actual: null, predicted: 45, upper: 49, lower: 41 },
  { date: "Jun 8", actual: null, predicted: 45.5, upper: 51, lower: 40 },
  { date: "Jun 15", actual: null, predicted: 45.73, upper: 52.1, lower: 39.36 },
]

const impactFactors = [
  { factor: "Supply & Demand", factorAr: "العرض والطلب", impact: 72, positive: true },
  { factor: "Seasonality", factorAr: "الموسمية", impact: 48, positive: true },
  { factor: "Weather Impact", factorAr: "تأثير الطقس", impact: 35, positive: true },
  { factor: "Production Cost", factorAr: "تكلفة الإنتاج", impact: 25, positive: true },
  { factor: "Export Demand", factorAr: "الطلب على التصدير", impact: 18, positive: true },
  { factor: "Market Sentiment", factorAr: "معنويات السوق", impact: 12, positive: true },
]

const topOpportunities = [
  { commodity: "Tomatoes", commodityAr: "طماطم", change: "+8.9%", profitability: "High", profitabilityAr: "مرتفع" },
  { commodity: "Bell Pepper", commodityAr: "فلفل ألوان", change: "+7.6%", profitability: "High", profitabilityAr: "مرتفع" },
  { commodity: "Strawberry", commodityAr: "فراولة", change: "+12.4%", profitability: "Very High", profitabilityAr: "مرتفع جداً" },
  { commodity: "Grapes", commodityAr: "عنب", change: "+6.3%", profitability: "Medium", profitabilityAr: "متوسط" },
  { commodity: "Cucumber", commodityAr: "خيار", change: "+5.7%", profitability: "Medium", profitabilityAr: "متوسط" },
]

const commodityData = [
  { commodity: "Tomatoes", commodityAr: "طماطم", icon: "🍅", current: 42.85, predicted: 45.73, change: 6.7, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "High", profitabilityAr: "مرتفع", signal: "Buy", signalAr: "شراء" },
  { commodity: "Bell Pepper", commodityAr: "فلفل ألوان", icon: "🫑", current: 68.20, predicted: 73.38, change: 7.6, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "High", profitabilityAr: "مرتفع", signal: "Buy", signalAr: "شراء" },
  { commodity: "Onion", commodityAr: "بصل", icon: "🧅", current: 18.45, predicted: 19.22, change: 4.2, trend: "up", risk: "Medium", riskAr: "متوسط", profitability: "Medium", profitabilityAr: "متوسط", signal: "Hold", signalAr: "احتفاظ" },
  { commodity: "Strawberry", commodityAr: "فراولة", icon: "🍓", current: 95.10, predicted: 106.89, change: 12.4, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "Very High", profitabilityAr: "مرتفع جداً", signal: "Strong Buy", signalAr: "شراء قوي" },
  { commodity: "Potato", commodityAr: "بطاطس", icon: "🥔", current: 16.30, predicted: 16.90, change: 3.7, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "Medium", profitabilityAr: "متوسط", signal: "Hold", signalAr: "احتفاظ" },
  { commodity: "Grapes", commodityAr: "عنب", icon: "🍇", current: 54.70, predicted: 58.15, change: 6.3, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "Medium", profitabilityAr: "متوسط", signal: "Buy", signalAr: "شراء" },
  { commodity: "Cucumber", commodityAr: "خيار", icon: "🥒", current: 22.15, predicted: 23.41, change: 5.7, trend: "up", risk: "Low", riskAr: "منخفض", profitability: "Medium", profitabilityAr: "متوسط", signal: "Buy", signalAr: "شراء" },
]

const heatmapData = [
  { name: "Tomatoes", nameAr: "طماطم", weeks: [2.1, 3.4, 4.2, 5.1, 5.8, 6.3, 6.8, 7.2, 6.7] },
  { name: "Bell Pepper", nameAr: "فلفل ألوان", weeks: [2.8, 3.9, 4.7, 5.6, 6.4, 7.1, 7.6, 8.0, 7.6] },
  { name: "Onion", nameAr: "بصل", weeks: [0.8, 1.2, 1.8, 2.3, 2.7, 3.2, 3.6, 4.0, 4.2] },
  { name: "Strawberry", nameAr: "فراولة", weeks: [4.5, 5.8, 6.9, 7.8, 8.6, 9.4, 10.3, 11.1, 12.4] },
  { name: "Potato", nameAr: "بطاطس", weeks: [0.6, 1.0, 1.4, 1.9, 2.3, 2.8, 3.2, 3.4, 3.7] },
  { name: "Grapes", nameAr: "عنب", weeks: [2.0, 2.9, 3.6, 4.1, 4.8, 5.2, 5.7, 6.1, 6.3] },
  { name: "Cucumber", nameAr: "خيار", weeks: [1.8, 2.5, 3.0, 3.6, 4.1, 4.6, 5.1, 5.4, 5.7] },
]

const marketNews = [
  { text: "Tomato exports to GCC expected to increase by 15% in Q2 2025", textAr: "من المتوقع زيادة صادرات الطماطم إلى دول الخليج بنسبة ١٥٪ في الربع الثاني من ٢٠٢٥", time: "10:30 AM", timeAr: "١٠:٣٠ صباحاً" },
  { text: "Weather patterns indicate optimal growing conditions for bell peppers", textAr: "تشير أنماط الطقس إلى ظروف نمو مثالية للفلفل الألوان", time: "09:45 AM", timeAr: "٠٩:٤٥ صباحاً" },
  { text: "Rising demand for strawberries in European markets", textAr: "ارتفاع الطلب على الفراولة في الأسواق الأوروبية", time: "08:20 AM", timeAr: "٠٨:٢٠ صباحاً" },
]

const localizeNumber = (num: string | number | null | undefined, isArabic: boolean) => {
  if (num === null || num === undefined) return ""
  const str = String(num)
  if (!isArabic) return str
  return str.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d as any])
}

const translateDate = (dateStr: string, isArabic: boolean) => {
  if (!isArabic) return dateStr
  const months: Record<string, string> = {
    Apr: "أبريل",
    May: "مايو",
    Jun: "يونيو",
  }
  let translated = dateStr
  for (const [en, ar] of Object.entries(months)) {
    if (translated.includes(en)) {
      translated = translated.replace(en, ar)
    }
  }
  return localizeNumber(translated, true)
}

const CustomTooltip = ({ active, payload, label, isArabic }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-lg p-2 text-xs shadow-xl" dir={isArabic ? "rtl" : "ltr"}>
        <div className="mb-2 text-gray-400">{translateDate(label, isArabic)}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }}>
              {isArabic 
                ? entry.dataKey === 'actual' ? 'السعر الفعلي' : entry.dataKey === 'predicted' ? 'السعر المتوقع' : entry.dataKey === 'upper' ? 'الحد الأعلى' : 'الحد الأدنى'
                : entry.name}
            </span>
            <span className="font-semibold text-white">
              {localizeNumber(entry.value, isArabic)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function PricePredictionPage() {
  const [isArabic, setIsArabic] = useState(false)

  const t = (en: string, ar: string) => isArabic ? ar : en

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6" dir={isArabic ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Header
              pageNumber={localizeNumber("06", isArabic)}
              title={t("Price Prediction", "توقع الأسعار")}
              subtitle={t("AI-driven market forecasting and price intelligence", "تنبؤ السوق الذكي وتحليل الأسعار")}
            />
          </div>
        </div>

        <div className="flex justify-end -mt-4 mb-2 relative z-40">
          <button
            onClick={() => setIsArabic(!isArabic)}
            className="px-4 py-2 bg-[#0a1a0f] border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {isArabic ? "English" : "العربية"}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard
            title={t("Commodities Tracked", "المنتجات المتعقبة")}
            value={localizeNumber("14", isArabic)}
            change={isArabic ? "مقارنة بآخر ٧ أيام (+٢)" : "+2 vs last 7 days"}
            trend="up"
            icon={<BarChart3 className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title={t("Current Market Price (EGP)", "سعر السوق الحالي (جنيه)")}
            value={localizeNumber("42.85", isArabic)}
            change={isArabic ? "مقارنة بآخر ٧ أيام (+٦.٨٪)" : "+6.8% vs last 7 days"}
            trend="up"
            icon={<DollarSign className="h-5 w-5 text-blue-400" />}
            iconBg="bg-blue-500/20"
          />
          <StatCard
            title={t("Predicted Price (60 Days)", "السعر المتوقع (٦٠ يوم)")}
            value={localizeNumber("45.73", isArabic)}
            change={isArabic ? "مقارنة بالحالي (+٦.٧٪)" : "+6.7% vs current"}
            trend="up"
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            iconBg="bg-purple-500/20"
          />
          <StatCard
            title={t("Expected Change (60 Days)", "التغير المتوقع (٦٠ يوم)")}
            value={isArabic ? "+ ٦.٧٪" : "+ 6.7%"}
            subtitle={t("Bullish Trend", "اتجاه صعودي")}
            subtitleColor="text-emerald-400"
            icon={<ArrowUpRight className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            title={t("Market Risk Score", "درجة مخاطر السوق")}
            value={localizeNumber("28", isArabic)}
            valueSuffix={localizeNumber("/100", isArabic)}
            subtitle={t("Low Risk", "مخاطر منخفضة")}
            subtitleColor="text-emerald-400"
            icon={<Shield className="h-5 w-5 text-cyan-400" />}
            iconBg="bg-cyan-500/20"
          />
          <StatCard
            title={t("Profitability Signal", "إشارة الربحية")}
            value={t("High", "مرتفع")}
            subtitle={t("Strong Opportunity", "فرصة قوية")}
            subtitleColor="text-emerald-400"
            icon={<Target className="h-5 w-5 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
            valueColor="text-emerald-400"
          />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Price Trajectory Chart */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{t("Price Trajectory (Tomatoes)", "مسار السعر (طماطم)")}</h3>
                <p className="text-gray-400 text-sm">{t("Actual vs Predicted Price (EGP/kg)", "السعر الفعلي مقابل المتوقع (جنيه/كجم)")}</p>
              </div>
              <div className="flex gap-2" dir="ltr">
                {[
                  { en: "7D", ar: "٧ أيام" },
                  { en: "30D", ar: "٣٠ يوم" },
                  { en: "60D", ar: "٦٠ يوم" },
                  { en: "90D", ar: "٩٠ يوم" },
                ].map((period, i) => (
                  <button
                    key={period.en}
                    className={`px-3 py-1 rounded text-sm ${i === 2 ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400"
                      }`}
                  >
                    {isArabic ? period.ar : period.en}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-gray-400"></div>
                <span className="text-gray-400">{t("Actual Price", "السعر الفعلي")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-400"></div>
                <span className="text-gray-400">{t("Predicted Price", "السعر المتوقع")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-400"></div>
                <span className="text-gray-400">{t("Confidence Range", "نطاق الثقة")}</span>
              </div>
            </div>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceTrajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(val) => translateDate(val, isArabic)} />
                  <YAxis stroke="#6b7280" fontSize={10} domain={[20, 60]} tickFormatter={(val) => localizeNumber(val, isArabic)} orientation={isArabic ? "right" : "left"} />
                  <Tooltip content={<CustomTooltip isArabic={isArabic} />} />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    name="Upper"
                    stroke="transparent"
                    fill="rgba(168, 85, 247, 0.1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    name="Lower"
                    stroke="transparent"
                    fill="#0a1a0f"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    dot={{ fill: "#9ca3af", r: 3 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#10b981", r: 3 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">{t("Jun 15, 2025", "١٥ يونيو ٢٠٢٥")}</div>
              <div className="text-emerald-400">{t("Predicted: 45.73 EGP", "المتوقع: ٤٥.٧٣ جنيه")}</div>
              <div className="text-xs text-gray-500">{t("Upper: 52.10 EGP | Lower: 39.36 EGP", "الأعلى: ٥٢.١٠ جنيه | الأدنى: ٣٩.٣٦ جنيه")}</div>
            </div>
          </div>

          {/* Impact Factors */}
          <div className="col-span-3 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">{t("Impact Factors", "عوامل التأثير")}</h3>
              <p className="text-gray-400 text-sm">{t("How factors influence predicted prices", "كيف تؤثر العوامل على الأسعار المتوقعة")}</p>
            </div>
            <div className="space-y-4">
              {impactFactors.map((item) => (
                <div key={item.factor}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{isArabic ? item.factorAr : item.factor}</span>
                    <span className="text-emerald-400">+{localizeNumber(item.impact, isArabic)}%</span>
                  </div>
                  <div className={`h-2 bg-gray-800 rounded-full overflow-hidden ${isArabic ? "transform rotate-180" : ""}`}>
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.impact}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>{t("Negative Impact", "تأثير سلبي")}</span>
              <span>{t("Positive Impact", "تأثير إيجابي")}</span>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{t("Top Opportunities", "أفضل الفرص")}</h3>
                <p className="text-gray-400 text-sm">{t("Highest predicted profitability", "أعلى ربحية متوقعة")}</p>
              </div>
              <span className="text-gray-400 text-sm">{t("60 Days", "٦٠ يوم")}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500 pb-2 border-b border-gray-800">
                <span className="w-1/3">{t("Commodity", "المنتج")}</span>
                <span className="w-1/3 text-center">{t("Predicted Change", "التغير المتوقع")}</span>
                <span className={`w-1/3 ${isArabic ? "text-left" : "text-right"}`}>{t("Profitability", "الربحية")}</span>
              </div>
              {topOpportunities.map((item, i) => (
                <div key={item.commodity} className="flex justify-between py-2 items-center">
                  <div className="flex items-center gap-2 w-1/3">
                    <span className="text-lg">
                      {["🍅", "🫑", "🍓", "🍇", "🥒"][i]}
                    </span>
                    <span className="text-gray-300 text-sm">{isArabic ? item.commodityAr : item.commodity}</span>
                  </div>
                  <span className="text-emerald-400 text-sm text-center w-1/3">
                    {isArabic ? `+${localizeNumber(item.change.replace("+", "").replace("%", ""), true)}٪` : item.change}
                  </span>
                  <span className={`text-sm ${isArabic ? "text-left" : "text-right"} w-1/3 ${item.profitability === "Very High" ? "text-emerald-400" :
                      item.profitability === "High" ? "text-emerald-400" : "text-yellow-400"
                    }`}>
                    {isArabic ? item.profitabilityAr : item.profitability}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-emerald-400 text-sm border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10">
              {t("View All Opportunities", "عرض جميع الفرص")}
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Commodity Price Forecast Overview */}
          <div className="col-span-5 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">{t("Commodity Price Forecast Overview", "نظرة عامة على توقعات أسعار المنتجات")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className={`${isArabic ? "text-right" : "text-left"} py-2`}>{t("Commodity", "المنتج")}</th>
                    <th className={`${isArabic ? "text-left" : "text-right"} py-2`}>{t("Current Price", "السعر الحالي")}<br />{t("(EGP/kg)", "(جنيه/كجم)")}</th>
                    <th className={`${isArabic ? "text-left" : "text-right"} py-2`}>{t("Predicted Price", "السعر المتوقع")}<br />{t("(EGP/kg)", "(جنيه/كجم)")}</th>
                    <th className={`${isArabic ? "text-left" : "text-right"} py-2`}>{t("Change (%)", "التغير (%)")}</th>
                    <th className="text-center py-2">{t("Trend", "الاتجاه")}</th>
                    <th className="text-center py-2">{t("Risk Level", "مستوى المخاطر")}</th>
                    <th className="text-center py-2">{t("Profitability", "الربحية")}</th>
                    <th className="text-center py-2">{t("Signal", "الإشارة")}</th>
                  </tr>
                </thead>
                <tbody>
                  {commodityData.map((item) => (
                    <tr key={item.commodity} className="border-b border-gray-800/50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-gray-300">{isArabic ? item.commodityAr : item.commodity}</span>
                        </div>
                      </td>
                      <td className={`${isArabic ? "text-left" : "text-right"} text-gray-300`}>{localizeNumber(item.current.toFixed(2), isArabic)}</td>
                      <td className={`${isArabic ? "text-left" : "text-right"} text-emerald-400`}>{localizeNumber(item.predicted.toFixed(2), isArabic)}</td>
                      <td className={`${isArabic ? "text-left" : "text-right"} text-emerald-400`}>+{localizeNumber(item.change, isArabic)}٪</td>
                      <td className="text-center">
                        <span className="text-gray-400">〰️</span>
                      </td>
                      <td className="text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${item.risk === "Low" ? "text-emerald-400" : "text-yellow-400"
                          }`}>
                          {isArabic ? item.riskAr : item.risk}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`text-xs ${item.profitability === "Very High" || item.profitability === "High"
                            ? "text-emerald-400" : "text-yellow-400"
                          }`}>
                          {isArabic ? item.profitabilityAr : item.profitability}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`px-2 py-1 rounded text-xs ${item.signal === "Strong Buy" ? "bg-emerald-500/20 text-emerald-400" :
                            item.signal === "Buy" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                          }`}>
                          {isArabic ? item.signalAr : item.signal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 text-gray-400 text-sm border border-gray-700 rounded-lg hover:bg-gray-800">
              {t("View Full Market Analysis", "عرض تحليل السوق بالكامل")}
            </button>
          </div>

          {/* Price Heatmap */}
          <div className="col-span-4 bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-white font-semibold">{t("Price Heatmap (Change %)", "الخريطة الحرارية للأسعار (نسبة التغير)")}</h3>
              <p className="text-gray-400 text-sm">{t("60 Days Forecast", "توقعات ٦٠ يوماً")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    <th className={`${isArabic ? "text-right" : "text-left"} py-1`}></th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((week) => (
                      <th key={week} className="text-center py-1 px-1">{t(`Week`, "الأسبوع")} {localizeNumber(week, isArabic)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.name}>
                      <td className={`py-1 text-gray-400 ${isArabic ? "pl-2" : "pr-2"}`}>{isArabic ? row.nameAr : row.name}</td>
                      {row.weeks.map((value, i) => (
                        <td key={i} className="text-center py-1 px-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs ${value >= 8 ? "bg-emerald-500 text-white" :
                                value >= 5 ? "bg-emerald-600/70 text-white" :
                                  value >= 3 ? "bg-emerald-700/50 text-emerald-200" :
                                    "bg-emerald-800/30 text-emerald-300"
                              }`}
                          >
                            {localizeNumber(value, isArabic)}٪
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market News & AI Confidence */}
          <div className="col-span-3 space-y-4">
            {/* Market News */}
            <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-emerald-400" />
                <h3 className="text-white font-semibold text-sm">{t("Market News & Insights", "أخبار ورؤى السوق")}</h3>
              </div>
              <div className="space-y-3">
                {marketNews.map((news, i) => (
                  <div key={i} className="flex gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-xs">{isArabic ? news.textAr : news.text}</p>
                      <span className="text-gray-500 text-xs">{isArabic ? news.timeAr : news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-1.5 text-emerald-400 text-xs border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10">
                {t("View All Market News", "عرض جميع أخبار السوق")}
              </button>
            </div>

            {/* AI Confidence Score */}
            <div className="bg-[#0a1a0f] border border-emerald-500/20 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">{t("AI Confidence Score", "درجة ثقة الذكاء الاصطناعي")}</h3>
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#1f2937"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${94 * 3.52} ${100 * 3.52}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-400">{localizeNumber("94", isArabic)}٪</span>
                    <span className="text-xs text-emerald-400">{t("High Confidence", "ثقة عالية")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Intelligence Sidebar Card */}
        <FloatingPanel
          title={t("Market Intelligence", "ذكاء السوق")}
          className={`fixed ${isArabic ? "right-4" : "left-4"} bottom-24 w-44 hidden xl:block`}
        >
          <div className="relative w-24 h-24 mx-auto my-2">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border border-purple-500/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="h-7 w-7 text-purple-400 animate-spin-slow" />
            </div>
          </div>
          <div className="text-center my-2">
            <div className="text-gray-400 text-[10px]">{t("Global Market Coverage", "تغطية السوق العالمية")}</div>
            <div className="text-xl font-bold text-white leading-none my-1">{localizeNumber("32", isArabic)}</div>
            <div className="text-gray-400 text-[10px]">{t("Countries", "دولة")}</div>
          </div>
          <button className="w-full py-1.5 text-emerald-400 text-[10px] border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-colors">
            {t("View Market Reports", "عرض تقارير السوق")}
          </button>
        </FloatingPanel>
      </div>
    </DashboardLayout>
  )
}
