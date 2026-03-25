import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockUpsellOffers } from '@/lib/mock-data/upsells';

// GET /api/upsells - List all upsell offers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    const productId = searchParams.get('productId');
    const upsellType = searchParams.get('upsellType');
    const active = searchParams.get('active');

    // Return mock data for ghost mode
    if (ghostMode) {
      let filteredOffers = [...mockUpsellOffers];

      if (productId) {
        filteredOffers = filteredOffers.filter((o) => o.productId === productId);
      }

      if (upsellType) {
        filteredOffers = filteredOffers.filter((o) => o.upsellType === upsellType);
      }

      if (active !== null) {
        filteredOffers = filteredOffers.filter((o) => o.active === (active === 'true'));
      }

      return NextResponse.json({ upsellOffers: filteredOffers });
    }

    // Real database query
    const where: Record<string, unknown> = {};

    if (productId) {
      where.productId = productId;
    }

    if (upsellType) {
      where.upsellType = upsellType;
    }

    if (active !== null) {
      where.active = active === 'true';
    }

    const upsellOffers = await db.upsellOffer.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        offerProduct: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ upsellOffers });
  } catch (error) {
    console.error('Error fetching upsell offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upsell offers' },
      { status: 500 }
    );
  }
}

// POST /api/upsells - Create new upsell offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      title,
      description,
      discountPrice,
      discountType,
      upsellType,
      offerProductId,
      triggerTiming,
      displayOrder,
      active,
      abTestVariant,
    } = body;

    const upsellOffer = await db.upsellOffer.create({
      data: {
        productId,
        title,
        description,
        discountPrice: parseFloat(discountPrice),
        discountType: discountType || 'fixed',
        upsellType: upsellType || 'ONE_CLICK',
        offerProductId,
        triggerTiming: triggerTiming || 'after_purchase',
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
        abTestVariant,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        offerProduct: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({ upsellOffer }, { status: 201 });
  } catch (error) {
    console.error('Error creating upsell offer:', error);
    return NextResponse.json(
      { error: 'Failed to create upsell offer' },
      { status: 500 }
    );
  }
}
