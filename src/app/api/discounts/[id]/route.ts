import { NextRequest, NextResponse } from 'next/server'
import { mockDiscountCodes } from '@/lib/mock-data/features'

// In-memory store for demo purposes (shared with main route)
let discountCodes = [...mockDiscountCodes]

// Helper to find discount by ID
function findDiscountById(id: string) {
  return discountCodes.find((d) => d.id === id)
}

// GET /api/discounts/[id] - Get a single discount code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const discount = findDiscountById(id)

    if (!discount) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(discount)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch discount code' },
      { status: 500 }
    )
  }
}

// PUT /api/discounts/[id] - Update a discount code
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const discountIndex = discountCodes.findIndex((d) => d.id === id)

    if (discountIndex === -1) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const existingDiscount = discountCodes[discountIndex]

    // Check if new code conflicts with existing codes
    if (body.code && body.code.toUpperCase() !== existingDiscount.code) {
      const codeExists = discountCodes.find(
        (d) => d.code === body.code.toUpperCase() && d.id !== id
      )
      if (codeExists) {
        return NextResponse.json(
          { error: 'This discount code already exists' },
          { status: 400 }
        )
      }
    }

    // Validate value if provided
    const type = body.type || existingDiscount.type
    const value = body.value !== undefined ? body.value : existingDiscount.value

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

    // Validate dates if provided
    const startDate = body.startDate ? new Date(body.startDate) : existingDiscount.startDate
    const endDate = body.endDate ? new Date(body.endDate) : existingDiscount.endDate

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    // Update the discount
    const updatedDiscount = {
      ...existingDiscount,
      code: body.code ? body.code.toUpperCase() : existingDiscount.code,
      name: body.name || existingDiscount.name,
      type: body.type ? body.type.toUpperCase() : existingDiscount.type,
      value: parseFloat(value),
      minPurchase: body.minPurchase !== undefined ? parseFloat(body.minPurchase) : existingDiscount.minPurchase,
      maxUses: body.maxUses !== undefined ? parseInt(body.maxUses) : existingDiscount.maxUses,
      startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : existingDiscount.startDate,
      endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existingDiscount.endDate,
      isActive: body.isActive !== undefined ? body.isActive : existingDiscount.isActive,
      isOneTimeUse: body.isOneTimeUse !== undefined ? body.isOneTimeUse : existingDiscount.isOneTimeUse,
      applicableProducts: body.applicableProducts !== undefined 
        ? (Array.isArray(body.applicableProducts) 
            ? JSON.stringify(body.applicableProducts) 
            : body.applicableProducts)
        : existingDiscount.applicableProducts,
      updatedAt: new Date(),
    }

    discountCodes[discountIndex] = updatedDiscount

    return NextResponse.json(updatedDiscount)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update discount code' },
      { status: 500 }
    )
  }
}

// DELETE /api/discounts/[id] - Delete a discount code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const initialLength = discountCodes.length
    discountCodes = discountCodes.filter((d) => d.id !== id)

    if (discountCodes.length === initialLength) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Discount code deleted successfully' 
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete discount code' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { discountCodes }
