import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/waitlist/stats - Get waitlist statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const courseId = searchParams.get('courseId');

    const where: Record<string, unknown> = { creatorId: session.user.id };
    if (productId) where.productId = productId;
    if (courseId) where.courseId = courseId;

    // Get total count
    const totalCount = await db.waitlist.count({ where });

    // Get count by source
    const bySource = await db.waitlist.groupBy({
      by: ['source'],
      where,
      _count: true,
    });

    // Get signups over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await db.waitlist.groupBy({
      by: ['createdAt'],
      where: {
        ...where,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    // Group by day
    const signupsByDay: Record<string, number> = {};
    recentSignups.forEach((signup) => {
      const day = signup.createdAt.toISOString().split('T')[0];
      signupsByDay[day] = (signupsByDay[day] || 0) + signup._count;
    });

    // Get notified count
    const notifiedCount = await db.waitlist.count({
      where: { ...where, notified: true },
    });

    // Calculate conversion rate (if we have product/course context)
    let conversionRate = 0;
    if (productId) {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: { salesCount: true },
      });
      if (product && totalCount > 0) {
        conversionRate = (product.salesCount / totalCount) * 100;
      }
    } else if (courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { enrollmentCount: true },
      });
      if (course && totalCount > 0) {
        conversionRate = (course.enrollmentCount / totalCount) * 100;
      }
    }

    // Get product/course specific stats
    const byProduct = await db.waitlist.groupBy({
      by: ['productId'],
      where: { ...where, productId: { not: null } },
      _count: true,
    });

    const byCourse = await db.waitlist.groupBy({
      by: ['courseId'],
      where: { ...where, courseId: { not: null } },
      _count: true,
    });

    return NextResponse.json({
      totalCount,
      notifiedCount,
      pendingNotification: totalCount - notifiedCount,
      conversionRate: Math.round(conversionRate * 100) / 100,
      bySource: bySource.map((s) => ({
        source: s.source,
        count: s._count,
      })),
      signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({
        date,
        count,
      })),
      byProduct: byProduct
        .filter((p) => p.productId)
        .map((p) => ({ productId: p.productId, count: p._count })),
      byCourse: byCourse
        .filter((c) => c.courseId)
        .map((c) => ({ courseId: c.courseId, count: c._count })),
    });
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist stats' },
      { status: 500 }
    );
  }
}
