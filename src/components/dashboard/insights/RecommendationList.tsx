"use client"

import * as React from "react"
import {
  Lightbulb,
  DollarSign,
  Megaphone,
  FileText,
  Heart,
  Package,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types matching the API
export interface Recommendation {
  id: string
  priority: "high" | "medium" | "low"
  title: string
  description: string
  category: "pricing" | "marketing" | "content" | "engagement" | "products"
  expectedImpact: string
  actions: string[]
}

// Icon mapping for categories
const categoryIcons: Record<Recommendation["category"], LucideIcon> = {
  pricing: DollarSign,
  marketing: Megaphone,
  content: FileText,
  engagement: Heart,
  products: Package,
}

// Color mapping for priority
const priorityColors: Record<Recommendation["priority"], string> = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-green-500/10 text-green-600 border-green-500/20",
}

// Badge variant for priority
const priorityBadgeVariants: Record<Recommendation["priority"], "default" | "secondary" | "outline"> = {
  high: "default",
  medium: "secondary",
  low: "outline",
}

interface RecommendationItemProps {
  recommendation: Recommendation
  expanded?: boolean
  onToggle?: () => void
  className?: string
}

function RecommendationItem({
  recommendation,
  expanded = false,
  onToggle,
  className,
}: RecommendationItemProps) {
  const CategoryIcon = categoryIcons[recommendation.category]
  
  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        expanded ? "bg-card" : "bg-card hover:bg-accent/50",
        className
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div className={cn("p-2 rounded-lg", priorityColors[recommendation.priority])}>
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-medium">{recommendation.title}</h4>
            <Badge variant={priorityBadgeVariants[recommendation.priority]} className="text-xs">
              {recommendation.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {recommendation.description}
          </p>
          {expanded && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Category: {recommendation.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  {recommendation.expectedImpact}
                </span>
              </div>
              
              {recommendation.actions.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Action Steps:</p>
                  <ul className="space-y-1.5">
                    {recommendation.actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Circle className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
    </div>
  )
}

interface RecommendationListProps {
  recommendations: Recommendation[]
  title?: string
  description?: string
  className?: string
}

export function RecommendationList({
  recommendations,
  title = "Recommendations",
  description = "AI-powered suggestions to improve your business",
  className,
}: RecommendationListProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  
  // Sort by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedRecommendations.length > 0 ? (
          sortedRecommendations.map((rec) => (
            <RecommendationItem
              key={rec.id}
              recommendation={rec}
              expanded={expandedId === rec.id}
              onToggle={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">All recommendations have been addressed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for dashboards
interface CompactRecommendationsProps {
  recommendations: Recommendation[]
  maxItems?: number
  className?: string
}

export function CompactRecommendations({
  recommendations,
  maxItems = 3,
  className,
}: CompactRecommendationsProps) {
  const sortedRecommendations = [...recommendations]
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, maxItems)

  return (
    <div className={cn("space-y-2", className)}>
      {sortedRecommendations.map((rec) => (
        <div
          key={rec.id}
          className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className={cn("p-1.5 rounded", priorityColors[rec.priority])}>
            <Lightbulb className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{rec.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {rec.expectedImpact}
            </p>
          </div>
          <Badge variant={priorityBadgeVariants[rec.priority]} className="text-xs shrink-0">
            {rec.priority}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export default RecommendationList
