"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRatingCompact } from "@/components/dashboard/reviews";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  salesCount?: number;
  rating?: number;
  reviewCount?: number;
  username: string;
  className?: string;
}

export function ProductCard({
  id,
  title,
  description,
  price,
  image,
  category,
  featured,
  salesCount,
  rating = 0,
  reviewCount = 0,
  username,
  className,
}: ProductCardProps) {
  return (
    <Link href={`/${username}/product/${id}`}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card h-full",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {featured && (
            <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {category && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {category}
            </span>
          )}

          {/* Title */}
          <h3 className="mt-1 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Rating */}
          {(rating > 0 || reviewCount > 0) && (
            <div className="mt-2">
              <StarRatingCompact
                rating={rating}
                reviewCount={reviewCount}
                size="sm"
              />
            </div>
          )}

          {/* Price & Stats */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {price === 0 ? "Free" : `$${price}`}
            </span>
            {salesCount !== undefined && salesCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {salesCount.toLocaleString()} sold
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
