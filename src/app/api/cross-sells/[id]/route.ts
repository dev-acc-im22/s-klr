import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockCrossSellProducts } from '@/lib/mock-data/upsells';

// GET /api/cross-sells/[id] - Get single cross-sell product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check for ghost mode mock data
    const ghostCrossSell = mockCrossSellProducts.find((c) => c.id === id);
    if (ghostCrossSell) {
      return NextResponse.json({ crossSell: ghostCrossSell });
    }

    const crossSell = await db.crossSellProduct.findUnique({
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
        relatedProduct: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            description: true,
            category: true,
            salesCount: true,
          },
        },
      },
    });

    if (!crossSell) {
      return NextResponse.json({ error: 'Cross-sell not found' }, { status: 404 });
    }

    return NextResponse.json({ crossSell });
  } catch (error) {
    console.error('Error fetching cross-sell:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cross-sell' },
      { status: 500 }
    );
  }
}

// PUT /api/cross-sells/[id] - Update cross-sell product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { displayOrder, active, bundlePrice } = body;

    const crossSell = await db.crossSellProduct.update({
      where: { id },
      data: {
        displayOrder,
        active,
        bundlePrice: bundlePrice ? parseFloat(bundlePrice) : null,
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
        relatedProduct: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            description: true,
            category: true,
            salesCount: true,
          },
        },
      },
    });

    return NextResponse.json({ crossSell });
  } catch (error) {
    console.error('Error updating cross-sell:', error);
    return NextResponse.json(
      { error: 'Failed to update cross-sell' },
      { status: 500 }
    );
  }
}

// DELETE /api/cross-sells/[id] - Delete cross-sell product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.crossSellProduct.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cross-sell:', error);
    return NextResponse.json(
      { error: 'Failed to delete cross-sell' },
      { status: 500 }
    );
  }
}
