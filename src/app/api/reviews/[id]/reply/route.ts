import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reviews/[id]/reply - Reply to a review (creator only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'User ID and content are required' },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user has already replied (only one reply per creator)
    const existingReply = await db.reviewReply.findFirst({
      where: {
        reviewId: id,
        userId,
      },
    });

    if (existingReply) {
      // Update existing reply
      const reply = await db.reviewReply.update({
        where: { id: existingReply.id },
        data: { content },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json({ reply });
    }

    // Create new reply
    const reply = await db.reviewReply.create({
      data: {
        reviewId: id,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error('Error replying to review:', error);
    return NextResponse.json(
      { error: 'Failed to reply to review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id]/reply - Delete reply
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const replyId = searchParams.get('replyId');

    if (!replyId) {
      return NextResponse.json(
        { error: 'Reply ID is required' },
        { status: 400 }
      );
    }

    await db.reviewReply.delete({
      where: { id: replyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
