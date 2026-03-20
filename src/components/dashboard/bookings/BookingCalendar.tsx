"use client";

import * as React from "react";
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { MockBooking, BookingStatus } from "@/lib/mock-data/bookings";
import { useHydrated } from "@/components/providers/HydrationProvider";

interface BookingCalendarProps {
  bookings: MockBooking[];
  onDateSelect?: (date: Date) => void;
  onBookingSelect?: (booking: MockBooking) => void;
  selectedDate?: Date;
  statusFilter?: string;
}

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-400",
};

export function BookingCalendar({
  bookings,
  onDateSelect,
  onBookingSelect,
  selectedDate,
  statusFilter = "all",
}: BookingCalendarProps) {
  const mounted = useHydrated();

  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">("calendar");
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(selectedDate || null);

  // Filter bookings by status
  const filteredBookings = React.useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter((booking) => isSameDay(new Date(booking.startTime), date));
  };

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const startDay = monthStart.getDay();

  // Generate calendar grid with padding for days before month start
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  days.forEach((day) => calendarDays.push(day));

  // Navigate months
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
    onDateSelect?.(new Date());
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    onDateSelect?.(date);
  };

  // Get bookings for selected day
  const selectedDayBookings = selectedDay ? getBookingsForDate(selectedDay) : [];

  // Sort list view bookings by date
  const sortedBookings = React.useMemo(() => {
    return [...filteredBookings].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [filteredBookings]);

  // Show skeleton while mounting to avoid hydration mismatch
  if (!mounted) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Booking Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
              <TabsList className="h-8">
                <TabsTrigger value="calendar" className="h-7 px-2">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="h-7 px-2">
                  <List className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="h-20 sm:h-24" />;
                  }

                  const dayBookings = getBookingsForDate(day);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const isCurrentDay = isToday(day);

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "h-20 sm:h-24 p-1 rounded-lg border transition-colors hover:bg-accent",
                        "flex flex-col items-start justify-start text-left",
                        isSelected && "border-primary bg-primary/5",
                        isCurrentDay && "ring-2 ring-primary ring-offset-1",
                        !isSameMonth(day, currentMonth) && "opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium mb-1",
                          isCurrentDay && "text-primary"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      <div className="flex flex-wrap gap-0.5 w-full">
                        {dayBookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full flex-shrink-0",
                              statusColors[booking.status]
                            )}
                            title={`${booking.title} - ${booking.status}`}
                          />
                        ))}
                        {dayBookings.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayBookings.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", color)} />
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Day Details */}
            <div className="border rounded-lg p-4 h-fit">
              <h4 className="font-medium mb-3">
                {selectedDay ? format(selectedDay, "EEEE, MMMM d, yyyy") : "Select a day"}
              </h4>
              {selectedDayBookings.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedDayBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => onBookingSelect?.(booking)}
                      className="w-full text-left p-2 rounded-md border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{booking.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.startTime), "h:mm a")} -{" "}
                            {format(new Date(booking.endTime), "h:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {booking.client.name}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 capitalize flex-shrink-0",
                            booking.status === "pending" && "border-yellow-500 text-yellow-700",
                            booking.status === "confirmed" && "border-blue-500 text-blue-700",
                            booking.status === "completed" && "border-green-500 text-green-700",
                            booking.status === "cancelled" && "border-red-400 text-red-600"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : selectedDay ? (
                <p className="text-sm text-muted-foreground">No bookings for this day</p>
              ) : null}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {sortedBookings.length > 0 ? (
              sortedBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => onBookingSelect?.(booking)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{booking.title}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 capitalize flex-shrink-0",
                            booking.status === "pending" && "border-yellow-500 text-yellow-700",
                            booking.status === "confirmed" && "border-blue-500 text-blue-700",
                            booking.status === "completed" && "border-green-500 text-green-700",
                            booking.status === "cancelled" && "border-red-400 text-red-600"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startTime), "EEE, MMM d")} •{" "}
                        {format(new Date(booking.startTime), "h:mm a")} -{" "}
                        {format(new Date(booking.endTime), "h:mm a")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.client.name} • ${booking.price}
                      </p>
                    </div>
                    {isToday(new Date(booking.startTime)) && (
                      <Badge variant="default" className="flex-shrink-0">
                        Today
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No bookings found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingCalendar;
