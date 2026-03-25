'use client';

import { useState } from 'react';
import { Variable, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Common variables grouped by category
const variableCategories = {
  subscriber: {
    name: 'Subscriber',
    variables: [
      { name: 'name', description: 'Subscriber\'s full name' },
      { name: 'first_name', description: 'Subscriber\'s first name' },
      { name: 'last_name', description: 'Subscriber\'s last name' },
      { name: 'email', description: 'Subscriber\'s email address' },
    ]
  },
  creator: {
    name: 'Creator',
    variables: [
      { name: 'creator_name', description: 'Your name/brand' },
      { name: 'store_url', description: 'Link to your store' },
    ]
  },
  order: {
    name: 'Order',
    variables: [
      { name: 'product', description: 'Product name' },
      { name: 'price', description: 'Product price' },
      { name: 'order_id', description: 'Unique order ID' },
      { name: 'order_date', description: 'Date of purchase' },
    ]
  },
  course: {
    name: 'Course',
    variables: [
      { name: 'course_name', description: 'Course name' },
      { name: 'course_url', description: 'Link to the course' },
      { name: 'module_count', description: 'Number of modules' },
      { name: 'duration', description: 'Estimated course duration' },
    ]
  },
  cart: {
    name: 'Cart',
    variables: [
      { name: 'cart_items', description: 'Items in cart' },
      { name: 'cart_total', description: 'Total cart value' },
      { name: 'cart_url', description: 'Link to cart' },
    ]
  },
  discount: {
    name: 'Discount',
    variables: [
      { name: 'discount', description: 'Discount percentage' },
      { name: 'discount_code', description: 'Promo code' },
      { name: 'expiry_date', description: 'Offer expiry date' },
    ]
  },
  system: {
    name: 'System',
    variables: [
      { name: 'unsubscribe_link', description: 'Unsubscribe link (required)' },
      { name: 'checkout_url', description: 'Checkout page URL' },
    ]
  }
};

interface VariableInserterProps {
  onInsert: (variable: string) => void;
  availableVariables?: string[];
  className?: string;
}

export function VariableInserter({ 
  onInsert, 
  availableVariables,
  className = ''
}: VariableInserterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  // Filter variables based on search and availableVariables
  const filteredCategories = Object.entries(variableCategories).reduce(
    (acc, [key, category]) => {
      const filteredVars = category.variables.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.description.toLowerCase().includes(search.toLowerCase())
      ).filter(
        (v) => !availableVariables || availableVariables.length === 0 || availableVariables.includes(v.name)
      );

      if (filteredVars.length > 0) {
        acc[key] = { ...category, variables: filteredVars };
      }
      return acc;
    },
    {} as typeof variableCategories
  );

  const handleInsert = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(variable);
    setCopiedVariable(variableName);
    setTimeout(() => setCopiedVariable(null), 2000);
    
    // Call the onInsert callback
    onInsert(variable);
    
    // Keep popover open for multiple insertions
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 ${className}`}
        >
          <Variable className="h-4 w-4" />
          Insert Variable
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {Object.keys(filteredCategories).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No variables found
              </p>
            ) : (
              Object.entries(filteredCategories).map(([key, category], index) => (
                <div key={key}>
                  {index > 0 && <Separator className="my-2" />}
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    {category.name}
                  </p>
                  {category.variables.map((variable) => (
                    <button
                      key={variable.name}
                      onClick={() => handleInsert(variable.name)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {`{{${variable.name}}}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {variable.description}
                        </p>
                      </div>
                      {copiedVariable === variable.name ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {availableVariables && availableVariables.length > 0 && (
          <div className="p-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Available for this template:
            </p>
            <div className="flex flex-wrap gap-1">
              {availableVariables.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs">
                  {v}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
