'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useGhostMode } from '@/hooks/useGhostMode';
import {
  mockAnalytics,
  mockGeographicData,
  mockTrafficSources,
  mockDeviceBreakdown,
  mockTopPages,
  mockRevenueByProduct,
  mockConversionFunnel,
} from '@/lib/mock-data/orders';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Import new analytics components
import { GeographicChart } from '@/components/dashboard/analytics/GeographicChart';
import { TrafficSourcesChart } from '@/components/dashboard/analytics/TrafficSourcesChart';
import { DeviceBreakdownChart } from '@/components/dashboard/analytics/DeviceBreakdownChart';
import { TopPagesChart } from '@/components/dashboard/analytics/TopPagesChart';
import { RevenueByProductChart } from '@/components/dashboard/analytics/RevenueByProductChart';
import { ConversionFunnel } from '@/components/dashboard/analytics/ConversionFunnel';

export default function AnalyticsPage() {
  const { isGhostMode } = useGhostMode();
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!isGhostMode) {
        try {
          const res = await fetch(`/api/analytics?range=${timeRange}`);
          const data = await res.json();
          if (data.analytics) {
            setAnalytics(data.analytics);
          }
        } catch (error) {
          console.error('Failed to load analytics:', error);
        }
      }
    };

    loadAnalytics();
  }, [isGhostMode, timeRange]);

  const overview = analytics.overview;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Track your store performance and insights
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {overview.revenueGrowth}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalOrders}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {overview.ordersGrowth}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalCustomers}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {overview.customersGrowth}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg. Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(overview.averageOrderValue)}</div>
              <div className="text-sm text-muted-foreground mt-1">Per order average</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Revenue & Visitors */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.revenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Visitors Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.visitors}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [value, 'Visitors']}
                    />
                    <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <ConversionFunnel data={mockConversionFunnel} />

        {/* Charts Row 2: Geographic & Traffic Sources */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GeographicChart data={mockGeographicData} />
          <TrafficSourcesChart data={mockTrafficSources} />
        </div>

        {/* Charts Row 3: Device Breakdown & Top Pages */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DeviceBreakdownChart data={mockDeviceBreakdown} />
          <TopPagesChart data={mockTopPages} />
        </div>

        {/* Revenue by Product */}
        <RevenueByProductChart data={mockRevenueByProduct} />

        {/* Top Products (Legacy) */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.title} className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.sales} sales
                    </div>
                  </div>
                  <div className="font-medium">{formatCurrency(product.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
