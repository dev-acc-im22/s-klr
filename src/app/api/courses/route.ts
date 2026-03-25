import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/courses - List all courses for current user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user ID from session
    const courses = await db.course.findMany({
      where: { creatorId: 'ghost-user-id' },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, image, published, modules } = body;

    // TODO: Get actual user ID from session
    const creatorId = 'ghost-user-id';

    const course = await db.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        published: published || false,
        creatorId,
        modules: {
          create: modules?.map((m: { title: string; order: number; lessons: { title: string; videoUrl: string; duration: number; order: number }[] }, moduleIndex: number) => ({
            title: m.title,
            order: m.order || moduleIndex,
            lessons: {
              create: m.lessons?.map((l: { title: string; videoUrl: string; duration: number; order: number }, lessonIndex: number) => ({
                title: l.title,
                videoUrl: l.videoUrl,
                duration: l.duration || 0,
                order: l.order || lessonIndex,
              })),
            },
          })),
        },
      },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
