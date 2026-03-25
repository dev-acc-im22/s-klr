'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2, Settings, Sparkles, Link2, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PRODUCT_CATEGORIES, ProductFormData } from '@/types/product';
import { mockProducts } from '@/lib/mock-data/products';

import { useToast } from '@/hooks/use-toast';

import { AIDescriptionGenerator } from '@/components/dashboard/products/AIDescriptionGenerator';
import { UpsellManager, CrossSellManager } from '@/components/dashboard/upsell';
import { LaunchSettings } from '@/components/dashboard/waitlist';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [productId, setProductId] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMeta, setSeoMeta] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const loadProduct = async () => {
      const { id } = await params;
      setProductId(id);

      try {
        const product = mockProducts.find((p) => p.id === id);
        if (product) {
          setFormData({
            title: product.title,
            description: product.description || '',
            price: product.price,
            category: product.category || 'other',
            images: product.images,
            files: product.files,
            featured: product.featured,
            published: product.published,
          });
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update product');

      toast({
        title: 'Product updated',
        description: 'Your product has been updated successfully.',
      });

      router.push('/dashboard/products');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update product. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });

      toast({
        title: 'Product deleted',
        description: 'Your product has been deleted.',
      });

      router.push('/dashboard/products');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product.',
      });
    }
  };

  const handleDescriptionGenerated = (description: string) => {
    if (formData) {
      setFormData({ ...formData, description });
    }
  };

  const handleSeoTitleGenerated = (title: string) => {
    setSeoTitle(title);
  };

  const handleSeoMetaGenerated = (meta: string) => {
    setSeoMeta(meta);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
              <p className="text-muted-foreground">
                Update your product details
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="launch" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Launch
            </TabsTrigger>
            <TabsTrigger value="upsells" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Upsells
            </TabsTrigger>
            <TabsTrigger value="cross-sells" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Cross-Sells
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Product Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use the AI generator on the right to create a compelling description
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PRODUCT_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="featured">Featured Product</Label>
                          <p className="text-sm text-muted-foreground">
                            Feature this product on your store homepage
                          </p>
                        </div>
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, featured: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="published">Published</Label>
                          <p className="text-sm text-muted-foreground">
                            Make this product visible on your store
                          </p>
                        </div>
                        <Switch
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, published: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - AI Generator */}
                <div className="space-y-6">
                  <AIDescriptionGenerator
                    productTitle={formData.title}
                    category={formData.category}
                    onDescriptionGenerated={handleDescriptionGenerated}
                    onSeoTitleGenerated={handleSeoTitleGenerated}
                    onSeoMetaGenerated={handleSeoMetaGenerated}
                  />

                  {/* SEO Preview Card (shows after AI generation) */}
                  {(seoTitle || seoMeta) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">SEO Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                          <p className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">
                            {seoTitle || formData.title || 'Product Title'}
                          </p>
                          <p className="text-green-700 dark:text-green-400 text-sm truncate">
                            yourstore.com/product/{formData.title.toLowerCase().replace(/\s+/g, '-') || 'product'}
                          </p>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {seoMeta || formData.description || 'Your product description will appear here...'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/products">Cancel</Link>
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Launch Tab */}
          <TabsContent value="launch" className="mt-6">
            <LaunchSettings
              productId={productId}
              regularPrice={formData.price}
            />
          </TabsContent>

          {/* Upsells Tab */}
          <TabsContent value="upsells" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <UpsellManager productId={productId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cross-Sells Tab */}
          <TabsContent value="cross-sells" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <CrossSellManager productId={productId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
