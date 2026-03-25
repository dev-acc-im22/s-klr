'use client';

import { useState } from 'react';
import { Rocket, Calendar, DollarSign, Bell, Save, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LaunchSettingsProps {
  productId?: string;
  courseId?: string;
  initialSettings?: {
    launchMode: boolean;
    launchDate: Date | null;
    earlyBirdPrice: number | null;
    earlyBirdEndDate: Date | null;
    waitlistEnabled: boolean;
  };
  onSave?: (settings: {
    launchMode: boolean;
    launchDate: Date | null;
    earlyBirdPrice: number | null;
    earlyBirdEndDate: Date | null;
    waitlistEnabled: boolean;
  }) => void;
  regularPrice?: number;
  ghostMode?: boolean;
}

export function LaunchSettings({
  productId,
  courseId,
  initialSettings,
  onSave,
  regularPrice = 0,
  ghostMode = false,
}: LaunchSettingsProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  
  const [settings, setSettings] = useState({
    launchMode: initialSettings?.launchMode ?? false,
    launchDate: initialSettings?.launchDate ? new Date(initialSettings.launchDate) : null,
    earlyBirdPrice: initialSettings?.earlyBirdPrice ?? null,
    earlyBirdEndDate: initialSettings?.earlyBirdEndDate ? new Date(initialSettings.earlyBirdEndDate) : null,
    waitlistEnabled: initialSettings?.waitlistEnabled ?? true,
  });

  const [notificationEmail, setNotificationEmail] = useState({
    subject: '🎉 We\'re Launching!',
    message: `Hi {name},\n\nGreat news! We're officially launching and you're on our exclusive early access list.\n\nAs a thank you for waiting, use code EARLYBIRD for 20% off.\n\nClick here to get started: {link}\n\nSee you inside!\nThe Team`,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (productId) {
        await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      } else if (courseId) {
        await fetch(`/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      }

      onSave?.(settings);
      
      toast({
        title: 'Settings saved',
        description: 'Your launch settings have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendNotification = async () => {
    if (!confirm('Send launch notification to all unnotified waitlist subscribers?')) return;
    
    setSendingNotification(true);
    try {
      const response = await fetch('/api/waitlist/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId || null,
          courseId: courseId || null,
          subject: notificationEmail.subject,
          message: notificationEmail.message,
          onlyUnnotified: true,
        }),
      });

      const data = await response.json();
      
      toast({
        title: 'Notifications sent',
        description: `${data.notifiedCount} subscribers have been notified.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send notifications.',
      });
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Launch Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Launch Mode
              </CardTitle>
              <CardDescription>
                Collect emails before your product goes live
              </CardDescription>
            </div>
            <Switch
              checked={settings.launchMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, launchMode: checked })
              }
            />
          </div>
        </CardHeader>
        {settings.launchMode && (
          <CardContent className="space-y-6">
            {/* Waitlist Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Waitlist</Label>
                <p className="text-sm text-muted-foreground">
                  Show signup form instead of purchase button
                </p>
              </div>
              <Switch
                checked={settings.waitlistEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, waitlistEnabled: checked })
                }
              />
            </div>

            {/* Launch Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Launch Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !settings.launchDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {settings.launchDate
                      ? format(settings.launchDate, 'PPP')
                      : 'Select launch date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarPicker
                    mode="single"
                    selected={settings.launchDate || undefined}
                    onSelect={(date) =>
                      setSettings({ ...settings, launchDate: date || null })
                    }
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Early Bird Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <Label>Early Bird Pricing</Label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Early Bird Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={regularPrice.toFixed(2)}
                      value={settings.earlyBirdPrice || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          earlyBirdPrice: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                      className="pl-8"
                    />
                  </div>
                  {settings.earlyBirdPrice && regularPrice > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(
                        ((regularPrice - settings.earlyBirdPrice) / regularPrice) *
                          100
                      )}
                      % off regular price
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Early Bird Ends
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !settings.earlyBirdEndDate && 'text-muted-foreground'
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {settings.earlyBirdEndDate
                          ? format(settings.earlyBirdEndDate, 'PPP')
                          : 'Select end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarPicker
                        mode="single"
                        selected={settings.earlyBirdEndDate || undefined}
                        onSelect={(date) =>
                          setSettings({ ...settings, earlyBirdEndDate: date || null })
                        }
                        disabled={(date) =>
                          date < new Date() ||
                          (settings.launchDate ? date > settings.launchDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Settings
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Notification Email */}
      {settings.launchMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Launch Notification
            </CardTitle>
            <CardDescription>
              Send an email to your waitlist when you launch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                value={notificationEmail.subject}
                onChange={(e) =>
                  setNotificationEmail({
                    ...notificationEmail,
                    subject: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email Message</Label>
              <Textarea
                rows={6}
                value={notificationEmail.message}
                onChange={(e) =>
                  setNotificationEmail({
                    ...notificationEmail,
                    message: e.target.value,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Use {'{name}'} and {'{link}'} as placeholders
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSendNotification}
              disabled={sendingNotification}
            >
              {sendingNotification ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bell className="mr-2 h-4 w-4" />
              )}
              Send Launch Notification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
