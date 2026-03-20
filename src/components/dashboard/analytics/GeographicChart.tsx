"use client"

import * as React from "react"
import { Globe } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface GeoData {
  country: string
  code: string
  orders: number
  revenue: number
  percentage: number
}

interface GeographicChartProps {
  data: GeoData[]
  className?: string
}

// Blue monochrome color palette
const COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff']

export function GeographicChart({ data, className }: GeographicChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Breakdown
        </CardTitle>
        <CardDescription>
          Top countries by visitors and revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-lg font-bold">{totalOrders.toLocaleString()}</p>
          </div>
        </div>

        {/* Country List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {data.map((item, index) => (
            <div key={item.code} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.country.split(' ')[0]}</span>
                  <span className="font-medium truncate">{item.country.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="hidden sm:inline">{item.orders} orders</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
              <div className="flex justify-end text-xs text-muted-foreground">
                {item.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
