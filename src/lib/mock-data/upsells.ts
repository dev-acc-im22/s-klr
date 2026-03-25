// Mock data for upsells and cross-sells (used in ghost mode)

export interface UpsellOffer {
  id: string;
  productId: string;
  title: string;
  description?: string;
  discountPrice: number;
  discountType: 'fixed' | 'percentage';
  upsellType: 'ONE_CLICK' | 'ORDER_BUMP' | 'BUNDLE';
  offerProductId: string;
  triggerTiming: 'after_purchase' | 'during_checkout';
  displayOrder: number;
  active: boolean;
  abTestVariant?: string;
  conversionRate: number;
  impressions: number;
  conversions: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  product?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  offerProduct?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export interface CrossSellProduct {
  id: string;
  productId: string;
  relatedProductId: string;
  displayOrder: number;
  active: boolean;
  bundlePrice?: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  product?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  relatedProduct?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description?: string;
    category?: string;
    salesCount?: number;
  };
}

export const mockUpsellOffers: UpsellOffer[] = [
  {
    id: 'upsell-1',
    productId: 'prod-1',
    title: 'Get the Content Strategy Guide for just $39!',
    description: 'Normally $49, save $10 when you add this to your order.',
    discountPrice: 39,
    discountType: 'fixed',
    upsellType: 'ONE_CLICK',
    offerProductId: 'prod-2',
    triggerTiming: 'after_purchase',
    displayOrder: 1,
    active: true,
    abTestVariant: 'A',
    conversionRate: 18.5,
    impressions: 342,
    conversions: 63,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    product: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
    },
    offerProduct: {
      id: 'prod-2',
      title: 'Content Strategy Guide',
      price: 49,
      images: ['/images/product-2.jpg'],
    },
  },
  {
    id: 'upsell-2',
    productId: 'prod-1',
    title: 'Add Email Templates for $15',
    description: 'Get 50+ proven email templates to grow your audience.',
    discountPrice: 15,
    discountType: 'fixed',
    upsellType: 'ORDER_BUMP',
    offerProductId: 'prod-3',
    triggerTiming: 'during_checkout',
    displayOrder: 2,
    active: true,
    abTestVariant: 'B',
    conversionRate: 24.2,
    impressions: 156,
    conversions: 38,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-05'),
    product: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
    },
    offerProduct: {
      id: 'prod-3',
      title: 'Email Templates Pack',
      price: 19,
      images: ['/images/product-3.jpg'],
    },
  },
  {
    id: 'upsell-3',
    productId: 'prod-2',
    title: 'Complete Creator Bundle',
    description: 'Get the Starter Kit + Email Templates for one low price.',
    discountPrice: 39,
    discountType: 'fixed',
    upsellType: 'BUNDLE',
    offerProductId: 'prod-1',
    triggerTiming: 'after_purchase',
    displayOrder: 1,
    active: true,
    conversionRate: 15.8,
    impressions: 89,
    conversions: 14,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    product: {
      id: 'prod-2',
      title: 'Content Strategy Guide',
      price: 49,
      images: ['/images/product-2.jpg'],
    },
    offerProduct: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
    },
  },
  {
    id: 'upsell-4',
    productId: 'prod-3',
    title: 'Add Thumbnail Pack for $12',
    description: '100+ customizable thumbnail templates - usually $15.',
    discountPrice: 12,
    discountType: 'fixed',
    upsellType: 'ORDER_BUMP',
    offerProductId: 'prod-4',
    triggerTiming: 'during_checkout',
    displayOrder: 1,
    active: true,
    conversionRate: 32.1,
    impressions: 234,
    conversions: 75,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-15'),
    product: {
      id: 'prod-3',
      title: 'Email Templates Pack',
      price: 19,
      images: ['/images/product-3.jpg'],
    },
    offerProduct: {
      id: 'prod-4',
      title: 'Thumbnail Design Pack',
      price: 15,
      images: ['/images/product-4.jpg'],
    },
  },
];

export const mockCrossSellProducts: CrossSellProduct[] = [
  {
    id: 'cross-1',
    productId: 'prod-1',
    relatedProductId: 'prod-2',
    displayOrder: 1,
    active: true,
    bundlePrice: 65,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    product: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
    },
    relatedProduct: {
      id: 'prod-2',
      title: 'Content Strategy Guide',
      price: 49,
      images: ['/images/product-2.jpg'],
      description: 'A comprehensive guide to building a content strategy that grows your audience and revenue.',
      category: 'ebook',
      salesCount: 89,
    },
  },
  {
    id: 'cross-2',
    productId: 'prod-1',
    relatedProductId: 'prod-3',
    displayOrder: 2,
    active: true,
    bundlePrice: 42,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    product: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
    },
    relatedProduct: {
      id: 'prod-3',
      title: 'Email Templates Pack',
      price: 19,
      images: ['/images/product-3.jpg'],
      description: '50+ proven email templates for creators. Welcome sequences, sales emails, newsletters, and more.',
      category: 'template',
      salesCount: 234,
    },
  },
  {
    id: 'cross-3',
    productId: 'prod-2',
    relatedProductId: 'prod-1',
    displayOrder: 1,
    active: true,
    bundlePrice: 65,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-05'),
    product: {
      id: 'prod-2',
      title: 'Content Strategy Guide',
      price: 49,
      images: ['/images/product-2.jpg'],
    },
    relatedProduct: {
      id: 'prod-1',
      title: 'Creator Starter Kit',
      price: 29,
      images: ['/images/product-1.jpg'],
      description: 'Everything you need to start your creator business. Includes templates, checklists, and guides.',
      category: 'template',
      salesCount: 142,
    },
  },
  {
    id: 'cross-4',
    productId: 'prod-3',
    relatedProductId: 'prod-4',
    displayOrder: 1,
    active: true,
    bundlePrice: 28,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    product: {
      id: 'prod-3',
      title: 'Email Templates Pack',
      price: 19,
      images: ['/images/product-3.jpg'],
    },
    relatedProduct: {
      id: 'prod-4',
      title: 'Thumbnail Design Pack',
      price: 15,
      images: ['/images/product-4.jpg'],
      description: '100+ customizable thumbnail templates for YouTube, courses, and social media.',
      category: 'template',
      salesCount: 312,
    },
  },
  {
    id: 'cross-5',
    productId: 'prod-4',
    relatedProductId: 'prod-3',
    displayOrder: 1,
    active: true,
    bundlePrice: 28,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-15'),
    product: {
      id: 'prod-4',
      title: 'Thumbnail Design Pack',
      price: 15,
      images: ['/images/product-4.jpg'],
    },
    relatedProduct: {
      id: 'prod-3',
      title: 'Email Templates Pack',
      price: 19,
      images: ['/images/product-3.jpg'],
      description: '50+ proven email templates for creators. Welcome sequences, sales emails, newsletters, and more.',
      category: 'template',
      salesCount: 234,
    },
  },
];

// Helper functions for ghost mode
export function getUpsellOffersByProductId(productId: string): UpsellOffer[] {
  return mockUpsellOffers.filter(
    (offer) => offer.productId === productId && offer.active
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCrossSellsByProductId(productId: string): CrossSellProduct[] {
  return mockCrossSellProducts.filter(
    (cross) => cross.productId === productId && cross.active
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getActiveOrderBumps(productId: string): UpsellOffer[] {
  return mockUpsellOffers.filter(
    (offer) => offer.productId === productId && offer.active && offer.upsellType === 'ORDER_BUMP'
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getAfterPurchaseUpsells(productId: string): UpsellOffer[] {
  return mockUpsellOffers.filter(
    (offer) => offer.productId === productId && offer.active && offer.upsellType === 'ONE_CLICK'
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getBundleOffers(productId: string): UpsellOffer[] {
  return mockUpsellOffers.filter(
    (offer) => offer.productId === productId && offer.active && offer.upsellType === 'BUNDLE'
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}
