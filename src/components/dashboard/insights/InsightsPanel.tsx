"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { InsightCard, InsightCardGrid, type Insight } from "./InsightCard"
import { RecommendationList, CompactRecommendations, type Recommendation } from "./RecommendationList"
import { TrendIndicator } from "./TrendIndicator"

// Types for the API response
interface InsightsData {
  insights: Insight[]
  summary: {
    totalRevenue: number
    revenueChange: number
    totalSales: number
    salesChange: number
    topProduct: string
    topProductRevenue: number
    conversionRate: number
    conversionChange: number
  }
  recommendations: Recommendation[]
  generatedAt: string
}

interface InsightsPanelProps {
  compact?: boolean
  showHeader?: boolean
  className?: string
}

export function InsightsPanel({
  compact = false,
  showHeader = true,
  className,
}: InsightsPanelProps) {
  const [data, setData] = React.useState<InsightsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<string>("all")
  const [refreshing, setRefreshing] = React.useState(false)

  const fetchInsights = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/insights")
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to load insights")
      }
    } catch (err) {
      setError("Failed to load insights")
      console.error("Error fetching insights:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchInsights()
    setRefreshing(false)
  }

  // Filter insights based on selected filter
  const filteredInsights = React.useMemo(() => {
    if (!data?.insights) return []
    if (filter === "all") return data.insights
    return data.insights.filter((i) => i.category === filter)
  }, [data?.insights, filter])

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Insights</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // No data
  if (!data) return null

  // Compact version for dashboard
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold">
                  ${data.summary.totalRevenue.toLocaleString()}
                </p>
                <TrendIndicator value={data.summary.revenueChange} size="sm" />
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Conversion</p>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold">{data.summary.conversionRate}%</p>
                <TrendIndicator value={data.summary.conversionChange} size="sm" />
              </div>
            </div>
          </div>
          
          {/* Top insights */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Top Insights</p>
            {filteredInsights.slice(0, 3).map((insight) => (
              <InsightCard key={insight.id} insight={insight} compact />
            ))}
          </div>

          {/* Quick recommendations */}
          {data.recommendations.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Recommendations
              </p>
              <CompactRecommendations recommendations={data.recommendations} maxItems={2} />
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/insights">
              View All Insights
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Full version for insights page
  return (
    <div className={cn("space-y-6", className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Creator Insights
            </h2>
            <p className="text-muted-foreground">
              AI-powered analytics and recommendations for your creator business
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh Insights
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.summary.totalRevenue.toLocaleString()}
            </div>
            <TrendIndicator
              value={data.summary.revenueChange}
              size="sm"
              className="mt-1"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalSales}</div>
            <TrendIndicator
              value={data.summary.salesChange}
              size="sm"
              className="mt-1"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{data.summary.topProduct}</div>
            <p className="text-xs text-muted-foreground">
              ${data.summary.topProductRevenue.toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.conversionRate}%</div>
            <TrendIndicator
              value={data.summary.conversionChange}
              size="sm"
              className="mt-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">
            Insights ({data.insights.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            Recommendations ({data.recommendations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary">{filteredInsights.length} insights</Badge>
          </div>

          {/* Insights Grid */}
          <InsightCardGrid insights={filteredInsights} columns={2} />
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationList recommendations={data.recommendations} />
        </TabsContent>
      </Tabs>

      {/* Last updated */}
      <p className="text-xs text-muted-foreground text-center">
        Last generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}

export default InsightsPanel
