"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { webhookEvents, type WebhookLog } from "@/lib/mock-data/webhooks"
import { toast } from "sonner"

interface WebhookLogsProps {
  webhookId: string
  webhookUrl?: string
}

const statusConfig = {
  SUCCESS: {
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badge: "default" as const,
  },
  FAILED: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badge: "destructive" as const,
  },
  PENDING: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    badge: "secondary" as const,
  },
  RETRYING: {
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badge: "outline" as const,
  },
}

export function WebhookLogs({ webhookId, webhookUrl }: WebhookLogsProps) {
  const [logs, setLogs] = React.useState<WebhookLog[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [eventFilter, setEventFilter] = React.useState<string>("all")
  const [expandedLogs, setExpandedLogs] = React.useState<Set<string>>(new Set())
  const [copied, setCopied] = React.useState<string | null>(null)
  const [retrying, setRetrying] = React.useState<string | null>(null)

  const fetchLogs = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (eventFilter !== "all") params.set("event", eventFilter)

      const response = await fetch(
        `/api/webhooks/${webhookId}/logs?${params.toString()}`
      )
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [webhookId, statusFilter, eventFilter])

  React.useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev)
      if (next.has(logId)) {
        next.delete(logId)
      } else {
        next.add(logId)
      }
      return next
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
    toast.success(`${label} copied to clipboard`)
  }

  const handleRetry = async (logId: string) => {
    setRetrying(logId)
    try {
      const response = await fetch(`/api/webhooks/${webhookId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      })

      if (response.ok) {
        const updatedLog = await response.json()
        setLogs((prev) =>
          prev.map((log) => (log.id === logId ? updatedLog : log))
        )
        toast.success("Webhook delivery retried successfully")
      } else {
        toast.error("Failed to retry webhook delivery")
      }
    } catch {
      toast.error("Failed to retry webhook delivery")
    } finally {
      setRetrying(null)
    }
  }

  const formatJson = (str: string | null) => {
    if (!str) return null
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Delivery Logs</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RETRYING">Retrying</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {webhookEvents.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No delivery logs found
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {logs.map((log) => {
                const config = statusConfig[log.status]
                const StatusIcon = config.icon
                const isExpanded = expandedLogs.has(log.id)

                return (
                  <div
                    key={log.id}
                    className={cn(
                      "border rounded-lg overflow-hidden",
                      config.borderColor
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer",
                        config.bgColor
                      )}
                      onClick={() => toggleExpand(log.id)}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={cn("h-5 w-5", config.color)} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.event}</span>
                            <Badge variant={config.badge}>{log.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                            {" • "}
                            {log.attempts} attempt{log.attempts !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.status === "FAILED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRetry(log.id)
                            }}
                            disabled={retrying === log.id}
                          >
                            {retrying === log.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-3 border-t space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Payload</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                copyToClipboard(
                                  formatJson(log.payload) || "",
                                  "Payload"
                                )
                              }
                            >
                              {copied === "Payload" ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {formatJson(log.payload)}
                          </pre>
                        </div>

                        {log.response && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Response</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  copyToClipboard(
                                    formatJson(log.response) || "",
                                    "Response"
                                  )
                                }
                              >
                                {copied === "Response" ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {formatJson(log.response)}
                            </pre>
                          </div>
                        )}

                        {log.error && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-sm font-medium text-red-700">Error</p>
                            <p className="text-xs text-red-600">{log.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
