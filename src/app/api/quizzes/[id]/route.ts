import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/quizzes/[id] - Get a specific quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quiz = await db.quiz.findUnique({
      where: { id },
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
        attempts: {
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Parse options for each question
    const quizWithOptions = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
      attempts: quiz.attempts.map((a) => ({
        ...a,
        answers: JSON.parse(a.answers),
      })),
    };

    return NextResponse.json({ quiz: quizWithOptions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// PUT /api/quizzes/[id] - Update a quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, passingScore, maxAttempts, questions } = body;

    // Update quiz basic info
    const quiz = await db.quiz.update({
      where: { id },
      data: {
        title,
        passingScore,
        maxAttempts,
      },
    });

    // If questions are provided, delete existing and create new ones
    if (questions) {
      // Delete existing questions
      await db.quizQuestion.deleteMany({
        where: { quizId: id },
      });

      // Create new questions
      await db.quizQuestion.createMany({
        data: questions.map(
          (
            q: { question: string; options: string[]; correctAnswer: number; order: number },
            index: number
          ) => ({
            quizId: id,
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            order: q.order || index,
          })
        ),
      });
    }

    // Fetch updated quiz with questions
    const updatedQuiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

// DELETE /api/quizzes/[id] - Delete a quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete quiz (cascade will delete questions and attempts)
    await db.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
