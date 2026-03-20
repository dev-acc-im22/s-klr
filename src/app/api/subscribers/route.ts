import { NextRequest, NextResponse } from 'next/server'
import { mockSubscribers } from '@/lib/mock-data/email'

// In-memory store for demo purposes
// In production, this would use Prisma with the database
let subscribers = [...mockSubscribers]

// GET /api/subscribers - List all subscribers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const tag = searchParams.get('tag') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  let filtered = [...subscribers]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (sub) =>
        sub.email.toLowerCase().includes(searchLower) ||
        (sub.name && sub.name.toLowerCase().includes(searchLower))
    )
  }

  // Filter by status
  if (status === 'active') {
    filtered = filtered.filter((sub) => sub.isActive)
  } else if (status === 'inactive') {
    filtered = filtered.filter((sub) => !sub.isActive)
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((sub) => sub.tags.includes(tag))
  }

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedResults = filtered.slice(start, start + limit)

  return NextResponse.json({
    subscribers: paginatedResults,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  })
}

// POST /api/subscribers - Add a new subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, tags = [] } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if subscriber already exists
    const existing = subscribers.find(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    )
    if (existing) {
      return NextResponse.json(
        { error: 'Subscriber already exists' },
        { status: 409 }
      )
    }

    const newSubscriber = {
      id: `sub_${String(subscribers.length + 1).padStart(3, '0')}`,
      email: email.toLowerCase(),
      name: name || null,
      isActive: true,
      tags,
      subscribedAt: new Date().toISOString(),
      unsubscribedAt: null,
      openRate: 0,
      clickRate: 0,
      emailsReceived: 0,
      emailsOpened: 0,
      linksClicked: 0
    }

    subscribers.push(newSubscriber as typeof mockSubscribers[0])

    return NextResponse.json(newSubscriber, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create subscriber' },
      { status: 500 }
    )
  }
}

// DELETE /api/subscribers - Delete multiple subscribers
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Subscriber IDs are required' },
        { status: 400 }
      )
    }

    subscribers = subscribers.filter((sub) => !ids.includes(sub.id))

    return NextResponse.json({
      success: true,
      deletedCount: ids.length
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete subscribers' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { subscribers }
