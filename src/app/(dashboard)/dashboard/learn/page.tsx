'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Play,
  Check,
  Clock,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useGhostMode } from '@/hooks/useGhostMode';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalDuration: number;
  nextLesson: {
    lessonId: string;
    lessonTitle: string;
  } | null;
}

// Mock data for ghost mode
const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: 'course-1',
    title: 'Build Your Creator Business',
    description:
      'A complete course on building a sustainable creator business.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    progress: 35,
    totalLessons: 9,
    completedLessons: 3,
    totalDuration: 180,
    nextLesson: { lessonId: 'les-4', lessonTitle: 'Content Planning' },
  },
  {
    id: 'course-2',
    title: 'Instagram Growth Masterclass',
    description:
      'Learn the exact strategies I used to grow to 100K followers.',
    image:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    totalDuration: 120,
    nextLesson: { lessonId: 'les-10', lessonTitle: 'Profile Optimization' },
  },
  {
    id: 'course-3',
    title: 'Email Marketing for Creators',
    description:
      'Build and monetize your email list with proven strategies.',
    image:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop',
    progress: 100,
    totalLessons: 8,
    completedLessons: 8,
    totalDuration: 150,
    nextLesson: null,
  },
];

export default function LearnPage() {
  const { isGhostMode } = useGhostMode();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        if (isGhostMode) {
          setCourses(mockEnrolledCourses);
        } else {
          // Fetch enrolled courses from API
          const res = await fetch('/api/courses?enrolled=true');
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [isGhostMode]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const inProgressCourses = courses.filter(
    (c) => c.progress > 0 && c.progress < 100
  );
  const completedCourses = courses.filter((c) => c.progress === 100);
  const notStartedCourses = courses.filter((c) => c.progress === 0);

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Learning</h1>
          <p className="text-muted-foreground">
            Continue where you left off or start a new course
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <Button asChild>
                <Link href="/dashboard/courses">Browse Courses</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* In Progress Courses */}
            {inProgressCourses.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  In Progress
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inProgressCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Continue Learning CTA */}
            {inProgressCourses.length > 0 && inProgressCourses[0].nextLesson && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Continue Learning
                        </p>
                        <p className="font-medium">
                          {inProgressCourses[0].nextLesson.lessonTitle}
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link
                        href={`/dashboard/learn/${inProgressCourses[0].id}/${inProgressCourses[0].nextLesson?.lessonId}`}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Not Started Courses */}
            {notStartedCourses.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  Not Started
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notStartedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Completed
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// Course Card Component
function CourseCard({
  course,
  formatDuration,
}: {
  course: EnrolledCourse;
  formatDuration: (seconds: number) => string;
}) {
  const isComplete = course.progress === 100;
  const isInProgress = course.progress > 0 && course.progress < 100;

  return (
    <Link href={`/dashboard/learn/${course.id}`}>
      <Card className="overflow-hidden hover:border-primary/50 transition-colors h-full">
        <div className="relative aspect-video">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          {isComplete && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          {isInProgress && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary text-primary-foreground">
                {course.progress}%
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {course.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(course.totalDuration)}
            </span>
            <span className="text-muted-foreground">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          {isInProgress && (
            <Progress value={course.progress} className="h-1 mt-3" />
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
