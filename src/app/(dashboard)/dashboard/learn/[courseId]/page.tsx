'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  Check,
  Award,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useGhostMode } from '@/hooks/useGhostMode';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  moduleId: string;
  moduleTitle: string;
}

interface LessonProgress {
  completed: boolean;
  percentage: number;
  lastPosition: number;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string;
  enrollmentId: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalDuration: number;
  lessons: Lesson[];
  lessonProgress: Record<string, LessonProgress>;
  nextLesson: {
    lessonId: string;
    lessonTitle: string;
    moduleId: string;
    moduleTitle: string;
  } | null;
}

// Mock data for ghost mode
const mockCourseData: CourseData = {
  id: 'course-1',
  title: 'Build Your Creator Business',
  description:
    'A complete course on building a sustainable creator business. Learn how to monetize your content, build products, and create multiple income streams.',
  image:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  enrollmentId: 'enrollment-1',
  progress: 35,
  totalLessons: 9,
  completedLessons: 3,
  totalDuration: 180,
  lessons: [
    {
      id: 'les-1',
      title: 'Welcome & Overview',
      duration: 330,
      order: 1,
      moduleId: 'mod-1',
      moduleTitle: 'Getting Started',
    },
    {
      id: 'les-2',
      title: 'Setting Your Goals',
      duration: 720,
      order: 2,
      moduleId: 'mod-1',
      moduleTitle: 'Getting Started',
    },
    {
      id: 'les-3',
      title: 'Finding Your Niche',
      duration: 1125,
      order: 3,
      moduleId: 'mod-1',
      moduleTitle: 'Getting Started',
    },
    {
      id: 'les-4',
      title: 'Content Planning',
      duration: 900,
      order: 4,
      moduleId: 'mod-2',
      moduleTitle: 'Content Strategy',
    },
    {
      id: 'les-5',
      title: 'Creating Consistently',
      duration: 1230,
      order: 5,
      moduleId: 'mod-2',
      moduleTitle: 'Content Strategy',
    },
  ],
  lessonProgress: {
    'les-1': { completed: true, percentage: 100, lastPosition: 0 },
    'les-2': { completed: true, percentage: 100, lastPosition: 0 },
    'les-3': { completed: true, percentage: 100, lastPosition: 0 },
    'les-4': { completed: false, percentage: 50, lastPosition: 450 },
    'les-5': { completed: false, percentage: 0, lastPosition: 0 },
  },
  nextLesson: {
    lessonId: 'les-4',
    lessonTitle: 'Content Planning',
    moduleId: 'mod-2',
    moduleTitle: 'Content Strategy',
  },
};

export default function LearnCourseOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isGhostMode } = useGhostMode();
  const courseId = params.courseId as string;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseData | null>(null);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    try {
      if (isGhostMode) {
        setCourse(mockCourseData);
      } else {
        // Fetch course data from API
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();

        if (data.course) {
          // Fetch progress data
          const progressRes = await fetch(
            `/api/progress/course/${courseId}?userId=current`
          );
          const progressData = await progressRes.json();

          const lessons: Lesson[] = data.course.modules.flatMap(
            (m: {
              id: string;
              title: string;
              lessons: {
                id: string;
                title: string;
                duration: number;
                order: number;
              }[];
            }) =>
              m.lessons.map((l) => ({
                ...l,
                moduleId: m.id,
                moduleTitle: m.title,
              }))
          );

          const lessonProgress: Record<string, LessonProgress> = {};
          progressData.lessonsProgress?.forEach(
            (p: {
              lessonId: string;
              completed: boolean;
              percentage: number;
              lastPosition: number;
            }) => {
              lessonProgress[p.lessonId] = {
                completed: p.completed,
                percentage: p.percentage,
                lastPosition: p.lastPosition,
              };
            }
          );

          setCourse({
            id: data.course.id,
            title: data.course.title,
            description: data.course.description,
            image: data.course.image,
            enrollmentId: progressData.enrollment?.id,
            progress: progressData.course?.percentage || 0,
            totalLessons: progressData.course?.totalLessons || 0,
            completedLessons: progressData.course?.completedLessons || 0,
            totalDuration: progressData.course?.totalDuration || 0,
            lessons,
            lessonProgress,
            nextLesson: progressData.nextLesson,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, isGhostMode]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const handleContinueLearning = () => {
    if (!course) return;

    if (course.nextLesson) {
      router.push(`/dashboard/learn/${courseId}/${course.nextLesson.lessonId}`);
    } else if (course.lessons.length > 0) {
      // If all complete, go to first lesson
      router.push(`/dashboard/learn/${courseId}/${course.lessons[0].id}`);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Group lessons by module
  const lessonsByModule = course?.lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.moduleTitle]) {
        acc[lesson.moduleTitle] = [];
      }
      acc[lesson.moduleTitle].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );

  if (loading) {
    return (
      <DashboardLayout ghostMode={isGhostMode}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout ghostMode={isGhostMode}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">
            This course doesn&apos;t exist or you don&apos;t have access.
          </p>
          <Button asChild>
            <Link href="/dashboard/courses">Browse Courses</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isComplete = course.progress === 100;

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-b from-primary/20 to-background">
          <div className="absolute inset-0">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit mb-2"
              asChild
            >
              <Link href="/dashboard/courses">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Courses
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.totalLessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(course.totalDuration)} total
              </span>
              {isComplete && (
                <Badge className="bg-green-500/20 text-green-600">
                  <Award className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Progress Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{course.progress}%</span>
                    <span className="text-muted-foreground">complete</span>
                  </div>
                  <Progress value={course.progress} className="h-2 w-full sm:w-64" />
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>
                <Button onClick={handleContinueLearning} size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  {isComplete
                    ? 'Review Course'
                    : course.progress > 0
                      ? 'Continue Learning'
                      : 'Start Course'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Lesson Card */}
          {course.nextLesson && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Next Up
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.nextLesson.lessonTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.nextLesson.moduleTitle}
                    </p>
                  </div>
                  <Button onClick={handleContinueLearning}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {lessonsByModule &&
                  Object.entries(lessonsByModule).map(
                    ([moduleTitle, moduleLessons]) => (
                      <div key={moduleTitle}>
                        <div className="px-6 py-3 bg-muted/50">
                          <h3 className="font-medium">{moduleTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {moduleLessons.length} lessons
                          </p>
                        </div>
                        <ul>
                          {moduleLessons.map((lesson) => {
                            const progress = course.lessonProgress[lesson.id];

                            return (
                              <li key={lesson.id}>
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/learn/${courseId}/${lesson.id}`
                                    )
                                  }
                                  className="w-full flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors text-left"
                                >
                                  <div
                                    className={cn(
                                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                      progress?.completed
                                        ? 'bg-green-500/20 text-green-600'
                                        : 'bg-muted'
                                    )}
                                  >
                                    {progress?.completed ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Play className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium">{lesson.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDuration(lesson.duration)}
                                      {progress?.percentage &&
                                        !progress.completed && (
                                          <span className="ml-2">
                                            • {progress.percentage}% watched
                                          </span>
                                        )}
                                    </p>
                                  </div>
                                  {progress?.completed && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-500/20 text-green-600"
                                    >
                                      Complete
                                    </Badge>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
