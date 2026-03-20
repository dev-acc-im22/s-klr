import { NextRequest, NextResponse } from 'next/server'
import { subscribers as initialSubscribers, mockSubscribers } from '@/lib/mock-data/email'

// In-memory store - sync with parent route
let subscribers = [...mockSubscribers]

// GET /api/subscribers/[id] - Get a single subscriber
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const subscriber = subscribers.find((sub) => sub.id === id)

  if (!subscriber) {
    return NextResponse.json(
      { error: 'Subscriber not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(subscriber)
}

// PATCH /api/subscribers/[id] - Update a subscriber
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = subscribers.findIndex((sub) => sub.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    const subscriber = subscribers[index]
    const updated = {
      ...subscriber,
      ...body,
      updatedAt: new Date().toISOString()
    }

    subscribers[index] = updated as typeof mockSubscribers[0]

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    )
  }
}

// DELETE /api/subscribers/[id] - Delete a subscriber
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = subscribers.findIndex((sub) => sub.id === id)

  if (index === -1) {
    return NextResponse.json(
      { error: 'Subscriber not found' },
      { status: 404 }
    )
  }

  subscribers.splice(index, 1)

  return NextResponse.json({ success: true })
}
