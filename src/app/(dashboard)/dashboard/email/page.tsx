'use client';

import { useState } from 'react';
import { Mail, Users, Send, FileText, TrendingUp, Plus, Download, Upload, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGhostMode } from '@/hooks/useGhostMode';

import { mockSubscribers, mockCampaigns } from '@/lib/mock-data/email';
import { format } from 'date-fns';

export default function EmailPage() {
  const { isGhostMode, mounted } = useGhostMode();
  const [activeTab, setActiveTab] = useState('overview');

  const totalSubscribers = mockSubscribers.length;
  const avgOpenRate = mockCampaigns
    .filter(c => c.status === 'SENT')
    .reduce((acc, c) => acc + (c.openCount / c.recipientCount), 0) / mockCampaigns.filter(c => c.status === 'SENT').length * 100;
  const avgClickRate = mockCampaigns
    .filter(c => c.status === 'SENT')
    .reduce((acc, c) => acc + (c.clickCount / c.recipientCount), 0) / mockCampaigns.filter(c => c.status === 'SENT').length * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">
            Build your audience and send newsletters
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/email/templates">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button asChild>
            <Link href="/dashboard/email/compose">
              <Plus className="mr-2 h-4 w-4" />
              Compose Email
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-green-600">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">+2.3% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4" />
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">+0.8% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Campaign
                </CardTitle>
                <CardDescription>
                  Send a newsletter to your subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/email/compose">Compose Email</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grow Your List
                </CardTitle>
                <CardDescription>
                  Add a signup form to your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Get Embed Code
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{campaign.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.status === 'SENT' && (mounted ? `Sent ${format(new Date(campaign.sentAt!), 'MMM d')}` : <Skeleton className="h-4 w-20 inline-block" />)}
                        {campaign.status === 'SCHEDULED' && (mounted ? `Scheduled ${format(new Date(campaign.scheduledAt!), 'MMM d')}` : <Skeleton className="h-4 w-24 inline-block" />)}
                        {campaign.status === 'DRAFT' && 'Draft'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={campaign.status === 'SENT' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'SENT' && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {((campaign.openCount / campaign.recipientCount) * 100).toFixed(0)}% opened
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Subscribers</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input placeholder="Search subscribers..." />
              </div>
              <div className="space-y-2">
                {mockSubscribers.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {sub.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-sm text-muted-foreground">{sub.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={sub.isActive ? 'default' : 'secondary'}>
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {mounted ? format(sub.subscribedAt, 'MMM d, yyyy') : <Skeleton className="h-4 w-24 inline-block" />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          {/* Draft Campaigns */}
          {mockCampaigns.filter(c => c.status === 'DRAFT').length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Draft Emails
                  </CardTitle>
                  <Badge variant="secondary">
                    {mockCampaigns.filter(c => c.status === 'DRAFT').length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCampaigns
                    .filter(c => c.status === 'DRAFT')
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{campaign.subject}</div>
                            <div className="text-xs text-muted-foreground">
                              Draft • Last edited {mounted ? format(new Date(campaign.createdAt), 'MMM d, yyyy') : <Skeleton className="h-3 w-20 inline-block" />}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href="/dashboard/email/compose">Edit</Link>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scheduled Campaigns */}
          {mockCampaigns.filter(c => c.status === 'SCHEDULED').length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Scheduled
                  </CardTitle>
                  <Badge variant="secondary">
                    {mockCampaigns.filter(c => c.status === 'SCHEDULED').length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCampaigns
                    .filter(c => c.status === 'SCHEDULED')
                    .map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{campaign.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {mounted && campaign.scheduledAt ? `Scheduled for ${format(new Date(campaign.scheduledAt), 'MMM d, yyyy \'at\' h:mm a')}` : <Skeleton className="h-4 w-32 inline-block" />}
                          </div>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{campaign.subject}</h3>
                        <Badge variant="secondary" className="mt-2">{campaign.status}</Badge>
                      </div>
                      {campaign.status === 'SENT' && (
                        <div className="text-right">
                          <div className="text-sm">
                            <span className="font-medium">{campaign.openCount}</span>
                            <span className="text-muted-foreground"> / {campaign.recipientCount} opened</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.clickCount} clicks
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  );
}
