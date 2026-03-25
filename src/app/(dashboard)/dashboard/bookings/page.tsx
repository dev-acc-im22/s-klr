'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Video, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGhostMode } from '@/hooks/useGhostMode';
import { Skeleton } from '@/components/ui/skeleton';

import { mockBookings, mockAvailability } from '@/lib/mock-data/features';
import { format } from 'date-fns';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const statusIcons = {
  PENDING: AlertCircle,
  CONFIRMED: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingsPage() {
  const { isGhostMode, mounted } = useGhostMode();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingBookings = mockBookings.filter(b => 
    b.status === 'PENDING' || b.status === 'CONFIRMED'
  );
  const pastBookings = mockBookings.filter(b => 
    b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Bookings</h1>
          <p className="text-muted-foreground">
            Manage your coaching calls and appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/bookings/schedule">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Link>
          </Button>
          <Button asChild>
            <Link href="/demo">
              <Plus className="mr-2 h-4 w-4" />
              New Booking Type
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastBookings.filter(b => b.status === 'COMPLETED').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Video className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookings.filter(b => b.status === 'PENDING').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming bookings</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/bookings/schedule">Set Your Availability</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status];
                return (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Date Box */}
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 rounded-lg p-3 text-center min-w-[70px]">
                            <div className="text-sm font-medium text-primary">
                              {mounted ? format(booking.startTime, 'MMM') : <Skeleton className="h-4 w-8 mx-auto" />}
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {mounted ? format(booking.startTime, 'd') : <Skeleton className="h-7 w-6 mx-auto" />}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {mounted ? format(booking.startTime, 'EEE') : <Skeleton className="h-3 w-8 mx-auto" />}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{booking.title}</h3>
                            <p className="text-sm text-muted-foreground">{booking.description}</p>
                          </div>
                        </div>

                        <div className="flex-1 md:text-right">
                          <div className="flex items-center gap-2 md:justify-end mb-2">
                            <Badge className={statusColors[booking.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {mounted ? `${format(booking.startTime, 'h:mm a')} - ${format(booking.endTime, 'h:mm a')}` : <Skeleton className="h-4 w-28 inline-block" />}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.meetingUrl && (
                            <Button variant="outline" asChild>
                              <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost">Reschedule</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastBookings.map((booking) => {
            const StatusIcon = statusIcons[booking.status];
            return (
              <Card key={booking.id} className="opacity-80">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted rounded-lg p-3 text-center min-w-[70px]">
                        <div className="text-sm font-medium text-muted-foreground">
                          {mounted ? format(booking.startTime, 'MMM') : <Skeleton className="h-4 w-8 mx-auto" />}
                        </div>
                        <div className="text-2xl font-bold">
                          {mounted ? format(booking.startTime, 'd') : <Skeleton className="h-7 w-6 mx-auto" />}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{booking.title}</h3>
                        <Badge className={statusColors[booking.status] + ' mt-1'}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="flex-1 md:text-right">
                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Weekly Availability</CardTitle>
              <CardDescription>
                Set when you're available for bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAvailability.map((slot) => (
                  <div
                    key={slot.dayOfWeek}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-medium w-12">{dayNames[slot.dayOfWeek]}</div>
                      <Badge variant="secondary">
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/bookings/schedule">
                  Manage Availability
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  );
}
