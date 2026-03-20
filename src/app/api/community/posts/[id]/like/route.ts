import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMockPostById } from '@/lib/mock-data/community';

// POST /api/community/posts/[id]/like - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';

    // TODO: Get actual user ID from session
    const userId = 'ghost-user-id';

    // Return mock response for ghost mode
    if (ghostMode) {
      const post = getMockPostById(id);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      // Toggle like state
      const isLiked = !post.isLiked;
      const likeCount = isLiked ? post.likeCount + 1 : post.likeCount - 1;

      return NextResponse.json({
        isLiked,
        likeCount: Math.max(0, likeCount),
      });
    }

    // Check if already liked
    const existingLike = await db.postLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike: remove the like and decrement count
      await db.postLike.delete({
        where: { id: existingLike.id },
      });

      await db.communityPost.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      });

      return NextResponse.json({ isLiked: false });
    } else {
      // Like: create the like and increment count
      await db.postLike.create({
        data: {
          postId: id,
          userId,
        },
      });

      await db.communityPost.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      });

      return NextResponse.json({ isLiked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
