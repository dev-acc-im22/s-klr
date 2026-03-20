import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/waitlist - List all waitlist entries for the creator
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const courseId = searchParams.get('courseId');
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { creatorId: session.user.id };
    
    if (productId) where.productId = productId;
    if (courseId) where.courseId = courseId;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const [entries, total] = await Promise.all([
      db.waitlist.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.waitlist.count({ where }),
    ]);

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}

// POST /api/waitlist - Join waitlist (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source, referrer, creatorId, productId, courseId } = body;

    if (!email || !creatorId) {
      return NextResponse.json(
        { error: 'Email and creator ID are required' },
        { status: 400 }
      );
    }

    // Check if already on waitlist
    const existing = await db.waitlist.findFirst({
      where: {
        email,
        creatorId,
        productId: productId || null,
        courseId: courseId || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already on waitlist', entry: existing },
        { status: 200 }
      );
    }

    const entry = await db.waitlist.create({
      data: {
        email,
        name,
        source: source || 'DIRECT',
        referrer,
        creatorId,
        productId: productId || null,
        courseId: courseId || null,
      },
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
