import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

// GET - Fetch all coaching sessions for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return mock data for demo purposes
      const { getAllSessions, coachingPackages } = await import("@/lib/mock-data/coaching");
      const sessions = getAllSessions();

      return NextResponse.json({
        sessions,
        packages: coachingPackages,
      });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await db.coachingSession.findMany({
      where: { creatorId: user.id },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching coaching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaching sessions" },
      { status: 500 }
    );
  }
}

// POST - Create a new coaching session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return mock response for demo
      const body = await request.json();
      const newSession = {
        id: `session-${Date.now()}`,
        ...body,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return NextResponse.json(newSession, { status: 201 });
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
      scheduledAt,
      duration,
      price,
      meetingUrl,
      notes,
    } = body;

    const coachingSession = await db.coachingSession.create({
      data: {
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        price: price || 0,
        meetingUrl,
        notes,
        creatorId: user.id,
      },
    });

    return NextResponse.json(coachingSession, { status: 201 });
  } catch (error) {
    console.error("Error creating coaching session:", error);
    return NextResponse.json(
      { error: "Failed to create coaching session" },
      { status: 500 }
    );
  }
}
