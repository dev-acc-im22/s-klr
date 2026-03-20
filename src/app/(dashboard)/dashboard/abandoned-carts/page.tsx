'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Mail,
  RefreshCw,
  Settings,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RecoveryStats } from '@/components/dashboard/cart/RecoveryStats';
import { AbandonedCartsTable } from '@/components/dashboard/cart/AbandonedCartsTable';
import { RecoveryEmailPreview } from '@/components/dashboard/cart/RecoveryEmailPreview';
import { CartRecoverySettings } from '@/components/dashboard/cart/CartRecoverySettings';
import {
  mockAbandonedCarts,
  mockRecoveryStats,
  mockRecoverySettings,
} from '@/lib/mock-data/cart';
import type { MockAbandonedCart } from '@/lib/mock-data/cart';
import { useToast } from '@/hooks/use-toast';

export default function AbandonedCartsPage() {
  const { isGhostMode } = useGhostMode();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCart, setSelectedCart] = useState<MockAbandonedCart | null>(null);
  const [carts, setCarts] = useState(mockAbandonedCarts);
  const [settings, setSettings] = useState(mockRecoverySettings);

  // Calculate stats from current carts
  const stats = {
    totalAbandoned: carts.length,
    emailsSent: carts.filter((c) => c.status === 'email_sent' || c.status === 'recovered').length,
    recovered: carts.filter((c) => c.status === 'recovered').length,
    recoveryRate: Math.round(
      (carts.filter((c) => c.status === 'recovered').length /
        Math.max(carts.filter((c) => c.status !== 'pending').length, 1)) *
        100
    ),
    potentialRevenue: carts.reduce((sum, c) => sum + (c.cartTotal || 0), 0),
    recoveredRevenue: carts
      .filter((c) => c.status === 'recovered')
      .reduce((sum, c) => sum + (c.cartTotal || 0), 0),
  };

  const handleSendRecoveryEmail = (cart: MockAbandonedCart) => {
    setSelectedCart(cart);
    setActiveTab('preview');
  };

  const handleViewDetails = (cart: MockAbandonedCart) => {
    setSelectedCart(cart);
    setActiveTab('preview');
  };

  const handleMarkRecovered = (cart: MockAbandonedCart) => {
    setCarts((prev) =>
      prev.map((c) =>
        c.id === cart.id ? { ...c, status: 'recovered', recoveredAt: new Date() } : c
      )
    );
    toast({
      title: 'Cart marked as recovered',
      description: `Cart for ${cart.email} has been marked as recovered.`,
    });
  };

  const handleSendEmail = (discountCode?: string, customMessage?: string) => {
    if (!selectedCart) return;

    setCarts((prev) =>
      prev.map((c) =>
        c.id === selectedCart.id
          ? {
              ...c,
              status: 'email_sent',
              recoveryEmailSentAt: new Date(),
              discountCode: discountCode || c.discountCode,
              recoveryEmails: [
                ...c.recoveryEmails,
                {
                  id: `email-${Date.now()}`,
                  sentAt: new Date(),
                  openedAt: null,
                  clickedAt: null,
                },
              ],
            }
          : c
      )
    );

    // Update selected cart
    setSelectedCart((prev) =>
      prev
        ? {
            ...prev,
            status: 'email_sent',
            recoveryEmailSentAt: new Date(),
            discountCode: discountCode || prev.discountCode,
            recoveryEmails: [
              ...prev.recoveryEmails,
              {
                id: `email-${Date.now()}`,
                sentAt: new Date(),
                openedAt: null,
                clickedAt: null,
              },
            ],
          }
        : null
    );

    toast({
      title: 'Recovery email sent',
      description: `Email sent to ${selectedCart.email}${discountCode ? ` with code: ${discountCode}` : ''}`,
    });
  };

  const handleSaveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    toast({
      title: 'Settings saved',
      description: 'Your cart recovery settings have been updated.',
    });
  };

  const pendingCarts = carts.filter((c) => c.status === 'pending');
  const sentCarts = carts.filter((c) => c.status === 'email_sent');
  const recoveredCarts = carts.filter((c) => c.status === 'recovered');

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Abandoned Cart Recovery</h1>
            <p className="text-muted-foreground">
              Recover lost sales from abandoned shopping carts
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setActiveTab('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </Button>
          </div>
        </div>

        {/* Stats */}
        <RecoveryStats stats={stats} />

        {/* Alert for pending carts */}
        {pendingCarts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 p-4">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">
                  {pendingCarts.length} cart{pendingCarts.length !== 1 ? 's' : ''} awaiting recovery email
                </p>
                <p className="text-sm text-amber-700">
                  Potential revenue: $
                  {pendingCarts.reduce((sum, c) => sum + (c.cartTotal || 0), 0).toFixed(2)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (pendingCarts[0]) {
                    handleSendRecoveryEmail(pendingCarts[0]);
                  }
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Emails
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              <ShoppingCart className="mr-2 h-4 w-4" />
              All Carts
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingCarts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingCarts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Mail className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Abandoned Carts</CardTitle>
                <CardDescription>
                  View and manage all abandoned shopping carts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AbandonedCartsTable
                  abandonedCarts={carts}
                  onSendRecoveryEmail={handleSendRecoveryEmail}
                  onViewDetails={handleViewDetails}
                  onMarkRecovered={handleMarkRecovered}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Recovery</CardTitle>
                    <CardDescription>
                      Carts that haven&apos;t received a recovery email yet
                    </CardDescription>
                  </div>
                  {pendingCarts.length > 0 && (
                    <Button
                      onClick={() => {
                        // Send to all pending
                        pendingCarts.forEach((cart) => {
                          handleSendRecoveryEmail(cart);
                        });
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send All ({pendingCarts.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AbandonedCartsTable
                  abandonedCarts={pendingCarts}
                  onSendRecoveryEmail={handleSendRecoveryEmail}
                  onViewDetails={handleViewDetails}
                  onMarkRecovered={handleMarkRecovered}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select a Cart</CardTitle>
                    <CardDescription>
                      Choose a cart to preview and send recovery email
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {carts
                        .filter((c) => c.status !== 'recovered' && c.status !== 'expired')
                        .map((cart) => (
                          <button
                            key={cart.id}
                            onClick={() => setSelectedCart(cart)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedCart?.id === cart.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{cart.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${(cart.cartTotal || 0).toFixed(2)} •{' '}
                                  {cart.cart.items.length} items
                                </p>
                              </div>
                              <Badge
                                variant={cart.status === 'pending' ? 'secondary' : 'default'}
                              >
                                {cart.status === 'pending' ? 'Pending' : 'Sent'}
                              </Badge>
                            </div>
                          </button>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent recovered */}
                {recoveredCarts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Recently Recovered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {recoveredCarts.slice(0, 3).map((cart) => (
                          <div
                            key={cart.id}
                            className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium">{cart.email}</p>
                              <p className="text-xs text-muted-foreground">
                                ${(cart.cartTotal || 0).toFixed(2)} recovered
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Recovered</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <RecoveryEmailPreview
                abandonedCart={selectedCart}
                onSendEmail={handleSendEmail}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <CartRecoverySettings settings={settings} onSave={handleSaveSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
