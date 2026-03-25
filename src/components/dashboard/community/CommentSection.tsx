"use client";

import * as React from "react";
import { useState } from "react";
import { useHydrated } from "@/components/providers/HydrationProvider";
import { formatDistanceToNow } from "date-fns";
import { Heart, Send, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isLocked?: boolean;
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

export function CommentSection({
  postId,
  comments,
  isLocked = false,
  onAddComment,
  onLikeComment,
  currentUser,
}: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const mounted = useHydrated();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(postId, newComment.trim());
      setNewComment("");
    }
  };

  const formatTimestamp = (date: Date) => {
    if (!mounted) {
      return <Skeleton className="h-4 w-16 inline-block" />;
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{comments.length} comments</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Comments List */}
      {isExpanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {isLocked ? (
            <p className="text-sm text-muted-foreground italic text-center py-2">
              Comments are disabled for this post.
            </p>
          ) : (
            <>
              {/* Existing Comments */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {comment.author.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 break-words">
                        {comment.content}
                      </p>
                      <button
                        onClick={() => onLikeComment?.(postId, comment.id)}
                        className={cn(
                          "flex items-center gap-1 mt-1 text-xs transition-colors",
                          comment.isLiked
                            ? "text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart
                          className={cn("h-3 w-3", comment.isLiked && "fill-current")}
                        />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              {currentUser && (
                <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {currentUser.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      disabled={!newComment.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
