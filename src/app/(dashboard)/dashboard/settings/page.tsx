'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Camera, Globe, ChevronRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { mockGhostUser } from '@/store/useGhostStore';

interface Settings {
  name: string;
  username: string;
  email: string;
  bio: string;
  storeName: string;
  storeDescription: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    twitter: string;
    tiktok: string;
  };
}

export default function SettingsPage() {
  const { isGhostMode } = useGhostMode();
  const { toast } = useToast();
  const [loading, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    name: '',
    username: '',
    email: '',
    bio: '',
    storeName: '',
    storeDescription: '',
    socialLinks: {
      instagram: '',
      youtube: '',
      twitter: '',
      tiktok: '',
    },
  });

  useEffect(() => {
    // Load settings
    if (isGhostMode) {
      setSettings({
        name: mockGhostUser.name,
        username: mockGhostUser.username,
        email: mockGhostUser.email,
        bio: mockGhostUser.bio,
        storeName: mockGhostUser.settings.storeName,
        storeDescription: mockGhostUser.settings.storeDescription,
        socialLinks: {
          instagram: 'https://instagram.com/ghostadmin',
          youtube: 'https://youtube.com/@ghostadmin',
          twitter: 'https://twitter.com/ghostadmin',
          tiktok: '',
        },
      });
    }
  }, [isGhostMode]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and store settings
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold text-white">
                {settings.name.charAt(0).toUpperCase()}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <p className="font-medium">{settings.name}</p>
              <p className="text-sm text-muted-foreground">
                Click to change avatar
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) =>
                  setSettings({ ...settings, username: e.target.value })
                }
                prefix="@"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) =>
                setSettings({ ...settings, bio: e.target.value })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store</CardTitle>
          <CardDescription>
            Customize your storefront appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              value={settings.storeDescription}
              onChange={(e) =>
                setSettings({ ...settings, storeDescription: e.target.value })
              }
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Link href="/dashboard/settings/domain" className="block">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Custom Domain</CardTitle>
                  <CardDescription>
                    Use your own domain for your store
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  <Crown className="h-3 w-3 mr-1" />
                  Business
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Add your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.socialLinks.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={settings.socialLinks.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      youtube: e.target.value,
                    },
                  })
                }
                placeholder="https://youtube.com/@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.socialLinks.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      twitter: e.target.value,
                    },
                  })
                }
                placeholder="https://twitter.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                value={settings.socialLinks.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      tiktok: e.target.value,
                    },
                  })
                }
                placeholder="https://tiktok.com/@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      </div>
    </DashboardLayout>
  );
}
