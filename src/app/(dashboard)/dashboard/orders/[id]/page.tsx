'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { mockOrders, Order } from '@/lib/mock-data/orders';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';


export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const { id } = await params;

      try {
        const found = mockOrders.find((o) => o.id === id);
        setOrder(found || null);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'REFUNDED':
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{order.id.slice(-6)}
            </h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                          <span className="text-lg">📦</span>
                        </div>
                        <div>
                          <div className="font-medium">{item.productTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-sm">
                  {order.paymentId || 'N/A'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">{order.buyer.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {order.buyer.email}
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Resend Receipt
              </Button>
              {order.status === 'COMPLETED' && (
                <Button variant="outline" className="w-full text-destructive">
                  Process Refund
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
  );
}
