'use client';

import { 
  Mail, 
  ShoppingBag, 
  GraduationCap, 
  ShoppingCart, 
  RefreshCw,
  Newspaper,
  Star,
  MoreVertical,
  Eye,
  Edit,
  RotateCcw,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmailTemplateType } from '@/lib/mock-data/email';

// Template type configuration
export const templateTypeConfig: Record<EmailTemplateType, {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}> = {
  WELCOME: {
    name: 'Welcome Email',
    description: 'Sent when someone subscribes to your list',
    icon: Star,
    color: 'bg-blue-100 text-blue-600'
  },
  PURCHASE_CONFIRMATION: {
    name: 'Purchase Confirmation',
    description: 'Sent after a successful purchase',
    icon: ShoppingBag,
    color: 'bg-green-100 text-green-600'
  },
  COURSE_ENROLLMENT: {
    name: 'Course Enrollment',
    description: 'Sent when someone enrolls in a course',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-600'
  },
  ABANDONED_CART: {
    name: 'Abandoned Cart',
    description: 'Sent when cart is abandoned',
    icon: ShoppingCart,
    color: 'bg-orange-100 text-orange-600'
  },
  RECOVERY: {
    name: 'Recovery Email',
    description: 'Follow-up for abandoned cart recovery',
    icon: RefreshCw,
    color: 'bg-pink-100 text-pink-600'
  },
  NEWSLETTER: {
    name: 'Newsletter',
    description: 'Regular newsletter template',
    icon: Newspaper,
    color: 'bg-cyan-100 text-cyan-600'
  }
};

export interface TemplateListItem {
  id: string;
  type: EmailTemplateType;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateListProps {
  templates: TemplateListItem[];
  onSelect: (template: TemplateListItem) => void;
  onEdit: (template: TemplateListItem) => void;
  onReset: (template: TemplateListItem) => void;
  onToggleActive: (template: TemplateListItem) => void;
}

export function TemplateList({
  templates,
  onSelect,
  onEdit,
  onReset,
  onToggleActive
}: TemplateListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(templateTypeConfig) as EmailTemplateType[]).map((type) => {
        const config = templateTypeConfig[type];
        const template = templates.find((t) => t.type === type);
        const Icon = config.icon;

        if (!template) {
          // Show placeholder for missing template type
          return (
            <Card key={type} className="opacity-60">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Not Created</Badge>
                </div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onEdit({ 
                    id: `new_${type}`,
                    type,
                    subject: '',
                    body: '',
                    variables: [],
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  })}
                >
                  Create Template
                </Button>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={type} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  {template.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  {template.isActive ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(template)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleActive(template)}>
                        {template.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReset(template)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset to Default
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardTitle className="text-lg">{config.name}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                <p className="text-sm truncate">
                  {template.subject.replace(/\{\{([a-z_]+)\}\}/g, '[$1]')}
                </p>
              </div>
              {template.variables.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 4).map((v) => (
                      <Badge key={v} variant="secondary" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                    {template.variables.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.variables.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelect(template)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
