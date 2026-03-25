"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Package, 
  CreditCard, 
  User, 
  Calendar,
  Mail,
  Receipt,
  RotateCcw,
  Send,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MockOrder, formatOrderDate, formatCurrency, OrderStatus } from "@/lib/mock-data/dashboard"

const statusConfig: Record<OrderStatus, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  completed: { 
    icon: CheckCircle, 
    color: "text-green-600 dark:text-green-400", 
    bgColor: "bg-green-500/10 border-green-500/20",
    label: "Completed"
  },
  pending: { 
    icon: Clock, 
    color: "text-yellow-600 dark:text-yellow-400", 
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
    label: "Pending"
  },
  refunded: { 
    icon: XCircle, 
    color: "text-red-600 dark:text-red-400", 
    bgColor: "bg-red-500/10 border-red-500/20",
    label: "Refunded"
  },
}

const paymentMethodLabels: Record<string, string> = {
  card: "Credit Card",
  paypal: "PayPal",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
}

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const [order, setOrder] = React.useState<MockOrder | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderId])

  const handleCopyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefund = () => {
    alert("Refund functionality will be implemented soon!")
  }

  const handleResendReceipt = () => {
    alert("Receipt has been sent to " + (order?.customer.email || "customer"))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardContent className="p-6"><div className="h-48 bg-muted animate-pulse rounded" /></CardContent></Card>
          </div>
          <div className="space-y-6">
            <Card><CardContent className="p-6"><div className="h-32 bg-muted animate-pulse rounded" /></CardContent></Card>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[order.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{order.id}</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleCopyOrderId}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-muted-foreground">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResendReceipt}>
            <Send className="mr-2 h-4 w-4" />
            Resend Receipt
          </Button>
          {order.status !== 'refunded' && (
            <Button variant="destructive" onClick={handleRefund}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refund
            </Button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <Card className={`border ${status.bgColor}`}>
        <CardContent className="flex items-center gap-3 p-4">
          <status.icon className={`h-5 w-5 ${status.color}`} />
          <div>
            <span className={`font-medium ${status.color}`}>{status.label}</span>
            <p className="text-sm text-muted-foreground">
              {order.status === 'completed' && "Payment received successfully"}
              {order.status === 'pending' && "Awaiting payment confirmation"}
              {order.status === 'refunded' && "Payment has been refunded"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.productTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity, order.currency)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.customer.avatar || ""} alt={order.customer.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {order.customer.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <a 
                    href={`mailto:${order.customer.email}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {order.customer.email}
                  </a>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/customers?search=${encodeURIComponent(order.customer.email)}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Customer Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">
                  {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {order.paymentId}
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency</span>
                <span>{order.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">{formatCurrency(order.total, order.currency)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-8 w-px bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">{formatOrderDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.status === 'completed' && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Completed</p>
                      <p className="text-xs text-muted-foreground">{formatOrderDate(order.createdAt)}</p>
                    </div>
                  </div>
                )}
                {order.status === 'refunded' && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Refund Processed</p>
                      <p className="text-xs text-muted-foreground">Refund completed</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="h-4 w-4" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleResendReceipt}>
                <Send className="mr-2 h-4 w-4" />
                Resend Receipt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              {order.status !== 'refunded' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleRefund}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Process Refund
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
