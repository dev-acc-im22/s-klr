"use client"

import * as React from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  Target,
  DollarSign,
  Package,
  Users,
  Megaphone,
  GraduationCap,
  ArrowRight,
  LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TrendIndicator } from "./TrendIndicator"

// Types matching the API
export interface Insight {
  id: string
  type: "trend" | "recommendation" | "alert" | "opportunity"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "revenue" | "products" | "customers" | "marketing" | "courses"
  actionable: boolean
  action?: {
    label: string
    href: string
  }
  metric?: {
    value: string
    change?: number
    changeDirection?: "up" | "down"
  }
  createdAt: string
}

// Icon mapping for insight types
const typeIcons: Record<Insight["type"], LucideIcon> = {
  trend: TrendingUp,
  recommendation: Lightbulb,
  alert: AlertTriangle,
  opportunity: Target,
}

// Icon mapping for categories
const categoryIcons: Record<Insight["category"], LucideIcon> = {
  revenue: DollarSign,
  products: Package,
  customers: Users,
  marketing: Megaphone,
  courses: GraduationCap,
}

// Color mapping for types
const typeColors: Record<Insight["type"], string> = {
  trend: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  recommendation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  alert: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  opportunity: "bg-green-500/10 text-green-600 border-green-500/20",
}

// Badge variant for impact
const impactVariants: Record<Insight["impact"], "default" | "secondary" | "outline"> = {
  high: "default",
  medium: "secondary",
  low: "outline",
}

interface InsightCardProps {
  insight: Insight
  compact?: boolean
  showActions?: boolean
  className?: string
}

export function InsightCard({
  insight,
  compact = false,
  showActions = true,
  className,
}: InsightCardProps) {
  const TypeIcon = typeIcons[insight.type]
  const CategoryIcon = categoryIcons[insight.category]
  
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
          className
        )}
      >
        <div className={cn("p-2 rounded-lg", typeColors[insight.type])}>
          <TypeIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{insight.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {insight.description}
          </p>
        </div>
        {insight.metric && (
          <div className="text-right">
            <p className="text-sm font-semibold">{insight.metric.value}</p>
            {insight.metric.change !== undefined && (
              <TrendIndicator
                value={insight.metric.change}
                direction={insight.metric.changeDirection}
                size="sm"
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", typeColors[insight.type])}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {insight.category}
                </Badge>
                <Badge variant={impactVariants[insight.impact]} className="text-xs">
                  {insight.impact} impact
                </Badge>
              </div>
            </div>
          </div>
          {insight.metric && (
            <div className="text-right">
              <p className="text-lg font-bold">{insight.metric.value}</p>
              {insight.metric.change !== undefined && (
                <TrendIndicator
                  value={insight.metric.change}
                  direction={insight.metric.changeDirection}
                  size="sm"
                />
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{insight.description}</p>
        
        {showActions && insight.actionable && insight.action && (
          <Button variant="outline" size="sm" asChild>
            <Link href={insight.action.href}>
              {insight.action.label}
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Grid of insight cards
interface InsightCardGridProps {
  insights: Insight[]
  columns?: 2 | 3 | 4
  compact?: boolean
  className?: string
}

export function InsightCardGrid({
  insights,
  columns = 2,
  compact = false,
  className,
}: InsightCardGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} compact={compact} />
      ))}
    </div>
  )
}

export default InsightCard
