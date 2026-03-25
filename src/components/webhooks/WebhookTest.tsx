"use client"

import * as React from "react"
import { Send, Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { webhookEvents, type WebhookEventType } from "@/lib/mock-data/webhooks"
import { toast } from "sonner"

interface WebhookTestProps {
  webhookUrl?: string
  webhookSecret?: string
  trigger?: React.ReactNode
}

interface TestResult {
  success: boolean
  duration?: number
  statusCode?: number
  response?: Record<string, unknown>
  error?: string
  payload?: Record<string, unknown>
}

export function WebhookTest({ webhookUrl, webhookSecret, trigger }: WebhookTestProps) {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState(webhookUrl || "")
  const [event, setEvent] = React.useState<WebhookEventType>("order.created")
  const [secret, setSecret] = React.useState(webhookSecret || "")
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<TestResult | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (webhookUrl) setUrl(webhookUrl)
    if (webhookSecret) setSecret(webhookSecret)
  }, [webhookUrl, webhookSecret])

  const handleTest = async () => {
    if (!url) {
      toast.error("Please enter a webhook URL")
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, event, secret }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast.success("Webhook test successful!")
      } else {
        toast.error(data.error || "Webhook test failed")
      }
    } catch (error) {
      toast.error("Failed to send test webhook")
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
    toast.success(`${label} copied to clipboard`)
  }

  const formatJson = (obj: unknown) => {
    return JSON.stringify(obj, null, 2)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Test Webhook
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Send a test payload to your webhook endpoint to verify it&apos;s working correctly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                placeholder="https://your-server.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event Type</Label>
                <Select value={event} onValueChange={(v) => setEvent(v as WebhookEventType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhookEvents.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret">Secret Key (Optional)</Label>
                <Input
                  id="secret"
                  placeholder="whsec_..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleTest} disabled={isLoading || !url}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Webhook
                </>
              )}
            </Button>
          </div>

          {result && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-600">Success</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-600">Failed</span>
                    </>
                  )}
                </div>
                {result.duration && (
                  <Badge variant="secondary">{result.duration}ms</Badge>
                )}
              </div>

              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
                  {result.error}
                </div>
              )}

              <Tabs defaultValue="payload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payload">Request Payload</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="payload" className="mt-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => copyToClipboard(formatJson(result.payload), "Payload")}
                    >
                      {copied === "Payload" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <ScrollArea className="h-[200px] w-full rounded-md bg-muted p-4">
                      <pre className="text-xs">{formatJson(result.payload)}</pre>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="mt-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => copyToClipboard(formatJson(result.response), "Response")}
                    >
                      {copied === "Response" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <ScrollArea className="h-[200px] w-full rounded-md bg-muted p-4">
                      <pre className="text-xs">
                        {result.response ? formatJson(result.response) : "No response"}
                      </pre>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
