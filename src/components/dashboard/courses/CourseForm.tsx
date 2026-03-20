"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useGhostMode } from "@/hooks/useGhostMode"
import type { Course, CourseInput } from "@/types/course"

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.number().min(0, "Price must be 0 or greater").max(10000, "Price must be less than $10,000"),
  published: z.boolean(),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

interface CourseFormProps {
  course?: Course
  isEditing?: boolean
}

export function CourseForm({ course, isEditing = false }: CourseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isGhostMode } = useGhostMode()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      image: course?.image || "",
      price: course?.price || 0,
      published: course?.published || false,
    },
  })

  async function onSubmit(data: CourseFormValues) {
    setIsLoading(true)

    try {
      const url = isEditing ? `/api/courses/${course?.id}` : "/api/courses"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-ghost-mode": isGhostMode ? "true" : "false",
          "x-creator-id": isGhostMode ? "ghost-user-id" : "",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || null,
          image: data.image || null,
          price: data.price,
          published: data.published,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to save course")
      }

      toast({
        title: isEditing ? "Course updated" : "Course created",
        description: isEditing 
          ? "Your course has been updated successfully." 
          : "Your course has been created. Now add modules and lessons!",
      })

      if (!isEditing) {
        router.push(`/dashboard/courses/${result.data.id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save course",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/courses">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <CardTitle>{isEditing ? "Edit Course" : "Create New Course"}</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update your course details below." 
                : "Fill in the details to create a new course."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Instagram Growth Masterclass" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, compelling title for your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what students will learn in this course..."
                      className="min-h-32 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description of what students will learn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    URL to the course cover image. You can use YouTube or Vimeo thumbnails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="99.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    The price students will pay for this course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published Toggle */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/40 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Make this course visible to students. You can unpublish anytime.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border/40 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/courses")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Course" : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
