'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  Send, 
  MessageSquare, 
  Zap, 
  Users, 
  TrendingUp, 
  Plus, 
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';

interface Automation {
  id: string;
  name: string;
  triggerType: string;
  keywords: string | null;
  message: string;
  delay: number;
  isActive: boolean;
  sentCount: number;
  createdAt: string;
}

interface Activity {
  id: string;
  automationName: string;
  recipient: string;
  sentAt: Date;
  status: string;
}

interface Stats {
  activeAutomations: number;
  dmsSentThisMonth: number;
  responseRate: number;
  newFollowersReached: number;
}

const triggerTypeLabels: Record<string, { label: string; icon: typeof Instagram }> = {
  NEW_FOLLOWER: { label: 'New Follower', icon: Users },
  KEYWORD_MENTION: { label: 'Keyword Mention', icon: MessageSquare },
  STORY_REPLY: { label: 'Story Reply', icon: Instagram },
  COMMENT: { label: 'Comment on Post', icon: MessageSquare },
};

export default function InstagramAutoDMsPage() {
  const { isGhostMode, mounted } = useGhostMode();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/instagram/automations');
        const data = await response.json();
        setAutomations(data.automations);
        setActivity(data.activity);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch automations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/instagram/automations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      setAutomations(automations.map(auto => 
        auto.id === id ? { ...auto, isActive: !currentStatus } : auto
      ));
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/instagram/automations/${id}`, {
        method: 'DELETE',
      });
      
      setAutomations(automations.filter(auto => auto.id !== id));
    } catch (error) {
      console.error('Failed to delete automation:', error);
    }
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Instagram className="h-7 w-7 text-pink-500" />
              Instagram AutoDMs
            </h1>
            <p className="text-muted-foreground">
              Automate direct messages to your Instagram followers
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/instagram/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Active Automations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeAutomations || 0}</div>
                  <p className="text-xs text-muted-foreground">Running now</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Send className="h-4 w-4" />
                DMs Sent This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.dmsSentThisMonth || 0}</div>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
                  <p className="text-xs text-green-600">Above average</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                New Followers Reached
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.newFollowersReached || 0}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Automation Rules List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>
                  Manage your automated DM responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-6 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : automations.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No automations yet</h3>
                    <p className="text-muted-foreground mt-2">
                      Create your first automation to start engaging with followers
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/instagram/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Automation
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {automations.map((automation) => {
                      const triggerInfo = triggerTypeLabels[automation.triggerType] || { label: automation.triggerType, icon: MessageSquare };
                      const TriggerIcon = triggerInfo.icon;
                      
                      return (
                        <div 
                          key={automation.id} 
                          className={`p-4 border rounded-lg transition-opacity ${!automation.isActive ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{automation.name}</h3>
                                <Badge variant={automation.isActive ? 'default' : 'secondary'}>
                                  {automation.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <TriggerIcon className="h-3.5 w-3.5" />
                                  {triggerInfo.label}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Send className="h-3.5 w-3.5" />
                                  {automation.sentCount} sent
                                </span>
                                {automation.delay > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {automation.delay}min delay
                                  </span>
                                )}
                              </div>
                              {automation.keywords && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {JSON.parse(automation.keywords).map((keyword: string) => (
                                    <Badge key={keyword} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={automation.isActive}
                                onCheckedChange={() => handleToggleActive(automation.id, automation.isActive)}
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/instagram/${automation.id}`}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDelete(automation.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest automated DMs sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activity.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activity.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <Instagram className="h-4 w-4 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.recipient}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.automationName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mounted ? formatDistanceToNow(new Date(item.sentAt), { addSuffix: true }) : ''}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Sent
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
