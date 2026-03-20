import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMockPosts, getCommunityStats } from '@/lib/mock-data/community';

// GET /api/community/posts - List all community posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    const creatorId = searchParams.get('creatorId');
    const stats = searchParams.get('stats') === 'true';

    // Return stats if requested
    if (stats) {
      const communityStats = getCommunityStats();
      return NextResponse.json({ stats: communityStats });
    }

    // Return mock data for ghost mode
    if (ghostMode) {
      const posts = getMockPosts();
      return NextResponse.json({ posts });
    }

    // TODO: Get actual user ID from session
    const whereClause = creatorId ? { creatorId } : {};

    const posts = await db.communityPost.findMany({
      where: whereClause,
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
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Transform the data to match the expected format
    const transformedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      creator: {
        name: post.creator.name,
        username: post.creator.username,
        avatar: post.creator.image,
      },
    }));

    return NextResponse.json({ posts: transformedPosts });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

// POST /api/community/posts - Create new post
export async function POST(request: NextRequest) {
  try {
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

    // TODO: Get actual user ID from session
    const creatorId = 'ghost-user-id';

    const post = await db.communityPost.create({
      data: {
        title,
        content,
        type: type || 'TEXT',
        imageUrl,
        videoUrl,
        videoType,
        isPinned: isPinned || false,
        isLocked: isLocked || false,
        isMemberOnly: isMemberOnly || false,
        creatorId,
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

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Failed to create community post' },
      { status: 500 }
    );
  }
}
