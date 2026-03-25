'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  percentage,
  className,
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full bg-primary rounded-full transition-all ease-out',
            animated ? 'duration-300' : 'duration-0'
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1">
          {clampedPercentage}% complete
        </p>
      )}
    </div>
  );
}

// Course progress header bar
interface CourseProgressHeaderProps {
  courseTitle: string;
  percentage: number;
  completedLessons: number;
  totalLessons: number;
  className?: string;
}

export function CourseProgressHeader({
  courseTitle,
  percentage,
  completedLessons,
  totalLessons,
  className,
}: CourseProgressHeaderProps) {
  return (
    <div className={cn('bg-card border-b', className)}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {courseTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
          <div className="flex items-center gap-3 w-32 sm:w-48">
            <ProgressBar percentage={percentage} size="md" />
            <span className="text-sm font-medium text-primary whitespace-nowrap">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lesson card progress indicator
interface LessonProgressIndicatorProps {
  percentage: number;
  completed: boolean;
  className?: string;
}

export function LessonProgressIndicator({
  percentage,
  completed,
  className,
}: LessonProgressIndicatorProps) {
  if (completed) {
    return (
      <div
        className={cn(
          'flex items-center gap-1 text-sm text-green-600',
          className
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Complete</span>
      </div>
    );
  }

  if (percentage > 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="w-16">
          <ProgressBar percentage={percentage} size="sm" />
        </div>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
    );
  }

  return null;
}
