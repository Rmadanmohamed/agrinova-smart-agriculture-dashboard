"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Minus, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingPanelProps {
  title: string
  children: React.ReactNode
  className?: string
  defaultMinimized?: boolean
  defaultCollapsed?: boolean
}

export function FloatingPanel({
  title,
  children,
  className,
  defaultMinimized = false,
  defaultCollapsed = false,
}: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [minimized, setMinimized] = useState(defaultMinimized)

  // Use the passed className or default to left-56 bottom-6 next to sidebar
  const resolvedClass = className || "fixed bottom-6 left-56 w-44"

  if (minimized) {
    return (
      <div
        className={cn(
          "fixed cursor-pointer z-50",
          "bg-[#0a1a0f] border border-emerald-500/30 rounded-full",
          "px-3 py-1.5 flex items-center gap-1.5 shadow-lg shadow-emerald-950/20",
          "transition-all duration-300 ease-in-out hover:scale-105",
          "hover:border-emerald-500/60 hover:shadow-emerald-500/20",
          // Position classes extracted from resolvedClass to keep it in the same place
          resolvedClass.includes("left-56") ? "left-56" : "left-4",
          resolvedClass.includes("bottom-24") ? "bottom-24" : "bottom-6"
        )}
        onClick={() => setMinimized(false)}
        title="Expand panel"
      >
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">{title}</span>
        <Maximize2 className="h-2.5 w-2.5 text-emerald-400" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 w-44 shadow-xl z-50",
        "transition-all duration-300 ease-in-out",
        resolvedClass
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground leading-none">{title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-red-400 transition-colors"
            title="Minimize to button"
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          collapsed ? "max-h-0 pt-0 opacity-0" : "max-h-96 pt-2 opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  )
}
