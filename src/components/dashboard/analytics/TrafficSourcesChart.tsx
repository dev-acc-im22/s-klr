"use client"

import * as React from "react"
import { Share2, Link, Instagram, Youtube, Twitter, Search, Mail, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

interface TrafficSourcesChartProps {
  data: TrafficSource[]
  className?: string
}

const sourceIcons: Record<string, React.ReactNode> = {
  'Direct': <Link className="h-4 w-4" />,
  'Instagram': <Instagram className="h-4 w-4" />,
  'YouTube': <Youtube className="h-4 w-4" />,
  'Twitter': <Twitter className="h-4 w-4" />,
  'TikTok': <span className="text-sm font-bold">TT</span>,
  'Google Search': <Search className="h-4 w-4" />,
  'Email': <Mail className="h-4 w-4" />,
  'Referral': <Users className="h-4 w-4" />,
}

// Blue monochrome color palette
const COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff']

export function TrafficSourcesChart({ data, className }: TrafficSourcesChartProps) {
  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Traffic Sources
        </CardTitle>
        <CardDescription>
          Where your visitors come from
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stat */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mb-6">
          <p className="text-sm text-muted-foreground">Total Visitors</p>
          <p className="text-2xl font-bold text-primary">{totalVisitors.toLocaleString()}</p>
        </div>

        {/* Source List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {data.map((item, index) => (
            <div key={item.source} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}
                  >
                    <div style={{ color: COLORS[index % COLORS.length] }}>
                      {sourceIcons[item.source] || <Link className="h-4 w-4" />}
                    </div>
                  </div>
                  <span className="font-medium">{item.source}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{item.visitors.toLocaleString()} visitors</span>
                  <span className="text-xs font-medium text-foreground">({item.percentage}%)</span>
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
