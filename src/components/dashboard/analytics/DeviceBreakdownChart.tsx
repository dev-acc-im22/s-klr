"use client"

import * as React from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DeviceData {
  device: string
  visitors: number
  percentage: number
}

interface DeviceBreakdownChartProps {
  data: DeviceData[]
  className?: string
}

const deviceIcons: Record<string, React.ReactNode> = {
  'Desktop': <Monitor className="h-4 w-4" />,
  'Mobile': <Smartphone className="h-4 w-4" />,
  'Tablet': <Tablet className="h-4 w-4" />,
}

// Blue monochrome color palette
const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd']

export function DeviceBreakdownChart({ data, className }: DeviceBreakdownChartProps) {
  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Device Breakdown
        </CardTitle>
        <CardDescription>
          Mobile vs Desktop visitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="visitors"
                  nameKey="device"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} visitors`,
                    name
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats List */}
          <div className="w-full md:w-1/2 space-y-3">
            {data.map((item, index) => (
              <div
                key={item.device}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${COLORS[index]}20` }}
                  >
                    <div style={{ color: COLORS[index] }}>
                      {deviceIcons[item.device] || <Monitor className="h-4 w-4" />}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{item.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.visitors.toLocaleString()} visitors
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{item.percentage}%</p>
                  <p className="text-xs text-muted-foreground">of total</p>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between p-3 rounded-lg border-t pt-3 mt-3">
              <span className="font-medium">Total Visitors</span>
              <span className="font-semibold">{totalVisitors.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
