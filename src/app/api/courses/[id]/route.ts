import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/courses/[id] - Get single course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, image, published, modules } = body;

    // Update course basic info
    const course = await db.course.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        published: published || false,
      },
    });

    // Handle modules update with drip settings
    if (modules && Array.isArray(modules)) {
      for (const moduleData of modules) {
        if (moduleData.id) {
          // Update existing module
          await db.module.update({
            where: { id: moduleData.id },
            data: {
              title: moduleData.title,
              order: moduleData.order,
              dripType: moduleData.dripType || 'immediate',
              dripDate: moduleData.dripDate ? new Date(moduleData.dripDate) : null,
              dripDays: moduleData.dripDays || null,
            },
          });
        } else {
          // Create new module
          await db.module.create({
            data: {
              title: moduleData.title,
              order: moduleData.order,
              courseId: id,
              dripType: moduleData.dripType || 'immediate',
              dripDate: moduleData.dripDate ? new Date(moduleData.dripDate) : null,
              dripDays: moduleData.dripDays || null,
            },
          });
        }
      }
    }

    // Fetch updated course with modules
    const updatedCourse = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
