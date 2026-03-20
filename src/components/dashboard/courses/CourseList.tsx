"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  GraduationCap,
  DollarSign,
  Users,
  Star,
  Clock,
  BookOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useGhostMode } from "@/hooks/useGhostMode"
import type { Course, CourseWithModules, countLessons, calculateTotalDuration } from "@/types/course"
import { formatDuration } from "@/types/course"

interface CourseListProps {
  courses: CourseWithModules[]
  onRefresh?: () => void
}

export function CourseList({ courses, onRefresh }: CourseListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isGhostMode } = useGhostMode()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  async function handleDelete(courseId: string) {
    setDeletingId(courseId)

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "x-ghost-mode": isGhostMode ? "true" : "false",
          "x-creator-id": isGhostMode ? "ghost-user-id" : "",
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to delete course")
      }

      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      })

      onRefresh?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete course",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (courses.length === 0) {
    return (
      <Card className="border-dashed border-border/60">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first course to start teaching and earning.
          </p>
          <Button asChild>
            <Link href="/dashboard/courses/new">
              Create Your First Course
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const lessonsCount = course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        )
        const totalDuration = course.modules.reduce(
          (total, module) => 
            total + module.lessons.reduce(
              (moduleTotal, lesson) => moduleTotal + (lesson.duration || 0),
              0
            ),
          0
        )
        const revenue = course.enrollmentCount * course.price

        return (
          <Card key={course.id} className="overflow-hidden border-border/40 flex flex-col">
            {/* Course Image */}
            <div className="relative aspect-video bg-muted">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <GraduationCap className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={course.published ? "default" : "secondary"}>
                  {course.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description || "No description"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-2 flex-1">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{lessonsCount} lessons</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{course.rating > 0 ? course.rating.toFixed(1) : "No ratings"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>${course.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Revenue:</span>{" "}
                  <span className="text-primary">${revenue.toFixed(2)}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/courses/${course.id}/curriculum`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Curriculum
                      </Link>
                    </DropdownMenuItem>
                    {course.published && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${"demo"}/course/${course.id}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View Public Page
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{course.title}&quot;? This action cannot be undone and will remove all modules and lessons.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(course.id)}
                            disabled={deletingId === course.id}
                          >
                            {deletingId === course.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
