"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ShoppingCart,
  Mail,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock
} from "lucide-react"

interface RecoveryStatsProps {
  stats: {
    totalAbandoned: number
    emailsSent: number
    recovered: number
    recoveryRate: number
    potentialRevenue: number
    recoveredRevenue: number
  }
}

export function RecoveryStats({ stats }: RecoveryStatsProps) {
  const statCards = [
    {
      title: "Abandoned Carts",
      value: stats.totalAbandoned,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Emails Sent",
      value: stats.emailsSent,
      icon: Mail,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Recovered",
      value: stats.recovered,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Recovery Rate",
      value: `${stats.recoveryRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Recovery Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recovered: ${stats.recoveredRevenue.toFixed(2)}</span>
            <span className="font-medium">Potential: ${stats.potentialRevenue.toFixed(2)}</span>
          </div>
          <Progress
            value={(stats.recoveredRevenue / stats.potentialRevenue) * 100}
            className="h-3"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {stats.potentialRevenue > stats.recoveredRevenue
                ? `$${(stats.potentialRevenue - stats.recoveredRevenue).toFixed(2)} still recoverable`
                : "All potential revenue recovered!"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
