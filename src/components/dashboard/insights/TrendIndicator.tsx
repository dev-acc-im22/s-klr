"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendIndicatorProps {
  value: number
  direction?: "up" | "down" | "neutral"
  showIcon?: boolean
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  invertColors?: boolean // For metrics where down is good (e.g., bounce rate)
}

export function TrendIndicator({
  value,
  direction,
  showIcon = true,
  showPercentage = true,
  size = "md",
  className,
  invertColors = false,
}: TrendIndicatorProps) {
  // Auto-determine direction if not provided
  const actualDirection = direction || (value > 0 ? "up" : value < 0 ? "down" : "neutral")
  
  // Determine if this is a positive or negative trend
  const isPositive = invertColors 
    ? actualDirection === "down" 
    : actualDirection === "up"
  
  const Icon: LucideIcon = actualDirection === "up" 
    ? TrendingUp 
    : actualDirection === "down" 
      ? TrendingDown 
      : Minus

  const sizeClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1.5",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium",
        sizeClasses[size],
        actualDirection === "neutral" 
          ? "text-muted-foreground" 
          : isPositive 
            ? "text-green-500" 
            : "text-red-500",
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showPercentage && (
        <span>
          {actualDirection === "up" && value > 0 && "+"}
          {value.toFixed(1)}%
        </span>
      )}
    </div>
  )
}

// A more detailed trend display with label
interface TrendDisplayProps {
  value: number
  label: string
  direction?: "up" | "down"
  invertColors?: boolean
  className?: string
}

export function TrendDisplay({
  value,
  label,
  direction,
  invertColors = false,
  className,
}: TrendDisplayProps) {
  const actualDirection = direction || (value > 0 ? "up" : "down")
  const isPositive = invertColors 
    ? actualDirection === "down" 
    : actualDirection === "up"
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <TrendIndicator 
        value={Math.abs(value)} 
        direction={actualDirection}
        invertColors={invertColors}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default TrendIndicator
