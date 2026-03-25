import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockAbandonedCarts, mockRecoveryStats } from '@/lib/mock-data/cart';

// GET /api/cart/abandoned - List abandoned carts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    const status = searchParams.get('status');
    const statsOnly = searchParams.get('stats') === 'true';

    // Return mock data for ghost mode
    if (ghostMode) {
      if (statsOnly) {
        return NextResponse.json({ stats: mockRecoveryStats });
      }

      let filtered = [...mockAbandonedCarts];
      if (status) {
        filtered = filtered.filter(c => c.status === status);
      }

      return NextResponse.json({ abandonedCarts: filtered });
    }

    // Return stats only
    if (statsOnly) {
      const totalAbandoned = await db.abandonedCart.count();
      const emailsSent = await db.abandonedCart.count({
        where: { NOT: { recoveryEmailSentAt: null } },
      });
      const recovered = await db.abandonedCart.count({
        where: { NOT: { recoveredAt: null } },
      });

      const stats = {
        totalAbandoned,
        emailsSent,
        recovered,
        recoveryRate: totalAbandoned > 0 ? Math.round((recovered / totalAbandoned) * 100) : 0,
      };

      return NextResponse.json({ stats });
    }

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const abandonedCarts = await db.abandonedCart.findMany({
      where,
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        recoveryEmails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate cart total for each
    const cartsWithTotal = abandonedCarts.map(ac => ({
      ...ac,
      cartTotal: ac.cart.items.reduce(
        (sum: number, item: { quantity: number; product: { price: number | null } }) => sum + (item.quantity * (item.product.price || 0)),
        0
      ),
    }));

    return NextResponse.json({ abandonedCarts: cartsWithTotal });
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}

// POST /api/cart/abandoned - Mark cart as abandoned
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, email, discountCode } = body;

    if (!cartId || !email) {
      return NextResponse.json(
        { error: 'Cart ID and email are required' },
        { status: 400 }
      );
    }

    // Check if already abandoned
    const existing = await db.abandonedCart.findUnique({
      where: { cartId },
    });

    if (existing) {
      return NextResponse.json({ abandonedCart: existing });
    }

    const abandonedCart = await db.abandonedCart.create({
      data: {
        cartId,
        email,
        discountCode,
        status: 'pending',
      },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ abandonedCart }, { status: 201 });
  } catch (error) {
    console.error('Error marking cart as abandoned:', error);
    return NextResponse.json(
      { error: 'Failed to mark cart as abandoned' },
      { status: 500 }
    );
  }
}

// PUT /api/cart/abandoned - Update abandoned cart status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, recoveredAt } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Abandoned cart ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (recoveredAt) {
      updateData.recoveredAt = new Date(recoveredAt);
    }

    const abandonedCart = await db.abandonedCart.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ abandonedCart });
  } catch (error) {
    console.error('Error updating abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to update abandoned cart' },
      { status: 500 }
    );
  }
}
