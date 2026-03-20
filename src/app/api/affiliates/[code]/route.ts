import { NextRequest, NextResponse } from 'next/server'
import { 
  mockAffiliates, 
  mockAffiliateClicks,
  mockAffiliateProgram 
} from '@/lib/mock-data/features'

// In-memory store for demo purposes
let affiliates = [...mockAffiliates]
let clicks = [...mockAffiliateClicks]

// GET /api/affiliates/[code] - Get affiliate by code or track a click
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const searchParams = request.nextUrl.searchParams
  const trackClick = searchParams.get('track') === 'true'
  const productId = searchParams.get('productId')
  const visitorIp = searchParams.get('ip') || 'unknown'
  const userAgent = searchParams.get('userAgent') || null

  // Find affiliate by code
  const affiliate = affiliates.find((a) => a.code.toUpperCase() === code.toUpperCase())

  if (!affiliate) {
    return NextResponse.json(
      { error: 'Affiliate code not found' },
      { status: 404 }
    )
  }

  // If tracking a click, record it
  if (trackClick) {
    const now = new Date().toISOString()
    const newClick = {
      id: `click-${Date.now()}`,
      affiliateId: affiliate.id,
      productId: productId || null,
      visitorIp,
      userAgent,
      createdAt: now,
    }

    clicks.push(newClick)

    // Update affiliate click count
    affiliates = affiliates.map((a) =>
      a.id === affiliate.id ? { ...a, clicks: a.clicks + 1 } : a
    )

    return NextResponse.json({
      success: true,
      message: 'Click tracked',
      affiliate: {
        ...affiliate,
        clicks: affiliate.clicks + 1,
      },
      program: mockAffiliateProgram,
    })
  }

  // Return affiliate info with program details
  return NextResponse.json({
    affiliate,
    program: mockAffiliateProgram,
  })
}

// PUT /api/affiliates/[code] - Update affiliate code
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { newCode } = body

    if (!newCode) {
      return NextResponse.json(
        { error: 'New code is required' },
        { status: 400 }
      )
    }

    // Check if new code already exists
    const existingAffiliate = affiliates.find(
      (a) => a.code.toUpperCase() === newCode.toUpperCase() && a.code.toUpperCase() !== code.toUpperCase()
    )
    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'This affiliate code is already taken' },
        { status: 400 }
      )
    }

    // Update affiliate code
    affiliates = affiliates.map((a) =>
      a.code.toUpperCase() === code.toUpperCase() 
        ? { ...a, code: newCode.toUpperCase() } 
        : a
    )

    const updatedAffiliate = affiliates.find(
      (a) => a.code.toUpperCase() === newCode.toUpperCase()
    )

    return NextResponse.json(updatedAffiliate)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update affiliate code' },
      { status: 500 }
    )
  }
}
