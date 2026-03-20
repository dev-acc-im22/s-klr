import { NextRequest, NextResponse } from 'next/server'
import { mockWebhookLogs, type WebhookLog } from '@/lib/mock-data/webhooks'

// In-memory store for demo purposes
let webhookLogs: WebhookLog[] = [...mockWebhookLogs]

// GET /api/webhooks/[id]/logs - Get logs for a webhook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const event = searchParams.get('event')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filtered = webhookLogs.filter((log) => log.webhookId === id)

    // Filter by status
    if (status) {
      filtered = filtered.filter((log) => log.status === status)
    }

    // Filter by event
    if (event) {
      filtered = filtered.filter((log) => log.event === event)
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const total = filtered.length
    filtered = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      logs: filtered,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch webhook logs' },
      { status: 500 }
    )
  }
}

// POST /api/webhooks/[id]/logs - Create a log entry (for retry)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { logId } = body

    if (!logId) {
      return NextResponse.json(
        { error: 'Log ID is required' },
        { status: 400 }
      )
    }

    const logIndex = webhookLogs.findIndex(
      (log) => log.id === logId && log.webhookId === id
    )

    if (logIndex === -1) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      )
    }

    const existingLog = webhookLogs[logIndex]

    // Simulate retry
    const updatedLog: WebhookLog = {
      ...existingLog,
      status: 'SUCCESS',
      attempts: existingLog.attempts + 1,
      response: JSON.stringify({ received: true, retried: true }),
      error: null,
    }

    webhookLogs[logIndex] = updatedLog

    return NextResponse.json(updatedLog)
  } catch {
    return NextResponse.json(
      { error: 'Failed to retry webhook delivery' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { webhookLogs }
