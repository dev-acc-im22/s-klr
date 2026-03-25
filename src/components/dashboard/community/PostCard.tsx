"use client";

import * as React from "react";
import { useHydrated } from "@/components/providers/HydrationProvider";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  Unlock,
  Crown,
  Play,
  FileText,
  Image as ImageIcon,
  Video,
  Megaphone,
  MoreHorizontal,
  Trash2,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CommentSection,
  type Comment,
} from "@/components/dashboard/community/CommentSection";

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "ANNOUNCEMENT";
  imageUrl?: string;
  videoUrl?: string;
  videoType?: "youtube" | "vimeo";
  isPinned: boolean;
  isLocked: boolean;
  isMemberOnly: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  creator: {
    name: string;
    username: string;
    avatar?: string;
  };
  isLiked?: boolean;
  comments?: Comment[];
  isAdmin?: boolean;
  currentUser?: {
    name: string;
    avatar?: string;
  };
  onLike?: (id: string) => void;
  onPin?: (id: string) => void;
  onLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  showFullContent?: boolean;
}

const postTypeIcons = {
  TEXT: FileText,
  IMAGE: ImageIcon,
  VIDEO: Video,
  ANNOUNCEMENT: Megaphone,
};

const postTypeColors = {
  TEXT: "bg-muted text-muted-foreground",
  IMAGE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  VIDEO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ANNOUNCEMENT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function PostCard({
  id,
  title,
  content,
  type,
  imageUrl,
  videoUrl,
  isPinned,
  isLocked,
  isMemberOnly,
  viewCount,
  likeCount,
  commentCount,
  createdAt,
  creator,
  isLiked,
  comments = [],
  isAdmin = false,
  currentUser,
  onLike,
  onPin,
  onLock,
  onDelete,
  onAddComment,
  onLikeComment,
  showFullContent = false,
}: PostCardProps) {
  const TypeIcon = postTypeIcons[type];
  const mounted = useHydrated();

  const truncateContent = (text: string, maxLength: number) => {
    if (showFullContent) return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatContent = (text: string) => {
    const truncated = truncateContent(text, showFullContent ? 1000 : 200);
    return truncated.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line.startsWith("**") && line.endsWith("**") ? (
          <strong>{line.slice(2, -2)}</strong>
        ) : line.startsWith("- ") ? (
          <span className="pl-4 block">• {line.slice(2)}</span>
        ) : (
          line
        )}
        {i < truncated.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const formatTimestamp = (date: Date) => {
    if (!mounted) {
      return <Skeleton className="h-4 w-24 inline-block" />;
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-md",
        isPinned && "ring-2 ring-primary/20 bg-primary/5"
      )}
    >
      {/* Pinned indicator */}
      {isPinned && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-primary/50" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {creator.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{creator.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("text-xs", postTypeColors[type])}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </Badge>
            {isMemberOnly && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                <Crown className="h-3 w-3 mr-1" />
                Members
              </Badge>
            )}
            {/* Admin Actions Menu */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPin?.(id)}>
                    {isPinned ? (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        Unpin Post
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        Pin Post
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLock?.(id)}>
                    {isLocked ? (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock Comments
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Lock Comments
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <Link href={`/dashboard/community/${id}`}>
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
            {isPinned && <Pin className="inline h-4 w-4 mr-1 text-primary" />}
            {title}
          </h3>
        </Link>

        {/* Content preview */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          {formatContent(content)}
        </div>

        {/* Image */}
        {type === "IMAGE" && imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Video embed */}
        {type === "VIDEO" && videoUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {videoType === "youtube" ? (
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-6 w-6 text-primary" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* Engagement stats */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 text-muted-foreground hover:text-red-500",
                isLiked && "text-red-500"
              )}
              onClick={(e) => {
                e.preventDefault();
                onLike?.(id);
              }}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span>{likeCount}</span>
            </Button>

            {/* Comment Count */}
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount}</span>
            </Button>

            {/* View Count */}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm px-2">
              <Eye className="h-4 w-4" />
              <span>{viewCount}</span>
            </div>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-primary"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {isPinned && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            {isLocked && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection
          postId={id}
          comments={comments}
          isLocked={isLocked}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          currentUser={currentUser}
        />
      </CardContent>
    </Card>
  );
}
