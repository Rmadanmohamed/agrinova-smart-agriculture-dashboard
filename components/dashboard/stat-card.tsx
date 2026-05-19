import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode, ReactElement } from "react"
import React from "react"

interface StatCardProps {
  title: string
  value: string | number
  // Legacy props (main page)
  suffix?: string
  change?: string
  changeType?: "increase" | "decrease" | "neutral"
  changeLabel?: string
  icon?: LucideIcon | ReactElement
  iconColor?: string
  className?: string
  // Extended props (sub-pages)
  trend?: "up" | "down" | "neutral"
  iconBg?: string
  subtitle?: string
  subtitleColor?: string
  valueSuffix?: string
  valueColor?: string
}

function renderIcon(
  icon: LucideIcon | ReactElement | undefined,
  iconBg?: string,
  iconColor?: string
): ReactNode {
  if (!icon) return null

  // If it's already a valid React element (JSX like <Home className="..." />), wrap it directly
  if (React.isValidElement(icon)) {
    return (
      <div className={cn("rounded-lg p-2.5", iconBg ?? "bg-secondary")}>
        {icon}
      </div>
    )
  }

  // Otherwise treat as a LucideIcon constructor (function or forwardRef object)
  // React can render these as components
  const IconComp = icon as React.ElementType
  return (
    <div className={cn("rounded-lg p-2.5", iconBg ?? "bg-secondary", !iconBg && iconColor)}>
      <IconComp className="h-5 w-5" />
    </div>
  )
}

export function StatCard({
  title,
  value,
  suffix,
  valueSuffix,
  change,
  changeType,
  changeLabel,
  trend,
  icon,
  iconColor,
  iconBg,
  subtitle,
  subtitleColor,
  valueColor,
  className,
}: StatCardProps) {
  const resolvedChangeType = changeType ?? (trend === "up" ? "increase" : trend === "down" ? "decrease" : "neutral")
  const displaySuffix = valueSuffix ?? suffix

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold text-foreground", valueColor)}>{value}</span>
            {displaySuffix && <span className="text-sm text-muted-foreground">{displaySuffix}</span>}
          </div>
          {subtitle && (
            <p className={cn("mt-0.5 text-xs font-medium", subtitleColor ?? "text-muted-foreground")}>{subtitle}</p>
          )}
          {change && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {resolvedChangeType === "increase" && <ArrowUp className="h-3 w-3 text-primary" />}
              {resolvedChangeType === "decrease" && <ArrowDown className="h-3 w-3 text-destructive" />}
              <span
                className={cn(
                  resolvedChangeType === "increase" && "text-primary",
                  resolvedChangeType === "decrease" && "text-destructive",
                  resolvedChangeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </span>
              {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
        {renderIcon(icon, iconBg, iconColor)}
      </div>
    </div>
  )
}
