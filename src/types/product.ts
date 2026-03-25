export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[];
  files: string[];
  category: string | null;
  featured: boolean;
  published: boolean;
  salesCount: number;
  launchMode: boolean;
  launchDate: Date | null;
  earlyBirdPrice: number | null;
  earlyBirdEndDate: Date | null;
  waitlistEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
}

export type ProductStatus = 'draft' | 'published';

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  files: string[];
  featured: boolean;
  published: boolean;
  launchMode?: boolean;
  launchDate?: Date | null;
  earlyBirdPrice?: number | null;
  earlyBirdEndDate?: Date | null;
  waitlistEnabled?: boolean;
}

export const PRODUCT_CATEGORIES = [
  { value: 'ebook', label: 'E-Book' },
  { value: 'template', label: 'Template' },
  { value: 'preset', label: 'Preset' },
  { value: 'course', label: 'Course' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'other', label: 'Other' },
] as const;

export const DEFAULT_PRODUCT: ProductFormData = {
  title: '',
  description: '',
  price: 0,
  category: 'other',
  images: [],
  files: [],
  featured: false,
  published: false,
};
