'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, X, Link2, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { useToast } from '@/hooks/use-toast';
import { mockCrossSellProducts, CrossSellProduct } from '@/lib/mock-data/upsells';
import { mockProducts } from '@/lib/mock-data/products';

interface CrossSellManagerProps {
  productId: string;
  ghostMode?: boolean;
}

export function CrossSellManager({ productId, ghostMode = false }: CrossSellManagerProps) {
  const { toast } = useToast();
  const [crossSells, setCrossSells] = useState<CrossSellProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [bundlePrice, setBundlePrice] = useState('');

  useEffect(() => {
    loadCrossSells();
  }, [productId]);

  const loadCrossSells = async () => {
    setLoading(true);
    try {
      if (ghostMode) {
        const productCrossSells = mockCrossSellProducts.filter((c) => c.productId === productId);
        setCrossSells(productCrossSells);
      } else {
        const res = await fetch(`/api/cross-sells?productId=${productId}`);
        const data = await res.json();
        setCrossSells(data.crossSells || []);
      }
    } catch (error) {
      console.error('Error loading cross-sells:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrossSell = async () => {
    if (!selectedProduct) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a product to cross-sell.',
      });
      return;
    }

    // Check if already exists
    if (crossSells.some((c) => c.relatedProductId === selectedProduct)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'This product is already added as a cross-sell.',
      });
      return;
    }

    try {
      const newCrossSell: CrossSellProduct = {
        id: `cross-${Date.now()}`,
        productId,
        relatedProductId: selectedProduct,
        displayOrder: crossSells.length,
        active: true,
        bundlePrice: bundlePrice ? parseFloat(bundlePrice) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        relatedProduct: mockProducts.find((p) => p.id === selectedProduct) as CrossSellProduct['relatedProduct'],
      };

      if (ghostMode) {
        setCrossSells([...crossSells, newCrossSell]);
      } else {
        await fetch('/api/cross-sells', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            relatedProductId: selectedProduct,
            bundlePrice: bundlePrice ? parseFloat(bundlePrice) : null,
            displayOrder: crossSells.length,
          }),
        });
        loadCrossSells();
      }

      toast({
        title: 'Cross-sell added',
        description: 'The product has been added as a cross-sell suggestion.',
      });

      setDialogOpen(false);
      setSelectedProduct('');
      setBundlePrice('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add cross-sell.',
      });
    }
  };

  const handleRemoveCrossSell = async (crossSellId: string) => {
    try {
      if (ghostMode) {
        setCrossSells(crossSells.filter((c) => c.id !== crossSellId));
      } else {
        await fetch(`/api/cross-sells/${crossSellId}`, { method: 'DELETE' });
        loadCrossSells();
      }

      toast({
        title: 'Cross-sell removed',
        description: 'The product has been removed from cross-sell suggestions.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove cross-sell.',
      });
    }
  };

  const handleToggleActive = async (crossSell: CrossSellProduct) => {
    try {
      if (ghostMode) {
        setCrossSells(
          crossSells.map((c) =>
            c.id === crossSell.id ? { ...c, active: !c.active } : c
          )
        );
      } else {
        await fetch(`/api/cross-sells/${crossSell.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: !crossSell.active }),
        });
        loadCrossSells();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update cross-sell status.',
      });
    }
  };

  const handleUpdateBundlePrice = async (crossSellId: string, price: string) => {
    try {
      if (ghostMode) {
        setCrossSells(
          crossSells.map((c) =>
            c.id === crossSellId
              ? { ...c, bundlePrice: price ? parseFloat(price) : undefined }
              : c
          )
        );
      } else {
        await fetch(`/api/cross-sells/${crossSellId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bundlePrice: price ? parseFloat(price) : null,
          }),
        });
      }
    } catch (error) {
      console.error('Error updating bundle price:', error);
    }
  };

  // Available products for cross-sell (exclude current product and already added products)
  const availableProducts = mockProducts.filter(
    (p) =>
      p.id !== productId && !crossSells.some((c) => c.relatedProductId === p.id)
  );

  // Current product info
  const currentProduct = mockProducts.find((p) => p.id === productId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cross-Sell Products</h3>
          <p className="text-sm text-muted-foreground">
            Products to show as &quot;You might also like&quot; suggestions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={availableProducts.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Current Cross-Sells */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : crossSells.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Link2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No cross-sell products added</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add related products to increase discoverability
            </p>
            <Button
              className="mt-4"
              onClick={() => setDialogOpen(true)}
              disabled={availableProducts.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Cross-Sell
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {crossSells.map((crossSell) => (
            <Card
              key={crossSell.id}
              className={crossSell.active ? '' : 'opacity-60'}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Drag Handle (for visual) */}
                  <div className="cursor-grab text-muted-foreground/40">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">
                        {crossSell.relatedProduct?.title || 'Unknown Product'}
                      </h4>
                      <Badge variant="secondary" className="shrink-0">
                        {crossSell.relatedProduct?.category || 'Product'}
                      </Badge>
                      {!crossSell.active && (
                        <Badge variant="outline" className="shrink-0">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Original: ${crossSell.relatedProduct?.price || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {crossSell.relatedProduct?.salesCount || 0} sold
                      </span>
                    </div>
                  </div>

                  {/* Bundle Price */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground shrink-0">
                      Bundle Price:
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        className="w-24 pl-7 h-9"
                        placeholder="Auto"
                        value={crossSell.bundlePrice || ''}
                        onChange={(e) =>
                          handleUpdateBundlePrice(crossSell.id, e.target.value)
                        }
                      />
                    </div>
                    {crossSell.bundlePrice && currentProduct && (
                      <span className="text-xs text-green-600 dark:text-green-400 shrink-0">
                        Save ${(currentProduct.price + (crossSell.relatedProduct?.price || 0) - crossSell.bundlePrice).toFixed(0)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={crossSell.active}
                      onCheckedChange={() => handleToggleActive(crossSell)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCrossSell(crossSell.id)}
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

      {/* Preview Section */}
      {crossSells.length > 0 && crossSells.some((c) => c.active) && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Preview</CardTitle>
            <CardDescription>
              How cross-sells will appear on your product page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {crossSells
                .filter((c) => c.active && c.relatedProduct)
                .slice(0, 3)
                .map((crossSell) => (
                  <div
                    key={crossSell.id}
                    className="p-3 bg-background rounded-lg border text-center"
                  >
                    <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">
                      {crossSell.relatedProduct?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {crossSell.bundlePrice ? (
                        <>
                          <span className="line-through mr-1">
                            ${crossSell.relatedProduct?.price}
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ${crossSell.bundlePrice}
                          </span>
                        </>
                      ) : (
                        `$${crossSell.relatedProduct?.price}`
                      )}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Cross-Sell Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title} - ${product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundlePrice">Bundle Price (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="bundlePrice"
                  type="number"
                  step="0.01"
                  className="pl-7"
                  placeholder="Special price when bought together"
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to use the original product price
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCrossSell}>Add Cross-Sell</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
