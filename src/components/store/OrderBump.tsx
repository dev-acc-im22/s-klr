'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Check, Zap, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mockUpsellOffers, UpsellOffer } from '@/lib/mock-data/upsells';

interface OrderBumpProps {
  productId: string;
  onBumpAdded: (bump: { offerId: string; productId: string; price: number }) => void;
  onBumpRemoved: (offerId: string) => void;
}

export function OrderBump({ productId, onBumpAdded, onBumpRemoved }: OrderBumpProps) {
  const [orderBumps, setOrderBumps] = useState<UpsellOffer[]>([]);
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderBumps();
  }, [productId]);

  const loadOrderBumps = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const bumps = mockUpsellOffers.filter(
        (u) =>
          u.productId === productId &&
          u.active &&
          u.upsellType === 'ORDER_BUMP'
      ).sort((a, b) => a.displayOrder - b.displayOrder);

      setOrderBumps(bumps);
    } catch (error) {
      console.error('Error loading order bumps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (bump: UpsellOffer) => {
    const newSelected = new Set(selectedBumps);

    if (newSelected.has(bump.id)) {
      newSelected.delete(bump.id);
      onBumpRemoved(bump.id);
    } else {
      newSelected.add(bump.id);
      onBumpAdded({
        offerId: bump.id,
        productId: bump.offerProductId,
        price: bump.discountPrice,
      });
    }

    setSelectedBumps(newSelected);
  };

  if (loading || orderBumps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {orderBumps.map((bump) => {
        const isSelected = selectedBumps.has(bump.id);
        const savings = (bump.offerProduct?.price || 0) - bump.discountPrice;

        return (
          <Card
            key={bump.id}
            className={cn(
              'transition-all cursor-pointer',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-dashed hover:border-primary/50'
            )}
            onClick={() => handleToggle(bump)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox indicator */}
                <div
                  className={cn(
                    'mt-1 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0',
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">{bump.title}</span>
                    {savings > 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Save ${savings.toFixed(0)}
                      </Badge>
                    )}
                  </div>
                  {bump.description && (
                    <p className="text-sm text-muted-foreground">
                      {bump.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-primary">
                      +${bump.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {bump.offerProduct?.title}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
