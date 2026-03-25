import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/waitlist/export - Export waitlist to CSV
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

    const where: Record<string, unknown> = { creatorId: session.user.id };
    if (productId) where.productId = productId;
    if (courseId) where.courseId = courseId;
    if (source) where.source = source;

    const entries = await db.waitlist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get product/course titles for context
    let productTitle = '';
    let courseTitle = '';

    if (productId) {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: { title: true },
      });
      productTitle = product?.title || '';
    }

    if (courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { title: true },
      });
      courseTitle = course?.title || '';
    }

    // Create CSV content
    const headers = [
      'Email',
      'Name',
      'Source',
      'Referrer',
      'Product',
      'Course',
      'Notified',
      'Signed Up At',
    ];

    const rows = entries.map((entry) => [
      entry.email,
      entry.name || '',
      entry.source,
      entry.referrer || '',
      productTitle,
      courseTitle,
      entry.notified ? 'Yes' : 'No',
      entry.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="waitlist-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to export waitlist' },
      { status: 500 }
    );
  }
}
