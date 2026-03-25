'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

import { useGhostMode } from '@/hooks/useGhostMode';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  moduleId: string;
  moduleTitle: string;
  videoUrl: string;
  videoType: string;
}

interface LessonProgress {
  completed: boolean;
  percentage: number;
  lastPosition: number;
  watchedSeconds: number;
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
  } | null;
}

// Mock data for ghost mode
const mockCourseData: CourseData = {
  id: 'course-1',
  title: 'Build Your Creator Business',
  description: 'A complete course on building a sustainable creator business.',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
    },
    {
      id: 'les-2',
      title: 'Setting Your Goals',
      duration: 720,
      order: 2,
      moduleId: 'mod-1',
      moduleTitle: 'Getting Started',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
    },
    {
      id: 'les-3',
      title: 'Finding Your Niche',
      duration: 1125,
      order: 3,
      moduleId: 'mod-1',
      moduleTitle: 'Getting Started',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
    },
    {
      id: 'les-4',
      title: 'Content Planning',
      duration: 900,
      order: 4,
      moduleId: 'mod-2',
      moduleTitle: 'Content Strategy',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
    },
    {
      id: 'les-5',
      title: 'Creating Consistently',
      duration: 1230,
      order: 5,
      moduleId: 'mod-2',
      moduleTitle: 'Content Strategy',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
    },
  ],
  lessonProgress: {
    'les-1': { completed: true, percentage: 100, lastPosition: 0, watchedSeconds: 330 },
    'les-2': { completed: true, percentage: 100, lastPosition: 0, watchedSeconds: 720 },
    'les-3': { completed: true, percentage: 100, lastPosition: 0, watchedSeconds: 1125 },
    'les-4': { completed: false, percentage: 50, lastPosition: 450, watchedSeconds: 450 },
    'les-5': { completed: false, percentage: 0, lastPosition: 0, watchedSeconds: 0 },
  },
  nextLesson: { lessonId: 'les-4', lessonTitle: 'Content Planning' },
};

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { isGhostMode } = useGhostMode();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentProgress, setCurrentProgress] = useState<LessonProgress | null>(null);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    try {
      if (isGhostMode) {
        setCourse(mockCourseData);
        const lesson = mockCourseData.lessons.find((l) => l.id === lessonId);
        setCurrentLesson(lesson || mockCourseData.lessons[0]);
        setCurrentProgress(
          mockCourseData.lessonProgress[lessonId || mockCourseData.lessons[0].id] || {
            completed: false,
            percentage: 0,
            lastPosition: 0,
            watchedSeconds: 0,
          }
        );
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

          const lessons: Lesson[] = data.course.modules.flatMap((m: { id: string; title: string; lessons: { id: string; title: string; duration: number; order: number; videoUrl: string; videoType: string }[] }) =>
            m.lessons.map((l) => ({
              ...l,
              moduleId: m.id,
              moduleTitle: m.title,
            }))
          );

          const lessonProgress: Record<string, LessonProgress> = {};
          progressData.lessonsProgress?.forEach((p: { lessonId: string; completed: boolean; percentage: number; lastPosition: number; watchedSeconds: number }) => {
            lessonProgress[p.lessonId] = {
              completed: p.completed,
              percentage: p.percentage,
              lastPosition: p.lastPosition,
              watchedSeconds: p.watchedSeconds,
            };
          });

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

          const lesson = lessons.find((l: Lesson) => l.id === lessonId);
          setCurrentLesson(lesson || lessons[0]);
          setCurrentProgress(lessonProgress[lessonId] || null);
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId, isGhostMode]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const handleLessonSelect = (newLessonId: string) => {
    if (!course) return;
    const lesson = course.lessons.find((l) => l.id === newLessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      setCurrentProgress(course.lessonProgress[newLessonId] || null);
      router.push(`/dashboard/learn/${courseId}/${newLessonId}`);
    }
  };

  const handleProgressUpdate = async (data: {
    watchedSeconds: number;
    lastPosition: number;
    percentage: number;
  }) => {
    if (!course?.enrollmentId || !currentLesson || isGhostMode) return;

    try {
      await fetch(`/api/progress/${currentLesson.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: course.enrollmentId,
          watchedSeconds: data.watchedSeconds,
          lastPosition: data.lastPosition,
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
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
    );
  }

  // Group lessons by module
  const lessonsByModule = course.lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.moduleTitle]) {
        acc[lesson.moduleTitle] = [];
      }
      acc[lesson.moduleTitle].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );

  return (
    <div className="min-h-screen bg-background">
        {/* Course Progress Header */}
        <div className="sticky top-0 z-40 bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/courses">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="min-w-0">
                  <h1 className="text-lg font-semibold text-foreground truncate">
                    {course.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons •{' '}
                    {Math.round(course.totalDuration / 60)} min total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 sm:w-48">
                  <Progress value={course.progress} className="h-2" />
                </div>
                <span className="text-sm font-medium text-primary whitespace-nowrap">
                  {course.progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Video Player Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Video Container */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                {currentLesson?.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No video available</p>
                    </div>
                  </div>
                )}

                {/* Progress bar overlay */}
                {currentProgress && currentProgress.percentage > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${currentProgress.percentage}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {currentLesson?.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentLesson
                          ? formatDuration(currentLesson.duration)
                          : '0:00'}
                      </span>
                      <span>{currentLesson?.moduleTitle}</span>
                      {currentProgress?.completed && (
                        <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/20">
                          <Check className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {currentProgress?.lastPosition && currentProgress.lastPosition > 0 && !currentProgress.completed && (
                    <Badge variant="secondary">
                      Resume at {formatDuration(currentProgress.lastPosition)}
                    </Badge>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={
                      !course.lessons.find(
                        (l) => l.id === currentLesson?.id && l.order > 1
                      )
                    }
                    onClick={() => {
                      const currentIndex = course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      );
                      if (currentIndex > 0) {
                        handleLessonSelect(course.lessons[currentIndex - 1].id);
                      }
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    disabled={
                      !course.lessons.find(
                        (l) => l.id === currentLesson?.id && l.order < course.lessons.length
                      )
                    }
                    onClick={() => {
                      const currentIndex = course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      );
                      if (currentIndex < course.lessons.length - 1) {
                        handleLessonSelect(course.lessons[currentIndex + 1].id);
                      }
                    }}
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lesson Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Course Content</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons}/{course.totalLessons} completed
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {Object.entries(lessonsByModule).map(
                      ([moduleTitle, moduleLessons]) => (
                        <div key={moduleTitle} className="border-b last:border-b-0">
                          <div className="px-4 py-2 bg-muted/50">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {moduleTitle}
                            </h4>
                          </div>
                          <ul>
                            {moduleLessons.map((lesson) => {
                              const progress = course.lessonProgress[lesson.id];
                              const isCurrent = lesson.id === currentLesson?.id;

                              return (
                                <li key={lesson.id}>
                                  <button
                                    onClick={() => handleLessonSelect(lesson.id)}
                                    className={cn(
                                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                                      isCurrent && 'bg-primary/5'
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                                        progress?.completed
                                          ? 'bg-green-500/20 text-green-600'
                                          : isCurrent
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                      )}
                                    >
                                      {progress?.completed ? (
                                        <Check className="w-3 h-3" />
                                      ) : (
                                        <Play className="w-3 h-3" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={cn(
                                          'text-sm font-medium truncate',
                                          isCurrent
                                            ? 'text-primary'
                                            : 'text-foreground'
                                        )}
                                      >
                                        {lesson.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDuration(lesson.duration)}
                                        {progress?.percentage &&
                                          !progress.completed &&
                                          ` • ${progress.percentage}%`}
                                      </p>
                                    </div>
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
        </div>
      </div>
  );
}
