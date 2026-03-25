'use client';

import { useState } from 'react';
import { Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmailTemplateType } from '@/lib/mock-data/email';

// Mock data for preview
const mockData: Record<string, Record<string, string>> = {
  WELCOME: {
    name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    creator_name: 'Your Brand',
    store_url: 'https://yourstore.com',
    unsubscribe_link: '#unsubscribe'
  },
  PURCHASE_CONFIRMATION: {
    name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    product: 'Digital Marketing Guide',
    price: '$49.00',
    order_id: 'ORD-2024-001',
    order_date: 'January 15, 2024',
    creator_name: 'Your Brand',
    store_url: 'https://yourstore.com',
    unsubscribe_link: '#unsubscribe'
  },
  COURSE_ENROLLMENT: {
    name: 'Alex Johnson',
    first_name: 'Alex',
    last_name: 'Johnson',
    course_name: 'Complete Web Development Bootcamp',
    course_url: 'https://yourstore.com/courses/web-dev',
    module_count: '12',
    duration: '24 hours',
    creator_name: 'Your Brand',
    unsubscribe_link: '#unsubscribe'
  },
  ABANDONED_CART: {
    name: 'Sarah Wilson',
    first_name: 'Sarah',
    last_name: 'Wilson',
    cart_items: 'Digital Marketing Guide, SEO Toolkit',
    cart_total: '$89.00',
    cart_url: 'https://yourstore.com/cart',
    creator_name: 'Your Brand',
    unsubscribe_link: '#unsubscribe'
  },
  RECOVERY: {
    name: 'Mike Brown',
    first_name: 'Mike',
    last_name: 'Brown',
    discount: '20',
    discount_code: 'COMEBACK20',
    checkout_url: 'https://yourstore.com/checkout',
    expiry_date: 'January 20, 2024',
    creator_name: 'Your Brand',
    unsubscribe_link: '#unsubscribe'
  },
  NEWSLETTER: {
    name: 'Emily Davis',
    first_name: 'Emily',
    last_name: 'Davis',
    creator_name: 'Your Brand',
    store_url: 'https://yourstore.com',
    unsubscribe_link: '#unsubscribe'
  }
};

interface TemplatePreviewProps {
  type: EmailTemplateType;
  subject: string;
  body: string;
  variables: string[];
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export function TemplatePreview({
  type,
  subject,
  body,
  variables
}: TemplatePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [customData, setCustomData] = useState<Record<string, string>>(mockData[type] || {});
  const [selectedDataSet, setSelectedDataSet] = useState<string>('default');

  // Replace variables with mock data
  const renderPreview = (text: string) => {
    return text.replace(/\{\{([a-z_]+)\}\}/g, (_, varName) => {
      return customData[varName] || `[${varName}]`;
    });
  };

  // Get device dimensions
  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
        return { width: '100%', height: '600px' };
    }
  };

  const dimensions = getDeviceDimensions();

  // Handle custom data change
  const handleDataChange = (key: string, value: string) => {
    setCustomData((prev) => ({ ...prev, [key]: value }));
  };

  // Load preset data
  const handlePresetChange = (preset: string) => {
    setSelectedDataSet(preset);
    if (preset === 'default') {
      setCustomData(mockData[type] || {});
    } else {
      // Load from localStorage or use preset values
      try {
        const saved = localStorage.getItem(`template_preview_${preset}`);
        if (saved) {
          setCustomData(JSON.parse(saved));
        }
      } catch {
        setCustomData(mockData[type] || {});
      }
    }
  };

  // Save current data as preset
  const saveAsPreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      localStorage.setItem(`template_preview_${presetName}`, JSON.stringify(customData));
    }
  };

  const renderedSubject = renderPreview(subject);
  const renderedBody = renderPreview(body);

  return (
    <div className="space-y-4">
      {/* Device Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={deviceMode === 'mobile' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'desktop' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDataSet} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Data</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={saveAsPreset}>
            Save Preset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Preview Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Email Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg overflow-hidden bg-white mx-auto transition-all duration-300"
                style={{ 
                  width: dimensions.width, 
                  maxWidth: '100%',
                  height: dimensions.height 
                }}
              >
                {/* Email Header */}
                <div className="bg-muted px-4 py-2 border-b">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Subject:</p>
                    <p className="text-sm font-medium">{renderedSubject}</p>
                  </div>
                </div>
                {/* Email Body */}
                <div className="p-4 overflow-auto h-[calc(100%-60px)]">
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderedBody }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Data Editor */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Preview Data</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCustomData(mockData[type] || {})}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="variables">
                <TabsList className="w-full">
                  <TabsTrigger value="variables" className="flex-1">
                    Variables
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">
                    All Data
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="variables" className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {variables.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No variables detected in template
                    </p>
                  ) : (
                    variables.map((v) => (
                      <div key={v} className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {`{{${v}}}`}
                          </Badge>
                        </Label>
                        <Input
                          value={customData[v] || ''}
                          onChange={(e) => handleDataChange(v, e.target.value)}
                          placeholder={`Enter ${v}...`}
                          className="h-8"
                        />
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="all" className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {Object.entries(customData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) => handleDataChange(key, e.target.value)}
                        className="h-8"
                      />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
