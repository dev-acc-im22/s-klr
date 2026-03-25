'use client';

import { useState, useMemo } from 'react';
import { Users, MessageSquare, Heart, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useGhostMode } from '@/hooks/useGhostMode';

import { mockCommunityPosts, mockComments } from '@/lib/mock-data/features';
import { PostCard, type PostCardProps } from '@/components/dashboard/community/PostCard';
import type { Comment } from '@/components/dashboard/community/CommentSection';

export default function CommunityPage() {
  const { isGhostMode, ghostUser } = useGhostMode();
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [comments, setComments] = useState(mockComments);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Convert mock posts to PostCard props format
  const postsData: PostCardProps[] = useMemo(() => {
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: 'TEXT' as const,
      isPinned: post.isPinned,
      isLocked: post.isLocked,
      isMemberOnly: false,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: comments.filter(c => c.postId === post.id).length,
      createdAt: post.createdAt,
      creator: {
        name: post.author.name,
        username: post.author.username,
      },
      isLiked: likedPosts.has(post.id),
      comments: comments
        .filter(c => c.postId === post.id)
        .map(c => ({
          id: c.id,
          author: c.author,
          content: c.content,
          createdAt: c.createdAt,
          likes: c.likes,
          isLiked: c.isLiked,
        })) as Comment[],
      isAdmin: true,
      currentUser: ghostUser ? { name: ghostUser.name || 'Ghost User' } : undefined,
    }));
  }, [posts, comments, likedPosts, ghostUser]);

  // Sort posts: pinned first, then by date
  const sortedPosts = useMemo(() => {
    return [...postsData].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [postsData]);

  // Stats
  const totalPosts = posts.length;
  const totalViews = posts.reduce((acc, p) => acc + p.viewCount, 0);
  const totalLikes = posts.reduce((acc, p) => acc + p.likeCount, 0);

  // Handlers
  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setPosts(prevPosts =>
          prevPosts.map(p =>
            p.id === postId ? { ...p, likeCount: Math.max(0, p.likeCount - 1) } : p
          )
        );
      } else {
        newSet.add(postId);
        setPosts(prevPosts =>
          prevPosts.map(p =>
            p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p
          )
        );
      }
      return newSet;
    });
  };

  const handlePin = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, isPinned: !p.isPinned } : p
      )
    );
  };

  const handleLock = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, isLocked: !p.isLocked } : p
      )
    );
  };

  const handleDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    setComments(prevComments => prevComments.filter(c => c.postId !== postId));
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment = {
      id: `c-new-${Date.now()}`,
      postId,
      content,
      author: { name: ghostUser?.name || 'You' },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    };
    setComments(prev => [...prev, newComment]);
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      )
    );
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  const handleNewPost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: `post-new-${Date.now()}`,
      title: newPostContent.split('\n')[0].slice(0, 50),
      content: newPostContent,
      isPinned: false,
      isLocked: false,
      viewCount: 0,
      createdAt: new Date(),
      author: { name: ghostUser?.name || 'Ghost Admin', username: 'ghostadmin' },
      likeCount: 0,
      commentCount: 0,
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Build and engage with your exclusive community
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/community/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,205</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Post</CardTitle>
            <CardDescription>Share something with your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="mb-2 min-h-[100px]"
                />
                <Button disabled={!newPostContent.trim()} onClick={handleNewPost}>
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onLike={handleLike}
              onPin={handlePin}
              onLock={handleLock}
              onDelete={handleDelete}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          ))}
        </div>
      </div>
  );
}
