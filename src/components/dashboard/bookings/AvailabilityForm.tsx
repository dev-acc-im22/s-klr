"use client";

import * as React from "react";
import { Clock, Plus, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  type MockAvailabilitySlot,
  type MockAvailabilitySettings,
  dayNames,
  timezoneOptions,
} from "@/lib/mock-data/bookings";

interface AvailabilityFormProps {
  initialSettings?: MockAvailabilitySettings;
  onSave?: (settings: MockAvailabilitySettings) => void;
}

export function AvailabilityForm({ initialSettings, onSave }: AvailabilityFormProps) {
  const [settings, setSettings] = React.useState<MockAvailabilitySettings>(
    initialSettings || {
      timezone: "America/New_York",
      bufferTime: 15,
      maxBookingsPerDay: 5,
      slots: [],
    }
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Update a specific slot
  const updateSlot = (slotId: string, updates: Partial<MockAvailabilitySlot>) => {
    setSettings((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      ),
    }));
    setHasChanges(true);
  };

  // Add a new time slot for a day
  const addSlot = (dayOfWeek: number) => {
    const newSlot: MockAvailabilitySlot = {
      id: `slot-${Date.now()}-${dayOfWeek}`,
      dayOfWeek,
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    };
    setSettings((prev) => ({
      ...prev,
      slots: [...prev.slots, newSlot],
    }));
    setHasChanges(true);
  };

  // Remove a time slot
  const removeSlot = (slotId: string) => {
    setSettings((prev) => ({
      ...prev,
      slots: prev.slots.filter((slot) => slot.id !== slotId),
    }));
    setHasChanges(true);
  };

  // Toggle slot active state
  const toggleSlotActive = (slotId: string) => {
    setSettings((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
      ),
    }));
    setHasChanges(true);
  };

  // Update general settings
  const updateSettings = (updates: Partial<MockAvailabilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave?.(settings);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Get slots by day
  const getSlotsByDay = (dayOfWeek: number) => {
    return settings.slots.filter((slot) => slot.dayOfWeek === dayOfWeek);
  };

  // Group slots by day for display
  const daysWithSlots = React.useMemo(() => {
    const result: { dayOfWeek: number; slots: MockAvailabilitySlot[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const daySlots = getSlotsByDay(i);
      if (daySlots.length > 0) {
        result.push({ dayOfWeek: i, slots: daySlots });
      }
    }
    return result;
  }, [settings.slots]);

  // Check if a day has any active slots
  const isDayActive = (dayOfWeek: number) => {
    const slots = getSlotsByDay(dayOfWeek);
    return slots.some((slot) => slot.isActive);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">General Settings</CardTitle>
          <CardDescription>
            Configure your default availability preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSettings({ timezone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Bookings Per Day */}
            <div className="space-y-2">
              <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
              <Input
                id="maxBookings"
                type="number"
                min={1}
                max={20}
                value={settings.maxBookingsPerDay}
                onChange={(e) =>
                  updateSettings({ maxBookingsPerDay: parseInt(e.target.value) || 1 })
                }
              />
            </div>
          </div>

          {/* Buffer Time */}
          <div className="space-y-2">
            <Label htmlFor="bufferTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Buffer Time Between Bookings
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="bufferTime"
                type="number"
                min={0}
                max={60}
                step={5}
                value={settings.bufferTime}
                onChange={(e) =>
                  updateSettings({ bufferTime: parseInt(e.target.value) || 0 })
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add a buffer between consecutive bookings for preparation time
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Availability</CardTitle>
          <CardDescription>
            Set your available hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Day by Day Configuration */}
          {dayNames.map((day, index) => {
            const daySlots = getSlotsByDay(index);
            const hasActiveSlots = isDayActive(index);

            return (
              <div key={day} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium w-24">{day}</span>
                    {hasActiveSlots && (
                      <Badge variant="outline" className="text-xs">
                        {daySlots.filter((s) => s.isActive).length} slot(s)
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSlot(index)}
                    className="h-7"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Slot
                  </Button>
                </div>

                {daySlots.length > 0 ? (
                  <div className="space-y-2 pl-4">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "flex flex-wrap items-center gap-3 p-3 rounded-lg border",
                          !slot.isActive && "opacity-50 bg-muted/50"
                        )}
                      >
                        <Switch
                          checked={slot.isActive}
                          onCheckedChange={() => toggleSlotActive(slot.id)}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              updateSlot(slot.id, { startTime: e.target.value })
                            }
                            className="w-28 h-8"
                            disabled={!slot.isActive}
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              updateSlot(slot.id, { endTime: e.target.value })
                            }
                            className="w-28 h-8"
                            disabled={!slot.isActive}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSlot(slot.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pl-4">
                    No availability set for this day
                  </p>
                )}

                {index < 6 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between sticky bottom-4 bg-background p-4 rounded-lg border shadow-lg">
        <p className="text-sm text-muted-foreground">
          {hasChanges ? "You have unsaved changes" : "All changes saved"}
        </p>
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default AvailabilityForm;
