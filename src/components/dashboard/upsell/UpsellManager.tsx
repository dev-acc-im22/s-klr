'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Sparkles, Package, ShoppingCart, Bundle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockUpsellOffers, UpsellOffer } from '@/lib/mock-data/upsells';
import { mockProducts } from '@/lib/mock-data/products';

interface UpsellManagerProps {
  productId: string;
  ghostMode?: boolean;
}

export function UpsellManager({ productId, ghostMode = false }: UpsellManagerProps) {
  const { toast } = useToast();
  const [upsells, setUpsells] = useState<UpsellOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUpsell, setSelectedUpsell] = useState<UpsellOffer | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPrice: '',
    discountType: 'fixed',
    upsellType: 'ONE_CLICK',
    offerProductId: '',
    triggerTiming: 'after_purchase',
    displayOrder: 0,
    active: true,
    abTestVariant: '',
  });

  useEffect(() => {
    loadUpsells();
  }, [productId]);

  const loadUpsells = async () => {
    setLoading(true);
    try {
      if (ghostMode) {
        const productUpsells = mockUpsellOffers.filter((u) => u.productId === productId);
        setUpsells(productUpsells);
      } else {
        const res = await fetch(`/api/upsells?productId=${productId}`);
        const data = await res.json();
        setUpsells(data.upsellOffers || []);
      }
    } catch (error) {
      console.error('Error loading upsells:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUpsell(null);
    setFormData({
      title: '',
      description: '',
      discountPrice: '',
      discountType: 'fixed',
      upsellType: 'ONE_CLICK',
      offerProductId: '',
      triggerTiming: 'after_purchase',
      displayOrder: upsells.length,
      active: true,
      abTestVariant: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (upsell: UpsellOffer) => {
    setSelectedUpsell(upsell);
    setFormData({
      title: upsell.title,
      description: upsell.description || '',
      discountPrice: upsell.discountPrice.toString(),
      discountType: upsell.discountType,
      upsellType: upsell.upsellType,
      offerProductId: upsell.offerProductId,
      triggerTiming: upsell.triggerTiming,
      displayOrder: upsell.displayOrder,
      active: upsell.active,
      abTestVariant: upsell.abTestVariant || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        productId,
        ...formData,
        discountPrice: parseFloat(formData.discountPrice),
      };

      if (ghostMode) {
        // Simulate save in ghost mode
        if (selectedUpsell) {
          setUpsells(upsells.map((u) =>
            u.id === selectedUpsell.id ? { ...u, ...payload } : u
          ));
        } else {
          const newUpsell: UpsellOffer = {
            id: `upsell-${Date.now()}`,
            ...payload,
            conversionRate: 0,
            impressions: 0,
            conversions: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUpsells([...upsells, newUpsell]);
        }
        toast({
          title: 'Upsell saved',
          description: 'The upsell offer has been saved successfully.',
        });
      } else {
        if (selectedUpsell) {
          await fetch(`/api/upsells/${selectedUpsell.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          await fetch('/api/upsells', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        loadUpsells();
        toast({
          title: 'Upsell saved',
          description: 'The upsell offer has been saved successfully.',
        });
      }

      setDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save upsell offer.',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedUpsell) return;

    try {
      if (ghostMode) {
        setUpsells(upsells.filter((u) => u.id !== selectedUpsell.id));
      } else {
        await fetch(`/api/upsells/${selectedUpsell.id}`, { method: 'DELETE' });
        loadUpsells();
      }
      toast({
        title: 'Upsell deleted',
        description: 'The upsell offer has been deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete upsell offer.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUpsell(null);
    }
  };

  const handleToggleActive = async (upsell: UpsellOffer) => {
    try {
      if (ghostMode) {
        setUpsells(upsells.map((u) =>
          u.id === upsell.id ? { ...u, active: !u.active } : u
        ));
      } else {
        await fetch(`/api/upsells/${upsell.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: !upsell.active }),
        });
        loadUpsells();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update upsell status.',
      });
    }
  };

  const handleMoveOrder = async (upsell: UpsellOffer, direction: 'up' | 'down') => {
    const currentIndex = upsells.findIndex((u) => u.id === upsell.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= upsells.length) return;

    const newUpsells = [...upsells];
    [newUpsells[currentIndex], newUpsells[newIndex]] = [newUpsells[newIndex], newUpsells[currentIndex]];

    // Update displayOrder
    newUpsells.forEach((u, index) => {
      u.displayOrder = index;
    });

    setUpsells(newUpsells);

    // In real mode, persist to database
    if (!ghostMode) {
      try {
        await Promise.all(
          newUpsells.map((u) =>
            fetch(`/api/upsells/${u.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ displayOrder: u.displayOrder }),
            })
          )
        );
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

  const getUpsellTypeIcon = (type: string) => {
    switch (type) {
      case 'ONE_CLICK':
        return <Sparkles className="h-4 w-4" />;
      case 'ORDER_BUMP':
        return <ShoppingCart className="h-4 w-4" />;
      case 'BUNDLE':
        return <Package className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getUpsellTypeLabel = (type: string) => {
    switch (type) {
      case 'ONE_CLICK':
        return 'One-Click Upsell';
      case 'ORDER_BUMP':
        return 'Order Bump';
      case 'BUNDLE':
        return 'Bundle Offer';
      default:
        return type;
    }
  };

  const filteredUpsells = upsells.filter((u) => {
    if (activeTab === 'all') return true;
    return u.upsellType === activeTab;
  });

  // Available products for upsell offers (exclude current product)
  const availableProducts = mockProducts.filter((p) => p.id !== productId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Upsell Offers</h3>
          <p className="text-sm text-muted-foreground">
            Create offers that appear after purchase or during checkout
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Upsell
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ONE_CLICK">One-Click</TabsTrigger>
          <TabsTrigger value="ORDER_BUMP">Order Bump</TabsTrigger>
          <TabsTrigger value="BUNDLE">Bundle</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredUpsells.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No upsell offers yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Create your first upsell to increase average order value
                </p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Upsell
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredUpsells.map((upsell, index) => (
                <Card key={upsell.id} className={upsell.active ? '' : 'opacity-60'}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(upsell, 'up')}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === filteredUpsells.length - 1}
                            onClick={() => handleMoveOrder(upsell, 'down')}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {getUpsellTypeIcon(upsell.upsellType)}
                              {getUpsellTypeLabel(upsell.upsellType)}
                            </Badge>
                            {upsell.abTestVariant && (
                              <Badge variant="outline">Test {upsell.abTestVariant}</Badge>
                            )}
                            {!upsell.active && (
                              <Badge variant="outline" className="text-muted-foreground">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium">{upsell.title}</h4>
                          {upsell.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {upsell.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>
                              Offer: {upsell.offerProduct?.title || 'Unknown Product'}
                            </span>
                            <span>
                              Price: ${upsell.discountPrice}
                              {upsell.offerProduct && upsell.offerProduct.price > upsell.discountPrice && (
                                <span className="text-green-600 dark:text-green-400 ml-1">
                                  (Save ${(upsell.offerProduct.price - upsell.discountPrice).toFixed(0)})
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Impressions: {upsell.impressions}</span>
                            <span>Conversions: {upsell.conversions}</span>
                            <span>Rate: {upsell.conversionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(upsell)}
                        >
                          {upsell.active ? (
                            <ToggleRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(upsell)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUpsell(upsell);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedUpsell ? 'Edit Upsell Offer' : 'Create Upsell Offer'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="upsellType">Upsell Type</Label>
              <Select
                value={formData.upsellType}
                onValueChange={(value) => setFormData({ ...formData, upsellType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_CLICK">One-Click Upsell (After Purchase)</SelectItem>
                  <SelectItem value="ORDER_BUMP">Order Bump (During Checkout)</SelectItem>
                  <SelectItem value="BUNDLE">Bundle Offer (Frequently Bought Together)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerProduct">Product to Offer</Label>
              <Select
                value={formData.offerProductId}
                onValueChange={(value) => setFormData({ ...formData, offerProductId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title} (${product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Add for just $19!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the value of this offer"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Special Price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  placeholder="9.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.upsellType === 'ONE_CLICK' && (
              <div className="space-y-2">
                <Label htmlFor="triggerTiming">When to Show</Label>
                <Select
                  value={formData.triggerTiming}
                  onValueChange={(value) => setFormData({ ...formData, triggerTiming: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after_purchase">After Purchase</SelectItem>
                    <SelectItem value="during_checkout">During Checkout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="abTestVariant">A/B Test Variant (Optional)</Label>
              <Input
                id="abTestVariant"
                value={formData.abTestVariant}
                onChange={(e) => setFormData({ ...formData, abTestVariant: e.target.value })}
                placeholder="e.g., A, B, or leave empty"
              />
              <p className="text-xs text-muted-foreground">
                Use this to track different versions of the same offer
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this upsell offer
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedUpsell ? 'Save Changes' : 'Create Upsell'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upsell Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedUpsell?.title}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
