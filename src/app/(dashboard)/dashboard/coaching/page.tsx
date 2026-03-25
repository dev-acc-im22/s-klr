'use client';

import { useState } from 'react';
import { Video, Clock, DollarSign, Calendar, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { mockCoachingPackages, mockCoachingSessions } from '@/lib/mock-data/features';
import { format } from 'date-fns';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function CoachingPage() {
  const { isGhostMode, mounted } = useGhostMode();
  const [activeTab, setActiveTab] = useState('sessions');

  const upcomingSessions = mockCoachingSessions.filter(s => 
    s.status === 'PENDING' || s.status === 'CONFIRMED'
  );
  const completedSessions = mockCoachingSessions.filter(s => 
    s.status === 'COMPLETED'
  );

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">1:1 Coaching</h1>
          <p className="text-muted-foreground">
            Manage your coaching sessions and strategy calls
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/coaching/schedule">
            <Plus className="mr-2 h-4 w-4" />
            New Package
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Video className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockCoachingSessions.reduce((acc, s) => acc + s.price, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCoachingPackages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4 mt-6">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming sessions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{session.title}</h3>
                          <Badge className={statusColors[session.status]}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.duration} min
                          </span>
                          <span>
                            {mounted ? format(session.scheduledAt, 'MMM d, yyyy h:mm a') : <Skeleton className="h-4 w-40 inline-block" />}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{session.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {session.meetingUrl && (
                          <Button asChild>
                            <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </a>
                          </Button>
                        )}
                        <Button variant="outline">Reschedule</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {completedSessions.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-8 mb-4">Past Sessions</h3>
              {completedSessions.map((session) => (
                <Card key={session.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          {mounted ? format(session.scheduledAt, 'MMM d, yyyy') : <Skeleton className="h-4 w-28 inline-block" />}
                        </div>
                      </div>
                      <Badge className={statusColors[session.status]}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {mockCoachingPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">
                      {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                    </span>
                    {pkg.price > 0 && <span className="text-muted-foreground">/session</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    {pkg.duration} minutes
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button className="flex-1">Share</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed flex items-center justify-center min-h-[200px]">
              <CardContent className="text-center">
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/coaching/schedule">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}
