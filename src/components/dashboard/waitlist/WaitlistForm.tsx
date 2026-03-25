'use client';

import { useState, useEffect } from 'react';
import { Mail, User, Loader2, CheckCircle, Clock, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WaitlistFormProps {
  creatorId: string;
  productId?: string;
  courseId?: string;
  title?: string;
  description?: string;
  launchDate?: Date | string | null;
  earlyBirdPrice?: number | null;
  regularPrice?: number;
  showCountdown?: boolean;
  showSocialShare?: boolean;
  onSuccess?: (entry: { email: string; name: string | null }) => void;
  source?: string;
  className?: string;
}

export function WaitlistForm({
  creatorId,
  productId,
  courseId,
  title = 'Join the Waitlist',
  description = 'Be the first to know when we launch!',
  launchDate,
  earlyBirdPrice,
  regularPrice,
  showCountdown = true,
  showSocialShare = true,
  onSuccess,
  source = 'DIRECT',
  className = '',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(false);

  // Countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!launchDate || !showCountdown) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const launch = new Date(launchDate).getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [launchDate, showCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || null,
          creatorId,
          productId: productId || null,
          courseId: courseId || null,
          source,
        }),
      });

      const data = await response.json();

      if (data.error === 'Already on waitlist') {
        setExisting(true);
        setSuccess(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSuccess(true);
      onSuccess?.({ email, name: name || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = window.location.href;
    const text = `I just joined the waitlist! Can't wait for the launch!`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (success) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {existing ? "You're already on the list!" : "You're on the list!"}
          </h3>
          <p className="text-muted-foreground mb-4">
            We'll notify you as soon as we launch.
          </p>
          {showSocialShare && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Share with friends:</p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  LinkedIn
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Early Bird Badge */}
        {earlyBirdPrice && regularPrice && (
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              Early Bird: ${earlyBirdPrice.toFixed(2)} 
              <span className="line-through text-muted-foreground ml-2">
                ${regularPrice.toFixed(2)}
              </span>
            </Badge>
          </div>
        )}

        {/* Countdown Timer */}
        {showCountdown && launchDate && (
          <div className="flex justify-center gap-2">
            {countdown.days > 0 && (
              <div className="flex flex-col items-center bg-muted rounded-lg p-2 min-w-[60px]">
                <span className="text-2xl font-bold">{countdown.days}</span>
                <span className="text-xs text-muted-foreground">Days</span>
              </div>
            )}
            <div className="flex flex-col items-center bg-muted rounded-lg p-2 min-w-[60px]">
              <span className="text-2xl font-bold">{countdown.hours}</span>
              <span className="text-xs text-muted-foreground">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-muted rounded-lg p-2 min-w-[60px]">
              <span className="text-2xl font-bold">{countdown.minutes}</span>
              <span className="text-xs text-muted-foreground">Mins</span>
            </div>
            <div className="flex flex-col items-center bg-muted rounded-lg p-2 min-w-[60px]">
              <span className="text-2xl font-bold">{countdown.seconds}</span>
              <span className="text-xs text-muted-foreground">Secs</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Join Waitlist
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
