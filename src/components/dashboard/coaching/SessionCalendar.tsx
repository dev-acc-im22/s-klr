"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths,
  isSameDay
} from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/components/providers/HydrationProvider";

interface Session {
  id: string;
  scheduledAt: Date;
  status: string;
  title?: string;
  packageName?: string;
}

interface SessionCalendarProps {
  sessions?: Session[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  mode?: "view" | "select";
}

export function SessionCalendar({ 
  sessions = [], 
  selectedDate, 
  onDateSelect,
  mode = "view" 
}: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date | undefined>(selectedDate);
  const mounted = useHydrated();

  const days = React.useMemo(() => {
    if (!mounted) return [];
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth, mounted]);

  // Pad days to start from Sunday
  const paddedDays = React.useMemo(() => {
    if (!days.length) return [];
    const startDay = days[0].getDay();
    return Array(startDay).fill(null).concat(days);
  }, [days]);

  const sessionsByDate = React.useMemo(() => {
    const map = new Map<string, Session[]>();
    sessions.forEach((session) => {
      const dateKey = format(session.scheduledAt, "yyyy-MM-dd");
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, session]);
    });
    return map;
  }, [sessions]);

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setInternalSelectedDate(new Date());
    onDateSelect?.(new Date());
  };

  const handleDateClick = (day: Date) => {
    setInternalSelectedDate(day);
    onDateSelect?.(day);
  };

  const activeSelectedDate = selectedDate ?? internalSelectedDate;

  if (!mounted) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base">
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {sessions.length} sessions scheduled
          </CardDescription>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddedDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = format(day, "yyyy-MM-dd");
            const daySessions = sessionsByDate.get(dateKey) || [];
            const isSelected = activeSelectedDate && isSameDay(day, activeSelectedDate);

            return (
              <button
                key={dateKey}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "aspect-square rounded-lg text-sm relative transition-colors flex flex-col items-center justify-center",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  isToday(day) && "bg-primary/10 font-semibold ring-1 ring-primary",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50"
                )}
              >
                <span>{format(day, "d")}</span>
                {daySessions.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {daySessions.slice(0, 3).map((session, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isSelected 
                            ? "bg-primary-foreground" 
                            : session.status === "completed" 
                              ? "bg-green-500" 
                              : session.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-primary"
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected date info */}
        {activeSelectedDate && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {format(activeSelectedDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sessionsByDate.get(format(activeSelectedDate, "yyyy-MM-dd"))?.length || 0} sessions
                </p>
              </div>
              {mode === "select" && (
                <Button size="sm">Add Session</Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
