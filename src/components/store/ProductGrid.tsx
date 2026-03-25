"use client";

import * as React from "react";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  featured?: boolean;
  salesCount?: number;
}

interface ProductGridProps {
  products: Product[];
  username: string;
  title?: string;
  showFeaturedOnly?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  username,
  title,
  showFeaturedOnly = false,
  className,
}: ProductGridProps) {
  const displayProducts = showFeaturedOnly
    ? products.filter((p) => p.featured)
    : products;

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-6", className)}>
      {title && (
        <h2 className="text-xl font-semibold text-foreground mb-4 px-1">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.images[0]}
            category={product.category}
            featured={product.featured}
            salesCount={product.salesCount}
            username={username}
          />
        ))}
      </div>
    </section>
  );
}
