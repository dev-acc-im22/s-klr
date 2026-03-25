"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  User,
  Video,
  FileText,
  Check,
  X,
  CalendarClock,
  ExternalLink,
  Copy,
  MapPin,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { getMockBookingById, type MockBooking, type BookingStatus } from "@/lib/mock-data/bookings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<BookingStatus, { color: string; bgColor: string; label: string }> = {
  pending: {
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Pending Confirmation",
  },
  confirmed: {
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "Confirmed",
  },
  completed: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "Completed",
  },
  cancelled: {
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    label: "Cancelled",
  },
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Get booking by ID
  const booking = React.useMemo(() => {
    const id = params.id as string;
    return getMockBookingById(id);
  }, [params.id]);

  // If booking not found
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Calendar className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Booking Not Found</h2>
        <p className="text-muted-foreground">
          The booking you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
      </div>
    );
  }

  const statusStyle = statusConfig[booking.status];
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  // Calculate duration
  const getDuration = () => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours} hour ${mins} minutes` : `${hours} hour`;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle actions
  const handleAccept = () => {
    toast.success("Booking accepted! The client has been notified.");
    router.push("/dashboard/bookings");
  };

  const handleDecline = () => {
    toast.success("Booking declined. The client has been notified.");
    router.push("/dashboard/bookings");
  };

  const handleReschedule = () => {
    toast.info("Reschedule feature coming soon!");
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("Notes saved successfully!");
  };

  const handleCopyMeetingLink = () => {
    if (booking.meetingUrl) {
      navigator.clipboard.writeText(booking.meetingUrl);
      toast.success("Meeting link copied to clipboard!");
    }
  };

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
              <h1 className="text-2xl font-bold tracking-tight">{booking.title}</h1>
              <p className="text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-sm px-3 py-1", statusStyle.color, statusStyle.bgColor)}
          >
            {statusStyle.label}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>
                  Information about this coaching session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{mounted ? format(startDate, "EEEE, MMMM d, yyyy") : <Skeleton className="h-5 w-40" />}</p>
                      <p className="text-sm text-muted-foreground">
                        {mounted ? `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}` : <Skeleton className="h-4 w-28" />}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{getDuration()}</p>
                      <p className="text-sm text-muted-foreground">Session duration</p>
                    </div>
                  </div>
                </div>

                {/* Timezone */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{booking.timezone}</p>
                    <p className="text-sm text-muted-foreground">Session timezone</p>
                  </div>
                </div>

                {/* Description */}
                {booking.description && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm">{booking.description}</p>
                  </div>
                )}

                {/* Meeting Link */}
                {booking.meetingUrl ? (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Meeting Link</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex-1 truncate"
                      >
                        {booking.meetingUrl}
                      </a>
                      <Button variant="ghost" size="icon" onClick={handleCopyMeetingLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" asChild>
                        <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                          Join
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed text-center">
                    <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Meeting link will be generated once booking is confirmed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Session Notes
                </CardTitle>
                <CardDescription>
                  Add notes for this session (only visible to you)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add notes about this session, topics to discuss, follow-ups, etc."
                  value={notes || booking.notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotes} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Notes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(booking.client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{booking.client.name}</p>
                    <a
                      href={`mailto:${booking.client.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {booking.client.email}
                    </a>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Session Price</span>
                    <span className="font-semibold text-lg flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {booking.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Booked On</span>
                    <span className="text-sm">
                      {mounted ? format(new Date(booking.createdAt), "MMM d, yyyy") : <Skeleton className="h-4 w-24" />}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.status === "pending" && (
                  <>
                    <Button className="w-full" onClick={handleAccept}>
                      <Check className="h-4 w-4 mr-2" />
                      Accept Booking
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <X className="h-4 w-4 mr-2" />
                          Decline Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Decline Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to decline this booking? The client will be notified
                            and the time slot will become available again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDecline} className="bg-destructive text-destructive-foreground">
                            Decline
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}

                {(booking.status === "confirmed" || booking.status === "pending") && (
                  <Button variant="outline" className="w-full" onClick={handleReschedule}>
                    <CalendarClock className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                )}

                {booking.status === "confirmed" && booking.meetingUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </a>
                  </Button>
                )}

                {booking.status === "completed" && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 text-center">
                    <Check className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Session Completed
                    </p>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 text-center">
                    <X className="h-6 w-6 mx-auto text-red-600 mb-2" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Session Cancelled
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
