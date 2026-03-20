import { NextRequest, NextResponse } from 'next/server'
import { mockInstagramAutomations, mockInstagramStats, mockInstagramActivity } from '@/lib/mock-data/features'

// In-memory store for demo purposes
let automations = [...mockInstagramAutomations]

// GET /api/instagram/automations - List all automations
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const isActive = searchParams.get('isActive')

  let filtered = [...automations]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (auto) =>
        auto.name.toLowerCase().includes(searchLower) ||
        auto.message.toLowerCase().includes(searchLower)
    )
  }

  // Filter by active status
  if (isActive !== null) {
    const isActiveBool = isActive === 'true'
    filtered = filtered.filter((auto) => auto.isActive === isActiveBool)
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Calculate stats
  const stats = {
    activeAutomations: automations.filter(a => a.isActive).length,
    dmsSentThisMonth: mockInstagramStats.dmsSentThisMonth,
    responseRate: mockInstagramStats.responseRate,
    newFollowersReached: mockInstagramStats.newFollowersReached,
  }

  return NextResponse.json({
    automations: filtered,
    stats,
    activity: mockInstagramActivity.slice(0, 5),
  })
}

// POST /api/instagram/automations - Create a new automation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      triggerType, 
      keywords, 
      message, 
      delay = 0,
      isActive = true 
    } = body

    if (!name || !triggerType || !message) {
      return NextResponse.json(
        { error: 'Name, trigger type, and message are required' },
        { status: 400 }
      )
    }

    const validTriggerTypes = ['NEW_FOLLOWER', 'KEYWORD_MENTION', 'STORY_REPLY', 'COMMENT']
    if (!validTriggerTypes.includes(triggerType)) {
      return NextResponse.json(
        { error: 'Invalid trigger type' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newAutomation = {
      id: `ig-auto-${String(automations.length + 1).padStart(2, '0')}`,
      name,
      triggerType,
      keywords: keywords ? JSON.stringify(keywords) : null,
      message,
      delay,
      isActive,
      sentCount: 0,
      createdAt: now,
    }

    automations.push(newAutomation as typeof mockInstagramAutomations[0])

    return NextResponse.json(newAutomation, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create automation' },
      { status: 500 }
    )
  }
}

// DELETE /api/instagram/automations - Delete multiple automations
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Automation IDs are required' },
        { status: 400 }
      )
    }

    automations = automations.filter((auto) => !ids.includes(auto.id))

    return NextResponse.json({
      success: true,
      deletedCount: ids.length
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete automations' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { automations }
