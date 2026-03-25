'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { PRODUCT_CATEGORIES, ProductFormData, DEFAULT_PRODUCT } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

import { AIDescriptionGenerator } from '@/components/dashboard/products/AIDescriptionGenerator';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_PRODUCT);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMeta, setSeoMeta] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create product');

      toast({
        title: 'Product created',
        description: 'Your product has been created successfully.',
      });

      router.push('/dashboard/products');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create product. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionGenerated = (description: string) => {
    setFormData({ ...formData, description });
  };

  const handleSeoTitleGenerated = (title: string) => {
    setSeoTitle(title);
  };

  const handleSeoMetaGenerated = (meta: string) => {
    setSeoMeta(meta);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
          <p className="text-muted-foreground">
            Create a new digital product to sell
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of your product
                </CardDescription>
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
                    placeholder="e.g., Creator Starter Kit"
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
                    placeholder="Describe your product..."
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
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="29.00"
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
                        <SelectValue placeholder="Select category" />
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

            {/* Files & Images (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Files & Images</CardTitle>
                <CardDescription>
                  Upload your product files and cover images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="text-muted-foreground mb-2">
                    File upload coming soon
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For now, you can add file URLs in the description
                  </p>
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
                  <CardDescription>
                    How your product might appear in search results
                  </CardDescription>
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
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Create Product
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/products">Cancel</Link>
          </Button>
        </div>
      </form>
      </div>
  );
}
