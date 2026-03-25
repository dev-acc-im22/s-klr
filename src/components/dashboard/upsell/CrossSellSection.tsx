'use client';

import * as React from 'react';
import { Package, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CrossSellProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  bundlePrice?: number;
  image?: string;
  category?: string;
  salesCount?: number;
}

interface CrossSellSectionProps {
  products: CrossSellProduct[];
  mainProductPrice: number;
  onAddToCart: (productId: string, isBundle?: boolean) => void;
  onProductClick?: (productId: string) => void;
  className?: string;
}

export function CrossSellSection({
  products,
  mainProductPrice,
  onAddToCart,
  onProductClick,
  className,
}: CrossSellSectionProps) {
  const [addedProducts, setAddedProducts] = React.useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = React.useState<string | null>(null);

  const handleAddToCart = async (product: CrossSellProduct) => {
    setIsAdding(product.id);
    try {
      await onAddToCart(product.id, !!product.bundlePrice);
      setAddedProducts((prev) => new Set(prev).add(product.id));
    } finally {
      setIsAdding(null);
    }
  };

  const calculateBundleTotal = () => {
    const selectedProducts = products.filter(
      (p) => addedProducts.has(p.id) && p.bundlePrice
    );
    const regularTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const bundleTotal = selectedProducts.reduce(
      (sum, p) => sum + (p.bundlePrice || p.price),
      0
    );
    return { regularTotal, bundleTotal, savings: regularTotal - bundleTotal };
  };

  if (products.length === 0) return null;

  const { savings } = calculateBundleTotal();

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">You might also like</h3>
          <p className="text-sm text-muted-foreground">
            Products frequently bought together
          </p>
        </div>
        {savings > 0 && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Bundle Savings: ${savings.toFixed(0)}
          </Badge>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const isAdded = addedProducts.has(product.id);
          const isProcessing = isAdding === product.id;
          const showBundlePrice = product.bundlePrice && product.bundlePrice < product.price;

          return (
            <Card
              key={product.id}
              className={cn(
                'transition-all overflow-hidden cursor-pointer hover:shadow-md',
                isAdded && 'ring-2 ring-primary'
              )}
              onClick={() => onProductClick?.(product.id)}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.category && (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.category}
                    </Badge>
                  )}
                  {isAdded && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-medium line-clamp-1">{product.title}</h4>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    {showBundlePrice ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          ${product.bundlePrice!.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Save ${(product.price - product.bundlePrice!).toFixed(0)}
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Sales Count */}
                  {product.salesCount !== undefined && product.salesCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {product.salesCount.toLocaleString()} sold
                    </p>
                  )}

                  {/* Add Button */}
                  <Button
                    size="sm"
                    className="w-full"
                    variant={isAdded ? 'secondary' : 'default'}
                    disabled={isProcessing || isAdded}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {isProcessing ? (
                      'Adding...'
                    ) : isAdded ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bundle All Button */}
      {products.length > 1 && products.some((p) => p.bundlePrice) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Get all {products.length} products</p>
                <p className="text-sm text-muted-foreground">
                  Bundle and save even more
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-xl font-bold text-primary">
                    $
                    {products
                      .reduce((sum, p) => sum + (p.bundlePrice || p.price), 0)
                      .toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    $
                    {products
                      .reduce((sum, p) => sum + p.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    products.forEach((p) => onAddToCart(p.id, true));
                    setAddedProducts(new Set(products.map((p) => p.id)));
                  }}
                >
                  Add All to Cart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
