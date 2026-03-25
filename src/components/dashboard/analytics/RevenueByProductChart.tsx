"use client"

import * as React from "react"
import { DollarSign, TrendingUp, TrendingDown, Package } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ProductRevenue {
  id: string
  title: string
  revenue: number
  sales: number
  growth?: number
  type: 'digital' | 'course' | 'coaching'
}

interface RevenueByProductChartProps {
  data: ProductRevenue[]
  className?: string
}

// Blue monochrome color palette
const BAR_COLORS = ['#3b82f6', '#4f8ff7', '#60a5fa', '#7db8fc', '#93c5fd']

const typeLabels: Record<string, string> = {
  digital: 'Digital',
  course: 'Course',
  coaching: 'Coaching',
}

export function RevenueByProductChart({ data, className }: RevenueByProductChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue by Product
        </CardTitle>
        <CardDescription>
          Which products are generating the most revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="title"
                width={100}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {data.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className="flex items-center justify-center h-10 w-10 rounded-lg"
                style={{ backgroundColor: `${BAR_COLORS[index]}15` }}
              >
                <Package className="h-5 w-5" style={{ color: BAR_COLORS[index] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{product.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                    {typeLabels[product.type]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.sales.toLocaleString()} sales
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                {product.growth !== undefined && (
                  <div className={`flex items-center text-xs ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(product.growth)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
