'use client';

import * as React from 'react';
import { X, Check, Sparkles, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upsell: {
    id: string;
    title: string;
    description?: string;
    discountPrice: number;
    originalPrice: number;
    productName: string;
    productImage?: string;
    upsellType: 'ONE_CLICK' | 'ORDER_BUMP' | 'BUNDLE';
    timeLimit?: number; // seconds
  };
  onAccept: () => void;
  onDecline: () => void;
}

export function UpsellModal({
  open,
  onOpenChange,
  upsell,
  onAccept,
  onDecline,
}: UpsellModalProps) {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Countdown timer
  React.useEffect(() => {
    if (open && upsell.timeLimit) {
      setTimeLeft(upsell.timeLimit);
    }
  }, [open, upsell.timeLimit]);

  React.useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-close when timer runs out
  React.useEffect(() => {
    if (timeLeft === 0 && open) {
      onDecline();
    }
  }, [timeLeft, open, onDecline]);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } finally {
      setIsProcessing(false);
    }
  };

  const savings = upsell.originalPrice - upsell.discountPrice;
  const discountPercent = Math.round((savings / upsell.originalPrice) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden">
        {/* Close Button */}
        <button
          onClick={onDecline}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Timer Badge */}
        {timeLeft !== null && timeLeft > 0 && (
          <div className="absolute left-4 top-4">
            <Badge variant="destructive" className="animate-pulse">
              <Clock className="mr-1 h-3 w-3" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Badge>
          </div>
        )}

        <DialogHeader className="text-center sm:text-center pt-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {upsell.upsellType === 'ONE_CLICK' ? (
              <Sparkles className="h-6 w-6 text-primary" />
            ) : upsell.upsellType === 'ORDER_BUMP' ? (
              <Zap className="h-6 w-6 text-primary" />
            ) : (
              <Sparkles className="h-6 w-6 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl">
            {upsell.upsellType === 'ONE_CLICK'
              ? 'Special One-Time Offer!'
              : upsell.upsellType === 'ORDER_BUMP'
                ? 'Add to Your Order?'
                : 'Bundle & Save!'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {upsell.title}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Product Preview */}
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border">
            {upsell.productImage && (
              <div className="shrink-0">
                <img
                  src={upsell.productImage}
                  alt={upsell.productName}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold">{upsell.productName}</h4>
              {upsell.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {upsell.description}
                </p>
              )}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-primary">
                  ${upsell.discountPrice.toFixed(2)}
                </span>
                <span className="text-muted-foreground line-through">
                  ${upsell.originalPrice.toFixed(2)}
                </span>
                {savings > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Save {discountPercent}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>One-click add to your order</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>No additional checkout required</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              <span>Instant access after purchase</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            size="lg"
            className="w-full text-base font-semibold"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                Yes, Add for ${upsell.discountPrice.toFixed(2)}
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onDecline}
          >
            No thanks, continue without
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
