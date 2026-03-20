"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

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

interface ReviewListProps {
  productId?: string;
  courseId?: string;
  reviews: Review[];
  currentUserId?: string;
  creatorId?: string;
  onMarkHelpful?: (reviewId: string) => void;
  onReply?: (reviewId: string, content: string) => void;
  helpfulVotes?: Record<string, boolean>;
  ghostMode?: boolean;
}

export function ReviewList({
  reviews,
  currentUserId,
  creatorId,
  onMarkHelpful,
  onReply,
  helpfulVotes = {},
  ghostMode = false,
}: ReviewListProps) {
  const [sortBy, setSortBy] = React.useState("recent");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState("");

  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "rating_high":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "rating_low":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "helpful":
        return sorted.sort((a, b) => b.helpful - a.helpful);
      case "recent":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [reviews, sortBy]);

  const handleReplySubmit = (reviewId: string) => {
    if (replyContent.trim() && onReply) {
      onReply(reviewId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rating_high">Highest Rated</SelectItem>
            <SelectItem value="rating_low">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="space-y-3">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={review.user.image || undefined} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {review.user.name || "Anonymous"}
                    </span>
                    {review.isVerified && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <StarRating rating={review.rating} size="sm" />
                    <span>·</span>
                    <span>
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h4 className="font-medium text-foreground mb-1">
                {review.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {review.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  helpfulVotes[review.id] && "text-primary"
                )}
                onClick={() => onMarkHelpful?.(review.id)}
                disabled={ghostMode}
              >
                <ThumbsUp
                  className={cn(
                    "w-4 h-4 mr-1",
                    helpfulVotes[review.id] && "fill-current"
                  )}
                />
                Helpful ({review.helpful})
              </Button>

              {creatorId && currentUserId === creatorId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setReplyingTo(replyingTo === review.id ? null : review.id)
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === review.id && (
              <div className="ml-4 space-y-3">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReplySubmit(review.id)}
                    disabled={!replyContent.trim()}
                  >
                    Submit Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {review.replies && review.replies.length > 0 && (
              <div className="ml-4 space-y-3 border-l-2 border-primary/20 pl-4">
                {review.replies.map((reply) => (
                  <div key={reply.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage src={reply.user.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {reply.user.name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {reply.user.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Creator
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
