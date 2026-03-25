'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Send,
  Clock,
  Eye,
  Save,
  Bold,
  Italic,
  Link as LinkIcon,
  Users,
  Tag,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useGhostMode } from '@/hooks/useGhostMode';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Available variables for email personalization
const emailVariables = [
  { name: 'First Name', variable: '{first_name}' },
  { name: 'Last Name', variable: '{last_name}' },
  { name: 'Unsubscribe Link', variable: '{unsubscribe_link}' },
  { name: 'Store URL', variable: '{store_url}' },
];

// Mock segments
const segments = [
  { id: 'all', name: 'All Subscribers', count: 50 },
  { id: 'customers', name: 'Customers', count: 23 },
  { id: 'course-buyers', name: 'Course Buyers', count: 15 },
  { id: 'engaged', name: 'Engaged (30 days)', count: 38 },
  { id: 'inactive', name: 'Inactive (90+ days)', count: 5 },
];

// Available tags
const availableTags = [
  'customer', 'lead', 'newsletter', 'course-buyer', 'product-buyer',
  'engaged', 'inactive', 'vip', 'new', 'returning'
];

export default function EmailComposePage() {
  const router = useRouter();
  const { isGhostMode } = useGhostMode();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'segment' | 'tags'>('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState('');
  const [sendOption, setSendOption] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [showPreview, setShowPreview] = useState(false);

  // Rich text formatting handlers
  const insertFormatting = (format: 'bold' | 'italic' | 'link') => {
    const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = emailContent.substring(start, end);

    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `_${selectedText}_`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
    }

    const updatedContent = emailContent.substring(0, start) + newText + emailContent.substring(end);
    setEmailContent(updatedContent);
  };

  // Insert variable into content
  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (!textarea) {
      setEmailContent(emailContent + variable);
      return;
    }

    const start = textarea.selectionStart;
    const updatedContent = emailContent.substring(0, start) + variable + emailContent.substring(start);
    setEmailContent(updatedContent);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle save as draft
  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          previewText,
          content: emailContent,
          template: 'custom',
        }),
      });

      if (response.ok) {
        router.push('/dashboard/email');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send/schedule
  const handleSendOrSchedule = async () => {
    if (!subject || !emailContent) return;

    setIsLoading(true);
    try {
      // Create campaign first
      const createResponse = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          previewText,
          content: emailContent,
          template: 'custom',
          scheduledAt: sendOption === 'schedule' && scheduledDate
            ? new Date(`${format(scheduledDate, 'yyyy-MM-dd')}T${scheduledTime}`).toISOString()
            : null,
        }),
      });

      const campaign = await createResponse.json();

      if (sendOption === 'now') {
        // Send immediately
        await fetch(`/api/campaigns/${campaign.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send' }),
        });
      }

      router.push('/dashboard/email');
    } catch (error) {
      console.error('Failed to send campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get recipient count
  const getRecipientCount = () => {
    if (recipientType === 'all') return 50;
    if (recipientType === 'segment') {
      const segment = segments.find(s => s.id === selectedSegment);
      return segment?.count || 0;
    }
    if (recipientType === 'tags' && selectedTags.length > 0) {
      return Math.floor(Math.random() * 30) + 10;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/email">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compose Email</h1>
            <p className="text-muted-foreground">
              Create and send emails to your subscribers
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Line */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preview">Preview Text</Label>
                  <Input
                    id="preview"
                    placeholder="Preview text shown in inbox..."
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This text appears next to the subject in some email clients
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipients
                </CardTitle>
                <CardDescription>
                  Choose who will receive this email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={recipientType}
                  onValueChange={(v) => setRecipientType(v as 'all' | 'segment' | 'tags')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="font-normal cursor-pointer">
                      All Subscribers ({segments[0].count})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="segment" id="segment" />
                    <Label htmlFor="segment" className="font-normal cursor-pointer">
                      Specific Segment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tags" id="tags" />
                    <Label htmlFor="tags" className="font-normal cursor-pointer">
                      Filter by Tags
                    </Label>
                  </div>
                </RadioGroup>

                {recipientType === 'segment' && (
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {recipientType === 'tags' && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Select Tags
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{getRecipientCount()}</strong> recipients will receive this email
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Email Body */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Body
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('bold')}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('italic')}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('link')}
                    title="Insert Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Variables
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Click to insert variable
                        </Label>
                        {emailVariables.map((v) => (
                          <Button
                            key={v.variable}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => insertVariable(v.variable)}
                          >
                            <span className="font-mono text-xs">{v.variable}</span>
                            <span className="ml-2 text-muted-foreground text-xs">
                              {v.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Textarea
                  id="email-content"
                  placeholder="Write your email content here...

You can use:
**bold text** for bold
_italic text_ for italic
[link text](url) for links

Variables: {first_name}, {last_name}, {unsubscribe_link}"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={sendOption}
                  onValueChange={(v) => setSendOption(v as 'now' | 'schedule')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="send-now" />
                    <Label htmlFor="send-now" className="font-normal cursor-pointer">
                      Send Now
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="schedule" id="schedule-later" />
                    <Label htmlFor="schedule-later" className="font-normal cursor-pointer">
                      Schedule for Later
                    </Label>
                  </div>
                </RadioGroup>

                {sendOption === 'schedule' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  className="w-full"
                  onClick={handleSendOrSchedule}
                  disabled={!subject || !emailContent || isLoading}
                >
                  {sendOption === 'now' ? (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Email
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule Email
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/dashboard/email/templates">
                    <Mail className="mr-2 h-4 w-4" />
                    Use Template
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Email Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="text-sm font-medium">
                      {subject || 'No subject'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {previewText || 'No preview text'}
                    </div>
                    <Separator />
                    <div className="text-sm whitespace-pre-wrap">
                      {emailContent || 'No content'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
}
