'use client';

import { useState, useCallback } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  Plus, 
  X, 
  FileText, 
  Search,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Tone = 'professional' | 'casual' | 'fun' | 'luxury';

interface AIDescriptionGeneratorProps {
  productTitle: string;
  category: string;
  onDescriptionGenerated: (description: string) => void;
  onSeoTitleGenerated?: (seoTitle: string) => void;
  onSeoMetaGenerated?: (seoMeta: string) => void;
}

interface GeneratedContent {
  description: string;
  seoTitle: string;
  seoMetaDescription: string;
}

const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Authoritative and trustworthy' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'fun', label: 'Fun', description: 'Playful and energetic' },
  { value: 'luxury', label: 'Luxury', description: 'Sophisticated and premium' },
];

export function AIDescriptionGenerator({
  productTitle,
  category,
  onDescriptionGenerated,
  onSeoTitleGenerated,
  onSeoMetaGenerated,
}: AIDescriptionGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<Tone>('professional');
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAddFeature = useCallback(() => {
    if (newFeature.trim() && keyFeatures.length < 10) {
      setKeyFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  }, [newFeature, keyFeatures.length]);

  const handleRemoveFeature = useCallback((index: number) => {
    setKeyFeatures(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleGenerate = async () => {
    if (!productTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing product title',
        description: 'Please enter a product title before generating.',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle,
          category,
          keyFeatures,
          tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate description');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setGeneratedContent(result.data);
        setShowSeoSection(true);
        
        toast({
          title: 'Description generated!',
          description: 'Your AI-powered product description is ready.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate description. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      
      toast({
        title: 'Copied to clipboard',
        description: `${field} has been copied to your clipboard.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
      });
    }
  };

  const handleUseDescription = () => {
    if (generatedContent) {
      onDescriptionGenerated(generatedContent.description);
      if (onSeoTitleGenerated && generatedContent.seoTitle) {
        onSeoTitleGenerated(generatedContent.seoTitle);
      }
      if (onSeoMetaGenerated && generatedContent.seoMetaDescription) {
        onSeoMetaGenerated(generatedContent.seoMetaDescription);
      }
      
      toast({
        title: 'Description applied',
        description: 'The generated description has been added to your product.',
      });
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-base">AI Description Generator</CardTitle>
            <CardDescription className="text-sm">
              Generate compelling product descriptions with AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tone Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tone</Label>
          <Select value={tone} onValueChange={(value: Tone) => setTone(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col items-start">
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {TONE_OPTIONS.find(t => t.value === tone)?.description}
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Key Features (Optional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Instant download, 50+ pages..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={keyFeatures.length >= 10}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddFeature}
              disabled={!newFeature.trim() || keyFeatures.length >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keyFeatures.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Add up to 10 key features to personalize the description ({keyFeatures.length}/10)
          </p>
        </div>

        {/* Generate Button */}
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !productTitle.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-4 pt-4 border-t">
            {/* Main Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Product Description
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(generatedContent.description, 'Description')}
                >
                  {copiedField === 'Description' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={generatedContent.description}
                  onChange={(e) => setGeneratedContent({ ...generatedContent, description: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>

            {/* SEO Section Toggle */}
            <button
              type="button"
              onClick={() => setShowSeoSection(!showSeoSection)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Search className="h-4 w-4" />
              SEO Suggestions
              {showSeoSection ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {/* SEO Section */}
            {showSeoSection && (
              <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                <div className="flex items-start gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    These SEO suggestions are optimized for search engines. Use them to improve your product visibility.
                  </p>
                </div>

                {/* SEO Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">SEO Title</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6"
                      onClick={() => handleCopy(generatedContent.seoTitle, 'SEO Title')}
                    >
                      {copiedField === 'SEO Title' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <Input
                    value={generatedContent.seoTitle}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, seoTitle: e.target.value })}
                    className={cn(
                      "h-8 text-sm",
                      generatedContent.seoTitle.length > 60 && "border-amber-500"
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {generatedContent.seoTitle.length}/60 characters
                    {generatedContent.seoTitle.length > 60 && " (too long)"}
                  </p>
                </div>

                {/* SEO Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Meta Description</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6"
                      onClick={() => handleCopy(generatedContent.seoMetaDescription, 'Meta Description')}
                    >
                      {copiedField === 'Meta Description' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={generatedContent.seoMetaDescription}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, seoMetaDescription: e.target.value })}
                    rows={2}
                    className={cn(
                      "text-sm resize-none",
                      generatedContent.seoMetaDescription.length > 160 && "border-amber-500"
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {generatedContent.seoMetaDescription.length}/160 characters
                    {generatedContent.seoMetaDescription.length > 160 && " (too long)"}
                  </p>
                </div>
              </div>
            )}

            {/* Use Description Button */}
            <Button
              type="button"
              onClick={handleUseDescription}
              variant="default"
              className="w-full"
            >
              <Check className="mr-2 h-4 w-4" />
              Use This Description
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
