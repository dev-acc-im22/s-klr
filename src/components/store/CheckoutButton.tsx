"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OrderBump } from "./OrderBump";

interface CheckoutButtonProps {
  price: number;
  title: string;
  productId: string;
  type?: "product" | "course";
  className?: string;
  onClick?: () => void;
}

interface OrderBumpItem {
  offerId: string;
  productId: string;
  price: number;
}

export function CheckoutButton({
  price,
  title,
  productId,
  type = "product",
  className,
  onClick,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderBumps, setOrderBumps] = React.useState<OrderBumpItem[]>([]);
  const [showUpsellModal, setShowUpsellModal] = React.useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show upsell modal after purchase (simulated)
    setShowUpsellModal(true);
    setIsLoading(false);
  };

  const handleBumpAdded = (bump: OrderBumpItem) => {
    setOrderBumps((prev) => [...prev, bump]);
  };

  const handleBumpRemoved = (offerId: string) => {
    setOrderBumps((prev) => prev.filter((b) => b.offerId !== offerId));
  };

  const totalPrice = price + orderBumps.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Order Bumps */}
      <OrderBump
        productId={productId}
        onBumpAdded={handleBumpAdded}
        onBumpRemoved={handleBumpRemoved}
      />

      {/* Price Display */}
      <div className="space-y-2">
        {orderBumps.length > 0 && (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{title}</span>
              <span>${price.toFixed(2)}</span>
            </div>
            {orderBumps.map((bump) => (
              <div
                key={bump.offerId}
                className="flex items-center justify-between text-sm text-muted-foreground"
              >
                <span>+ Add-on</span>
                <span>${bump.price.toFixed(2)}</span>
              </div>
            ))}
            <Separator />
          </>
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">
            {totalPrice === 0 ? "Free" : `$${totalPrice.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        size="lg"
        className="w-full text-base font-semibold btn-press"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </div>
        ) : (
          <>
            {totalPrice === 0
              ? `Get ${type === "course" ? "Free Access" : "It Free"}`
              : `Buy Now - $${totalPrice.toFixed(2)}`}
          </>
        )}
      </Button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Money-back guarantee</span>
        </div>
      </div>
    </div>
  );
}
