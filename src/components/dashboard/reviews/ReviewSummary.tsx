"use client";

import * as React from "react";
import { StarRating, StarRatingCompact } from "./StarRating";
import { Progress } from "@/components/ui/progress";

interface RatingDistribution {
  star: number;
  count: number;
}

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  showWriteReview?: boolean;
  onWriteReview?: () => void;
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  showWriteReview = true,
  onWriteReview,
}: ReviewSummaryProps) {
  // Calculate percentage for each star
  const maxCount = Math.max(...ratingDistribution.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* Overall Rating */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="md" className="justify-center mt-1" />
          <div className="text-sm text-muted-foreground mt-1">
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-1.5">
          {ratingDistribution
            .slice()
            .reverse()
            .map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-3">
                  {star}
                </span>
                <svg
                  className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <Progress
                  value={(count / maxCount) * 100}
                  className="h-2 flex-1"
                />
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Write Review Button */}
      {showWriteReview && onWriteReview && (
        <button
          onClick={onWriteReview}
          className="text-sm text-primary hover:underline"
        >
          Write a review
        </button>
      )}
    </div>
  );
}

// Compact version for cards and lists
export function ReviewSummaryCompact({
  averageRating,
  totalReviews,
}: {
  averageRating: number;
  totalReviews: number;
}) {
  return (
    <StarRatingCompact
      rating={averageRating}
      reviewCount={totalReviews}
    />
  );
}
