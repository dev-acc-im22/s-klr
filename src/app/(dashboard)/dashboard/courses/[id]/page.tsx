'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  Trash2,
  Plus,
  ExternalLink,
  FileQuestion,
  Edit3,
  GripVertical,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useGhostMode } from '@/hooks/useGhostMode';
import { useToast } from '@/hooks/use-toast';

import { QuizBuilder } from '@/components/dashboard/quiz';
import type { QuestionData } from '@/components/dashboard/quiz';

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    order: number;
  }[];
}

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  quiz?: Quiz | null;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  price: number;
  published: boolean;
  modules: Module[];
}

const mockCourse: Course = {
  id: 'course-1',
  title: 'Creator Business Masterclass',
  description: 'Learn how to build a successful creator business from scratch.',
  image: null,
  price: 199,
  published: true,
  modules: [
    {
      id: 'm1',
      title: 'Getting Started',
      lessons: [
        {
          id: 'l1',
          title: 'Welcome to the Course',
          videoUrl: 'https://youtube.com/...',
          duration: 300,
          quiz: {
            id: 'quiz-1',
            title: 'Welcome Quiz',
            passingScore: 70,
            maxAttempts: 3,
            questions: [
              {
                id: 'q1',
                question: 'What is the main goal of this course?',
                options: [
                  'Learn to code',
                  'Build a creator business',
                  'Master marketing',
                  'Create content',
                ],
                correctAnswer: 1,
                order: 0,
              },
            ],
          },
        },
        {
          id: 'l2',
          title: 'Course Overview',
          videoUrl: 'https://youtube.com/...',
          duration: 600,
        },
      ],
    },
    {
      id: 'm2',
      title: 'Building Your Foundation',
      lessons: [
        {
          id: 'l3',
          title: 'Finding Your Niche',
          videoUrl: 'https://youtube.com/...',
          duration: 900,
        },
      ],
    },
  ],
};

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { isGhostMode } = useGhostMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    published: false,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  // Lesson editor state
  const [editingLesson, setEditingLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [showQuizEditor, setShowQuizEditor] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      const { id } = await params;
      setCourseId(id);

      try {
        if (isGhostMode) {
          setFormData({
            title: mockCourse.title,
            description: mockCourse.description || '',
            price: mockCourse.price,
            image: mockCourse.image || '',
            published: mockCourse.published,
          });
          setModules(mockCourse.modules);
        } else {
          const res = await fetch(`/api/courses/${id}`);
          const data = await res.json();
          if (data.course) {
            setFormData({
              title: data.course.title,
              description: data.course.description || '',
              price: data.course.price,
              image: data.course.image || '',
              published: data.course.published,
            });
            setModules(data.course.modules || []);
          }
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [params, isGhostMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          modules,
        }),
      });

      toast({
        title: 'Course updated',
        description: 'Your course has been updated successfully.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update course.',
      });
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: Date.now().toString(),
        title: `Module ${modules.length + 1}`,
        lessons: [],
      },
    ]);
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      id: Date.now().toString(),
      title: `Lesson ${newModules[moduleIndex].lessons.length + 1}`,
      videoUrl: '',
      duration: 0,
    });
    setModules(newModules);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    const newModules = [...modules];
    (newModules[moduleIndex].lessons[lessonIndex] as Record<string, unknown>)[field] = value;
    setModules(newModules);
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(newModules);
    setEditingLesson(null);
  };

  const handleDeleteModule = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules.splice(moduleIndex, 1);
    setModules(newModules);
  };

  const currentLesson = editingLesson
    ? modules[editingLesson.moduleIndex]?.lessons[editingLesson.lessonIndex]
    : null;

  const handleQuizSave = (quiz: Quiz) => {
    if (!editingLesson) return;

    const newModules = [...modules];
    newModules[editingLesson.moduleIndex].lessons[editingLesson.lessonIndex].quiz = quiz;
    setModules(newModules);
    setShowQuizEditor(false);
  };

  const handleQuizDelete = () => {
    if (!editingLesson) return;

    const newModules = [...modules];
    delete newModules[editingLesson.moduleIndex].lessons[editingLesson.lessonIndex].quiz;
    setModules(newModules);
    setShowQuizEditor(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/courses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
                {formData.published && <Badge>Published</Badge>}
              </div>
              <p className="text-muted-foreground">Update your course content</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/demo/course/${courseId}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this course visible on your store
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Curriculum */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Curriculum</CardTitle>
                <Button type="button" variant="outline" onClick={addModule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No modules yet. Click &quot;Add Module&quot; to get started.</p>
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={modules.map((_, i) => `module-${i}`)} className="space-y-2">
                  {modules.map((module, moduleIndex) => (
                    <AccordionItem
                      key={module.id}
                      value={`module-${moduleIndex}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            Module {moduleIndex + 1}: {module.title}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {module.lessons.length} lessons
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {/* Module title */}
                          <div className="space-y-2">
                            <Label>Module Title</Label>
                            <div className="flex gap-2">
                              <Input
                                value={module.title}
                                onChange={(e) => {
                                  const newModules = [...modules];
                                  newModules[moduleIndex].title = e.target.value;
                                  setModules(newModules);
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteModule(moduleIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Lessons list */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Lessons</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addLesson(moduleIndex)}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Add Lesson
                              </Button>
                            </div>

                            {module.lessons.length === 0 ? (
                              <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                                No lessons yet. Click &quot;Add Lesson&quot; to create one.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{lesson.title}</span>
                                        {lesson.quiz && (
                                          <Badge variant="outline" className="text-xs">
                                            <FileQuestion className="h-3 w-3 mr-1" />
                                            Quiz
                                          </Badge>
                                        )}
                                      </div>
                                      {lesson.videoUrl && (
                                        <p className="text-xs text-muted-foreground truncate">
                                          {lesson.videoUrl}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingLesson({ moduleIndex, lessonIndex });
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/courses">Cancel</Link>
            </Button>
            <Button type="button" variant="destructive" className="ml-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Course
            </Button>
          </div>
        </form>
      </div>

      {/* Lesson Editor Dialog */}
      <Dialog
        open={editingLesson !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLesson(null);
            setShowQuizEditor(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Lesson: {currentLesson?.title}
            </DialogTitle>
          </DialogHeader>

          {currentLesson && editingLesson && (
            <div className="space-y-6 pt-4">
              {/* Lesson basic info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Lesson Title</Label>
                  <Input
                    value={currentLesson.title}
                    onChange={(e) =>
                      updateLesson(
                        editingLesson.moduleIndex,
                        editingLesson.lessonIndex,
                        'title',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    value={currentLesson.videoUrl}
                    onChange={(e) =>
                      updateLesson(
                        editingLesson.moduleIndex,
                        editingLesson.lessonIndex,
                        'videoUrl',
                        e.target.value
                      )
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={currentLesson.duration}
                    onChange={(e) =>
                      updateLesson(
                        editingLesson.moduleIndex,
                        editingLesson.lessonIndex,
                        'duration',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              {/* Quiz section */}
              <div className="border-t pt-6">
                {!showQuizEditor ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Quiz</h3>
                      </div>
                      {currentLesson.quiz ? (
                        <Button variant="outline" onClick={() => setShowQuizEditor(true)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Quiz
                        </Button>
                      ) : (
                        <Button onClick={() => setShowQuizEditor(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quiz
                        </Button>
                      )}
                    </div>

                    {currentLesson.quiz ? (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{currentLesson.quiz.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {currentLesson.quiz.questions.length} questions •{' '}
                                {currentLesson.quiz.passingScore}% to pass •{' '}
                                {currentLesson.quiz.maxAttempts === 0
                                  ? 'Unlimited attempts'
                                  : `${currentLesson.quiz.maxAttempts} attempts`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Add a quiz to test students&apos; understanding of this lesson.
                      </p>
                    )}
                  </div>
                ) : (
                  <QuizBuilder
                    lessonId={currentLesson.id}
                    lessonTitle={currentLesson.title}
                    existingQuiz={currentLesson.quiz}
                    onSave={handleQuizSave}
                    onDelete={handleQuizDelete}
                  />
                )}
              </div>

              {/* Done button */}
              {!showQuizEditor && (
                <div className="flex justify-end border-t pt-4">
                  <Button
                    onClick={() => {
                      setEditingLesson(null);
                      setShowQuizEditor(false);
                    }}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
