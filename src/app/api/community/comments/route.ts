import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMockCommentsByPostId } from '@/lib/mock-data/community';

// GET /api/community/comments - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const ghostMode = searchParams.get('ghost') === 'true';

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Return mock data for ghost mode
    if (ghostMode) {
      const comments = getMockCommentsByPostId(postId);
      return NextResponse.json({ comments });
    }

    // Get only top-level comments (no parentId)
    const comments = await db.communityComment.findMany({
      where: {
        postId,
        parentId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data
    const transformComment = (comment: typeof comments[0]) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      postId: comment.postId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      author: {
        name: comment.author.name,
        username: comment.author.username,
        avatar: comment.author.image,
      },
      replies: comment.replies?.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        postId: reply.postId,
        authorId: reply.authorId,
        parentId: reply.parentId,
        author: {
          name: reply.author.name,
          username: reply.author.username,
          avatar: reply.author.image,
        },
        replies: reply.replies?.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          postId: r.postId,
          authorId: r.authorId,
          parentId: r.parentId,
          author: {
            name: r.author.name,
            username: r.author.username,
            avatar: r.author.image,
          },
        })),
      })),
    });

    const transformedComments = comments.map(transformComment);

    return NextResponse.json({ comments: transformedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/community/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, parentId } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    // TODO: Get actual user ID from session
    const authorId = 'ghost-user-id';

    const comment = await db.communityComment.create({
      data: {
        content,
        postId,
        authorId,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Transform the response
    const transformedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      postId: comment.postId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      author: {
        name: comment.author.name,
        username: comment.author.username,
        avatar: comment.author.image,
      },
    };

    return NextResponse.json({ comment: transformedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
