import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DripType } from '@prisma/client';

// GET /api/courses/[id]/drip - Get drip settings for all modules
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
            dripType: true,
            dripDate: true,
            dripDays: true,
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
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

    return NextResponse.json({ dripSettings: course });
  } catch (error) {
    console.error('Error fetching drip settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drip settings' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id]/drip - Update drip settings for a module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { moduleId, dripType, dripDate, dripDays } = body;

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      );
    }

    // Validate drip type
    const validDripTypes: DripType[] = ['immediate', 'scheduled', 'after_previous'];
    if (dripType && !validDripTypes.includes(dripType)) {
      return NextResponse.json(
        { error: 'Invalid drip type' },
        { status: 400 }
      );
    }

    // Validate dripDate for scheduled type
    if (dripType === 'scheduled' && !dripDate) {
      return NextResponse.json(
        { error: 'Drip date is required for scheduled drip type' },
        { status: 400 }
      );
    }

    // Validate dripDays for after_previous type
    if (dripType === 'after_previous' && (dripDays === undefined || dripDays === null)) {
      return NextResponse.json(
        { error: 'Drip days is required for after_previous drip type' },
        { status: 400 }
      );
    }

    // Verify module belongs to course
    const existingModule = await db.module.findFirst({
      where: { id: moduleId, courseId: id },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found in this course' },
        { status: 404 }
      );
    }

    // Update module drip settings
    const updatedModule = await db.module.update({
      where: { id: moduleId },
      data: {
        dripType: dripType || 'immediate',
        dripDate: dripDate ? new Date(dripDate) : null,
        dripDays: dripDays || null,
      },
    });

    return NextResponse.json({ module: updatedModule });
  } catch (error) {
    console.error('Error updating drip settings:', error);
    return NextResponse.json(
      { error: 'Failed to update drip settings' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/drip - Batch update drip settings for multiple modules
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { modules } = body;

    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json(
        { error: 'Modules array is required' },
        { status: 400 }
      );
    }

    // Verify all modules belong to the course
    const courseModules = await db.module.findMany({
      where: { courseId: id },
      select: { id: true },
    });

    const courseModuleIds = courseModules.map(m => m.id);
    const invalidModules = modules.filter(m => !courseModuleIds.includes(m.moduleId));

    if (invalidModules.length > 0) {
      return NextResponse.json(
        { error: 'Some modules do not belong to this course' },
        { status: 400 }
      );
    }

    // Batch update modules
    const updatePromises = modules.map(moduleData =>
      db.module.update({
        where: { id: moduleData.moduleId },
        data: {
          dripType: moduleData.dripType || 'immediate',
          dripDate: moduleData.dripDate ? new Date(moduleData.dripDate) : null,
          dripDays: moduleData.dripDays || null,
        },
      })
    );

    await Promise.all(updatePromises);

    // Fetch updated course with modules
    const updatedCourse = await db.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
            dripType: true,
            dripDate: true,
            dripDays: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ dripSettings: updatedCourse });
  } catch (error) {
    console.error('Error batch updating drip settings:', error);
    return NextResponse.json(
      { error: 'Failed to batch update drip settings' },
      { status: 500 }
    );
  }
}
