import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/certificates/[number] - Verify certificate by number
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params;

    if (!number) {
      return NextResponse.json(
        { error: 'Certificate number is required' },
        { status: 400 }
      );
    }

    const certificate = await db.certificate.findUnique({
      where: { certificateNumber: number },
      include: {
        enrollment: {
          include: {
            course: {
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
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found', valid: false },
        { status: 404 }
      );
    }

    const formattedCertificate = {
      valid: true,
      certificateNumber: certificate.certificateNumber,
      issuedAt: certificate.issuedAt,
      courseName: certificate.enrollment.course.title,
      studentName: certificate.enrollment.user.name || 'Student',
      instructorName: certificate.enrollment.course.creator.name || 'Instructor',
      instructorUsername: certificate.enrollment.course.creator.username,
      completedAt: certificate.enrollment.completedAt,
      courseId: certificate.enrollment.course.id,
    };

    return NextResponse.json({ certificate: formattedCertificate });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate', valid: false },
      { status: 500 }
    );
  }
}
