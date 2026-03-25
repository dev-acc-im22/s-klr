import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/certificates - Get all certificates for the current user
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const certificates = await db.certificate.findMany({
      where: {
        enrollment: {
          userId: user.id,
        },
      },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                creator: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    const formattedCertificates = certificates.map((cert) => ({
      id: cert.id,
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
      courseName: cert.enrollment.course.title,
      studentName: cert.enrollment.user.name || 'Student',
      instructorName: cert.enrollment.course.creator.name || 'Instructor',
      courseId: cert.enrollment.course.id,
    }));

    return NextResponse.json({ certificates: formattedCertificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Create a new certificate for completed enrollment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCert = await db.certificate.findUnique({
      where: { enrollmentId },
    });

    if (existingCert) {
      return NextResponse.json({ certificate: existingCert });
    }

    // Get enrollment with course and user info
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            creator: true,
          },
        },
        user: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Check if course is completed
    if (enrollment.progress < 100) {
      return NextResponse.json(
        { error: 'Course not completed yet' },
        { status: 400 }
      );
    }

    // Generate unique certificate number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certificateNumber = `CH-${timestamp}-${random}`;

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        enrollmentId,
        certificateNumber,
      },
    });

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
