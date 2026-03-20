'use client';

import { Check, X, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GradedAnswer {
  selected: number | null;
  correct: number;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  answers: GradedAnswer[];
}

interface QuizResultsProps {
  result: QuizResult;
  questions: QuizQuestion[];
  passingScore: number;
  canRetry?: boolean;
  onRetry?: () => void;
  onViewCourse?: () => void;
}

export function QuizResults({
  result,
  questions,
  passingScore,
  canRetry = true,
  onRetry,
  onViewCourse,
}: QuizResultsProps) {
  const { score, passed, correctCount, totalQuestions, answers } = result;

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = () => {
    if (score >= passingScore) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <Card
        className={cn(
          'border-2',
          passed
            ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
            : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'
        )}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center',
                passed ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {passed ? (
                <Trophy className="h-10 w-10 text-white" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-white" />
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-muted-foreground">
                {passed
                  ? 'You passed the quiz!'
                  : `You need ${passingScore}% to pass. Keep studying and try again!`}
              </p>
            </div>

            {/* Score */}
            <div className="flex items-baseline gap-1">
              <span className={cn('text-5xl font-bold', getScoreColor())}>
                {score}%
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-lg">{correctCount}</p>
                <p className="text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {totalQuestions - correctCount}
                </p>
                <p className="text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{totalQuestions}</p>
                <p className="text-muted-foreground">Total</p>
              </div>
            </div>

            {/* Progress bar showing passing score */}
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
                <Progress value={score} className="h-4" />
                {/* Passing score marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-border"
                  style={{ left: `${passingScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>{passingScore}% passing</span>
                <span>100%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {!passed && canRetry && onRetry && (
                <Button variant="outline" onClick={onRetry}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Quiz
                </Button>
              )}
              {onViewCourse && (
                <Button onClick={onViewCourse}>Continue Course</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const answer = answers[index];
            if (!answer) return null;

            return (
              <div
                key={question.id}
                className={cn(
                  'p-4 rounded-lg border',
                  answer.isCorrect
                    ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                    : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                      answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    )}
                  >
                    {answer.isCorrect ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Question content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Q{index + 1}.
                      </span>{' '}
                      <span className="font-medium">{question.question}</span>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = answer.selected === optionIndex;
                        const isCorrect = optionIndex === answer.correct;

                        return (
                          <div
                            key={optionIndex}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded text-sm',
                              isCorrect && 'bg-green-100 dark:bg-green-900/30',
                              isSelected &&
                                !isCorrect &&
                                'bg-red-100 dark:bg-red-900/30'
                            )}
                          >
                            <div
                              className={cn(
                                'flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium',
                                isCorrect
                                  ? 'bg-green-500 text-white'
                                  : isSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span
                              className={cn(
                                isCorrect && 'font-medium',
                                isSelected && !isCorrect && 'line-through'
                              )}
                            >
                              {option}
                            </span>
                            {isCorrect && (
                              <Badge
                                variant="secondary"
                                className="ml-auto text-xs"
                              >
                                Correct
                              </Badge>
                            )}
                            {isSelected && !isCorrect && (
                              <Badge
                                variant="destructive"
                                className="ml-auto text-xs"
                              >
                                Your answer
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
