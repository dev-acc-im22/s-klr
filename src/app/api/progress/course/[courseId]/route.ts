import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

// GET /api/progress/course/[courseId] - Get all progress for a course
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the enrollment for this user and course
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                duration: true,
                moduleId: true,
              },
            },
          },
        },
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    duration: true,
                    order: true,
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Calculate progress for each lesson
    const lessonsProgress = enrollment.course.modules.flatMap((module) =>
      module.lessons.map((lesson) => {
        const progress = enrollment.lessonProgress.find(
          (p) => p.lessonId === lesson.id
        );
        const duration = lesson.duration ?? 0;
        const watchedSeconds = progress?.watchedSeconds ?? 0;
        const percentage = duration > 0 ? Math.min(100, Math.round((watchedSeconds / duration) * 100)) : 0;

        return {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          moduleId: module.id,
          moduleTitle: module.title,
          duration,
          watchedSeconds,
          lastPosition: progress?.lastPosition ?? 0,
          completed: progress?.completed ?? false,
          completedAt: progress?.completedAt,
          percentage,
          order: lesson.order,
        };
      })
    );

    // Calculate overall course progress
    const totalLessons = lessonsProgress.length;
    const completedLessons = lessonsProgress.filter((l) => l.completed).length;
    const totalDuration = lessonsProgress.reduce((acc, l) => acc + l.duration, 0);
    const totalWatched = lessonsProgress.reduce((acc, l) => acc + l.watchedSeconds, 0);

    // Find next incomplete lesson
    const nextLesson = lessonsProgress
      .filter((l) => !l.completed)
      .sort((a, b) => a.order - b.order)[0];

    return NextResponse.json({
      enrollment: {
        id: enrollment.id,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      },
      course: {
        id: enrollment.course.id,
        totalLessons,
        completedLessons,
        totalDuration,
        totalWatched,
        percentage: totalDuration > 0 ? Math.round((totalWatched / totalDuration) * 100) : 0,
      },
      lessonsProgress,
      nextLesson: nextLesson
        ? {
            lessonId: nextLesson.lessonId,
            lessonTitle: nextLesson.lessonTitle,
            moduleId: nextLesson.moduleId,
            moduleTitle: nextLesson.moduleTitle,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course progress' },
      { status: 500 }
    );
  }
}
