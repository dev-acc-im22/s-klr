'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

interface QuizTakerProps {
  quiz: QuizData;
  userId: string;
  onComplete?: (result: {
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
  }) => void;
}

export function QuizTaker({ quiz, userId, onComplete }: QuizTakerProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === quiz.questions.length;

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast({
        title: 'Incomplete quiz',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          answers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit quiz');
      }

      toast({
        title: result.passed ? 'Congratulations!' : 'Quiz completed',
        description: result.passed
          ? `You passed with ${result.score}%!`
          : `You scored ${result.score}%. You need ${quiz.passingScore}% to pass.`,
        variant: result.passed ? 'default' : 'destructive',
      });

      onComplete?.({
        score: result.score,
        passed: result.passed,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to submit quiz',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key >= '1' && e.key <= '4') {
        handleSelectAnswer(parseInt(e.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">
            {quiz.questions.length} questions • {quiz.passingScore}% to pass
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>
              {answeredCount}/{quiz.questions.length} answered
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentQuestion + 1}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <span className="text-muted-foreground mr-2">
                Q{currentQuestion + 1}.
              </span>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Options */}
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    answers[currentQuestion] === index
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                        answers[currentQuestion] === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question navigator */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  className={cn(
                    'w-8 h-8 rounded text-sm font-medium transition-colors',
                    currentQuestion === index
                      ? 'bg-primary text-primary-foreground'
                      : answers[index] !== null
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted" />
                <span>Not answered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning for unanswered questions */}
      {!allAnswered && currentQuestion === quiz.questions.length - 1 && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">
            You have {quiz.questions.length - answeredCount} unanswered
            question(s). Please answer all questions before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
