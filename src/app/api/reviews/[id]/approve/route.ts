import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reviews/[id]/approve - Approve or reject a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isApproved } = body;

    const review = await db.review.update({
      where: { id },
      data: { isApproved },
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

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error updating review approval:', error);
    return NextResponse.json(
      { error: 'Failed to update review approval' },
      { status: 500 }
    );
  }
}
