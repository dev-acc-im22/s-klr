import { NextRequest, NextResponse } from 'next/server'
import { mockWebhooks, type Webhook } from '@/lib/mock-data/webhooks'

// In-memory store for demo purposes (shared with main route)
let webhooks: Webhook[] = [...mockWebhooks]

// Helper to find webhook by ID
function findWebhookById(id: string) {
  return webhooks.find((w) => w.id === id)
}

// GET /api/webhooks/[id] - Get a single webhook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const webhook = findWebhookById(id)

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(webhook)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch webhook' },
      { status: 500 }
    )
  }
}

// PUT /api/webhooks/[id] - Update a webhook
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const webhookIndex = webhooks.findIndex((w) => w.id === id)

    if (webhookIndex === -1) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const existingWebhook = webhooks[webhookIndex]

    // Validate URL format if provided
    if (body.url) {
      try {
        const urlObj = new URL(body.url)
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          throw new Error('Invalid protocol')
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format. Must be a valid HTTP or HTTPS URL' },
          { status: 400 }
        )
      }
    }

    // Validate events if provided
    if (body.events !== undefined) {
      if (!Array.isArray(body.events) || body.events.length === 0) {
        return NextResponse.json(
          { error: 'At least one event must be selected' },
          { status: 400 }
        )
      }
    }

    // Update the webhook
    const updatedWebhook: Webhook = {
      ...existingWebhook,
      url: body.url || existingWebhook.url,
      events: body.events || existingWebhook.events,
      isActive: body.isActive !== undefined ? body.isActive : existingWebhook.isActive,
      updatedAt: new Date(),
    }

    webhooks[webhookIndex] = updatedWebhook

    return NextResponse.json(updatedWebhook)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    )
  }
}

// DELETE /api/webhooks/[id] - Delete a webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const initialLength = webhooks.length
    webhooks = webhooks.filter((w) => w.id !== id)

    if (webhooks.length === initialLength) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    )
  }
}

// PATCH /api/webhooks/[id] - Toggle webhook active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const webhookIndex = webhooks.findIndex((w) => w.id === id)

    if (webhookIndex === -1) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    webhooks[webhookIndex] = {
      ...webhooks[webhookIndex],
      isActive: body.isActive !== undefined ? body.isActive : !webhooks[webhookIndex].isActive,
      updatedAt: new Date(),
    }

    return NextResponse.json(webhooks[webhookIndex])
  } catch {
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { webhooks }
