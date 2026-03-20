"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Megaphone,
  Pin,
  Lock,
  Crown,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["TEXT", "IMAGE", "VIDEO", "ANNOUNCEMENT"]),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  videoType: z.enum(["youtube", "vimeo"]).optional(),
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
  isMemberOnly: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  initialData?: Partial<PostFormData>;
  postId?: string;
  isEditing?: boolean;
}

const postTypes = [
  {
    value: "TEXT",
    label: "Text Post",
    icon: FileText,
    description: "Share your thoughts with the community",
  },
  {
    value: "IMAGE",
    label: "Image Post",
    icon: ImageIcon,
    description: "Share images with your audience",
  },
  {
    value: "VIDEO",
    label: "Video Post",
    icon: Video,
    description: "Embed videos from YouTube or Vimeo",
  },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
    icon: Megaphone,
    description: "Important updates for your community",
  },
] as const;

export function CreatePostForm({ initialData, postId, isEditing = false }: CreatePostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<PostFormData["type"]>(
    initialData?.type || "TEXT"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "TEXT",
      imageUrl: initialData?.imageUrl || "",
      videoUrl: initialData?.videoUrl || "",
      videoType: initialData?.videoType || "youtube",
      isPinned: initialData?.isPinned || false,
      isLocked: initialData?.isLocked || false,
      isMemberOnly: initialData?.isMemberOnly || false,
    },
  });

  const watchedType = watch("type");

  React.useEffect(() => {
    setSelectedType(watchedType);
  }, [watchedType]);

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const url = isEditing
        ? `/api/community/posts/${postId}?ghost=true`
        : "/api/community/posts?ghost=true";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: isEditing
          ? "Your post has been updated successfully."
          : "Your post has been created successfully.",
      });

      router.push("/dashboard/community");
      router.refresh();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Post Type Selection */}
      <div className="space-y-3">
        <Label>Post Type</Label>
        <Tabs
          value={selectedType}
          onValueChange={(value) => setValue("type", value as PostFormData["type"])}
        >
          <TabsList className="grid w-full grid-cols-4">
            {postTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                <type.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {postTypes.map((type) => (
            <TabsContent key={type.value} value={type.value} className="mt-0">
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </TabsContent>
          ))}
        </Tabs>
        <input type="hidden" {...register("type")} />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter post title..."
          {...register("title")}
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Write your post content..."
          rows={8}
          {...register("content")}
          className={cn(errors.content && "border-destructive")}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Supports basic formatting: **bold**, - bullet points
        </p>
      </div>

      {/* Image URL (for IMAGE type) */}
      {selectedType === "IMAGE" && (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            {...register("imageUrl")}
            className={cn(errors.imageUrl && "border-destructive")}
          />
          {errors.imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter a valid image URL. For best results, use images with 16:9 aspect ratio.
          </p>
        </div>
      )}

      {/* Video URL (for VIDEO type) */}
      {selectedType === "VIDEO" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Video Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoType">Video Platform</Label>
              <Select
                value={watch("videoType")}
                onValueChange={(value) => setValue("videoType", value as "youtube" | "vimeo")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("videoType")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Embed URL</Label>
              <Input
                id="videoUrl"
                placeholder={
                  watch("videoType") === "youtube"
                    ? "https://www.youtube.com/embed/VIDEO_ID"
                    : "https://player.vimeo.com/video/VIDEO_ID"
                }
                {...register("videoUrl")}
                className={cn(errors.videoUrl && "border-destructive")}
              />
              {errors.videoUrl && (
                <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch("videoType") === "youtube"
                  ? "Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID"
                  : "Use the player URL format: https://player.vimeo.com/video/VIDEO_ID"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Post Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-primary" />
                <Label htmlFor="isPinned">Pin Post</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Pinned posts appear at the top of the community feed
              </p>
            </div>
            <Switch
              id="isPinned"
              checked={watch("isPinned")}
              onCheckedChange={(checked) => setValue("isPinned", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="isLocked">Lock Discussion</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Prevent new comments on this post
              </p>
            </div>
            <Switch
              id="isLocked"
              checked={watch("isLocked")}
              onCheckedChange={(checked) => setValue("isLocked", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <Label htmlFor="isMemberOnly">Members Only</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Only show this post to paying members
              </p>
            </div>
            <Switch
              id="isMemberOnly"
              checked={watch("isMemberOnly")}
              onCheckedChange={(checked) => setValue("isMemberOnly", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
