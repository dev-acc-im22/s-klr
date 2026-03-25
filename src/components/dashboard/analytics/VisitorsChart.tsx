"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Eye, Users } from "lucide-react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VisitorData {
  byDay: Array<{
    date: string
    visitors: number
    pageViews: number
  }>
  total: number
  unique: number
}

interface VisitorsChartProps {
  data: VisitorData
  className?: string
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  pageViews: {
    label: "Page Views",
    color: "var(--chart-2)",
  },
}

export function VisitorsChart({ data, className }: VisitorsChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Visitors & Page Views
        </CardTitle>
        <CardDescription>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {data.unique.toLocaleString()} unique visitors
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart 
            data={data.byDay}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent />
              }
            />
            <Area
              type="monotone"
              dataKey="pageViews"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#pageViewsGradient)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#visitorsGradient)"
            />
          </AreaChart>
        </ChartContainer>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }} />
            <span className="text-sm text-muted-foreground">Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }} />
            <span className="text-sm text-muted-foreground">Page Views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
