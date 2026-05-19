"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Activity,
  Heart,
  Bot,
  Wifi,
  TrendingUp,
  Shield,
  MessageSquare,
  Leaf,
  Bell,
  CheckCircle,
  Zap,
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Farm Monitoring", href: "/farm-monitoring", icon: Activity },
  { name: "Crop Health", href: "/crop-health", icon: Heart },
  { name: "Robotics & Drones", href: "/robotics-drones", icon: Bot },
  { name: "IoT Network", href: "/iot-network", icon: Wifi },
  { name: "Price Prediction", href: "/price-prediction", icon: TrendingUp },
  { name: "Blockchain Security", href: "/blockchain", icon: Shield },
  { name: "AI Assistant", href: "/ai-assistant", icon: MessageSquare },
  { name: "Sustainability", href: "/sustainability", icon: Leaf },
  { name: "Alerts & Reports", href: "/alerts-reports", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-52 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">AgriNova</h1>
          <p className="text-[10px] text-muted-foreground">AI Smart Agriculture Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-secondary p-3">
          <h3 className="text-xs font-semibold text-foreground">System Status</h3>
          <div className="mt-2 flex items-center gap-2">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-primary bg-primary/10 p-2">
                <CheckCircle className="h-full w-full text-primary" />
              </div>
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-primary">All Systems Operational</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-3 w-3" /> Uptime
              </span>
              <span className="text-foreground">99.9%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Activity className="h-3 w-3" /> Response Time
              </span>
              <span className="text-foreground">120ms</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
