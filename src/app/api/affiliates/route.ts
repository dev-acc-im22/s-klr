import { NextRequest, NextResponse } from 'next/server'
import { 
  mockAffiliates, 
  mockAffiliateProgram,
  mockAffiliateStats
} from '@/lib/mock-data/features'

// In-memory store for demo purposes
let affiliates = [...mockAffiliates]

// GET /api/affiliates - List all affiliates for the creator's program
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status')

  let filtered = [...affiliates]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (affiliate) =>
        affiliate.code.toLowerCase().includes(searchLower) ||
        affiliate.user.name.toLowerCase().includes(searchLower) ||
        affiliate.user.email.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status (active/inactive based on clicks)
  if (status === 'active') {
    filtered = filtered.filter((affiliate) => affiliate.clicks > 0)
  } else if (status === 'inactive') {
    filtered = filtered.filter((affiliate) => affiliate.clicks === 0)
  }

  // Sort by earnings (highest first)
  filtered.sort((a, b) => b.earnings - a.earnings)

  return NextResponse.json({
    affiliates: filtered,
    program: mockAffiliateProgram,
    stats: mockAffiliateStats,
  })
}

// POST /api/affiliates - Create a new affiliate (join a program)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, userId, userName, userEmail, programId } = body

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Affiliate code and user ID are required' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingAffiliate = affiliates.find((a) => a.code === code.toUpperCase())
    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'This affiliate code is already taken' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newAffiliate = {
      id: `affiliate-${Date.now()}`,
      programId: programId || mockAffiliateProgram.id,
      userId,
      code: code.toUpperCase(),
      clicks: 0,
      conversions: 0,
      earnings: 0,
      createdAt: now,
      user: { 
        name: userName || 'New Affiliate', 
        email: userEmail || 'new@example.com' 
      },
    }

    affiliates.push(newAffiliate)

    return NextResponse.json(newAffiliate, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create affiliate' },
      { status: 500 }
    )
  }
}

// DELETE /api/affiliates - Remove an affiliate from the program
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Affiliate ID is required' },
        { status: 400 }
      )
    }

    const initialLength = affiliates.length
    affiliates = affiliates.filter((affiliate) => affiliate.id !== id)

    if (affiliates.length === initialLength) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Affiliate removed' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete affiliate' },
      { status: 500 }
    )
  }
}
