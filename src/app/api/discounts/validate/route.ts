import { NextRequest, NextResponse } from 'next/server'
import { mockDiscountCodes } from '@/lib/mock-data/features'

// In-memory store (shared reference would be better, but for demo we'll use the mock)
const discountCodes = [...mockDiscountCodes]

// POST /api/discounts/validate - Validate a discount code for checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, amount, productId, productIds } = body

    // Validate required fields
    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required', valid: false },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid order amount is required', valid: false },
        { status: 400 }
      )
    }

    // Find the discount code
    const discount = discountCodes.find(
      (d) => d.code === code.toUpperCase()
    )

    if (!discount) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid discount code',
      })
    }

    // Check if active
    if (!discount.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code is no longer active',
      })
    }

    // Check date validity
    const now = new Date()
    if (discount.startDate && new Date(discount.startDate) > now) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code is not yet active',
      })
    }

    if (discount.endDate && new Date(discount.endDate) < now) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code has expired',
      })
    }

    // Check usage limits
    if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code has reached its usage limit',
      })
    }

    // Check minimum purchase
    if (discount.minPurchase > 0 && amount < discount.minPurchase) {
      return NextResponse.json({
        valid: false,
        error: `Minimum purchase of $${discount.minPurchase.toFixed(2)} required`,
        minPurchase: discount.minPurchase,
      })
    }

    // Check applicable products
    if (discount.applicableProducts) {
      const applicableProducts = JSON.parse(discount.applicableProducts)
      if (applicableProducts.length > 0) {
        const productsToCheck = productIds || (productId ? [productId] : [])
        const hasApplicableProduct = productsToCheck.some((p: string) => 
          applicableProducts.includes(p)
        )

        if (!hasApplicableProduct) {
          return NextResponse.json({
            valid: false,
            error: 'This discount code is not applicable to the selected products',
          })
        }
      }
    }

    // Calculate discount amount
    let discountAmount = 0
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (amount * discount.value) / 100
    } else {
      discountAmount = Math.min(discount.value, amount) // Can't discount more than order total
    }

    const finalAmount = Math.max(0, amount - discountAmount)

    return NextResponse.json({
      valid: true,
      discount: {
        id: discount.id,
        code: discount.code,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        isOneTimeUse: discount.isOneTimeUse,
      },
      originalAmount: amount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      message: discount.type === 'PERCENTAGE' 
        ? `${discount.value}% discount applied!` 
        : `$${discount.value.toFixed(2)} discount applied!`,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to validate discount code', valid: false },
      { status: 500 }
    )
  }
}
