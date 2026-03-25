'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  loading?: boolean;
}

function StatCard({ title, value, change, icon, iconBg, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(change)}% from last period
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AffiliateStats {
  totalAffiliates: number;
  activeAffiliates: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  pendingPayouts: number;
  paidOut: number;
  avgEarningsPerAffiliate: number;
  clicksThisMonth: number;
  conversionsThisMonth: number;
  earningsThisMonth: number;
}

interface TopAffiliate {
  id: string;
  code: string;
  name: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

interface TrendData {
  date: string;
  clicks?: number;
  conversions?: number;
  earnings?: number;
}

export function AffiliateStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [topAffiliates, setTopAffiliates] = useState<TopAffiliate[]>([]);
  const [clickTrends, setClickTrends] = useState<TrendData[]>([]);
  const [conversionTrends, setConversionTrends] = useState<TrendData[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/affiliates/stats');
        const data = await response.json();
        setStats(data.stats);
        setTopAffiliates(data.topAffiliates);
        setClickTrends(data.clickTrends);
        setConversionTrends(data.conversionTrends);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Affiliates"
          value={stats?.totalAffiliates || 0}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100"
          loading={loading}
        />
        <StatCard
          title="Total Clicks"
          value={stats?.totalClicks?.toLocaleString() || 0}
          change={12.5}
          icon={<MousePointer className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
          loading={loading}
        />
        <StatCard
          title="Conversions"
          value={stats?.totalConversions || 0}
          change={8.2}
          icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100"
          loading={loading}
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings?.toFixed(2) || '0.00'}`}
          change={15.3}
          icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
          iconBg="bg-yellow-100"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">${stats?.pendingPayouts?.toFixed(2) || '0.00'}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Earnings/Affiliate</p>
                <p className="text-2xl font-bold">${stats?.avgEarningsPerAffiliate?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="clicks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clicks">Click Trends</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clicks">
          <Card>
            <CardHeader>
              <CardTitle>Click Trends</CardTitle>
              <CardDescription>Affiliate link clicks over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clickTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Trends</CardTitle>
              <CardDescription>Sales and earnings over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="conversions" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Affiliates */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Affiliates</CardTitle>
          <CardDescription>Your highest earning affiliates this month</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topAffiliates.map((affiliate, index) => (
                <div 
                  key={affiliate.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{affiliate.name}</p>
                      <p className="text-sm text-muted-foreground">{affiliate.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-medium">{affiliate.clicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Conv.</p>
                      <p className="font-medium">{affiliate.conversions}</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-muted-foreground">Earnings</p>
                      <p className="font-bold text-green-600">${affiliate.earnings.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
