'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Mail,
  Sparkles,
  Gift,
  BookOpen,
  Heart,
  Megaphone,
  Calendar,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGhostMode } from '@/hooks/useGhostMode';

import { emailTemplates } from '@/lib/mock-data/email';

// Template definitions with icons and colors
const templateCategories = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'Welcome and getting started emails',
    templates: [
      {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Perfect first impression for new subscribers',
        icon: Sparkles,
        color: 'bg-blue-100 text-blue-600',
        subject: 'Welcome to CreatorHub Community!',
        preview: 'Thanks for joining - here\'s what to expect',
        features: ['Personalized greeting', 'What to expect', 'Call to action'],
        content: emailTemplates.welcome.content
      },
      {
        id: 'thank-you',
        name: 'Thank You Email',
        description: 'Express gratitude after a purchase or signup',
        icon: Heart,
        color: 'bg-pink-100 text-pink-600',
        subject: 'Thank you for your support!',
        preview: 'Your purchase means the world to me',
        features: ['Order confirmation', 'Express gratitude', 'Next steps'],
        content: `<div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1e40af; font-size: 28px;">Thank You! 💖</h1>
          <p style="color: #334155; font-size: 16px;">Hi {first_name},</p>
          <p style="color: #334155; font-size: 16px;">Thank you so much for your purchase! Your support means everything to me.</p>
          <p style="color: #334155; font-size: 16px;">Here's what happens next:</p>
          <ul style="color: #334155; font-size: 16px;">
            <li>Check your email for access details</li>
            <li>Join our community for support</li>
            <li>Reach out if you have questions</li>
          </ul>
        </div>`
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Promotional and sales emails',
    templates: [
      {
        id: 'product-launch',
        name: 'Product Launch',
        description: 'Announce a new product to your audience',
        icon: Megaphone,
        color: 'bg-green-100 text-green-600',
        subject: '🚀 Introducing something new!',
        preview: 'You\'re going to love this',
        features: ['Product highlights', 'Early bird offer', 'Urgency'],
        content: `<div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1e40af; font-size: 28px;">🚀 New Product Launch!</h1>
          <p style="color: #334155; font-size: 16px;">Hi {first_name},</p>
          <p style="color: #334155; font-size: 16px;">I'm thrilled to announce my latest product! After months of work, it's finally ready.</p>
          <p style="color: #334155; font-size: 16px;">As a valued subscriber, you get early access with a special discount.</p>
        </div>`
      },
      {
        id: 'flash-sale',
        name: 'Flash Sale',
        description: 'Create urgency with limited-time offers',
        icon: Gift,
        color: 'bg-orange-100 text-orange-600',
        subject: '⚡ Flash Sale - 48 Hours Only!',
        preview: 'Don\'t miss this exclusive deal',
        features: ['Limited time', 'Clear discount', 'Urgency'],
        content: emailTemplates.promotion.content
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Educational and newsletter emails',
    templates: [
      {
        id: 'newsletter',
        name: 'Weekly Newsletter',
        description: 'Keep your audience engaged weekly',
        icon: Calendar,
        color: 'bg-purple-100 text-purple-600',
        subject: 'Your Weekly Update',
        preview: 'This week\'s highlights and tips',
        features: ['Weekly highlights', 'Tips & tricks', 'Community updates'],
        content: emailTemplates.newsletter.content
      },
      {
        id: 'course-announcement',
        name: 'Course Announcement',
        description: 'Promote your latest course',
        icon: BookOpen,
        color: 'bg-cyan-100 text-cyan-600',
        subject: '🎓 New Course Now Available!',
        preview: 'Transform your skills with this comprehensive course',
        features: ['Course overview', 'Learning outcomes', 'Special pricing'],
        content: `<div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1e40af; font-size: 28px;">🎓 New Course Launch!</h1>
          <p style="color: #334155; font-size: 16px;">Hi {first_name},</p>
          <p style="color: #334155; font-size: 16px;">I'm excited to announce my brand new course!</p>
          <h2 style="color: #1e40af; font-size: 20px;">What You'll Learn:</h2>
          <ul style="color: #334155; font-size: 16px;">
            <li>Module 1: Getting Started</li>
            <li>Module 2: Core Concepts</li>
            <li>Module 3: Advanced Techniques</li>
            <li>Module 4: Real-world Projects</li>
          </ul>
        </div>`
      }
    ]
  }
];

// Flatten templates for search
const allTemplates = templateCategories.flatMap(cat =>
  cat.templates.map(t => ({ ...t, category: cat.name }))
);

export default function EmailTemplatesPage() {
  const router = useRouter();
  const { isGhostMode } = useGhostMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof allTemplates[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Filter templates by search
  const filteredTemplates = searchQuery
    ? allTemplates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Handle use template
  const handleUseTemplate = (template: typeof allTemplates[0]) => {
    // Store template in sessionStorage for compose page to pick up
    sessionStorage.setItem('emailTemplate', JSON.stringify({
      subject: template.subject,
      content: template.content
    }));
    router.push('/dashboard/email/compose');
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/email">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
              <p className="text-muted-foreground">
                Pre-built templates to get you started
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/email/compose">
              <Plus className="mr-2 h-4 w-4" />
              Start from Scratch
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search Results */}
        {filteredTemplates && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${template.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Subject:</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {template.subject}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setPreviewOpen(true);
                          }}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Template Categories */}
        {!filteredTemplates && (
          <Tabs defaultValue="onboarding" className="space-y-6">
            <TabsList>
              {templateCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {templateCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.templates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className={`p-2 rounded-lg ${template.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                            </div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Subject:</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {template.subject}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {template.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setSelectedTemplate(template as typeof allTemplates[0]);
                                  setPreviewOpen(true);
                                }}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUseTemplate(template as typeof allTemplates[0])}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                Use
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTemplate?.icon && (
                  <selectedTemplate.icon className="h-5 w-5" />
                )}
                {selectedTemplate?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Subject Line:</p>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {selectedTemplate.subject}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Preview Text:</p>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {selectedTemplate.preview}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email Preview:</p>
                  <div
                    className="border rounded-lg p-4 bg-white"
                    dangerouslySetInnerHTML={{
                      __html: selectedTemplate.content
                        .replace(/{first_name}/g, 'John')
                        .replace(/{last_name}/g, 'Doe')
                        .replace(/{subscriber_name}/g, 'John Doe')
                        .replace(/{creator_name}/g, 'Your Brand')
                        .replace(/{store_url}/g, '#')
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setPreviewOpen(false);
                      handleUseTemplate(selectedTemplate);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Use This Template
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
