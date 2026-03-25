"use client"

import * as React from "react"

import { InsightsPanel } from "@/components/dashboard/insights"
import { useGhostMode } from "@/hooks/useGhostMode"

export default function InsightsPage() {
  const { isGhostMode } = useGhostMode()

  return (
    <InsightsPanel />
  )
}
