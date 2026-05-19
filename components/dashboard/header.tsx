"use client"

import { Search, Bell, User, Calendar, Clock, CheckCircle, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  pageNumber: string
  title: string
  subtitle: string
}

export function Header({ pageNumber, title, subtitle }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-lg font-bold text-foreground">
          {pageNumber}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Center Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Status Badges & Actions */}
      <div className="flex items-center gap-3">
        {/* Status Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">SECURITY: VERIFIED</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">MODE: EXECUTIVE</span>
          </div>
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
