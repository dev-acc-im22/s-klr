"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Plus,
  MoreHorizontal,
  Copy,
  Check,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventSelector, EventBadges } from "./EventSelector"
import { WebhookTest } from "./WebhookTest"
import { WebhookLogs } from "./WebhookLogs"
import { type Webhook, generateSecretKey } from "@/lib/mock-data/webhooks"
import { toast } from "sonner"

interface WebhookManagerProps {
  className?: string
}

export function WebhookManager({ className }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = React.useState<Webhook[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [editingWebhook, setEditingWebhook] = React.useState<Webhook | null>(null)
  const [viewingLogsWebhook, setViewingLogsWebhook] = React.useState<Webhook | null>(null)
  const [deletingWebhook, setDeletingWebhook] = React.useState<Webhook | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)

  // Form state
  const [formData, setFormData] = React.useState({
    url: "",
    events: [] as string[],
    isActive: true,
  })

  const fetchWebhooks = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/webhooks")
      const data = await response.json()
      setWebhooks(data.webhooks || [])
    } catch (error) {
      console.error("Failed to fetch webhooks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchWebhooks()
  }, [fetchWebhooks])

  const resetForm = () => {
    setFormData({
      url: "",
      events: [],
      isActive: true,
    })
  }

  const handleCreate = async () => {
    if (!formData.url) {
      toast.error("URL is required")
      return
    }
    if (formData.events.length === 0) {
      toast.error("Select at least one event")
      return
    }

    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newWebhook = await response.json()
        setWebhooks((prev) => [newWebhook, ...prev])
        setShowCreateDialog(false)
        resetForm()
        toast.success("Webhook created successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create webhook")
      }
    } catch {
      toast.error("Failed to create webhook")
    }
  }

  const handleUpdate = async () => {
    if (!editingWebhook) return

    try {
      const response = await fetch(`/api/webhooks/${editingWebhook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedWebhook = await response.json()
        setWebhooks((prev) =>
          prev.map((w) => (w.id === editingWebhook.id ? updatedWebhook : w))
        )
        setEditingWebhook(null)
        resetForm()
        toast.success("Webhook updated successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update webhook")
      }
    } catch {
      toast.error("Failed to update webhook")
    }
  }

  const handleDelete = async () => {
    if (!deletingWebhook) return

    try {
      const response = await fetch(`/api/webhooks/${deletingWebhook.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== deletingWebhook.id))
        setDeletingWebhook(null)
        toast.success("Webhook deleted successfully")
      } else {
        toast.error("Failed to delete webhook")
      }
    } catch {
      toast.error("Failed to delete webhook")
    }
  }

  const handleToggleActive = async (webhook: Webhook) => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !webhook.isActive }),
      })

      if (response.ok) {
        const updatedWebhook = await response.json()
        setWebhooks((prev) =>
          prev.map((w) => (w.id === webhook.id ? updatedWebhook : w))
        )
        toast.success(
          `Webhook ${updatedWebhook.isActive ? "enabled" : "disabled"}`
        )
      }
    } catch {
      toast.error("Failed to update webhook")
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
    toast.success(`${label} copied to clipboard`)
  }

  const openEditDialog = (webhook: Webhook) => {
    setFormData({
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
    })
    setEditingWebhook(webhook)
  }

  if (viewingLogsWebhook) {
    return (
      <div className={className}>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setViewingLogsWebhook(null)}
        >
          ← Back to Webhooks
        </Button>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{viewingLogsWebhook.url}</h2>
              <p className="text-sm text-muted-foreground">
                Webhook ID: {viewingLogsWebhook.id}
              </p>
            </div>
            <WebhookTest
              webhookUrl={viewingLogsWebhook.url}
              webhookSecret={viewingLogsWebhook.secret}
              trigger={
                <Button variant="outline" size="sm">
                  Test Webhook
                </Button>
              }
            />
          </div>
          <WebhookLogs
            webhookId={viewingLogsWebhook.id}
            webhookUrl={viewingLogsWebhook.url}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Webhooks</h2>
          <p className="text-muted-foreground">
            Manage webhooks to receive notifications for events in your store.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ExternalLink className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No webhooks configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create a webhook to receive real-time notifications for events in your store.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{webhook.url}</CardTitle>
                      <Badge variant={webhook.isActive ? "default" : "secondary"}>
                        {webhook.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created {format(new Date(webhook.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(webhook)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(webhook.secret, "Secret key")}>
                        {copied === "Secret key" ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy Secret Key
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleActive(webhook)}>
                        {webhook.isActive ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeletingWebhook(webhook)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Events</p>
                    <EventBadges events={webhook.events} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingLogsWebhook(webhook)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Logs
                    </Button>
                    <WebhookTest
                      webhookUrl={webhook.url}
                      webhookSecret={webhook.secret}
                      trigger={
                        <Button variant="outline" size="sm">
                          Test Webhook
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog || !!editingWebhook}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false)
            setEditingWebhook(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingWebhook ? "Edit Webhook" : "Create Webhook"}
            </DialogTitle>
            <DialogDescription>
              Configure your webhook endpoint to receive event notifications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Endpoint URL</Label>
              <Input
                id="url"
                placeholder="https://your-server.com/webhook"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                The URL where we&apos;ll send POST requests for webhook events.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              <EventSelector
                value={formData.events as string[]}
                onChange={(events) =>
                  setFormData((prev) => ({ ...prev, events }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Enable or disable this webhook
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            {editingWebhook && (
              <div className="space-y-2">
                <Label>Secret Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                    {editingWebhook.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(editingWebhook.secret, "Secret")
                    }
                  >
                    {copied === "Secret" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook signatures in your endpoint.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false)
                setEditingWebhook(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingWebhook ? handleUpdate : handleCreate}>
              {editingWebhook ? "Save Changes" : "Create Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingWebhook}
        onOpenChange={(open) => !open && setDeletingWebhook(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
              You will no longer receive notifications at {deletingWebhook?.url}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
