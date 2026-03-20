'use client';

import { Percent, DollarSign, Tag, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DiscountBadgeProps {
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  code?: string;
  variant?: 'default' | 'compact' | 'banner';
  className?: string;
}

export function DiscountBadge({ 
  type, 
  value, 
  code,
  variant = 'default',
  className 
}: DiscountBadgeProps) {
  const discountText = type === 'PERCENTAGE' 
    ? `${value}% OFF` 
    : `$${value} OFF`;

  if (variant === 'banner') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg",
        "flex items-center justify-center gap-2 font-semibold shadow-sm",
        className
      )}>
        <Sparkles className="h-4 w-4" />
        <span>{discountText}</span>
        {code && (
          <code className="ml-1 px-2 py-0.5 bg-white/20 rounded text-xs">
            {code}
          </code>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Badge 
        variant="outline"
        className={cn(
          "bg-red-50 text-red-700 border-red-200",
          className
        )}
      >
        {type === 'PERCENTAGE' ? (
          <Percent className="h-3 w-3 mr-1" />
        ) : (
          <DollarSign className="h-3 w-3 mr-1" />
        )}
        {discountText}
      </Badge>
    );
  }

  return (
    <Badge 
      className={cn(
        "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 gap-1",
        className
      )}
    >
      <Tag className="h-3 w-3" />
      <span>{discountText}</span>
      {code && (
        <code className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
          {code}
        </code>
      )}
    </Badge>
  );
}

// Product-specific discount badge with more details
interface ProductDiscountBadgeProps {
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  originalPrice: number;
  code?: string;
  showSavings?: boolean;
  className?: string;
}

export function ProductDiscountBadge({ 
  type, 
  value, 
  originalPrice,
  code,
  showSavings = true,
  className 
}: ProductDiscountBadgeProps) {
  const discountAmount = type === 'PERCENTAGE' 
    ? (originalPrice * value) / 100 
    : value;
  
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <DiscountBadge type={type} value={value} code={code} />
      </div>
      {showSavings && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="font-semibold text-green-600">
            ${finalPrice.toFixed(2)}
          </span>
          <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
            Save ${discountAmount.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
