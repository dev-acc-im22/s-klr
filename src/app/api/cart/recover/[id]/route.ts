import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/cart/recover/[id] - Get recovery details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const abandonedCart = await db.abandonedCart.findUnique({
      where: { id },
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
                    description: true,
                  },
                },
              },
            },
          },
        },
        recoveryEmails: {
          orderBy: { sentAt: 'desc' },
        },
      },
    });

    if (!abandonedCart) {
      return NextResponse.json(
        { error: 'Abandoned cart not found' },
        { status: 404 }
      );
    }

    // Calculate cart total
    const cartTotal = abandonedCart.cart.items.reduce(
      (sum: number, item: { quantity: number; product: { price: number | null } }) =>
        sum + (item.quantity * (item.product.price || 0)),
      0
    );

    return NextResponse.json({
      abandonedCart: {
        ...abandonedCart,
        cartTotal,
      },
    });
  } catch (error) {
    console.error('Error fetching recovery details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recovery details' },
      { status: 500 }
    );
  }
}

// POST /api/cart/recover/[id] - Send recovery email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { discountCode, customMessage } = body;

    const abandonedCart = await db.abandonedCart.findUnique({
      where: { id },
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

    if (!abandonedCart) {
      return NextResponse.json(
        { error: 'Abandoned cart not found' },
        { status: 404 }
      );
    }

    // In a real implementation, you would send an email here
    // using a service like SendGrid, Resend, etc.
    // For now, we'll just log the recovery email and update the status

    // Create recovery email record
    const recoveryEmail = await db.recoveryEmail.create({
      data: {
        abandonedCartId: id,
      },
    });

    // Update abandoned cart with discount code and status
    const updatedAbandonedCart = await db.abandonedCart.update({
      where: { id },
      data: {
        recoveryEmailSentAt: new Date(),
        status: 'email_sent',
        discountCode: discountCode || abandonedCart.discountCode,
      },
    });

    // In production, send actual email here
    console.log('Sending recovery email:', {
      to: abandonedCart.email,
      subject: customMessage || 'You left something in your cart!',
      cartItems: abandonedCart.cart.items.map((item: { product: { title: string }; quantity: number }) => ({
        product: item.product.title,
        quantity: item.quantity,
      })),
      discountCode: discountCode || abandonedCart.discountCode,
    });

    return NextResponse.json({
      success: true,
      recoveryEmail,
      abandonedCart: updatedAbandonedCart,
    });
  } catch (error) {
    console.error('Error sending recovery email:', error);
    return NextResponse.json(
      { error: 'Failed to send recovery email' },
      { status: 500 }
    );
  }
}

// PUT /api/cart/recover/[id] - Track email opened/clicked
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { emailId, action } = body; // action: 'opened' | 'clicked'

    if (!emailId || !action) {
      return NextResponse.json(
        { error: 'Email ID and action are required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, Date> = {};
    if (action === 'opened') {
      updateData.openedAt = new Date();
    } else if (action === 'clicked') {
      updateData.clickedAt = new Date();
    }

    const recoveryEmail = await db.recoveryEmail.update({
      where: { id: emailId },
      data: updateData,
    });

    return NextResponse.json({ recoveryEmail });
  } catch (error) {
    console.error('Error tracking email:', error);
    return NextResponse.json(
      { error: 'Failed to track email' },
      { status: 500 }
    );
  }
}
