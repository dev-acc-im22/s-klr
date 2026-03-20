'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Percent,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
  Package,
  Users,
  Sparkles,
  Loader2,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface DiscountFormData {
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
  maxUses: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  isOneTimeUse: boolean;
  applicableProducts: string[];
}

interface DiscountCodeFormProps {
  discountId?: string;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DiscountCodeForm({ discountId, mode = 'create', onSuccess, onCancel }: DiscountCodeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState<DiscountFormData>({
    code: '',
    name: '',
    type: 'PERCENTAGE',
    value: 10,
    minPurchase: 0,
    maxUses: 0,
    startDate: null,
    endDate: null,
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: [],
  });

  // Fetch existing discount for edit mode
  useEffect(() => {
    if (mode === 'edit' && discountId) {
      fetchDiscount();
    }
  }, [mode, discountId]);

  const fetchDiscount = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/discounts/${discountId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          code: data.code,
          name: data.name,
          type: data.type,
          value: data.value,
          minPurchase: data.minPurchase,
          maxUses: data.maxUses,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          isActive: data.isActive,
          isOneTimeUse: data.isOneTimeUse,
          applicableProducts: data.applicableProducts 
            ? JSON.parse(data.applicableProducts) 
            : [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discount code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = mode === 'edit' ? `/api/discounts/${discountId}` : '/api/discounts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Discount code ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard/discounts');
        }
      } else {
        throw new Error(data.error || 'Failed to save discount code');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save discount code',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          {mode === 'edit' ? 'Edit Discount Code' : 'Create Discount Code'}
        </CardTitle>
        <CardDescription>
          {mode === 'edit' 
            ? 'Update the details of your discount code' 
            : 'Create a new discount code for your products'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Discount Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER20"
                  className="uppercase"
                  required
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Letters and numbers only, will be capitalized
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Friendly Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sale Discount"
                required
              />
            </div>
          </div>

          {/* Discount Type and Value */}
          <div className="space-y-3">
            <Label>Discount Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as 'PERCENTAGE' | 'FIXED' })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
                <Label htmlFor="percentage" className="flex items-center gap-2 cursor-pointer">
                  <Percent className="h-4 w-4" />
                  Percentage
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="FIXED" id="fixed" />
                <Label htmlFor="fixed" className="flex items-center gap-2 cursor-pointer">
                  <DollarSign className="h-4 w-4" />
                  Fixed Amount
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value">
              Discount Value {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
            </Label>
            <div className="relative">
              {formData.type === 'FIXED' && (
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                min={formData.type === 'PERCENTAGE' ? 1 : 0.01}
                max={formData.type === 'PERCENTAGE' ? 100 : undefined}
                step={formData.type === 'PERCENTAGE' ? 1 : 0.01}
                className={formData.type === 'FIXED' ? 'pl-8' : ''}
                required
              />
              {formData.type === 'PERCENTAGE' && (
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                {formData.isActive ? (
                  <ToggleRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                )}
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.isActive ? 'Discount is currently active' : 'Discount is currently inactive'}
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Advanced Options */}
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              <span>Advanced Options</span>
              <Badge variant="outline">Optional</Badge>
            </Button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 rounded-lg border p-4">
                {/* Minimum Purchase */}
                <div className="space-y-2">
                  <Label htmlFor="minPurchase" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Minimum Purchase Amount
                  </Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                    min={0}
                    step={0.01}
                    placeholder="0 = no minimum"
                  />
                  <p className="text-xs text-muted-foreground">
                    Order must be at least this amount for discount to apply
                  </p>
                </div>

                {/* Max Uses */}
                <div className="space-y-2">
                  <Label htmlFor="maxUses" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Maximum Uses
                  </Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                    min={0}
                    placeholder="0 = unlimited"
                  />
                  <p className="text-xs text-muted-foreground">
                    How many times this code can be used (0 = unlimited)
                  </p>
                </div>

                {/* Date Range */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Start Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {formData.startDate ? format(formData.startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.startDate || undefined}
                          onSelect={(date) => setFormData({ ...formData, startDate: date || null })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      End Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {formData.endDate ? format(formData.endDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.endDate || undefined}
                          onSelect={(date) => setFormData({ ...formData, endDate: date || null })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* One-Time Use */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>One-Time Use</Label>
                    <p className="text-sm text-muted-foreground">
                      Each customer can only use this code once
                    </p>
                  </div>
                  <Switch
                    checked={formData.isOneTimeUse}
                    onCheckedChange={(checked) => setFormData({ ...formData, isOneTimeUse: checked })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'edit' ? 'Update Code' : 'Create Code'}
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
