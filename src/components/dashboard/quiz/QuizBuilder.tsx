'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Save, Loader2, Settings, FileQuestion, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuestionEditor, QuestionData, createEmptyQuestion } from './QuestionEditor';
import { useToast } from '@/hooks/use-toast';

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: QuestionData[];
}

interface QuizBuilderProps {
  lessonId: string;
  lessonTitle?: string;
  existingQuiz?: QuizData | null;
  onSave?: (quiz: QuizData) => void;
  onDelete?: () => void;
}

// Sortable wrapper for QuestionEditor
function SortableQuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: QuestionData;
  index: number;
  onUpdate: (id: string, data: Partial<QuestionData>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionEditor
        question={question}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

export function QuizBuilder({
  lessonId,
  lessonTitle,
  existingQuiz,
  onSave,
  onDelete,
}: QuizBuilderProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState(existingQuiz?.title || 'Quiz');
  const [passingScore, setPassingScore] = useState(existingQuiz?.passingScore || 70);
  const [maxAttempts, setMaxAttempts] = useState(existingQuiz?.maxAttempts || 3);
  const [questions, setQuestions] = useState<QuestionData[]>(
    existingQuiz?.questions || [createEmptyQuestion(0)]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update questions when existingQuiz changes
  useEffect(() => {
    if (existingQuiz) {
      setTitle(existingQuiz.title);
      setPassingScore(existingQuiz.passingScore);
      setMaxAttempts(existingQuiz.maxAttempts);
      setQuestions(
        existingQuiz.questions.length > 0
          ? existingQuiz.questions
          : [createEmptyQuestion(0)]
      );
    }
  }, [existingQuiz]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, createEmptyQuestion(questions.length)]);
  };

  const handleUpdateQuestion = useCallback(
    (id: string, data: Partial<QuestionData>) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...data } : q))
      );
    },
    []
  );

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => {
      if (prev.length === 1) {
        toast({
          title: 'Cannot delete',
          description: 'A quiz must have at least one question.',
          variant: 'destructive',
        });
        return prev;
      }
      return prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i }));
    });
  };

  const handleSave = async () => {
    // Validate questions
    const invalidQuestions = questions.filter(
      (q) =>
        !q.question.trim() ||
        q.options.some((o) => !o.trim())
    );

    if (invalidQuestions.length > 0) {
      toast({
        title: 'Incomplete questions',
        description: 'Please fill in all question texts and answer options.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const quizData: QuizData = {
        id: existingQuiz?.id || '',
        title,
        passingScore,
        maxAttempts,
        questions,
      };

      const method = existingQuiz ? 'PUT' : 'POST';
      const url = existingQuiz
        ? `/api/quizzes/${existingQuiz.id}`
        : '/api/quizzes';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          title,
          passingScore,
          maxAttempts,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: q.order,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save quiz');
      }

      toast({
        title: 'Quiz saved',
        description: 'Your quiz has been saved successfully.',
      });

      onSave?.(result.quiz);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save quiz',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingQuiz?.id) return;

    try {
      const response = await fetch(`/api/quizzes/${existingQuiz.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      toast({
        title: 'Quiz deleted',
        description: 'The quiz has been removed from this lesson.',
      });

      onDelete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete quiz',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileQuestion className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">
              {existingQuiz ? 'Edit Quiz' : 'Create Quiz'}
            </h3>
            {lessonTitle && (
              <p className="text-sm text-muted-foreground">
                For lesson: {lessonTitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Settings Dialog */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quiz Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Passing Score</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimum percentage to pass
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={passingScore}
                        onChange={(e) =>
                          setPassingScore(parseInt(e.target.value) || 0)
                        }
                        className="w-20"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Max Attempts</Label>
                      <p className="text-sm text-muted-foreground">
                        How many times can students retry (0 = unlimited)
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={maxAttempts}
                      onChange={(e) =>
                        setMaxAttempts(parseInt(e.target.value) || 0)
                      }
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {existingQuiz && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Quiz info badges */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{passingScore}% to pass</Badge>
        <Badge variant="secondary">
          {maxAttempts === 0 ? 'Unlimited' : maxAttempts} attempts
        </Badge>
        <Badge variant="secondary">{questions.length} questions</Badge>
      </div>

      <Separator />

      {/* Questions */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {questions.map((question, index) => (
              <SortableQuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={handleUpdateQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add question button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddQuestion}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </Button>

      {/* Save button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Quiz
        </Button>
      </div>
    </div>
  );
}
