import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/waitlist/notify - Send launch notification to waitlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, courseId, subject, message, onlyUnnotified = true } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: Record<string, unknown> = { creatorId: session.user.id };
    if (productId) where.productId = productId;
    if (courseId) where.courseId = courseId;
    if (onlyUnnotified) where.notified = false;

    // Get entries to notify
    const entries = await db.waitlist.findMany({ where });

    if (entries.length === 0) {
      return NextResponse.json({
        success: true,
        notifiedCount: 0,
        message: 'No entries to notify',
      });
    }

    // In a real application, you would integrate with an email service
    // (SendGrid, Mailgun, AWS SES, etc.) here to send actual emails.
    // For this demo, we'll just mark them as notified.

    // Get creator info for the email
    const creator = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    // Simulate email sending and mark as notified
    const entryIds = entries.map((e) => e.id);

    await db.waitlist.updateMany({
      where: { id: { in: entryIds } },
      data: { notified: true },
    });

    // In production, you would:
    // 1. Queue emails for sending (using a job queue)
    // 2. Send emails in batches to avoid rate limits
    // 3. Track email delivery status
    // 4. Handle bounces and unsubscribes

    console.log(`[Waitlist Notification] Would send ${entries.length} emails from ${creator?.name || creator?.email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message preview: ${message.substring(0, 100)}...`);

    return NextResponse.json({
      success: true,
      notifiedCount: entries.length,
      message: `Notifications sent to ${entries.length} subscribers`,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
