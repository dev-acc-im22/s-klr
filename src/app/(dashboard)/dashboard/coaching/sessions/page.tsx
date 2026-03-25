"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { SessionCard } from "@/components/dashboard/coaching/SessionCard";
import { SessionCalendar } from "@/components/dashboard/coaching/SessionCalendar";
import { SessionNotes } from "@/components/dashboard/coaching/SessionNotes";
import {
  upcomingSessions,
  completedSessions,
  getAllSessions,
  type CoachingSession,
} from "@/lib/mock-data/coaching";
import { cn } from "@/lib/utils";

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedSession, setSelectedSession] = React.useState<CoachingSession | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list");

  const allSessions = getAllSessions();

  const filteredSessions = allSessions.filter((session) => {
    const matchesSearch =
      session.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingSessions = filteredSessions.filter((s) => s.status === "pending");
  const confirmedSessions = filteredSessions.filter((s) => s.status === "confirmed");
  const completedFilteredSessions = filteredSessions.filter((s) => s.status === "completed");

  return (
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
              <h1 className="text-2xl font-bold tracking-tight">All Sessions</h1>
              <p className="text-muted-foreground">
                Manage your coaching sessions
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, email, or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{allSessions.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{pendingSessions.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-xl font-bold">{confirmedSessions.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{completedFilteredSessions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content */}
        {viewMode === "calendar" ? (
          <Card>
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
              <CardDescription>View and manage your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionCalendar
                sessions={allSessions}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                mode="view"
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedFilteredSessions.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({filteredSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <ScrollArea className="max-h-[600px]">
                <div className="grid gap-4 md:grid-cols-2 pr-4">
                  {upcomingSessions
                    .filter((s) => {
                      if (statusFilter !== "all" && s.status !== statusFilter) return false;
                      if (searchQuery) {
                        return (
                          s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.packageName.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                      }
                      return true;
                    })
                    .map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onViewDetails={() => setSelectedSession(session)}
                        onAddNotes={() => setSelectedSession(session)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="completed">
              <ScrollArea className="max-h-[600px]">
                <div className="grid gap-4 md:grid-cols-2 pr-4">
                  {completedFilteredSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onViewDetails={() => setSelectedSession(session)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="all">
              <ScrollArea className="max-h-[600px]">
                <div className="grid gap-4 md:grid-cols-2 pr-4">
                  {filteredSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onViewDetails={() => setSelectedSession(session)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        {/* Session Detail Dialog */}
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedSession && (
              <>
                <DialogHeader>
                  <DialogTitle>Session Details</DialogTitle>
                  <DialogDescription>
                    {selectedSession.packageName} with {selectedSession.clientName}
                  </DialogDescription>
                </DialogHeader>
                <SessionNotes
                  session={selectedSession}
                  onSave={(data) => {
                    console.log("Saving notes:", data);
                    setSelectedSession(null);
                  }}
                  onMarkComplete={() => {
                    console.log("Marking complete");
                    setSelectedSession(null);
                  }}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
