import { NextRequest, NextResponse } from 'next/server'
import { 
  mockAffiliateProgram, 
  mockAffiliateStats, 
  mockAffiliates 
} from '@/lib/mock-data/features'

// In-memory store for demo purposes
let program = { ...mockAffiliateProgram }
let affiliates = [...mockAffiliates]

// GET /api/affiliates/program - Get the creator's affiliate program settings
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const includeAffiliates = searchParams.get('includeAffiliates') === 'true'

  const response: Record<string, unknown> = {
    program,
    stats: mockAffiliateStats,
  }

  if (includeAffiliates) {
    response.affiliates = affiliates
  }

  return NextResponse.json(response)
}

// POST /api/affiliates/program - Create a new affiliate program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { commissionRate, cookieDuration } = body

    // Validate inputs
    if (commissionRate !== undefined && (commissionRate < 0 || commissionRate > 100)) {
      return NextResponse.json(
        { error: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (cookieDuration !== undefined && (cookieDuration < 1 || cookieDuration > 365)) {
      return NextResponse.json(
        { error: 'Cookie duration must be between 1 and 365 days' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newProgram = {
      id: `affiliate-program-${Date.now()}`,
      creatorId: 'user-1',
      commissionRate: commissionRate ?? 10,
      cookieDuration: cookieDuration ?? 30,
      isActive: true,
      createdAt: now,
      totalAffiliates: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalEarnings: 0,
      pendingPayouts: 0,
    }

    program = newProgram

    return NextResponse.json(newProgram, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create affiliate program' },
      { status: 500 }
    )
  }
}

// PUT /api/affiliates/program - Update affiliate program settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { commissionRate, cookieDuration, isActive } = body

    // Validate inputs
    if (commissionRate !== undefined && (commissionRate < 0 || commissionRate > 100)) {
      return NextResponse.json(
        { error: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (cookieDuration !== undefined && (cookieDuration < 1 || cookieDuration > 365)) {
      return NextResponse.json(
        { error: 'Cookie duration must be between 1 and 365 days' },
        { status: 400 }
      )
    }

    program = {
      ...program,
      ...(commissionRate !== undefined && { commissionRate }),
      ...(cookieDuration !== undefined && { cookieDuration }),
      ...(isActive !== undefined && { isActive }),
    }

    return NextResponse.json(program)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update affiliate program' },
      { status: 500 }
    )
  }
}

// DELETE /api/affiliates/program - Delete the affiliate program
export async function DELETE() {
  try {
    // Reset program to inactive state
    program = {
      ...program,
      isActive: false,
    }

    return NextResponse.json({ success: true, message: 'Affiliate program deactivated' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete affiliate program' },
      { status: 500 }
    )
  }
}
