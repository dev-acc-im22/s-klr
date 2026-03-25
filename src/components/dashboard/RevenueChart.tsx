"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for the last 7 days
const chartData = [
  { date: "Mon", revenue: 1200, orders: 12 },
  { date: "Tue", revenue: 1800, orders: 18 },
  { date: "Wed", revenue: 1400, orders: 14 },
  { date: "Thu", revenue: 2200, orders: 22 },
  { date: "Fri", revenue: 1900, orders: 19 },
  { date: "Sat", revenue: 2500, orders: 25 },
  { date: "Sun", revenue: 2100, orders: 21 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
}

interface RevenueChartProps {
  className?: string
}

export function RevenueChart({ className }: RevenueChartProps) {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
  const previousWeekRevenue = 10500 // Mock previous week
  const percentageChange = ((totalRevenue - previousWeekRevenue) / previousWeekRevenue * 100).toFixed(1)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Revenue Overview
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardTitle>
        <CardDescription>
          Last 7 days performance • Total: ${totalRevenue.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
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
              tickFormatter={(value) => `$${value}`}
              className="text-xs"
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{name}:</span>
                      <span className="font-semibold">
                        {name === 'revenue' ? `$${value}` : value}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-green-500 font-medium">+{percentageChange}%</span>
          <span className="text-muted-foreground">compared to last week</span>
        </div>
      </CardContent>
    </Card>
  )
}
