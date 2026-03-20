"use client"

import * as React from "react"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsCardProps {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down'
  }
  className?: string
}

export function AnalyticsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: AnalyticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
