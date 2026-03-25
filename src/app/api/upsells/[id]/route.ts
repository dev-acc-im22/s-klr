import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockUpsellOffers } from '@/lib/mock-data/upsells';

// GET /api/upsells/[id] - Get single upsell offer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check for ghost mode mock data
    const ghostOffer = mockUpsellOffers.find((o) => o.id === id);
    if (ghostOffer) {
      return NextResponse.json({ upsellOffer: ghostOffer });
    }

    const upsellOffer = await db.upsellOffer.findUnique({
      where: { id },
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

    if (!upsellOffer) {
      return NextResponse.json({ error: 'Upsell offer not found' }, { status: 404 });
    }

    return NextResponse.json({ upsellOffer });
  } catch (error) {
    console.error('Error fetching upsell offer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upsell offer' },
      { status: 500 }
    );
  }
}

// PUT /api/upsells/[id] - Update upsell offer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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

    const upsellOffer = await db.upsellOffer.update({
      where: { id },
      data: {
        title,
        description,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        discountType,
        upsellType,
        offerProductId,
        triggerTiming,
        displayOrder,
        active,
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

    return NextResponse.json({ upsellOffer });
  } catch (error) {
    console.error('Error updating upsell offer:', error);
    return NextResponse.json(
      { error: 'Failed to update upsell offer' },
      { status: 500 }
    );
  }
}

// DELETE /api/upsells/[id] - Delete upsell offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.upsellOffer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting upsell offer:', error);
    return NextResponse.json(
      { error: 'Failed to delete upsell offer' },
      { status: 500 }
    );
  }
}

// PATCH /api/upsells/[id] - Update specific fields (e.g., track impression/conversion)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { trackImpression, trackConversion } = body;

    const updateData: Record<string, unknown> = {};

    if (trackImpression) {
      const current = await db.upsellOffer.findUnique({
        where: { id },
        select: { impressions: true },
      });
      updateData.impressions = (current?.impressions || 0) + 1;
    }

    if (trackConversion) {
      const current = await db.upsellOffer.findUnique({
        where: { id },
        select: { conversions: true, impressions: true },
      });
      const newConversions = (current?.conversions || 0) + 1;
      const impressions = current?.impressions || 1;
      updateData.conversions = newConversions;
      updateData.conversionRate = (newConversions / impressions) * 100;
    }

    const upsellOffer = await db.upsellOffer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ upsellOffer });
  } catch (error) {
    console.error('Error patching upsell offer:', error);
    return NextResponse.json(
      { error: 'Failed to update upsell offer' },
      { status: 500 }
    );
  }
}
