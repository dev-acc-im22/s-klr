'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DiscountCodeForm } from '@/components/dashboard/discounts/DiscountCodeForm';

export default function NewDiscountPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/discounts')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Discount Code</h1>
            <p className="text-muted-foreground">
              Create a new discount code for your products
            </p>
          </div>
        </div>

        {/* Form */}
        <DiscountCodeForm
          mode="create"
          onSuccess={() => router.push('/dashboard/discounts')}
          onCancel={() => router.push('/dashboard/discounts')}
        />
      </div>
  );
}
