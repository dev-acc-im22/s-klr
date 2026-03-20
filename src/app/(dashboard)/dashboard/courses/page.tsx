'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  price: number;
  published: boolean;
  enrollmentCount: number;
  rating: number;
  modules: { lessons: unknown[] }[];
}

const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Creator Business Masterclass',
    description: 'Learn how to build a successful creator business from scratch.',
    image: null,
    price: 199,
    published: true,
    enrollmentCount: 23,
    rating: 4.9,
    modules: [
      { lessons: [{ id: '1' }, { id: '2' }, { id: '3' }] },
      { lessons: [{ id: '4' }, { id: '5' }] },
    ],
  },
  {
    id: 'course-2',
    title: 'Instagram Growth Masterclass',
    description: 'Grow your Instagram following with proven strategies.',
    image: null,
    price: 79,
    published: true,
    enrollmentCount: 45,
    rating: 4.7,
    modules: [
      { lessons: [{ id: '1' }, { id: '2' }] },
      { lessons: [{ id: '3' }, { id: '4' }, { id: '5' }] },
    ],
  },
  {
    id: 'course-3',
    title: 'Email Marketing for Creators',
    description: 'Build and monetize your email list effectively.',
    image: null,
    price: 49,
    published: false,
    enrollmentCount: 0,
    rating: 0,
    modules: [
      { lessons: [{ id: '1' }] },
    ],
  },
];

export default function CoursesPage() {
  const { isGhostMode } = useGhostMode();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (isGhostMode) {
          setCourses(mockCourses);
        } else {
          const res = await fetch('/api/courses');
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalLessons = (course: Course) => {
    return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Create and manage your online courses
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Courses</div>
          <div className="text-2xl font-bold">{courses.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold">
            {courses.filter((c) => c.published).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Students</div>
          <div className="text-2xl font-bold">
            {courses.reduce((acc, c) => acc + c.enrollmentCount, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Revenue</div>
          <div className="text-2xl font-bold">
            {formatCurrency(
              courses.reduce(
                (acc, c) => acc + c.price * c.enrollmentCount,
                0
              )
            )}
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No courses found</p>
          <Button asChild>
            <Link href="/dashboard/courses/new">Create Your First Course</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/courses/${course.id}`}
              className="group"
            >
              <Card className="h-full card-hover overflow-hidden">
                {/* Course Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🎓</span>
                  </div>
                  {!course.published && (
                    <Badge className="absolute top-3 right-3" variant="secondary">
                      Draft
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrollmentCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📚</span>
                      {getTotalLessons(course)} lessons
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">
                      {formatCurrency(course.price)}
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
