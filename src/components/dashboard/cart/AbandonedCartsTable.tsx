"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Mail,
  MoreHorizontal,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react"
import type { MockAbandonedCart } from "@/lib/mock-data/cart"

interface AbandonedCartsTableProps {
  abandonedCarts: MockAbandonedCart[]
  onSendRecoveryEmail: (cart: MockAbandonedCart) => void
  onViewDetails: (cart: MockAbandonedCart) => void
  onMarkRecovered: (cart: MockAbandonedCart) => void
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  email_sent: "bg-blue-100 text-blue-800",
  recovered: "bg-green-100 text-green-800",
  expired: "bg-gray-100 text-gray-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  email_sent: "Email Sent",
  recovered: "Recovered",
  expired: "Expired",
}

export function AbandonedCartsTable({
  abandonedCarts,
  onSendRecoveryEmail,
  onViewDetails,
  onMarkRecovered,
}: AbandonedCartsTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  if (abandonedCarts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No abandoned carts</h3>
        <p className="text-muted-foreground text-sm mt-1">
          When customers leave items in their cart, they&apos;ll appear here
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Cart Value</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Abandoned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {abandonedCarts.map((cart) => (
            <>
              <TableRow
                key={cart.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setExpandedRow(expandedRow === cart.id ? null : cart.id)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{cart.email}</p>
                    {cart.discountCode && (
                      <p className="text-xs text-muted-foreground">
                        Code: {cart.discountCode}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">
                      {(cart.cartTotal || 0).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {cart.cart.items.length} item{cart.cart.items.length !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[cart.status]}>
                    {statusLabels[cart.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(cart.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(cart)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {cart.status === "pending" && (
                        <DropdownMenuItem onClick={() => onSendRecoveryEmail(cart)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Recovery Email
                        </DropdownMenuItem>
                      )}
                      {cart.status === "email_sent" && (
                        <DropdownMenuItem onClick={() => onMarkRecovered(cart)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Recovered
                        </DropdownMenuItem>
                      )}
                      {cart.status !== "recovered" && cart.status !== "expired" && (
                        <DropdownMenuItem
                          onClick={() => onMarkRecovered({ ...cart, status: "expired" })}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Mark as Expired
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedRow === cart.id && (
                <TableRow key={`${cart.id}-expanded`} className="bg-muted/30">
                  <TableCell colSpan={6} className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Cart Items</h4>
                      <div className="grid gap-2">
                        {cart.cart.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-background p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.product.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                      {cart.recoveryEmails.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-sm mb-2">Recovery Emails</h4>
                          <div className="flex gap-2 flex-wrap">
                            {cart.recoveryEmails.map((email, idx) => (
                              <Badge key={email.id} variant="outline">
                                Email {idx + 1}: {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })}
                                {email.openedAt && " (opened)"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
