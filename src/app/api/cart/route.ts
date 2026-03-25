import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockCarts } from '@/lib/mock-data/cart';

// GET /api/cart - Get cart by sessionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const ghostMode = searchParams.get('ghost') === 'true';

    // Return mock data for ghost mode
    if (ghostMode) {
      const cart = sessionId ? mockCarts.find(c => c.sessionId === sessionId) : mockCarts[0];
      return NextResponse.json({ cart: cart || null });
    }

    if (!sessionId) {
      return NextResponse.json({ cart: null });
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Create or update cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if cart exists
    const existingCart = await db.cart.findUnique({
      where: { sessionId },
    });

    if (existingCart) {
      // Update email if provided
      if (email) {
        const updatedCart = await db.cart.update({
          where: { sessionId },
          data: { email },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
        return NextResponse.json({ cart: updatedCart });
      }
      return NextResponse.json({ cart: existingCart });
    }

    // Create new cart
    const cart = await db.cart.create({
      data: {
        sessionId,
        email,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ cart }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create/update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Delete cart (after checkout)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await db.cart.delete({
      where: { sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart' },
      { status: 500 }
    );
  }
}
