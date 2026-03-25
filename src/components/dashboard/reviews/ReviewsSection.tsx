"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ReviewSummary,
  ReviewList,
  ReviewForm,
} from "@/components/dashboard/reviews";
import { useGhostMode } from "@/hooks/useGhostMode";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  isApproved: boolean;
  helpful: number;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: Array<{
    id: string;
    content: string;
    createdAt: string | Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
}

interface ReviewsSectionProps {
  productId?: string;
  courseId?: string;
  creatorId?: string;
}

export function ReviewsSection({
  productId,
  courseId,
  creatorId,
}: ReviewsSectionProps) {
  const { isGhostMode } = useGhostMode();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [summary, setSummary] = React.useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [
      { star: 5, count: 0 },
      { star: 4, count: 0 },
      { star: 3, count: 0 },
      { star: 2, count: 0 },
      { star: 1, count: 0 },
    ],
  });
  const [loading, setLoading] = React.useState(true);
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [helpfulVotes, setHelpfulVotes] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        const params = new URLSearchParams();
        if (productId) params.append("productId", productId);
        if (courseId) params.append("courseId", courseId);
        if (isGhostMode) params.append("ghost", "true");
        params.append("approved", "true");

        const res = await fetch(`/api/reviews?${params.toString()}`);
        const data = await res.json();

        setReviews(data.reviews || []);
        setSummary(
          data.summary || {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: [
              { star: 5, count: 0 },
              { star: 4, count: 0 },
              { star: 3, count: 0 },
              { star: 2, count: 0 },
              { star: 1, count: 0 },
            ],
          }
        );
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, courseId, isGhostMode]);

  const handleMarkHelpful = async (reviewId: string) => {
    if (isGhostMode) {
      setHelpfulVotes((prev) => ({
        ...prev,
        [reviewId]: !prev[reviewId],
      }));
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current-user" }), // TODO: Get from session
      });
      const data = await res.json();

      setHelpfulVotes((prev) => ({
        ...prev,
        [reviewId]: data.helpful,
      }));

      // Update review helpful count in local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, helpful: data.helpful ? r.helpful + 1 : r.helpful - 1 }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
  };

  const handleReply = async (reviewId: string, content: string) => {
    if (isGhostMode) {
      // Mock reply for ghost mode
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                replies: [
                  ...(r.replies || []),
                  {
                    id: `reply-${Date.now()}`,
                    content,
                    createdAt: new Date(),
                    user: { id: "creator", name: "Creator", image: null },
                  },
                ],
              }
            : r
        )
      );
      return;
    }

    try {
      await fetch(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user", // TODO: Get from session
          content,
        }),
      });

      // Reload reviews to get the new reply
      const params = new URLSearchParams();
      if (productId) params.append("productId", productId);
      if (courseId) params.append("courseId", courseId);
      params.append("approved", "true");

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const handleReviewSubmit = (review: { rating: number; title: string; content: string }) => {
    // Mock for now - in real app this would be handled by the form
    setReviews((prev) => [
      {
        id: `review-${Date.now()}`,
        ...review,
        isVerified: false,
        isApproved: false,
        helpful: 0,
        createdAt: new Date(),
        user: { id: "user", name: "You", image: null },
        replies: [],
      },
      ...prev,
    ]);
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <ReviewSummary
            averageRating={summary.averageRating}
            totalReviews={summary.totalReviews}
            ratingDistribution={summary.ratingDistribution}
            onWriteReview={() => setShowReviewForm(true)}
          />

          <Separator />

          {/* Reviews List */}
          <ReviewList
            reviews={reviews}
            creatorId={creatorId}
            onMarkHelpful={handleMarkHelpful}
            onReply={handleReply}
            helpfulVotes={helpfulVotes}
            ghostMode={isGhostMode}
          />
        </CardContent>
      </Card>

      {/* Review Form Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            productId={productId}
            courseId={courseId}
            onSubmit={handleReviewSubmit}
            onSuccess={() => setShowReviewForm(false)}
            onCancel={() => setShowReviewForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
