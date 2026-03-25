"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CoachingPackage {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  popular?: boolean;
  isActive: boolean;
}

interface CoachingPackageFormProps {
  initialData?: CoachingPackage;
  onSubmit: (data: Omit<CoachingPackage, "id">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function CoachingPackageForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: CoachingPackageFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 60,
    price: initialData?.price || 0,
    popular: initialData?.popular || false,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Package Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Strategy Session"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select
            value={String(formData.duration)}
            onValueChange={(v) => setFormData({ ...formData, duration: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what's included in this session..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          placeholder="99.00"
          required
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="popular"
            checked={formData.popular}
            onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
          />
          <Label htmlFor="popular" className="text-sm">Mark as Popular</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive" className="text-sm">Active</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "Update Package" : "Create Package"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function PackagePreviewCard({ pkg }: { pkg: CoachingPackage }) {
  return (
    <Card className={pkg.popular ? "border-primary" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pkg.name}</CardTitle>
          {pkg.popular && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        <CardDescription>{pkg.duration} minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
        <div className="text-2xl font-bold">${pkg.price}</div>
      </CardContent>
    </Card>
  );
}
