"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  GraduationCap,
  BarChart3,
  Calendar,
  Mail,
  Settings,
  Sparkles,
  Users,
  Video,
  Instagram,
  ShoppingBag,
  UserPlus,
  Award,
  Tag,
  BookOpen,
  FileText,
  Lightbulb,
  Clock,
  Star,
  Webhook,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGhostMode } from "@/hooks/useGhostMode"

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    exactMatch: true, // Only highlight on exact match, not sub-routes
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: GraduationCap,
  },
  {
    title: "My Learning",
    url: "/dashboard/learn",
    icon: BookOpen,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Discounts",
    url: "/dashboard/discounts",
    icon: Tag,
  },
  {
    title: "Certificates",
    url: "/dashboard/certificates",
    icon: Award,
  },
  {
    title: "Reviews",
    url: "/dashboard/reviews",
    icon: Star,
  },
]

const growthItems = [
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Email Marketing",
    url: "/dashboard/email",
    icon: Mail,
  },
  {
    title: "Email Templates",
    url: "/dashboard/email-templates",
    icon: FileText,
  },
  {
    title: "Community",
    url: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Coaching",
    url: "/dashboard/coaching",
    icon: Video,
  },
  {
    title: "Instagram AutoDMs",
    url: "/dashboard/instagram",
    icon: Instagram,
  },
  {
    title: "Affiliates",
    url: "/dashboard/affiliates",
    icon: UserPlus,
  },
  {
    title: "Abandoned Carts",
    url: "/dashboard/abandoned-carts",
    icon: ShoppingBag,
  },
  {
    title: "Waitlist",
    url: "/dashboard/waitlist",
    icon: Clock,
  },
  {
    title: "Webhooks",
    url: "/dashboard/webhooks",
    icon: Webhook,
  },
]

const dataItems = [
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    url: "/dashboard/insights",
    icon: Lightbulb,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { isGhostMode, ghostUser, mounted } = useGhostMode()

  // Only show ghost mode data after mount to prevent hydration mismatch
  const userName = mounted && isGhostMode && ghostUser ? ghostUser.name : "John Doe"
  const userEmail = mounted && isGhostMode && ghostUser ? ghostUser.email : "john@example.com"
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold whitespace-nowrap">CreatorHub</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {mounted && isGhostMode ? 'Ghost Mode' : 'Creator Dashboard'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.exactMatch ? pathname === item.url : (pathname === item.url || pathname.startsWith(item.url + '/'))}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Growth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/dashboard/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="User Profile"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold whitespace-nowrap">{userName}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{userEmail}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
