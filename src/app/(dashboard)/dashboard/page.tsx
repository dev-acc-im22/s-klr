"use client"

import * as React from "react"
import Link from "next/link"
import {
  DollarSign,
  Package,
  GraduationCap,
  Users,
  Calendar,
  CalendarDays,
  Video,
  MessageSquare,
  Mail,
  Send,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShoppingCart,
  BookOpen,
  Clock,
  Instagram,
  Target,
  Eye,
  Heart,
  Sparkles,
  Plus,
  ExternalLink,
  FileText,
  Activity,
} from "lucide-react"


import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { InsightsPanel } from "@/components/dashboard/insights"
import { useGhostMode } from "@/hooks/useGhostMode"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Import mock data
import { getBookingStats, mockBookings, getUpcomingBookings } from "@/lib/mock-data/bookings"
import { coachingStats, upcomingSessions, coachingPackages, completedSessions } from "@/lib/mock-data/coaching"
import { getCommunityStats, mockPosts, mockComments } from "@/lib/mock-data/community"
import { emailAnalytics, mockCampaigns, mockSubscribers } from "@/lib/mock-data/email"
import { mockInstagramStats, mockInstagramAutomations, mockInstagramActivity } from "@/lib/mock-data/features"
import { mockOrders, mockAnalytics, mockTrafficSources, mockTopPages } from "@/lib/mock-data/orders"

// ============================================
// MOCK DATA FOR ADDITIONAL FEATURES
// ============================================

// Products mock data
const mockProducts = [
  { id: 'prod-1', title: 'Creator Starter Kit', price: 29, sales: 89, revenue: 2581, type: 'digital', status: 'active' },
  { id: 'prod-2', title: 'Content Strategy Guide', price: 49, sales: 67, revenue: 3283, type: 'digital', status: 'active' },
  { id: 'prod-3', title: 'Email Templates Pack', price: 19, sales: 134, revenue: 2546, type: 'digital', status: 'active' },
  { id: 'prod-4', title: 'Thumbnail Design Pack', price: 15, sales: 98, revenue: 1470, type: 'digital', status: 'active' },
]

// Courses mock data
const mockCourses = [
  { id: 'course-1', title: 'Creator Business Masterclass', price: 199, enrollments: 23, revenue: 4577, status: 'published', students: 23 },
  { id: 'course-2', title: 'Instagram Growth Masterclass', price: 79, enrollments: 45, revenue: 3555, status: 'published', students: 45 },
  { id: 'course-3', title: 'Email Marketing Bootcamp', price: 59, enrollments: 88, revenue: 5192, status: 'published', students: 88 },
]

// ============================================
// DASHBOARD COMPONENT
// ============================================

// Format time for sessions
function formatSessionTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// Format date for sessions
function formatSessionDate(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function DashboardPage() {
  const { isGhostMode, ghostUser, mounted } = useGhostMode()
  const [greeting, setGreeting] = React.useState("Hello!")

  React.useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning!")
    else if (hour < 18) setGreeting("Good afternoon!")
    else setGreeting("Good evening!")
  }, [])

  // Only show ghost mode data after mount to prevent hydration mismatch
  const userName = mounted && isGhostMode && ghostUser ? ghostUser.name : "John"

  // ============================================
  // COMPUTE STATISTICS FROM ALL FEATURES
  // ============================================

  // Booking stats
  const bookingStats = getBookingStats()
  const upcomingBookings = getUpcomingBookings(3)

  // Community stats
  const communityStats = getCommunityStats()
  const recentPosts = [...mockPosts]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4)

  // Coaching stats
  const nextSessions = upcomingSessions.slice(0, 5)
  const totalCoachingRevenue = completedSessions.reduce((acc, s) => acc + s.price, 0) + 
    upcomingSessions.filter(s => s.status === 'confirmed').reduce((acc, s) => acc + s.price, 0)

  // Email stats
  const sentCampaigns = mockCampaigns
    .filter((c) => c.status === "SENT")
    .sort((a, b) => new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime())
    .slice(0, 3)
  const scheduledCampaigns = mockCampaigns.filter(c => c.status === 'SCHEDULED')
  const draftCampaigns = mockCampaigns.filter(c => c.status === 'DRAFT')

  // Instagram stats
  const activeAutomations = mockInstagramAutomations.filter(a => a.isActive)
  const recentActivity = mockInstagramActivity.slice(0, 4)

  // Products stats
  const totalProducts = mockProducts.length
  const totalProductSales = mockProducts.reduce((acc, p) => acc + p.sales, 0)
  const totalProductRevenue = mockProducts.reduce((acc, p) => acc + p.revenue, 0)

  // Courses stats
  const totalCourses = mockCourses.length
  const totalEnrollments = mockCourses.reduce((acc, c) => acc + c.enrollments, 0)
  const totalCourseRevenue = mockCourses.reduce((acc, c) => acc + c.revenue, 0)

  // Orders stats
  const completedOrders = mockOrders.filter(o => o.status === 'COMPLETED')
  const pendingOrders = mockOrders.filter(o => o.status === 'PENDING')
  const totalOrdersRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0)

  // Analytics stats
  const totalVisitors = mockAnalytics.visitors.reduce((acc, v) => acc + v.visitors, 0)
  const avgVisitors = Math.round(totalVisitors / mockAnalytics.visitors.length)
  const topTrafficSource = mockTrafficSources[0]

  // ============================================
  // CORE STATS (4) - Main KPIs
  // ============================================
  const coreStatsData = [
    {
      title: "Total Revenue",
      value: `$${(totalProductRevenue + totalCourseRevenue + totalCoachingRevenue).toLocaleString()}`,
      description: "All time",
      icon: DollarSign,
      trend: { value: 12.5, label: "from last month", direction: "up" as const },
    },
    {
      title: "Products Sold",
      value: totalProductSales.toLocaleString(),
      description: "Digital products",
      icon: Package,
      trend: { value: 8.2, label: "from last month", direction: "up" as const },
    },
    {
      title: "Course Enrollments",
      value: totalEnrollments.toLocaleString(),
      description: "All courses",
      icon: GraduationCap,
      trend: { value: 23.1, label: "from last month", direction: "up" as const },
    },
    {
      title: "Total Customers",
      value: mockAnalytics.overview.totalCustomers.toLocaleString(),
      description: "Unique buyers",
      icon: Users,
      trend: { value: 15.2, label: "from last month", direction: "up" as const },
    },
  ]

  // ============================================
  // FEATURE STATS (12) - One per major feature
  // ============================================
  const featureStats = [
    // Products
    {
      title: "Active Products",
      value: totalProducts,
      description: `${totalProductSales} total sales`,
      icon: Package,
      category: "Products" as const,
    },
    // Courses
    {
      title: "Published Courses",
      value: totalCourses,
      description: `${totalEnrollments} students`,
      icon: BookOpen,
      category: "Courses" as const,
    },
    // Orders
    {
      title: "Total Orders",
      value: mockOrders.length,
      description: `${pendingOrders.length} pending`,
      icon: ShoppingCart,
      category: "Orders" as const,
    },
    // Bookings
    {
      title: "Sessions This Week",
      value: bookingStats.thisWeek,
      description: `${bookingStats.today} today`,
      icon: Calendar,
      category: "Bookings" as const,
    },
    // Coaching
    {
      title: "Coaching Revenue",
      value: `$${coachingStats.revenue.toLocaleString()}`,
      description: `Avg rating: ${coachingStats.avgRating}`,
      icon: Video,
      category: "Coaching" as const,
    },
    // Email Marketing
    {
      title: "Email Subscribers",
      value: emailAnalytics.totalSubscribers.toLocaleString(),
      description: `${emailAnalytics.activeSubscribers} active`,
      icon: Mail,
      category: "Email" as const,
    },
    // Email Campaigns
    {
      title: "Email Open Rate",
      value: `${emailAnalytics.avgOpenRate}%`,
      description: "Average rate",
      icon: Eye,
      category: "Email" as const,
    },
    // Community
    {
      title: "Community Posts",
      value: communityStats.totalPosts,
      description: `${communityStats.totalComments} comments`,
      icon: MessageSquare,
      category: "Community" as const,
    },
    // Community Engagement
    {
      title: "Community Members",
      value: "1,247",
      description: `${communityStats.totalViews} total views`,
      icon: Users,
      category: "Community" as const,
    },
    // Instagram AutoDMs
    {
      title: "DMs Sent (Month)",
      value: mockInstagramStats.dmsSentThisMonth.toLocaleString(),
      description: `${mockInstagramStats.responseRate}% response`,
      icon: Instagram,
      category: "Instagram" as const,
    },
    // Instagram Automations
    {
      title: "Active Automations",
      value: activeAutomations.length,
      description: `${mockInstagramStats.newFollowersReached} reached`,
      icon: Zap,
      category: "Instagram" as const,
    },
    // Analytics
    {
      title: "Weekly Visitors",
      value: avgVisitors.toLocaleString(),
      description: `via ${topTrafficSource?.source || 'Direct'}`,
      icon: Activity,
      category: "Analytics" as const,
    },
  ]

  // ============================================
  // QUICK ACTIONS - Enhanced
  // ============================================
  const quickActions = [
    { title: "Add Product", icon: Plus, href: "/dashboard/products/new", color: "bg-blue-500" },
    { title: "Create Course", icon: BookOpen, href: "/dashboard/courses/new", color: "bg-indigo-500" },
    { title: "New Campaign", icon: Mail, href: "/dashboard/email/compose", color: "bg-purple-500" },
    { title: "Schedule Session", icon: Calendar, href: "/dashboard/coaching/schedule", color: "bg-pink-500" },
    { title: "Create Post", icon: MessageSquare, href: "/dashboard/community/new", color: "bg-cyan-500" },
    { title: "Add Automation", icon: Zap, href: "/dashboard/instagram/new", color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {userName}!
            </h1>
            {mounted && isGhostMode && (
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-500 border-blue-500/20"
              >
                Ghost Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {greeting} Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Core Stats Grid - 4 main KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {coreStatsData.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Feature Stats Grid - 12 stats from all features */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Feature Overview</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {featureStats.map((stat) => (
              <Card key={stat.title} className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions - Enhanced */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Jump into common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  asChild
                >
                  <Link href={action.href}>
                    <div className={cn("p-2 rounded-lg", action.color)}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Widgets Grid - 3 columns */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Activity Overview</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* AI Insights Widget */}
            <InsightsPanel compact />
            
            {/* Upcoming Sessions Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  Upcoming Sessions
                </CardTitle>
                <Badge variant="secondary">{nextSessions.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextSessions.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {nextSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.clientAvatar}
                            alt={session.clientName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {session.clientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.packageName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">
                            {formatSessionDate(session.scheduledAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatSessionTime(session.scheduledAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming sessions
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/coaching">
                    View All Sessions
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Community Activity Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Community Activity
                </CardTitle>
                <Badge variant="secondary">{communityStats.totalPosts}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={post.creator.avatar}
                          alt={post.creator.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {post.creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                      {post.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                          Pinned
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/community">
                    View Community
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Email Campaign Performance Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Campaigns
                </CardTitle>
                <Badge variant="secondary">{emailAnalytics.totalSubscribers}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {sentCampaigns.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {sentCampaigns.map((campaign) => {
                      const openRate =
                        campaign.recipientCount > 0
                          ? Math.round(
                              (campaign.openCount / campaign.recipientCount) * 100
                            )
                          : 0
                      const clickRate =
                        campaign.openCount > 0
                          ? Math.round(
                              (campaign.clickCount / campaign.openCount) * 100
                            )
                          : 0

                      return (
                        <div
                          key={campaign.id}
                          className="p-2.5 rounded-lg border space-y-2"
                        >
                          <p className="text-sm font-medium truncate">
                            {campaign.subject}
                          </p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Open Rate
                              </span>
                              <span className="font-medium">{openRate}%</span>
                            </div>
                            <Progress value={openRate} className="h-1.5" />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{campaign.recipientCount} sent</span>
                            <span>{campaign.clickCount} clicks ({clickRate}%)</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No campaigns sent yet
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/email">
                    View All Campaigns
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Widgets Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Recent Bookings
              </CardTitle>
              <Badge variant="secondary">{bookingStats.thisWeek} this week</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      booking.status === 'confirmed' ? "bg-green-500/10" : "bg-yellow-500/10"
                    )}>
                      <CalendarDays className={cn(
                        "h-4 w-4",
                        booking.status === 'confirmed' ? "text-green-600" : "text-yellow-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{booking.title}</p>
                      <p className="text-xs text-muted-foreground">{booking.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${booking.price}</p>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        booking.status === 'confirmed' 
                          ? "border-green-500/30 text-green-600" 
                          : "border-yellow-500/30 text-yellow-600"
                      )}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/bookings">
                  Manage Bookings
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Instagram AutoDM Activity Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                Instagram AutoDM Activity
              </CardTitle>
              <Badge variant="secondary">{activeAutomations.length} active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-pink-500/10">
                      <Send className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.automationName}</p>
                      <p className="text-xs text-muted-foreground">Sent to {activity.recipient}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.sentAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/instagram">
                  Manage Automations
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Top Product */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Product
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">Content Strategy Guide</div>
              <p className="text-xs text-muted-foreground">
                $3,283 revenue • 67 sales
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+8.7%</span>
                <span className="text-xs text-muted-foreground">growth</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Course */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Course
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">Business Masterclass</div>
              <p className="text-xs text-muted-foreground">
                $4,577 revenue • 23 students
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+15.3%</span>
                <span className="text-xs text-muted-foreground">growth</span>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Source */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Traffic Source
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{topTrafficSource?.source || 'Direct'}</div>
              <p className="text-xs text-muted-foreground">
                {topTrafficSource?.visitors.toLocaleString() || '0'} visitors • {topTrafficSource?.percentage || 0}%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">highest engagement</span>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                Visitor to customer
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">+0.5%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Revenue Chart - Takes 4 columns */}
          <RevenueChart className="lg:col-span-4" />

          {/* Top Pages Widget */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {mockTopPages.slice(0, 5).map((page, index) => (
                  <div key={page.path} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <RecentOrders />
      </div>
  )
}
