'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Megaphone,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { useGhostMode } from '@/hooks/useGhostMode';

const postTypes = [
  { value: 'TEXT', label: 'Text Post', description: 'Share your thoughts with the community', icon: FileText },
  { value: 'IMAGE', label: 'Image Post', description: 'Share images with your audience', icon: ImageIcon },
  { value: 'VIDEO', label: 'Video Post', description: 'Embed videos from YouTube, Vimeo, etc.', icon: Video },
  { value: 'ANNOUNCEMENT', label: 'Announcement', description: 'Important updates for your community', icon: Megaphone },
];

interface PostFormData {
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'ANNOUNCEMENT';
  imageUrl: string;
  videoUrl: string;
  isMemberOnly: boolean;
}

const DEFAULT_FORM_DATA: PostFormData = {
  title: '',
  content: '',
  type: 'TEXT',
  imageUrl: '',
  videoUrl: '',
  isMemberOnly: false,
};

export default function NewCommunityPostPage() {
  const { isGhostMode } = useGhostMode();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PostFormData>(DEFAULT_FORM_DATA);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In ghost mode, simulate successful creation
      if (isGhostMode) {
        toast({
          title: 'Post created',
          description: 'Your community post has been created successfully.',
        });
        router.push('/dashboard/community');
        return;
      }

      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create post');

      toast({
        title: 'Post created',
        description: 'Your community post has been created successfully.',
      });

      router.push('/dashboard/community');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create post. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = postTypes.find(t => t.value === formData.type);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/community">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Community Post</h1>
            <p className="text-muted-foreground">
              Create a new post to share with your community
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>
                Enter the details of your community post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Post Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Post Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'TEXT' | 'IMAGE' | 'VIDEO' | 'ANNOUNCEMENT') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    {postTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedType && (
                  <p className="text-xs text-muted-foreground">
                    {selectedType.description}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Exciting News: New Course Launch!"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Share your thoughts with your community..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Section - Show based on post type */}
          {formData.type === 'IMAGE' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image
                </CardTitle>
                <CardDescription>
                  Add an image URL to include in your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a direct link to your image (JPG, PNG, GIF)
                  </p>
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {formData.type === 'VIDEO' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video
                </CardTitle>
                <CardDescription>
                  Embed a video from YouTube, Vimeo, or other platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube, Vimeo, or other video URL
                  </p>
                </div>

                {/* Video URL Preview Info */}
                {formData.videoUrl && (
                  <div className="mt-4 p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      <span>Video will be embedded in your post</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {formData.type === 'ANNOUNCEMENT' && (
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Megaphone className="h-5 w-5" />
                  Announcement
                </CardTitle>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                  Announcements are highlighted and shown prominently to your community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Megaphone className="h-4 w-4" />
                  <span>This post will be marked as an announcement</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Label htmlFor="memberOnly">Members Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only paying members can view this post
                    </p>
                  </div>
                </div>
                <Switch
                  id="memberOnly"
                  checked={formData.isMemberOnly}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isMemberOnly: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !formData.title || !formData.content}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Create Post
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/community">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
  );
}
