"use client";

import * as React from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { Calendar, Clock, DollarSign, ExternalLink, Mail, User, Video, MoreVertical, Check, X, CalendarClock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MockBooking, BookingStatus } from "@/lib/mock-data/bookings";
import { useHydrated } from "@/components/providers/HydrationProvider";

interface BookingCardProps {
  booking: MockBooking;
  onAccept?: (booking: MockBooking) => void;
  onDecline?: (booking: MockBooking) => void;
  onReschedule?: (booking: MockBooking) => void;
  onViewDetails?: (booking: MockBooking) => void;
  compact?: boolean;
}

const statusConfig: Record<BookingStatus, { color: string; bgColor: string; borderColor: string }> = {
  pending: {
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  confirmed: {
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  completed: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

export function BookingCard({
  booking,
  onAccept,
  onDecline,
  onReschedule,
  onViewDetails,
  compact = false,
}: BookingCardProps) {
  const mounted = useHydrated();

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const statusStyle = statusConfig[booking.status];

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date display
  const getDateDisplay = () => {
    if (isToday(startDate)) return "Today";
    if (isTomorrow(startDate)) return "Tomorrow";
    return format(startDate, "EEE, MMM d");
  };

  // Calculate duration
  const getDuration = () => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors",
          statusStyle.borderColor,
          booking.status === "cancelled" && "opacity-60"
        )}
        onClick={() => onViewDetails?.(booking)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{booking.title}</p>
          <p className="text-xs text-muted-foreground">
            {mounted ? `${format(startDate, "h:mm a")} • ${getDuration()}` : <Skeleton className="h-3 w-20" />}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("text-[10px] px-1.5 capitalize", statusStyle.color)}
        >
          {booking.status}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden", statusStyle.borderColor, booking.status === "cancelled" && "opacity-60")}>
      <CardContent className="p-0">
        {/* Status Bar */}
        <div className={cn("h-1", statusStyle.bgColor.replace("50", "400").replace("950", "700"))} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{booking.title}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {getDateDisplay()}
                <span className="mx-1">•</span>
                <Clock className="h-3.5 w-3.5" />
                {mounted ? `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}` : <Skeleton className="h-4 w-28" />}
                <span className="text-muted-foreground/50">({getDuration()})</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("capitalize", statusStyle.color)}
              >
                {booking.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails?.(booking)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {booking.status === "pending" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAccept?.(booking)}>
                        <Check className="h-4 w-4 mr-2" />
                        Accept Booking
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDecline?.(booking)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline Booking
                      </DropdownMenuItem>
                    </>
                  )}
                  {(booking.status === "confirmed" || booking.status === "pending") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onReschedule?.(booking)}>
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                    </>
                  )}
                  {booking.meetingUrl && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Client Info */}
          <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(booking.client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{booking.client.name}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {booking.client.email}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{booking.client.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Description */}
          {booking.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {booking.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-green-600" />
              {booking.price.toFixed(2)}
            </div>
            {booking.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline?.(booking)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button size="sm" onClick={() => onAccept?.(booking)}>
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </div>
            )}
            {booking.meetingUrl && booking.status === "confirmed" && (
              <Button size="sm" asChild>
                <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-1" />
                  Join Meeting
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingCard;
