import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET - Fetch a specific coaching session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return mock data for demo
      const { getAllSessions } = await import("@/lib/mock-data/coaching");
      const sessions = getAllSessions();
      const foundSession = sessions.find((s) => s.id === id);

      if (!foundSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      return NextResponse.json(foundSession);
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const coachingSession = await db.coachingSession.findFirst({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!coachingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(coachingSession);
  } catch (error) {
    console.error("Error fetching coaching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaching session" },
      { status: 500 }
    );
  }
}

// PUT - Update a coaching session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return mock response for demo
      const body = await request.json();
      const updatedSession = {
        id,
        ...body,
        updatedAt: new Date(),
      };
      return NextResponse.json(updatedSession);
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      status,
      scheduledAt,
      duration,
      price,
      meetingUrl,
      notes,
      recordingUrl,
    } = body;

    const coachingSession = await db.coachingSession.update({
      where: {
        id,
        creatorId: user.id,
      },
      data: {
        title,
        description,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        duration,
        price,
        meetingUrl,
        notes,
        recordingUrl,
      },
    });

    return NextResponse.json(coachingSession);
  } catch (error) {
    console.error("Error updating coaching session:", error);
    return NextResponse.json(
      { error: "Failed to update coaching session" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a coaching session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return mock response for demo
      return NextResponse.json({ success: true });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.coachingSession.delete({
      where: {
        id,
        creatorId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coaching session:", error);
    return NextResponse.json(
      { error: "Failed to delete coaching session" },
      { status: 500 }
    );
  }
}
