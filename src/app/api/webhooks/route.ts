import { NextRequest, NextResponse } from 'next/server'
import {
  mockWebhooks,
  mockWebhookStats,
  generateSecretKey,
  type Webhook
} from '@/lib/mock-data/webhooks'

// In-memory store for demo purposes
let webhooks: Webhook[] = [...mockWebhooks]

// GET /api/webhooks - List all webhooks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isActive = searchParams.get('isActive')

  let filtered = [...webhooks]

  // Filter by active status
  if (isActive !== null) {
    const isActiveBool = isActive === 'true'
    filtered = filtered.filter((w) => w.isActive === isActiveBool)
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    webhooks: filtered,
    stats: {
      ...mockWebhookStats,
      totalWebhooks: webhooks.length,
      activeWebhooks: webhooks.filter((w) => w.isActive).length,
    },
  })
}

// POST /api/webhooks - Create a new webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, events, isActive = true } = body

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'At least one event must be selected' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Must be a valid HTTP or HTTPS URL' },
        { status: 400 }
      )
    }

    const newWebhook: Webhook = {
      id: `webhook-${Date.now()}`,
      url,
      secret: generateSecretKey(),
      events,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1', // Mock user ID
    }

    webhooks.push(newWebhook)

    return NextResponse.json(newWebhook, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    )
  }
}

// DELETE /api/webhooks - Delete multiple webhooks
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Array of webhook IDs is required' },
        { status: 400 }
      )
    }

    const initialLength = webhooks.length
    webhooks = webhooks.filter((w) => !ids.includes(w.id))

    if (webhooks.length === initialLength) {
      return NextResponse.json(
        { error: 'No webhooks found with the provided IDs' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${initialLength - webhooks.length} webhook(s)`,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete webhooks' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { webhooks }
