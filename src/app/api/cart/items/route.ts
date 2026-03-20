import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/cart/items - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, productId, quantity = 1 } = body;

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'Session ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await db.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { sessionId },
        include: { items: true },
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });

      // Update cart timestamp
      await db.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({ item: updatedItem });
    }

    // Add new item
    const cartItem = await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: { product: true },
    });

    // Update cart timestamp
    await db.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ item: cartItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart/items - Update item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await db.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ success: true, deleted: true });
    }

    const cartItem = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true, cart: true },
    });

    // Update cart timestamp
    await db.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      select: { cartId: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await db.cartItem.delete({
      where: { id: itemId },
    });

    // Update cart timestamp
    await db.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
