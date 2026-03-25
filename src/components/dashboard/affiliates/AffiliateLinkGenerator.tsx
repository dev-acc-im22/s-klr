'use client';

import { useState, useEffect } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AffiliateData {
  code: string;
  program: {
    creatorName: string;
    commissionRate: number;
    cookieDuration: number;
  };
}

export function AffiliateLinkGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [customCode, setCustomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchAffiliateData() {
      try {
        const response = await fetch('/api/affiliates/stats?type=affiliate');
        const data = await response.json();
        setAffiliateData(data.myData);
        setCustomCode(data.myData.code);
      } catch (error) {
        console.error('Failed to fetch affiliate data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliateData();
  }, []);

  const generateNewCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(code);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCode = async () => {
    if (!customCode || customCode.length < 4) {
      toast({
        title: 'Error',
        description: 'Code must be at least 4 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/affiliates/${affiliateData?.code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCode: customCode.toUpperCase() }),
      });

      if (response.ok) {
        setAffiliateData((prev) => prev ? { ...prev, code: customCode.toUpperCase() } : null);
        toast({
          title: 'Code updated',
          description: 'Your affiliate code has been updated',
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getAffiliateLink = (productId?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const code = affiliateData?.code || 'CODE';
    if (productId) {
      return `${baseUrl}/store/${productId}?ref=${code}`;
    }
    return `${baseUrl}/store?ref=${code}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Affiliate Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Affiliate Links
        </CardTitle>
        <CardDescription>
          Generate and share your unique affiliate links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Affiliate Code */}
        <div className="space-y-3">
          <Label>Your Affiliate Code</Label>
          <div className="flex gap-2">
            <Input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="YOURCODE"
              className="font-mono uppercase"
              maxLength={12}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={generateNewCode}
              title="Generate random code"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Custom code: 4-12 characters, letters and numbers only
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleUpdateCode}
              disabled={isGenerating || customCode === affiliateData?.code}
            >
              {isGenerating ? 'Updating...' : 'Update Code'}
            </Button>
          </div>
        </div>

        {/* Main Store Link */}
        <div className="space-y-3">
          <Label>Main Store Link</Label>
          <div className="flex gap-2">
            <Input
              value={getAffiliateLink()}
              readOnly
              className="font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => copyToClipboard(getAffiliateLink())}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link to earn <Badge variant="secondary" className="mx-1">{affiliateData?.program.commissionRate}%</Badge> commission on all sales
          </p>
        </div>

        {/* Quick Copy Section */}
        <div className="space-y-3 rounded-lg border p-4">
          <h4 className="font-medium flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Quick Copy Links
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Store Homepage</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(getAffiliateLink())}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Products Page</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(`${getAffiliateLink()}/products`)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Courses Page</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(`${getAffiliateLink()}/courses`)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Cookie Info */}
        <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-800">
              {affiliateData?.program.cookieDuration}-Day Cookie Duration
            </p>
            <p className="text-sm text-blue-700">
              When someone clicks your link, they have {affiliateData?.program.cookieDuration} days to make a purchase 
              for you to earn commission.
            </p>
          </div>
        </div>

        {/* Preview Link */}
        <Button variant="outline" className="w-full" asChild>
          <a href={getAffiliateLink()} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Your Affiliate Link
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Import Clock icon
import { Clock } from 'lucide-react';
