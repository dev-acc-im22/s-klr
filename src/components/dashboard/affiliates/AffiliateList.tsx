'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Mail,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Affiliate {
  id: string;
  programId: string;
  userId: string;
  code: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export function AffiliateList() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        const response = await fetch('/api/affiliates');
        const data = await response.json();
        setAffiliates(data.affiliates);
      } catch (error) {
        console.error('Failed to fetch affiliates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, []);

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveAffiliate = async (id: string) => {
    try {
      const response = await fetch('/api/affiliates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAffiliates(affiliates.filter((a) => a.id !== id));
        toast({
          title: 'Affiliate removed',
          description: 'The affiliate has been removed from your program.',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove affiliate.',
        variant: 'destructive',
      });
    }
  };

  const copyAffiliateLink = async (code: string, id: string) => {
    const link = `${window.location.origin}/store?ref=${code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: 'Link copied!',
        description: 'Affiliate link copied to clipboard',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const getConversionRate = (affiliate: Affiliate) => {
    if (affiliate.clicks === 0) return 0;
    return ((affiliate.conversions / affiliate.clicks) * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Affiliates
            </CardTitle>
            <CardDescription>
              Manage your affiliate partners
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search affiliates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No affiliates found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Share your program to get your first affiliates'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAffiliates.map((affiliate) => (
              <div
                key={affiliate.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {affiliate.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{affiliate.user.name}</p>
                      <Badge variant="outline" className="font-mono">
                        {affiliate.code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{affiliate.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-semibold">{affiliate.clicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Conv.</p>
                      <p className="font-semibold">{affiliate.conversions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-semibold flex items-center gap-1">
                        {getConversionRate(affiliate)}%
                        {parseFloat(getConversionRate(affiliate) as string) >= 5 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-muted-foreground" />
                        )}
                      </p>
                    </div>
                    <div className="text-center min-w-[70px]">
                      <p className="text-muted-foreground">Earnings</p>
                      <p className="font-bold text-green-600">${affiliate.earnings.toFixed(2)}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyAffiliateLink(affiliate.code, affiliate.id)}>
                        {copiedId === affiliate.id ? (
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveAffiliate(affiliate.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAffiliates.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAffiliates.length} of {affiliates.length} affiliates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
