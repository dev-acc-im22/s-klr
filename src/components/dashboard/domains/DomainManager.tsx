'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Plus,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  Crown,
  AlertCircle,
  Shield,
  RefreshCw,
} from 'lucide-react'
import { DomainStatus, type DomainStatusType } from './DomainStatus'
import { DomainVerification } from './DomainVerification'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Domain {
  id: string
  userId: string
  domain: string
  status: DomainStatusType
  verifiedAt: string | null
  sslEnabled: boolean
  isPrimary: boolean
  wwwRedirect: boolean
  createdAt: string
  updatedAt: string
}

interface DomainManagerProps {
  userId?: string
  isBusinessTier?: boolean
}

export function DomainManager({ userId = 'user-1', isBusinessTier = true }: DomainManagerProps) {
  const { toast } = useToast()
  const [domains, setDomains] = useState<Domain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingDomain, setIsAddingDomain] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null)
  const [newDomain, setNewDomain] = useState('')
  const [wwwRedirect, setWwwRedirect] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const fetchDomains = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/domains?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setDomains(data.domains)
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load domains',
      })
    } finally {
      setIsLoading(false)
    }
  }, [userId, toast])

  useEffect(() => {
    fetchDomains()
  }, [fetchDomains])

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a domain name',
      })
      return
    }

    setIsAddingDomain(true)
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: newDomain,
          userId,
          wwwRedirect,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Domain added!',
          description: `${data.domain} has been added. Configure DNS to verify ownership.`,
        })
        setDomains((prev) => [...prev, data])
        setNewDomain('')
        setWwwRedirect(true)
        setIsAddDialogOpen(false)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to add domain',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add domain',
      })
    } finally {
      setIsAddingDomain(false)
    }
  }

  const handleDeleteDomain = async () => {
    if (!domainToDelete) return

    try {
      const response = await fetch(`/api/domains/${domainToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Domain removed',
          description: `${domainToDelete.domain} has been removed`,
        })
        setDomains((prev) => prev.filter((d) => d.id !== domainToDelete.id))
      } else {
        const data = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to remove domain',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove domain',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDomainToDelete(null)
    }
  }

  const handleSetPrimary = async (domain: Domain) => {
    try {
      const response = await fetch(`/api/domains/${domain.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPrimary: true }),
      })

      if (response.ok) {
        toast({
          title: 'Primary domain updated',
          description: `${domain.domain} is now your primary domain`,
        })
        setDomains((prev) =>
          prev.map((d) => ({
            ...d,
            isPrimary: d.id === domain.id,
          }))
        )
      } else {
        const data = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to set primary domain',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to set primary domain',
      })
    }
  }

  const handleStatusChange = (domainId: string, status: DomainStatusType) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, status } : d))
    )
  }

  const handleVerifyComplete = (domainId: string) => {
    fetchDomains()
  }

  if (!isBusinessTier) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Crown className="h-3 w-3 mr-1" />
              Business
            </Badge>
          </CardTitle>
          <CardDescription>
            Use your own domain for your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Upgrade to Business Plan</p>
              <p className="text-sm text-muted-foreground">
                Custom domains are available on the Business plan. Upgrade to use your own domain.
              </p>
            </div>
            <Button>Upgrade</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Custom Domains
          </h2>
          <p className="text-muted-foreground">
            Add and manage custom domains for your store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDomains} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={domains.length >= 5}>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Domain</DialogTitle>
                <DialogDescription>
                  Enter your domain name. We&apos;ll help you configure DNS settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="store.example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your domain without http:// or www
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="www-redirect">Redirect www to non-www</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically redirect www.yourdomain.com to yourdomain.com
                    </p>
                  </div>
                  <Switch
                    id="www-redirect"
                    checked={wwwRedirect}
                    onCheckedChange={setWwwRedirect}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDomain} disabled={isAddingDomain}>
                  {isAddingDomain && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Domain
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Domain limit notice */}
      {domains.length >= 5 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You&apos;ve reached the maximum of 5 custom domains.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : domains.length === 0 ? (
        /* Empty state */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No custom domains</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
              Add a custom domain to give your store a professional look with your own brand.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Domain list */
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id} className={cn(domain.isPrimary && 'border-primary')}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{domain.domain}</CardTitle>
                    {domain.isPrimary && (
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <DomainStatus
                    status={domain.status}
                    sslEnabled={domain.sslEnabled}
                  />
                </div>
                <CardDescription>
                  Added {new Date(domain.createdAt).toLocaleDateString()}
                  {domain.verifiedAt && (
                    <> &middot; Verified {new Date(domain.verifiedAt).toLocaleDateString()}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {domain.sslEnabled ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Shield className="h-4 w-4" />
                        SSL Enabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        No SSL
                      </span>
                    )}
                    {domain.wwwRedirect && (
                      <span>• www redirect enabled</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {domain.status === 'ACTIVE' && !domain.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(domain)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Set as Primary
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setDomainToDelete(domain)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Domain Verification Section */}
      {domains.filter((d) => d.status !== 'ACTIVE').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Pending Verification</h3>
          <div className="space-y-4">
            {domains
              .filter((d) => d.status !== 'ACTIVE')
              .map((domain) => (
                <DomainVerification
                  key={domain.id}
                  domain={domain}
                  onVerifyComplete={() => handleVerifyComplete(domain.id)}
                  onStatusChange={(status) => handleStatusChange(domain.id, status)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Domain</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{domainToDelete?.domain}</strong>? This will
              disable your store on this domain. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDomain}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Domain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
