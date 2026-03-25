'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Instagram, 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Hash,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGhostMode } from '@/hooks/useGhostMode';


const triggerTypes = [
  { value: 'NEW_FOLLOWER', label: 'New Follower', description: 'Send DM when someone follows you', icon: Users },
  { value: 'KEYWORD_MENTION', label: 'Keyword Mention', description: 'Send DM when keywords are mentioned', icon: Hash },
  { value: 'STORY_REPLY', label: 'Story Reply', description: 'Send DM when someone replies to your story', icon: Instagram },
  { value: 'COMMENT', label: 'Comment on Post', description: 'Send DM when someone comments on your post', icon: MessageSquare },
];

export default function NewInstagramAutomationPage() {
  const { isGhostMode } = useGhostMode();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    triggerType: '',
    keywords: '',
    message: '',
    delay: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const keywords = formData.triggerType === 'KEYWORD_MENTION' && formData.keywords
        ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
        : null;

      const response = await fetch('/api/instagram/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          triggerType: formData.triggerType,
          keywords,
          message: formData.message,
          delay: formData.delay,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/instagram');
      }
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTrigger = triggerTypes.find(t => t.value === formData.triggerType);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/instagram">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6" />
              New Automation
            </h1>
            <p className="text-muted-foreground">
              Create a new automated DM response
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Automation Details</CardTitle>
              <CardDescription>
                Configure when and how your automated DMs are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Automation Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Welcome New Followers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name to help you identify this automation
                </p>
              </div>

              {/* Trigger Type */}
              <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select
                  value={formData.triggerType}
                  onValueChange={(value) => setFormData({ ...formData, triggerType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTrigger && (
                  <p className="text-xs text-muted-foreground">
                    {selectedTrigger.description}
                  </p>
                )}
              </div>

              {/* Keywords (only for KEYWORD_MENTION) */}
              {formData.triggerType === 'KEYWORD_MENTION' && (
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., discount, code, promo"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated keywords that will trigger this automation
                  </p>
                  {formData.keywords && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.keywords.split(',').map((keyword, i) => (
                        keyword.trim() && (
                          <Badge key={i} variant="outline">
                            {keyword.trim()}
                          </Badge>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message Template */}
              <div className="space-y-2">
                <Label htmlFor="message">Message Template</Label>
                <Textarea
                  id="message"
                  placeholder="Hey {username}! Thanks for following! I'm excited to connect with you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{'{username}'}</code> to personalize messages with the recipient&apos;s username
                </p>
              </div>

              {/* Delay */}
              <div className="space-y-2">
                <Label htmlFor="delay" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Delay (minutes)
                </Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="1440"
                  value={formData.delay}
                  onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Time to wait before sending the DM (0-1440 minutes). A short delay can make responses feel more natural.
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable this automation
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Message Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Your Account</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {formData.message || 'Your message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/instagram">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.triggerType || !formData.message}>
              {loading ? 'Creating...' : 'Create Automation'}
            </Button>
          </div>
        </form>
      </div>
  );
}
