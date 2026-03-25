import { NextRequest, NextResponse } from 'next/server'
import { mockCampaigns, emailAnalytics, mockSubscribers } from '@/lib/mock-data/email'

// In-memory store for demo purposes
let campaigns = [...mockCampaigns]

// GET /api/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  let filtered = [...campaigns]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (camp) =>
        camp.subject.toLowerCase().includes(searchLower) ||
        camp.previewText.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (status !== 'all') {
    filtered = filtered.filter((camp) => camp.status === status.toUpperCase())
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedResults = filtered.slice(start, start + limit)

  return NextResponse.json({
    campaigns: paginatedResults,
    analytics: emailAnalytics,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  })
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      subject, 
      previewText, 
      content, 
      template = 'custom',
      scheduledAt 
    } = body

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newCampaign = {
      id: `camp_${String(campaigns.length + 1).padStart(3, '0')}`,
      subject,
      previewText: previewText || '',
      content,
      status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
      scheduledAt: scheduledAt || null,
      sentAt: null,
      recipientCount: 0,
      openCount: 0,
      clickCount: 0,
      unsubscribeCount: 0,
      template,
      createdAt: now,
      updatedAt: now
    }

    campaigns.push(newCampaign)

    return NextResponse.json(newCampaign, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns - Delete multiple campaigns
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Campaign IDs are required' },
        { status: 400 }
      )
    }

    campaigns = campaigns.filter((camp) => !ids.includes(camp.id))

    return NextResponse.json({
      success: true,
      deletedCount: ids.length
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete campaigns' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { campaigns }
