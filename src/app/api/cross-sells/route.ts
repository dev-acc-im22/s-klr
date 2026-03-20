import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockCrossSellProducts } from '@/lib/mock-data/upsells';

// GET /api/cross-sells - List all cross-sell products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    const productId = searchParams.get('productId');
    const active = searchParams.get('active');

    // Return mock data for ghost mode
    if (ghostMode) {
      let filteredCrossSells = [...mockCrossSellProducts];

      if (productId) {
        filteredCrossSells = filteredCrossSells.filter((c) => c.productId === productId);
      }

      if (active !== null) {
        filteredCrossSells = filteredCrossSells.filter((c) => c.active === (active === 'true'));
      }

      return NextResponse.json({ crossSells: filteredCrossSells });
    }

    // Real database query
    const where: Record<string, unknown> = {};

    if (productId) {
      where.productId = productId;
    }

    if (active !== null) {
      where.active = active === 'true';
    }

    const crossSells = await db.crossSellProduct.findMany({
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
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ crossSells });
  } catch (error) {
    console.error('Error fetching cross-sell products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cross-sell products' },
      { status: 500 }
    );
  }
}

// POST /api/cross-sells - Create new cross-sell relationship
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, relatedProductId, displayOrder, active, bundlePrice } = body;

    // Check if relationship already exists
    const existing = await db.crossSellProduct.findFirst({
      where: {
        productId,
        relatedProductId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Cross-sell relationship already exists' },
        { status: 400 }
      );
    }

    const crossSell = await db.crossSellProduct.create({
      data: {
        productId,
        relatedProductId,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
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

    return NextResponse.json({ crossSell }, { status: 201 });
  } catch (error) {
    console.error('Error creating cross-sell:', error);
    return NextResponse.json(
      { error: 'Failed to create cross-sell' },
      { status: 500 }
    );
  }
}
