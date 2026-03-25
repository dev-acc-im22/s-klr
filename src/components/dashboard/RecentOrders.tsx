"use client"

import * as React from "react"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: null,
    },
    product: "Digital Marketing Course",
    amount: 99.00,
    status: "completed" as const,
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: null,
    },
    product: "E-book Bundle",
    amount: 49.00,
    status: "completed" as const,
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: null,
    },
    product: "Design Templates",
    amount: 29.00,
    status: "pending" as const,
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Alex Thompson",
      email: "alex@example.com",
      avatar: null,
    },
    product: "Photography Masterclass",
    amount: 149.00,
    status: "completed" as const,
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      avatar: null,
    },
    product: "Stock Video Pack",
    amount: 79.00,
    status: "refunded" as const,
    date: "2024-01-13",
  },
]

const statusStyles = {
  completed: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  refunded: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
}

interface RecentOrdersProps {
  className?: string
}

export function RecentOrders({ className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest purchases from your store</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/orders">
            View All
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={order.customer.avatar || ""} alt={order.customer.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {order.customer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <div className="font-medium text-sm">{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.product}</TableCell>
                <TableCell className="font-medium">${order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Refund Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
