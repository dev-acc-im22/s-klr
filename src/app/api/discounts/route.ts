import { NextRequest, NextResponse } from 'next/server'
import { mockDiscountCodes, mockDiscountStats } from '@/lib/mock-data/features'

// In-memory store for demo purposes
let discountCodes = [...mockDiscountCodes]

// GET /api/discounts - List all discount codes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let filtered = [...discountCodes]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (discount) =>
        discount.code.toLowerCase().includes(searchLower) ||
        discount.name.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (status === 'active') {
    filtered = filtered.filter((d) => d.isActive)
  } else if (status === 'inactive') {
    filtered = filtered.filter((d) => !d.isActive)
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter((d) => d.type === type.toUpperCase())
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    discounts: filtered,
    stats: mockDiscountStats,
  })
}

// POST /api/discounts - Create a new discount code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      code,
      name,
      type,
      value,
      minPurchase = 0,
      maxUses = 0,
      startDate,
      endDate,
      isActive = true,
      isOneTimeUse = false,
      applicableProducts = '',
    } = body

    // Validate required fields
    if (!code || !name || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Code, name, type, and value are required' },
        { status: 400 }
      )
    }

    // Validate code format
    const codeRegex = /^[A-Z0-9]+$/
    if (!codeRegex.test(code.toUpperCase())) {
      return NextResponse.json(
        { error: 'Code must contain only letters and numbers' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCode = discountCodes.find((d) => d.code === code.toUpperCase())
    if (existingCode) {
      return NextResponse.json(
        { error: 'This discount code already exists' },
        { status: 400 }
      )
    }

    // Validate value
    if (type === 'PERCENTAGE' && (value < 1 || value > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 1 and 100' },
        { status: 400 }
      )
    }

    if (type === 'FIXED' && value <= 0) {
      return NextResponse.json(
        { error: 'Fixed discount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    const newDiscount = {
      id: `discount-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      type: type.toUpperCase(),
      value: parseFloat(value),
      minPurchase: parseFloat(minPurchase) || 0,
      maxUses: parseInt(maxUses) || 0,
      usedCount: 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive,
      isOneTimeUse,
      applicableProducts: Array.isArray(applicableProducts) 
        ? JSON.stringify(applicableProducts) 
        : applicableProducts,
      createdAt: new Date(),
    }

    discountCodes.push(newDiscount)

    return NextResponse.json(newDiscount, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create discount code' },
      { status: 500 }
    )
  }
}

// DELETE /api/discounts - Delete multiple discount codes
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Array of discount IDs is required' },
        { status: 400 }
      )
    }

    const initialLength = discountCodes.length
    discountCodes = discountCodes.filter((d) => !ids.includes(d.id))

    if (discountCodes.length === initialLength) {
      return NextResponse.json(
        { error: 'No discount codes found with the provided IDs' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${initialLength - discountCodes.length} discount code(s)` 
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete discount codes' },
      { status: 500 }
    )
  }
}
