'use client';

import { useState, useEffect } from 'react';
import { CrossSellSection } from '@/components/dashboard/upsell';
import { mockCrossSellProducts } from '@/lib/mock-data/upsells';

interface ProductCrossSellsProps {
  productId: string;
  productPrice: number;
}

export function ProductCrossSells({ productId, productPrice }: ProductCrossSellsProps) {
  const [crossSellProducts, setCrossSellProducts] = useState<
    Array<{
      id: string;
      title: string;
      description?: string;
      price: number;
      bundlePrice?: number;
      image?: string;
      category?: string;
      salesCount?: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrossSells();
  }, [productId]);

  const loadCrossSells = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // For now, use mock data
      const crossSells = mockCrossSellProducts
        .filter((c) => c.productId === productId && c.active)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const products = crossSells
        .map((c) => ({
          id: c.relatedProductId,
          title: c.relatedProduct?.title || '',
          description: c.relatedProduct?.description,
          price: c.relatedProduct?.price || 0,
          bundlePrice: c.bundlePrice,
          image: c.relatedProduct?.images?.[0],
          category: c.relatedProduct?.category,
          salesCount: c.relatedProduct?.salesCount,
        }))
        .filter((p) => p.title);

      setCrossSellProducts(products);
    } catch (error) {
      console.error('Error loading cross-sells:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product_Id: string, _isBundle?: boolean) => {
    // Simulate adding to cart
    console.log('Adding product to cart:', product_Id);
    // In production, this would call the cart API
  };

  const handleProductClick = (product_Id: string) => {
    // Navigate to product page
    window.location.href = `${window.location.pathname.split('/').slice(0, -1).join('/')}/${product_Id}`;
  };

  if (loading || crossSellProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <CrossSellSection
        products={crossSellProducts}
        mainProductPrice={productPrice}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />
    </div>
  );
}
