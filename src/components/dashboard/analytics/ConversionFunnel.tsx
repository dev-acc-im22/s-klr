"use client"

import * as React from "react"
import { Funnel, Users, Eye, ShoppingCart, CreditCard, ArrowDown } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FunnelStep {
  id: string
  name: string
  count: number
  percentage: number
  dropoff: number
}

interface ConversionFunnelProps {
  data: FunnelStep[]
  className?: string
}

const stepIcons: Record<string, React.ReactNode> = {
  visitors: <Users className="h-4 w-4" />,
  views: <Eye className="h-4 w-4" />,
  cart: <ShoppingCart className="h-4 w-4" />,
  purchases: <CreditCard className="h-4 w-4" />,
}

// Blue monochrome color palette - darker to lighter
const STEP_COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa']

export function ConversionFunnel({ data, className }: ConversionFunnelProps) {
  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Funnel className="h-5 w-5" />
          Conversion Funnel
        </CardTitle>
        <CardDescription>
          Track visitor journey from discovery to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((step, index) => {
            const width = (step.count / maxCount) * 100
            const isLast = index === data.length - 1

            return (
              <div key={step.id} className="relative">
                {/* Step Container */}
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full shrink-0"
                    style={{ backgroundColor: `${STEP_COLORS[index]}20` }}
                  >
                    <div style={{ color: STEP_COLORS[index] }}>
                      {stepIcons[step.id] || <Users className="h-4 w-4" />}
                    </div>
                  </div>

                  {/* Funnel Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{step.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{step.count.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">
                          {step.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-8 rounded-md transition-all duration-500 flex items-center justify-end pr-3"
                      style={{
                        width: `${width}%`,
                        minWidth: '80px',
                        backgroundColor: STEP_COLORS[index],
                        opacity: 0.9,
                      }}
                    >
                      <span className="text-xs text-white font-medium">
                        {((step.count / data[0].count) * 100).toFixed(0)}% of visitors
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropoff indicator */}
                {!isLast && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ArrowDown className="h-4 w-4" />
                      <span className="text-xs">
                        -{step.dropoff.toFixed(1)}% drop-off
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Overall Conversion</p>
            <p className="text-xl font-bold text-primary">
              {data.length > 0 && data[0].count > 0
                ? ((data[data.length - 1].count / data[0].count) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Visitors</p>
            <p className="text-xl font-bold">{data[0]?.count.toLocaleString() || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Purchases</p>
            <p className="text-xl font-bold">{data[data.length - 1]?.count.toLocaleString() || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
