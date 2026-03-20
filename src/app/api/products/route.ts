import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockProducts } from '@/lib/mock-data/products';

// GET /api/products - List all products for current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    
    // Return mock data for ghost mode
    if (ghostMode) {
      return NextResponse.json({ products: mockProducts });
    }

    // TODO: Get actual user ID from session
    // For now, return mock data
    const products = await db.product.findMany({
      where: { creatorId: 'user-id' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, category, images, files, featured, published } = body;

    // TODO: Get actual user ID from session
    const creatorId = 'ghost-user-id';

    const product = await db.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images: images || [],
        files: files || [],
        featured: featured || false,
        published: published || false,
        creatorId,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
