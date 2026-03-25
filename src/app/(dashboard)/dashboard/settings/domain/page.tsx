'use client'

import { useGhostMode } from '@/hooks/useGhostMode'

import { DomainManager } from '@/components/dashboard/domains'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Globe, Shield, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DomainSettingsPage() {
  const { isGhostMode } = useGhostMode()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Custom Domain</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              <Crown className="h-3 w-3 mr-1" />
              Business Feature
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Connect your own domain to give your store a professional look
          </p>
        </div>

        {/* Features overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Globe className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-sm">Custom Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Use your own domain like store.yourbrand.com instead of creatorhub.store/username
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-5 w-5 text-green-500 mb-2" />
              <CardTitle className="text-sm">Free SSL Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Automatic HTTPS encryption for secure transactions and visitor trust
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Zap className="h-5 w-5 text-yellow-500 mb-2" />
              <CardTitle className="text-sm">Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Step-by-step DNS configuration guide with automatic verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Domain Manager */}
        <DomainManager isBusinessTier={true} />

        {/* Help section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              Here are some common questions about custom domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">What&apos;s the difference between apex and subdomain?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                An apex domain is your root domain (e.g., example.com), while a subdomain is a prefix
                (e.g., store.example.com). We recommend using a subdomain for easier configuration.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">How long does DNS propagation take?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                DNS changes typically take a few minutes to a few hours to propagate globally. In rare
                cases, it can take up to 48 hours.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Can I use my domain with another provider?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your domain can be registered with any provider. You just need to update the DNS
                records to point to CreatorHub.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
