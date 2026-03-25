"use client"

import { useState } from "react"
import { Webhook, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useGhostMode } from "@/hooks/useGhostMode"
import { WebhookManager } from "@/components/webhooks/WebhookManager"
import { WebhookTest } from "@/components/webhooks/WebhookTest"
import { mockWebhookStats } from "@/lib/mock-data/webhooks"

export default function WebhooksPage() {
  const { isGhostMode } = useGhostMode()
  const [stats] = useState(mockWebhookStats)

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Webhook className="h-7 w-7 text-primary" />
              Webhooks
            </h1>
            <p className="text-muted-foreground">
              Configure webhooks to receive real-time notifications for events in your store
            </p>
          </div>
          <WebhookTest
            trigger={
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-accent">
                <ExternalLink className="h-3 w-3 mr-1" />
                Test Endpoint
              </Badge>
            }
          />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Total Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWebhooks}</div>
              <p className="text-xs text-muted-foreground">{stats.activeWebhooks} active</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Total Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">All time deliveries</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successfulDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                {stats.successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedDeliveries}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Manager */}
        <WebhookManager />

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Getting Started with Webhooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-medium">Create a Webhook</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-10">
                  Add your endpoint URL and select the events you want to receive.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-medium">Verify Signatures</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-10">
                  Use the secret key to verify webhook signatures in your endpoint.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-medium">Monitor Deliveries</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-10">
                  Check delivery logs and retry failed webhook calls.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Security Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Always verify the webhook signature using your secret key to ensure requests are coming from CreatorHub.
                    The signature is included in the <code className="bg-muted px-1 rounded">X-Webhook-Signature</code> header.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
