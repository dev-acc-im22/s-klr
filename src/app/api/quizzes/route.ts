import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/quizzes - List all quizzes for a lesson or course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const courseId = searchParams.get('courseId');

    if (lessonId) {
      // Get quiz for specific lesson
      const quiz = await db.quiz.findUnique({
        where: { lessonId },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });
      return NextResponse.json({ quiz });
    }

    if (courseId) {
      // Get all quizzes for a course
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  quiz: {
                    include: {
                      questions: {
                        orderBy: { order: 'asc' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const quizzes = course?.modules.flatMap((m) =>
        m.lessons
          .filter((l) => l.quiz)
          .map((l) => ({
            ...l.quiz,
            lessonTitle: l.title,
            moduleTitle: m.title,
          }))
      ) || [];

      return NextResponse.json({ quizzes });
    }

    // Get all quizzes for the creator
    const quizzes = await db.quiz.findMany({
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, title, passingScore, maxAttempts, questions } = body;

    // Check if lesson already has a quiz
    const existingQuiz = await db.quiz.findUnique({
      where: { lessonId },
    });

    if (existingQuiz) {
      return NextResponse.json(
        { error: 'Lesson already has a quiz. Update the existing quiz instead.' },
        { status: 400 }
      );
    }

    // Create quiz with questions
    const quiz = await db.quiz.create({
      data: {
        title,
        passingScore: passingScore || 70,
        maxAttempts: maxAttempts || 3,
        lessonId,
        questions: {
          create: questions?.map(
            (
              q: { question: string; options: string[]; correctAnswer: number; order: number },
              index: number
            ) => ({
              question: q.question,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              order: q.order || index,
            })
          ),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
