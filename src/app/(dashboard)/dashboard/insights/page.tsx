"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InsightsPanel } from "@/components/dashboard/insights"
import { useGhostMode } from "@/hooks/useGhostMode"

export default function InsightsPage() {
  const { isGhostMode } = useGhostMode()

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <InsightsPanel />
    </DashboardLayout>
  )
}
