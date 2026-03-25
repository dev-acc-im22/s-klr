import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/quizzes/[id]/submit - Submit a quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, answers } = body;

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        attempts: {
          where: { userId },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check if max attempts reached
    if (quiz.maxAttempts > 0 && quiz.attempts.length >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: 'Maximum attempts reached for this quiz' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const gradedAnswers = answers.map(
      (answer: number | null, index: number) => {
        const question = quiz.questions[index];
        if (!question) return { selected: answer, correct: null, isCorrect: false };
        
        const isCorrect = answer === question.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          selected: answer,
          correct: question.correctAnswer,
          isCorrect,
        };
      }
    );

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Create or update attempt
    const attempt = await db.quizAttempt.create({
      data: {
        quizId: id,
        userId,
        score,
        passed,
        answers: JSON.stringify(gradedAnswers),
      },
    });

    return NextResponse.json({
      attempt: {
        ...attempt,
        answers: gradedAnswers,
      },
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

// GET /api/quizzes/[id]/submit - Get user's attempt for this quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const attempt = await db.quizAttempt.findUnique({
      where: {
        quizId_userId: {
          quizId: id,
          userId,
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ attempt: null });
    }

    // Get quiz questions for showing correct answers
    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      attempt: {
        ...attempt,
        answers: JSON.parse(attempt.answers),
      },
      quiz: quiz
        ? {
            ...quiz,
            questions: quiz.questions.map((q) => ({
              ...q,
              options: JSON.parse(q.options),
            })),
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt' },
      { status: 500 }
    );
  }
}
