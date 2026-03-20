import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ lessonId: string }>;
}

// GET /api/progress/[lessonId] - Get progress for a specific lesson
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { lessonId } = await params;
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    const progress = await db.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
    });

    // Get lesson duration to calculate percentage
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { duration: true },
    });

    const watchedSeconds = progress?.watchedSeconds ?? 0;
    const lastPosition = progress?.lastPosition ?? 0;
    const duration = lesson?.duration ?? 0;
    const percentage = duration > 0 ? Math.min(100, Math.round((watchedSeconds / duration) * 100)) : 0;

    return NextResponse.json({
      progress: {
        id: progress?.id,
        watchedSeconds,
        lastPosition,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt,
        percentage,
        duration,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/progress/[lessonId] - Update progress for a lesson
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    const { enrollmentId, watchedSeconds, lastPosition, completed } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    // Get lesson duration
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { duration: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const duration = lesson.duration ?? 0;
    
    // Calculate if lesson should be marked as complete
    // Mark complete if watched 90%+ or explicitly marked complete
    const effectiveWatchedSeconds = watchedSeconds ?? 0;
    const effectiveLastPosition = lastPosition ?? 0;
    const progressPercentage = duration > 0 ? (effectiveWatchedSeconds / duration) * 100 : 0;
    const shouldMarkComplete = completed || progressPercentage >= 90;

    // Upsert progress
    const progress = await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      update: {
        watchedSeconds: effectiveWatchedSeconds,
        lastPosition: effectiveLastPosition,
        completed: shouldMarkComplete,
        completedAt: shouldMarkComplete && !completed ? new Date() : undefined,
      },
      create: {
        enrollmentId,
        lessonId,
        watchedSeconds: effectiveWatchedSeconds,
        lastPosition: effectiveLastPosition,
        completed: shouldMarkComplete,
        completedAt: shouldMarkComplete ? new Date() : undefined,
      },
    });

    // Update enrollment progress percentage
    await updateEnrollmentProgress(enrollmentId);

    return NextResponse.json({
      progress: {
        id: progress.id,
        watchedSeconds: progress.watchedSeconds,
        lastPosition: progress.lastPosition,
        completed: progress.completed,
        completedAt: progress.completedAt,
        percentage: Math.min(100, Math.round((progress.watchedSeconds / duration) * 100)),
      },
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// Helper function to update enrollment progress percentage
async function updateEnrollmentProgress(enrollmentId: string) {
  try {
    // Get all lessons for the course
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        lessonProgress: true,
      },
    });

    if (!enrollment) return;

    // Calculate total lessons
    const totalLessons = enrollment.course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );

    if (totalLessons === 0) return;

    // Calculate completed lessons
    const completedLessons = enrollment.lessonProgress.filter(
      (p) => p.completed
    ).length;

    // Calculate progress percentage
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Check if course is complete
    const isCourseComplete = completedLessons === totalLessons;

    // Update enrollment
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: progressPercentage,
        completedAt: isCourseComplete ? new Date() : null,
      },
    });
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
  }
}
