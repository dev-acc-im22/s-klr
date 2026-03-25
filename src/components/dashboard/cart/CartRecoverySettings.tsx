"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Clock,
  Mail,
  Percent,
  Save,
  RotateCcw,
} from "lucide-react"

interface CartRecoverySettingsProps {
  settings: {
    enabled: boolean
    abandonmentThreshold: number
    firstEmailDelay: number
    secondEmailDelay: number
    thirdEmailDelay: number
    defaultDiscountPercent: number
    emailTemplate: {
      subject: string
      body: string
    }
  }
  onSave: (settings: CartRecoverySettingsProps["settings"]) => void
}

export function CartRecoverySettings({ settings, onSave }: CartRecoverySettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof typeof localSettings>(key: K, value: (typeof localSettings)[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
  }

  const handleSave = () => {
    onSave(localSettings)
    setHasChanges(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Recovery Settings
            </CardTitle>
            <CardDescription>
              Configure automatic abandoned cart recovery
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="enabled" className="text-sm">
              {localSettings.enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id="enabled"
              checked={localSettings.enabled}
              onCheckedChange={(checked) => updateSetting("enabled", checked)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Abandonment Threshold */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Abandonment Threshold</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            How long before a cart is considered abandoned
          </p>
          <Select
            value={localSettings.abandonmentThreshold.toString()}
            onValueChange={(value) => updateSetting("abandonmentThreshold", parseInt(value))}
            disabled={!localSettings.enabled}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Email Sequence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Email Sequence</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Timing for automated recovery emails
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="first-email" className="text-xs text-muted-foreground">
                First Email
              </Label>
              <Select
                value={localSettings.firstEmailDelay.toString()}
                onValueChange={(value) => updateSetting("firstEmailDelay", parseInt(value))}
                disabled={!localSettings.enabled}
              >
                <SelectTrigger id="first-email">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min after</SelectItem>
                  <SelectItem value="60">1 hour after</SelectItem>
                  <SelectItem value="120">2 hours after</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="second-email" className="text-xs text-muted-foreground">
                Second Email
              </Label>
              <Select
                value={localSettings.secondEmailDelay.toString()}
                onValueChange={(value) => updateSetting("secondEmailDelay", parseInt(value))}
                disabled={!localSettings.enabled}
              >
                <SelectTrigger id="second-email">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1440">24 hours after</SelectItem>
                  <SelectItem value="2880">48 hours after</SelectItem>
                  <SelectItem value="4320">72 hours after</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="third-email" className="text-xs text-muted-foreground">
                Final Email
              </Label>
              <Select
                value={localSettings.thirdEmailDelay.toString()}
                onValueChange={(value) => updateSetting("thirdEmailDelay", parseInt(value))}
                disabled={!localSettings.enabled}
              >
                <SelectTrigger id="third-email">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4320">72 hours after</SelectItem>
                  <SelectItem value="10080">7 days after</SelectItem>
                  <SelectItem value="0">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Default Discount */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Default Discount</Label>
            <Badge variant="secondary">Optional</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Default discount percentage offered in recovery emails
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={localSettings.defaultDiscountPercent}
              onChange={(e) => updateSetting("defaultDiscountPercent", parseInt(e.target.value) || 0)}
              className="w-24"
              disabled={!localSettings.enabled}
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        <Separator />

        {/* Email Template */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Email Template</Label>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-xs text-muted-foreground">
                Subject Line
              </Label>
              <Input
                id="subject"
                value={localSettings.emailTemplate.subject}
                onChange={(e) =>
                  updateSetting("emailTemplate", {
                    ...localSettings.emailTemplate,
                    subject: e.target.value,
                  })
                }
                disabled={!localSettings.enabled}
              />
            </div>
            <div>
              <Label htmlFor="body" className="text-xs text-muted-foreground">
                Email Body
              </Label>
              <Textarea
                id="body"
                value={localSettings.emailTemplate.body}
                onChange={(e) =>
                  updateSetting("emailTemplate", {
                    ...localSettings.emailTemplate,
                    body: e.target.value,
                  })
                }
                rows={8}
                disabled={!localSettings.enabled}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Variables: {"{discount}"}, {"{code}"}, {"{cart_items}"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
