'use client';

import { useState } from 'react';
import { Users, BarChart3, List, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { WaitlistStats, WaitlistList, LaunchSettings } from '@/components/dashboard/waitlist';
import { useGhostMode } from '@/hooks/useGhostMode';

export default function WaitlistPage() {
  const { isGhostMode } = useGhostMode();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-muted-foreground">
            Manage your launch mode and collect emails before going live
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="signups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Signups
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <WaitlistStats ghostMode={isGhostMode} />
            
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for a Successful Launch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Build Anticipation</h4>
                    <p className="text-sm text-muted-foreground">
                      Share behind-the-scenes content and teasers on social media to build excitement.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Offer Early Bird Pricing</h4>
                    <p className="text-sm text-muted-foreground">
                      Give waitlist subscribers exclusive early access and discounted pricing.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Leverage Referrals</h4>
                    <p className="text-sm text-muted-foreground">
                      Encourage subscribers to share with friends for extra rewards or earlier access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signups Tab */}
          <TabsContent value="signups" className="mt-6">
            <WaitlistList ghostMode={isGhostMode} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <LaunchSettings ghostMode={isGhostMode} />
              
              {/* Product/Course Selection for Launch Mode */}
              <Card>
                <CardHeader>
                  <CardTitle>Products & Courses in Launch Mode</CardTitle>
                  <CardDescription>
                    Enable launch mode for specific products or courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      To enable launch mode for a specific product or course, go to its settings page and toggle "Launch Mode".
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="/dashboard/products"
                        className="text-sm text-primary hover:underline"
                      >
                        Manage Products →
                      </a>
                      <span className="text-muted-foreground">|</span>
                      <a
                        href="/dashboard/courses"
                        className="text-sm text-primary hover:underline"
                      >
                        Manage Courses →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
