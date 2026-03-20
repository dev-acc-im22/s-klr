"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts"
import { Package } from "lucide-react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/mock-data/dashboard"

interface TopProduct {
  id: string
  title: string
  sales: number
  revenue: number
  category: string
}

interface ProductsChartProps {
  data: TopProduct[]
  className?: string
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
}

export function ProductsChart({ data, className }: ProductsChartProps) {
  // Take top 5 products by revenue
  const topProducts = [...data]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(product => ({
      ...product,
      shortTitle: product.title.length > 20 
        ? product.title.substring(0, 20) + '...' 
        : product.title
    }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Top Products by Revenue
        </CardTitle>
        <CardDescription>
          Best performing products in this period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart 
            data={topProducts}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis 
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              className="text-xs"
            />
            <YAxis 
              type="category"
              dataKey="shortTitle"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              width={120}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name, props) => (
                    <div className="space-y-1">
                      <p className="font-medium">{props.payload.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Revenue: <span className="font-semibold">{formatCurrency(value as number)}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sales: <span className="font-semibold">{props.payload.sales}</span>
                      </p>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {topProducts.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded" 
                  style={{ backgroundColor: `var(--chart-${(index % 5) + 1})` }}
                />
                <span className="truncate max-w-[150px]">{product.title}</span>
              </div>
              <span className="text-muted-foreground">{product.sales} sold</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
