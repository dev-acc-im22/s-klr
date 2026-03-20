'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Check, X, MessageSquare, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StarRating } from '@/components/dashboard/reviews';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  isApproved: boolean;
  helpful: number;
  createdAt: string;
  productId?: string;
  courseId?: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email?: string;
  };
  replies?: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
    };
  }>;
}

// Mock reviews for ghost mode
const mockReviews: Review[] = [
  {
    id: 'review-1',
    rating: 5,
    title: 'Excellent product!',
    content: 'This exceeded my expectations. The quality is amazing and the content is very well organized.',
    isVerified: true,
    isApproved: false,
    helpful: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    productId: 'product-1',
    user: { id: 'user-1', name: 'Sarah Johnson', image: '/avatars/sarah.svg' },
  },
  {
    id: 'review-2',
    rating: 4,
    title: 'Great value for money',
    content: 'Really good content overall. I learned a lot from this.',
    isVerified: true,
    isApproved: true,
    helpful: 12,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    productId: 'product-1',
    user: { id: 'user-2', name: 'Michael Chen', image: '/avatars/marcus.svg' },
  },
  {
    id: 'review-3',
    rating: 3,
    title: 'Could be better',
    content: 'The content is okay but I expected more depth. Some sections feel rushed.',
    isVerified: false,
    isApproved: false,
    helpful: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    courseId: 'course-1',
    user: { id: 'user-3', name: 'Emily Davis', image: '/avatars/emily.svg' },
  },
  {
    id: 'review-4',
    rating: 1,
    title: 'Very disappointed',
    content: 'This did not meet my expectations at all. The quality is poor and the content is outdated.',
    isVerified: true,
    isApproved: false,
    helpful: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    productId: 'product-2',
    user: { id: 'user-4', name: 'David Wilson', image: '/avatars/david.svg' },
  },
];

export default function ReviewsPage() {
  const { isGhostMode } = useGhostMode();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        if (isGhostMode) {
          setReviews(mockReviews);
        } else {
          const res = await fetch('/api/reviews?approved=all');
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [isGhostMode]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !review.isApproved) ||
      (statusFilter === 'approved' && review.isApproved);
    const matchesRating =
      ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleApprove = async (reviewId: string, approve: boolean) => {
    try {
      if (!isGhostMode) {
        await fetch(`/api/reviews/${reviewId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isApproved: approve }),
        });
      }

      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, isApproved: approve } : r
        )
      );

      toast({
        title: approve ? 'Review approved' : 'Review rejected',
        description: approve
          ? 'The review is now visible to customers'
          : 'The review has been rejected',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyContent.trim()) return;

    try {
      if (!isGhostMode) {
        await fetch(`/api/reviews/${selectedReview.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'current-user', // TODO: Get from session
            content: replyContent,
          }),
        });
      }

      setReviews(
        reviews.map((r) =>
          r.id === selectedReview.id
            ? {
                ...r,
                replies: [
                  ...(r.replies || []),
                  {
                    id: `reply-${Date.now()}`,
                    content: replyContent,
                    createdAt: new Date().toISOString(),
                    user: { id: 'current-user', name: 'You' },
                  },
                ],
              }
            : r
        )
      );

      toast({
        title: 'Reply sent',
        description: 'Your reply has been posted',
      });

      setReplyDialogOpen(false);
      setReplyContent('');
      setSelectedReview(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reply',
        variant: 'destructive',
      });
    }
  };

  const openReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setReplyContent('');
    setReplyDialogOpen(true);
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Moderate and respond to customer reviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-2xl font-bold mt-1">{reviews.length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-yellow-500" />
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">{pendingCount}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-2xl font-bold mt-1 text-green-600">{approvedCount}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-2xl font-bold mt-1">{averageRating.toFixed(1)}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading reviews...</p>
              </CardContent>
            </Card>
          ) : filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No reviews found</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.user.image || undefined} />
                        <AvatarFallback>
                          {review.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          {review.isVerified && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-700"
                            >
                              Verified
                            </Badge>
                          )}
                          {!review.isApproved && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-yellow-100 text-yellow-700"
                            >
                              Pending
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
                          {review.productId && (
                            <>
                              <span>·</span>
                              <span>Product</span>
                            </>
                          )}
                          {review.courseId && (
                            <>
                              <span>·</span>
                              <span>Course</span>
                            </>
                          )}
                        </div>
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-muted-foreground max-w-2xl">
                          {review.content}
                        </p>

                        {/* Replies */}
                        {review.replies && review.replies.length > 0 && (
                          <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-4">
                            {review.replies.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {reply.user.name}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Creator
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!review.isApproved ? (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(review.id, true)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApprove(review.id, false)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReplyDialog(review)}
                        >
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to Review</DialogTitle>
              <DialogDescription>
                Write a response to this review. Your reply will be visible to
                all customers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedReview && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={selectedReview.rating} size="sm" />
                    <span className="font-medium">{selectedReview.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.content}
                  </p>
                </div>
              )}
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={!replyContent.trim()}>
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
