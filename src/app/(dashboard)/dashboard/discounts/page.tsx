'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useGhostMode } from '@/hooks/useGhostMode';
import { DiscountCodeList } from '@/components/dashboard/discounts/DiscountCodeList';
import { DiscountCodeForm } from '@/components/dashboard/discounts/DiscountCodeForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  isOneTimeUse: boolean;
  applicableProducts: string;
  createdAt: Date;
}

interface DiscountStats {
  totalCodes: number;
  activeCodes: number;
  totalUses: number;
  totalSavings: number;
  usesThisMonth: number;
  savingsThisMonth: number;
}

export default function DiscountsPage() {
  const { isGhostMode } = useGhostMode();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [stats, setStats] = useState<DiscountStats | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null);
  const [deletingDiscount, setDeletingDiscount] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/discounts');
      if (response.ok) {
        const data = await response.json();
        setDiscounts(data.discounts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discount codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingDiscount(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/discounts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Deleted',
          description: 'Discount code deleted successfully',
        });
        fetchDiscounts();
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete discount code',
        variant: 'destructive',
      });
    } finally {
      setDeletingDiscount(null);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/discounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast({
          title: 'Updated',
          description: `Discount code ${isActive ? 'activated' : 'deactivated'}`,
        });
        fetchDiscounts();
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update discount code',
        variant: 'destructive',
      });
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchDiscounts();
  };

  const handleEditSuccess = () => {
    setEditingDiscount(null);
    fetchDiscounts();
  };

  const filteredDiscounts = activeTab === 'all' 
    ? discounts 
    : discounts.filter(d => d.isActive);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Tag className="h-7 w-7 text-primary" />
              Discount Codes
            </h1>
            <p className="text-muted-foreground">
              Create and manage discount codes for your products
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Code
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Total Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCodes}</div>
                <p className="text-xs text-muted-foreground">{stats.activeCodes} active</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUses}</div>
                <p className="text-xs text-green-600">+{stats.usesThisMonth} this month</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSavings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  ${stats.savingsThisMonth.toFixed(2)} this month
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Avg. Discount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalUses > 0 
                    ? `$${(stats.totalSavings / stats.totalUses).toFixed(2)}` 
                    : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground">per use</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs and List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Codes</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : (
              <DiscountCodeList
                discounts={filteredDiscounts}
                onEdit={handleEdit}
                onDelete={(id) => setDeletingDiscount(id)}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : (
              <DiscountCodeList
                discounts={filteredDiscounts}
                onEdit={handleEdit}
                onDelete={(id) => setDeletingDiscount(id)}
                onToggleActive={handleToggleActive}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Create Discount Code
              </DialogTitle>
            </DialogHeader>
            <DiscountCodeForm
              mode="create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingDiscount} onOpenChange={() => setEditingDiscount(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Edit Discount Code
              </DialogTitle>
            </DialogHeader>
            {editingDiscount && (
              <DiscountCodeForm
                mode="edit"
                discountId={editingDiscount}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingDiscount(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingDiscount} onOpenChange={() => setDeletingDiscount(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Discount Code?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the discount code
                and remove it from any active campaigns.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingDiscount && handleDelete(deletingDiscount)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}
