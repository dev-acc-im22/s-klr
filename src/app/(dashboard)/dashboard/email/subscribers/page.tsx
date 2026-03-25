"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"


import { SubscriberList } from "@/components/dashboard/email/SubscriberList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSubscribers } from "@/lib/mock-data/email"
import { useGhostMode } from "@/hooks/useGhostMode"

export default function SubscribersPage() {
  const { isGhostMode } = useGhostMode()
  const [subscribers, setSubscribers] = React.useState(mockSubscribers)

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/email">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
              <p className="text-muted-foreground">
                {subscribers.length} total subscribers
              </p>
            </div>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-2xl">{subscribers.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {subscribers.filter(s => s.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inactive</CardDescription>
              <CardTitle className="text-2xl text-gray-500">
                {subscribers.filter(s => !s.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Open Rate</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {Math.round(subscribers.reduce((acc, s) => acc + s.openRate, 0) / subscribers.length)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Subscriber List */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>
              Manage your email list and subscriber segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriberList 
              subscribers={subscribers} 
              onRefresh={() => {}}
            />
          </CardContent>
        </Card>
      </div>
  )
}
