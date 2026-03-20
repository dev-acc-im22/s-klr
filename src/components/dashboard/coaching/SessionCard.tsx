"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Clock, Calendar, MoreVertical, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/components/providers/HydrationProvider";

interface SessionCardProps {
  session: {
    id: string;
    title?: string;
    packageName?: string;
    clientName: string;
    clientEmail?: string;
    clientAvatar?: string;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "UPCOMING" | "COMPLETED" | "CANCELLED";
    scheduledAt: Date;
    duration: number;
    price: number;
    meetingUrl?: string;
    notes?: string;
    recordingUrl?: string;
  };
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
  onAddNotes?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  UPCOMING: { label: "Upcoming", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export function SessionCard({
  session,
  onJoin,
  onReschedule,
  onCancel,
  onViewDetails,
  onAddNotes,
}: SessionCardProps) {
  const mounted = useHydrated();

  const normalizedStatus = session.status.toLowerCase() as "pending" | "confirmed" | "completed" | "cancelled";
  const statusInfo = statusConfig[session.status] || statusConfig[normalizedStatus] || statusConfig.pending;
  
  const isUpcoming = normalizedStatus === "pending" || normalizedStatus === "confirmed";
  const isPast = normalizedStatus === "completed" || normalizedStatus === "cancelled";
  const title = session.title || session.packageName || "Coaching Session";

  return (
    <Card className={cn("transition-all hover:shadow-md", isPast && "opacity-75")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{title}</h3>
              <Badge className={cn("shrink-0", statusInfo.className)}>
                {statusInfo.label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              with {session.clientName}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {mounted ? format(session.scheduledAt, "MMM d") : <Skeleton className="h-4 w-12" />}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mounted ? format(session.scheduledAt, "h:mm a") : <Skeleton className="h-4 w-16" />}
              </div>
              <span>{session.duration} min</span>
            </div>

            {session.notes && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {session.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-lg font-bold">${session.price}</div>
            
            {isUpcoming && session.meetingUrl && (
              <Button size="sm" onClick={onJoin}>
                <Video className="h-4 w-4 mr-1" />
                Join
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewDetails}>
                  View Details
                </DropdownMenuItem>
                {onAddNotes && (
                  <DropdownMenuItem onClick={onAddNotes}>
                    Add Notes
                  </DropdownMenuItem>
                )}
                {isUpcoming && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onReschedule}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCancel} className="text-destructive">
                      Cancel Session
                    </DropdownMenuItem>
                  </>
                )}
                {session.recordingUrl && (
                  <DropdownMenuItem asChild>
                    <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Recording
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
