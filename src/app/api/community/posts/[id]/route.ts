import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMockPostById } from '@/lib/mock-data/community';

// GET /api/community/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';

    // Return mock data for ghost mode
    if (ghostMode) {
      const post = getMockPostById(id);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const post = await db.communityPost.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await db.communityPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Transform the data
    const transformedPost = {
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      creator: {
        name: post.creator.name,
        username: post.creator.username,
        avatar: post.creator.image,
      },
    };

    return NextResponse.json({ post: transformedPost });
  } catch (error) {
    console.error('Error fetching community post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community post' },
      { status: 500 }
    );
  }
}

// PUT /api/community/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      content,
      type,
      imageUrl,
      videoUrl,
      videoType,
      isPinned,
      isLocked,
      isMemberOnly,
    } = body;

    const post = await db.communityPost.update({
      where: { id },
      data: {
        title,
        content,
        type,
        imageUrl,
        videoUrl,
        videoType,
        isPinned,
        isLocked,
        isMemberOnly,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating community post:', error);
    return NextResponse.json(
      { error: 'Failed to update community post' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.communityPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting community post:', error);
    return NextResponse.json(
      { error: 'Failed to delete community post' },
      { status: 500 }
    );
  }
}
