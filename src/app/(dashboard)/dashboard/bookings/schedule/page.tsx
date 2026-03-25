"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Globe, Settings } from "lucide-react";

import { AvailabilityForm } from "@/components/dashboard/bookings/AvailabilityForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  defaultAvailabilitySettings,
  dayNames,
  type MockAvailabilitySettings,
} from "@/lib/mock-data/bookings";
import { toast } from "sonner";

export default function SchedulePage() {
  const [settings, setSettings] = React.useState<MockAvailabilitySettings>(defaultAvailabilitySettings);

  // Handle save
  const handleSave = (newSettings: MockAvailabilitySettings) => {
    setSettings(newSettings);
    toast.success("Availability settings saved successfully!");
  };

  // Get active days count
  const activeDaysCount = React.useMemo(() => {
    const activeDays = new Set(
      settings.slots.filter((s) => s.isActive).map((s) => s.dayOfWeek)
    );
    return activeDays.size;
  }, [settings.slots]);

  // Get total hours per week
  const totalHoursPerWeek = React.useMemo(() => {
    let totalMinutes = 0;
    settings.slots.forEach((slot) => {
      if (!slot.isActive) return;
      const [startHour, startMin] = slot.startTime.split(":").map(Number);
      const [endHour, endMin] = slot.endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      totalMinutes += endMinutes - startMinutes;
    });
    return (totalMinutes / 60).toFixed(1);
  }, [settings.slots]);

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/bookings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Availability Schedule</h1>
              <p className="text-muted-foreground">
                Set when clients can book coaching calls with you
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeDaysCount}</p>
                  <p className="text-sm text-muted-foreground">Active days per week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalHoursPerWeek}h</p>
                  <p className="text-sm text-muted-foreground">Available hours per week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {settings.timezone.split("/")[1]?.replace("_", " ") || settings.timezone}
                  </p>
                  <p className="text-sm text-muted-foreground">Timezone</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Form */}
        <AvailabilityForm
          initialSettings={settings}
          onSave={handleSave}
        />

        {/* Tips Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Scheduling Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Buffer Time</h4>
                <p className="text-xs text-muted-foreground">
                  Add {settings.bufferTime} minutes between bookings to prepare notes and 
                  wrap up from previous calls without feeling rushed.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Daily Limits</h4>
                <p className="text-xs text-muted-foreground">
                  You have a limit of {settings.maxBookingsPerDay} bookings per day. 
                  This helps prevent burnout and ensures quality sessions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Time Zone</h4>
                <p className="text-xs text-muted-foreground">
                  Your schedule is shown in {settings.timezone}. Clients will see 
                  times converted to their local timezone automatically.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Blocking Days</h4>
                <p className="text-xs text-muted-foreground">
                  Need a day off? Simply remove all slots for that day or toggle them 
                  off to temporarily block bookings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
