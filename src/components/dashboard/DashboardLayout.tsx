"use client"

import * as React from "react"
import { AppSidebar } from "./Sidebar"
import { Header } from "./Header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  ghostMode?: boolean
}

export function DashboardLayout({ children, ghostMode = false }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header ghostMode={ghostMode} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
