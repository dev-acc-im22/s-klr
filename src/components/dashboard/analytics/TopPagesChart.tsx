"use client"

import * as React from "react"
import { FileText, ExternalLink } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageData {
  path: string
  title: string
  views: number
  uniqueVisitors: number
}

interface TopPagesChartProps {
  data: PageData[]
  className?: string
}

// Blue monochrome gradient colors
const BAR_COLORS = ['#3b82f6', '#4f8ff7', '#60a5fa', '#7db8fc', '#93c5fd']

export function TopPagesChart({ data, className }: TopPagesChartProps) {
  const totalViews = data.reduce((sum, item) => sum + item.views, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Top Pages
        </CardTitle>
        <CardDescription>
          Most visited pages on your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Horizontal Bar Chart */}
        <div className="h-[200px] mb-6">
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
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'views' ? `${value.toLocaleString()} views` : value,
                  name === 'views' ? 'Views' : name
                ]}
              />
              <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {data.map((page, index) => (
            <div
              key={page.path}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className="flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${BAR_COLORS[index]}20`, color: BAR_COLORS[index] }}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{page.title}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{page.path}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{page.views.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">views</p>
              </div>
              <a
                href={page.path}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title="View page"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Page Views</span>
          <span className="font-semibold">{totalViews.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
