'use client';

import { ChevronLeft, ChevronRight, Check, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LessonProgressIndicator } from './ProgressBar';

interface Lesson {
  id: string;
  title: string;
  duration?: number;
  order: number;
  moduleId: string;
  moduleTitle: string;
}

interface LessonNavigationProps {
  currentLessonId: string;
  lessons: Lesson[];
  lessonProgress: Record<
    string,
    { completed: boolean; percentage: number; lastPosition: number }
  >;
  onLessonSelect: (lessonId: string) => void;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  className?: string;
}

export function LessonNavigation({
  currentLessonId,
  lessons,
  lessonProgress,
  onLessonSelect,
  onPreviousLesson,
  onNextLesson,
  className,
}: LessonNavigationProps) {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Group lessons by module
  const lessonsByModule = lessons.reduce(
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
    <div className={cn('space-y-4', className)}>
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={!previousLesson}
          onClick={() => previousLesson && onLessonSelect(previousLesson.id)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={!nextLesson}
          onClick={() => nextLesson && onLessonSelect(nextLesson.id)}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Current lesson info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Now Playing</p>
          <p className="font-medium text-sm">
            {lessons[currentIndex]?.title}
          </p>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
        {Object.entries(lessonsByModule).map(([moduleTitle, moduleLessons]) => (
          <div key={moduleTitle}>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {moduleTitle}
            </h4>
            <div className="space-y-1">
              {moduleLessons.map((lesson) => {
                const progress = lessonProgress[lesson.id] || {
                  completed: false,
                  percentage: 0,
                  lastPosition: 0,
                };
                const isCurrent = lesson.id === currentLessonId;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                      isCurrent
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted'
                    )}
                  >
                    {/* Status icon */}
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                        progress.completed
                          ? 'bg-green-500/20 text-green-600'
                          : isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                      )}
                    >
                      {progress.completed ? (
                        <Check className="w-3 h-3" />
                      ) : isCurrent ? (
                        <Play className="w-3 h-3" />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {moduleLessons.indexOf(lesson) + 1}
                        </span>
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isCurrent ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2">
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                        {progress.percentage > 0 && !progress.completed && (
                          <span className="text-xs text-muted-foreground">
                            • {progress.percentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    {progress.completed && (
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation callbacks */}
      {previousLesson && (
        <div className="hidden">
          <button ref={onPreviousLesson as unknown as React.RefObject<HTMLButtonElement>} />
        </div>
      )}
    </div>
  );
}

// Compact lesson card for sidebar
interface LessonCardProps {
  lesson: Lesson;
  progress: { completed: boolean; percentage: number; lastPosition: number };
  isCurrent: boolean;
  onSelect: () => void;
}

export function LessonCard({
  lesson,
  progress,
  isCurrent,
  onSelect,
}: LessonCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
        isCurrent
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-muted border border-transparent'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          progress.completed
            ? 'bg-green-500/20 text-green-600'
            : 'bg-muted'
        )}
      >
        {progress.completed ? (
          <Check className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            isCurrent ? 'text-primary' : 'text-foreground'
          )}
        >
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {lesson.duration && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(lesson.duration)}
            </span>
          )}
          <LessonProgressIndicator
            percentage={progress.percentage}
            completed={progress.completed}
          />
        </div>
      </div>
    </button>
  );
}
