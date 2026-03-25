import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reviews/[id]/helpful - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user has already voted
    const existingVote = await db.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId: id,
          userId,
        },
      },
    });

    if (existingVote) {
      // Remove the vote (toggle off)
      await db.$transaction([
        db.reviewVote.delete({
          where: { id: existingVote.id },
        }),
        db.review.update({
          where: { id },
          data: { helpful: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ helpful: false, message: 'Vote removed' });
    }

    // Add new vote
    await db.$transaction([
      db.reviewVote.create({
        data: {
          reviewId: id,
          userId,
        },
      }),
      db.review.update({
        where: { id },
        data: { helpful: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ helpful: true, message: 'Marked as helpful' });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}

// GET /api/reviews/[id]/helpful - Check if user has voted
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ hasVoted: false });
    }

    const vote = await db.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId: id,
          userId,
        },
      },
    });

    return NextResponse.json({ hasVoted: !!vote });
  } catch (error) {
    console.error('Error checking helpful vote:', error);
    return NextResponse.json(
      { error: 'Failed to check helpful vote' },
      { status: 500 }
    );
  }
}
