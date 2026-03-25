'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, TrendingUp, Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface WaitlistStatsProps {
  creatorId?: string;
  productId?: string;
  courseId?: string;
  ghostMode?: boolean;
}

interface Stats {
  totalCount: number;
  notifiedCount: number;
  pendingNotification: number;
  conversionRate: number;
  bySource: Array<{ source: string; count: number }>;
  signupsByDay: Array<{ date: string; count: number }>;
  byProduct: Array<{ productId: string; count: number }>;
  byCourse: Array<{ courseId: string; count: number }>;
}

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#dc2626', '#9333ea', '#0891b2'];

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direct',
  SOCIAL: 'Social Media',
  REFERRAL: 'Referral',
  EMAIL: 'Email',
  ADS: 'Ads',
  OTHER: 'Other',
};

// Mock data for ghost mode
const mockStats: Stats = {
  totalCount: 847,
  notifiedCount: 623,
  pendingNotification: 224,
  conversionRate: 12.5,
  bySource: [
    { source: 'DIRECT', count: 312 },
    { source: 'SOCIAL', count: 245 },
    { source: 'REFERRAL', count: 156 },
    { source: 'EMAIL', count: 89 },
    { source: 'ADS', count: 45 },
  ],
  signupsByDay: [
    { date: '2024-01-15', count: 24 },
    { date: '2024-01-16', count: 35 },
    { date: '2024-01-17', count: 28 },
    { date: '2024-01-18', count: 42 },
    { date: '2024-01-19', count: 38 },
    { date: '2024-01-20', count: 56 },
    { date: '2024-01-21', count: 67 },
  ],
  byProduct: [],
  byCourse: [],
};

export function WaitlistStats({
  productId,
  courseId,
  ghostMode = false,
}: WaitlistStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchStats = async () => {
      if (ghostMode) {
        setStats(mockStats);
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (productId) params.set('productId', productId);
        if (courseId) params.set('courseId', courseId);

        const response = await fetch(`/api/waitlist/stats?${params}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [productId, courseId, ghostMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No stats available
        </CardContent>
      </Card>
    );
  }

  const notificationProgress = stats.totalCount > 0
    ? (stats.notifiedCount / stats.totalCount) * 100
    : 0;

  const pieData = stats.bySource.map((s) => ({
    name: SOURCE_LABELS[s.source] || s.source,
    value: s.count,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              People on your waitlist
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notified</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notifiedCount.toLocaleString()}</div>
            <Progress value={notificationProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(notificationProgress)}% notified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Notification</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingNotification.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting launch email
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Waitlist to customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Signups Over Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Signups Over Time</CardTitle>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.signupsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => value.split('-').slice(1).join('/')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => value}
                    formatter={(value: number) => [value, 'Signups']}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{entry.name}:</span>
                  <span className="font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
