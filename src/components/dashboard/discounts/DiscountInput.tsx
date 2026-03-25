'use client';

import { useState } from 'react';
import {
  Tag,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DiscountInputProps {
  onApply: (discount: {
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    discountAmount: number;
    finalAmount: number;
  }) => void;
  onRemove: () => void;
  currentAmount: number;
  productIds?: string[];
  appliedDiscount?: {
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    discountAmount: number;
  } | null;
}

export function DiscountInput({ 
  onApply, 
  onRemove, 
  currentAmount, 
  productIds = [],
  appliedDiscount 
}: DiscountInputProps) {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          amount: currentAmount,
          productIds,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        onApply({
          id: data.discount.id,
          code: data.discount.code,
          type: data.discount.type,
          value: data.discount.value,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
        });
        
        toast({
          title: 'Discount Applied!',
          description: data.message,
        });
        
        setCode('');
      } else {
        setError(data.error || 'Invalid discount code');
      }
    } catch {
      setError('Failed to validate discount code');
      toast({
        title: 'Error',
        description: 'Failed to validate discount code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  if (appliedDiscount) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <code className="font-mono font-semibold text-green-800">
                  {appliedDiscount.code}
                </code>
                <Badge className="bg-green-500 text-white">
                  {appliedDiscount.type === 'PERCENTAGE' 
                    ? `${appliedDiscount.value}% off` 
                    : `$${appliedDiscount.value} off`}
                </Badge>
              </div>
              <p className="text-sm text-green-700">
                You save ${appliedDiscount.discountAmount.toFixed(2)}!
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRemove}
            className="text-green-700 hover:text-green-800 hover:bg-green-100"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Have a discount code?</span>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Enter code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            className={`uppercase ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={loading}
          />
        </div>
        <Button onClick={handleApply} disabled={loading || !code.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              Apply
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <XCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
