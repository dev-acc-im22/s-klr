"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ChevronLeft,
  Plus,
  Trash2,
  Edit,
  Settings,
  Globe,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useGhostMode } from "@/hooks/useGhostMode";
import {
  CoachingPackageForm,
  PackagePreviewCard,
} from "@/components/dashboard/coaching/CoachingPackageForm";
import { coachingPackages, type CoachingPackage } from "@/lib/mock-data/coaching";
import { cn } from "@/lib/utils";

interface AvailabilitySettings {
  timezone: string;
  bufferTime: number;
  maxDailySessions: number;
  autoConfirm: boolean;
  sendReminders: boolean;
  reminderTime: number;
  allowReschedule: boolean;
  cancellationPolicy: string;
}

const timezones = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "UTC",
];

export default function SchedulePage() {
  const { isGhostMode } = useGhostMode();
  const [packages, setPackages] = React.useState<CoachingPackage[]>(coachingPackages);
  const [editingPackage, setEditingPackage] = React.useState<CoachingPackage | null>(null);
  const [showPackageDialog, setShowPackageDialog] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null);

  const [availability, setAvailability] = React.useState<AvailabilitySettings>({
    timezone: "America/New_York",
    bufferTime: 15,
    maxDailySessions: 4,
    autoConfirm: true,
    sendReminders: true,
    reminderTime: 24,
    allowReschedule: true,
    cancellationPolicy: "24 hours",
  });

  const handleSavePackage = (data: Omit<CoachingPackage, "id">) => {
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === editingPackage.id ? { ...data, id: pkg.id } : pkg
        )
      );
    } else {
      const newPackage: CoachingPackage = {
        ...data,
        id: `pkg-${Date.now()}`,
      };
      setPackages((prev) => [...prev, newPackage]);
    }
    setShowPackageDialog(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/coaching">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Schedule Setup</h1>
              <p className="text-muted-foreground">
                Configure your coaching packages and availability
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Packages Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Existing Packages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Coaching Packages</CardTitle>
                  <CardDescription>
                    Packages your clients can book
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingPackage(null);
                    setShowPackageDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={cn(
                        "relative rounded-lg border p-4 transition-all hover:shadow-md",
                        selectedPackage === pkg.id && "ring-2 ring-primary"
                      )}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            Popular
                          </Badge>
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{pkg.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pkg.duration} min · ${pkg.price}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPackage(pkg);
                              setShowPackageDialog(true);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability Settings
                </CardTitle>
                <CardDescription>
                  Configure when clients can book sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={availability.timezone}
                      onValueChange={(v) =>
                        setAvailability((prev) => ({ ...prev, timezone: v }))
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buffer">Buffer Between Sessions</Label>
                    <Select
                      value={String(availability.bufferTime)}
                      onValueChange={(v) =>
                        setAvailability((prev) => ({ ...prev, bufferTime: Number(v) }))
                      }
                    >
                      <SelectTrigger id="buffer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDaily">Max Daily Sessions</Label>
                    <Input
                      id="maxDaily"
                      type="number"
                      min="1"
                      max="10"
                      value={availability.maxDailySessions}
                      onChange={(e) =>
                        setAvailability((prev) => ({
                          ...prev,
                          maxDailySessions: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellation">Cancellation Policy</Label>
                    <Select
                      value={availability.cancellationPolicy}
                      onValueChange={(v) =>
                        setAvailability((prev) => ({ ...prev, cancellationPolicy: v }))
                      }
                    >
                      <SelectTrigger id="cancellation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12 hours">12 hours notice</SelectItem>
                        <SelectItem value="24 hours">24 hours notice</SelectItem>
                        <SelectItem value="48 hours">48 hours notice</SelectItem>
                        <SelectItem value="72 hours">72 hours notice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-confirm Bookings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically confirm new booking requests
                      </p>
                    </div>
                    <Switch
                      checked={availability.autoConfirm}
                      onCheckedChange={(v) =>
                        setAvailability((prev) => ({ ...prev, autoConfirm: v }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email reminders before sessions
                      </p>
                    </div>
                    <Switch
                      checked={availability.sendReminders}
                      onCheckedChange={(v) =>
                        setAvailability((prev) => ({ ...prev, sendReminders: v }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Rescheduling</Label>
                      <p className="text-sm text-muted-foreground">
                        Let clients reschedule their sessions
                      </p>
                    </div>
                    <Switch
                      checked={availability.allowReschedule}
                      onCheckedChange={(v) =>
                        setAvailability((prev) => ({ ...prev, allowReschedule: v }))
                      }
                    />
                  </div>
                </div>

                {availability.sendReminders && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Reminder Time</Label>
                      <Select
                        value={String(availability.reminderTime)}
                        onValueChange={(v) =>
                          setAvailability((prev) => ({
                            ...prev,
                            reminderTime: Number(v),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour before</SelectItem>
                          <SelectItem value="4">4 hours before</SelectItem>
                          <SelectItem value="24">24 hours before</SelectItem>
                          <SelectItem value="48">48 hours before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking Page Preview</CardTitle>
                <CardDescription>
                  How clients see your packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {packages.slice(0, 2).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-3 rounded-lg border bg-card text-center"
                    >
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${pkg.price} · {pkg.duration} min
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/demo" target="_blank">
                      <Globe className="h-4 w-4 mr-2" />
                      View Public Page
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Block Out Dates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Weekly Hours
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Add a popular badge to your best-selling package to increase conversions</p>
                <p>• Include specific deliverables in your package descriptions</p>
                <p>• Set buffer time to prepare between sessions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Package Dialog */}
      <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Create New Package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Update your coaching package details"
                : "Add a new coaching package for clients to book"}
            </DialogDescription>
          </DialogHeader>
          <CoachingPackageForm
            initialData={editingPackage || undefined}
            onSubmit={handleSavePackage}
            onCancel={() => {
              setShowPackageDialog(false);
              setEditingPackage(null);
            }}
            isEditing={!!editingPackage}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
