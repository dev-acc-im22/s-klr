import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Play, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReviewsSection } from "@/components/dashboard/reviews/ReviewsSection";
import {
  getMockStore,
  getMockCourse,
} from "@/lib/mock-data/store";

interface CoursePageProps {
  params: Promise<{
    username: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { username, id } = await params;
  const course = getMockCourse(username, id);

  if (!course) {
    return {
      title: "Course Not Found | CreatorHub",
    };
  }

  return {
    title: `${course.title} | CreatorHub Store`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { username, id } = await params;
  const store = getMockStore(username);
  const course = getMockCourse(username, id);

  if (!store || !course) {
    notFound();
  }

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );

  const totalDuration = course.modules.reduce((acc, module) => {
    return (
      acc +
      module.lessons.reduce((lessonAcc, lesson) => {
        const [minutes, seconds] = lesson.duration.split(":").map(Number);
        return lessonAcc + minutes + seconds / 60;
      }, 0)
    );
  }, 0);

  const previewLessons = course.modules.flatMap((m) =>
    m.lessons.filter((l) => l.isPreview)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${username}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to store</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            CreatorHub
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/${username}`} className="hover:text-foreground">
            {store.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </nav>

        {/* Course Hero */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="relative aspect-video">
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Course Badge */}
            <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
              Course
            </Badge>

            {/* Rating */}
            {course.rating && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm text-white font-medium">{course.rating}</span>
              </div>
            )}

            {/* Title & Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.modules.length} modules
                </span>
                <span className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.round(totalDuration)} min total
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrollmentCount.toLocaleString()} students
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                About This Course
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                What You&apos;ll Learn
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Build a sustainable online presence</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create content that converts</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Monetize your expertise</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scale your creator business</span>
                </li>
              </ul>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Course Curriculum
              </h2>
              <div className="rounded-lg border bg-card">
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {moduleIndex + 1}
                          </span>
                          <span className="font-medium">{module.title}</span>
                          <Badge variant="secondary" className="ml-2">
                            {module.lessons.length} lessons
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-0">
                        <ul className="border-t">
                          {module.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-8 rounded-full bg-muted">
                                  <Play className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {lesson.title}
                                  </p>
                                  {lesson.isPreview && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Free Preview
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Checkout Card */}
            <Card className="border-2 border-primary/20 shadow-lg sticky top-20">
              <CardContent className="p-6">
                <CheckoutButton
                  price={course.price}
                  title={course.title}
                  type="course"
                />
                
                <Separator className="my-4" />
                
                {/* Course Includes */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    This course includes:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Play className="w-4 h-4 text-primary" />
                      {totalLessons} video lessons
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {Math.round(totalDuration)} min of content
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {course.modules.length} modules
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Instructor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/${username}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="size-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src={store.avatar} alt={store.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {store.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {store.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{username}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsSection courseId={course.id} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-semibold text-primary">CreatorHub</span>
            <span>•</span>
            <span>Create your own store</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
