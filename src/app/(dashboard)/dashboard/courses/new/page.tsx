'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useGhostMode } from '@/hooks/useGhostMode';

interface Module {
  id: string;
  title: string;
  lessons: { id: string; title: string; videoUrl: string; duration: number }[];
}

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isGhostMode } = useGhostMode();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    published: false,
  });
  const [modules, setModules] = useState<Module[]>([
    { id: '1', title: 'Module 1', lessons: [] },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          modules: modules.map((m, index) => ({
            ...m,
            order: index,
            lessons: m.lessons.map((l, lIndex) => ({
              ...l,
              order: lIndex,
            })),
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to create course');

      toast({
        title: 'Course created',
        description: 'Your course has been created successfully.',
      });

      router.push('/dashboard/courses');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create course. Please try again.',
      });
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Course</h1>
          <p className="text-muted-foreground">
            Build your online course with modules and lessons
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Creator Business Masterclass"
                required
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
                placeholder="What will students learn?"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="99.00"
                  required
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
                  placeholder="https://..."
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
              <div>
                <CardTitle>Curriculum</CardTitle>
                <CardDescription>
                  Add modules and lessons to your course
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addModule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="space-y-2">
                  <Label>Module {moduleIndex + 1} Title</Label>
                  <Input
                    value={module.title}
                    onChange={(e) => {
                      const newModules = [...modules];
                      newModules[moduleIndex].title = e.target.value;
                      setModules(newModules);
                    }}
                    placeholder="e.g., Getting Started"
                  />
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">
                      Lessons ({module.lessons.length})
                    </Label>
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

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <Input
                          value={lesson.title}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[moduleIndex].lessons[lessonIndex].title =
                              e.target.value;
                            setModules(newModules);
                          }}
                          placeholder="Lesson title"
                          className="h-8"
                        />
                        <Input
                          value={lesson.videoUrl}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[moduleIndex].lessons[
                              lessonIndex
                            ].videoUrl = e.target.value;
                            setModules(newModules);
                          }}
                          placeholder="Video URL (YouTube/Vimeo)"
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Create Course
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/courses">Cancel</Link>
          </Button>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
