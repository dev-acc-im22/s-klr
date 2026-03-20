"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, BookOpen, ExternalLink, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const quickActions = [
  {
    title: "Add Product",
    description: "Create a new digital product",
    icon: Plus,
    href: "/dashboard/products/new",
    variant: "default" as const,
  },
  {
    title: "Create Course",
    description: "Build a new course",
    icon: BookOpen,
    href: "/dashboard/courses/new",
    variant: "outline" as const,
  },
  {
    title: "View Store",
    description: "See your public store",
    icon: ExternalLink,
    href: "/store",
    variant: "outline" as const,
    external: true,
  },
]

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks to manage your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            
            if (action.external) {
              return (
                <Button
                  key={action.title}
                  variant={action.variant}
                  className="justify-start h-auto py-4"
                  asChild
                >
                  <Link href={action.href} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              )
            }
            
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      action.variant === "default" 
                        ? "bg-primary-foreground/10" 
                        : "bg-primary/10"
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        action.variant === "default" 
                          ? "text-primary-foreground" 
                          : "text-primary"
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
