"use client";

import * as React from "react";
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns";
import { Calendar, Clock, Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookingCard } from "./BookingCard";
import type { MockBooking } from "@/lib/mock-data/bookings";

interface BookingListProps {
  bookings: MockBooking[];
  onBookingSelect?: (booking: MockBooking) => void;
  onAccept?: (booking: MockBooking) => void;
  onDecline?: (booking: MockBooking) => void;
  onReschedule?: (booking: MockBooking) => void;
  showFilters?: boolean;
 groupByDate?: boolean;
 compact?: boolean;
}

type SortOption = "date_asc" | "date_desc" | "price_asc" | "price_desc";

export function BookingList({
  bookings,
  onBookingSelect,
  onAccept,
  onDecline,
  onReschedule,
  showFilters = true,
  groupByDate = true,
  compact = false,
}: BookingListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("date_asc");
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(["today", "upcoming"]));

  // Filter and sort bookings
  const filteredBookings = React.useMemo(() => {
    let result = [...bookings];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.client.name.toLowerCase().includes(query) ||
          b.client.email.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case "date_desc":
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, statusFilter, searchQuery, sortBy]);

  // Group bookings by date category
  const groupedBookings = React.useMemo(() => {
    if (!groupByDate) {
      return { all: filteredBookings };
    }

    const groups: Record<string, MockBooking[]> = {
      today: [],
      tomorrow: [],
      upcoming: [],
      past: [],
    };

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    filteredBookings.forEach((booking) => {
      const bookingDate = new Date(booking.startTime);
      
      if (isToday(bookingDate)) {
        groups.today.push(booking);
      } else if (isTomorrow(bookingDate)) {
        groups.tomorrow.push(booking);
      } else if (isFuture(bookingDate)) {
        groups.upcoming.push(booking);
      } else {
        groups.past.push(booking);
      }
    });

    return groups;
  }, [filteredBookings, groupByDate]);

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  // Get group title and count
  const getGroupInfo = (group: string) => {
    const counts: Record<string, { title: string; icon: React.ReactNode }> = {
      today: { title: "Today", icon: <Calendar className="h-4 w-4" /> },
      tomorrow: { title: "Tomorrow", icon: <Calendar className="h-4 w-4" /> },
      upcoming: { title: "Upcoming", icon: <Clock className="h-4 w-4" /> },
      past: { title: "Past", icon: <Clock className="h-4 w-4" /> },
      all: { title: "All Bookings", icon: <Calendar className="h-4 w-4" /> },
    };
    return counts[group] || counts.all;
  };

  // Count bookings by status
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All ({statusCounts.all})
              </SelectItem>
              <SelectItem value="pending">
                Pending ({statusCounts.pending})
              </SelectItem>
              <SelectItem value="confirmed">
                Confirmed ({statusCounts.confirmed})
              </SelectItem>
              <SelectItem value="completed">
                Completed ({statusCounts.completed})
              </SelectItem>
              <SelectItem value="cancelled">
                Cancelled ({statusCounts.cancelled})
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_asc">Date (Earliest)</SelectItem>
              <SelectItem value="date_desc">Date (Latest)</SelectItem>
              <SelectItem value="price_asc">Price (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Booking Groups */}
      {Object.entries(groupedBookings).map(([group, groupBookings]) => {
        if (groupBookings.length === 0) return null;

        const info = getGroupInfo(group);
        const isExpanded = expandedGroups.has(group);
        const todayCount = group === "today" ? groupBookings.filter(b => b.status !== "cancelled").length : 0;

        return (
          <Collapsible
            key={group}
            open={isExpanded}
            onOpenChange={() => toggleGroup(group)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto py-2 px-3 hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  {info.icon}
                  <span className="font-medium">{info.title}</span>
                  <Badge variant="secondary" className="ml-1">
                    {groupBookings.length}
                  </Badge>
                  {group === "today" && todayCount > 0 && (
                    <Badge className="ml-1 bg-primary">
                      {todayCount} active
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className={cn(
                "grid gap-3 pt-2",
                compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {groupBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    compact={compact}
                    onViewDetails={onBookingSelect}
                    onAccept={onAccept}
                    onDecline={onDecline}
                    onReschedule={onReschedule}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Bookings will appear here once scheduled"}
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingList;
