'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  Shield,
  RefreshCw,
} from 'lucide-react'
import { DomainStatus, type DomainStatusType } from './DomainStatus'
import { DnsInstructions } from './DnsInstructions'
import { useToast } from '@/hooks/use-toast'

interface DomainVerificationProps {
  domain: {
    id: string
    domain: string
    status: DomainStatusType
    sslEnabled: boolean
    verifiedAt: string | null
  }
  onVerifyComplete?: () => void
  onStatusChange?: (status: DomainStatusType) => void
}

interface DnsRecord {
  type: 'CNAME' | 'A' | 'TXT'
  name: string
  value: string
  required: boolean
}

interface DnsInstruction {
  step: number
  title: string
  description: string
}

export function DomainVerification({
  domain,
  onVerifyComplete,
  onStatusChange,
}: DomainVerificationProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isEnablingSsl, setIsEnablingSsl] = useState(false)
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])
  const [instructions, setInstructions] = useState<DnsInstruction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch DNS instructions when dialog opens
  useEffect(() => {
    if (isOpen && domain.status !== 'ACTIVE') {
      fetchDnsInstructions()
    }
  }, [isOpen, domain.status])

  const fetchDnsInstructions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/domains/${domain.id}/verify`)
      if (response.ok) {
        const data = await response.json()
        setDnsRecords(data.dnsRecords)
        setInstructions(data.instructions)
      }
    } catch (error) {
      console.error('Failed to fetch DNS instructions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const response = await fetch(`/api/domains/${domain.id}/verify`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Domain verified!',
          description: data.message,
        })

        if (data.domain) {
          onStatusChange?.(data.domain.status)
        }

        // If verified, auto-provision SSL
        if (data.sslStatus === 'pending') {
          await handleEnableSsl()
        }

        onVerifyComplete?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: data.error || 'Please check your DNS configuration and try again.',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify domain. Please try again.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleEnableSsl = async () => {
    setIsEnablingSsl(true)
    try {
      const response = await fetch(`/api/domains/${domain.id}/ssl`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'SSL enabled!',
          description: 'Your domain is now secured with HTTPS.',
        })

        if (data.domain) {
          onStatusChange?.(data.domain.status)
        }

        onVerifyComplete?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'SSL provisioning failed',
          description: data.error || 'Please try again later.',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to enable SSL. Please try again.',
      })
    } finally {
      setIsEnablingSsl(false)
    }
  }

  const getStatusMessage = () => {
    switch (domain.status) {
      case 'PENDING':
        return {
          type: 'warning' as const,
          title: 'Domain verification required',
          description: `Add DNS records to verify ownership of ${domain.domain}`,
          action: 'Configure DNS',
        }
      case 'VERIFYING':
        return {
          type: 'info' as const,
          title: 'Verification in progress',
          description: 'Checking DNS records...',
          action: null,
        }
      case 'VERIFIED':
        return {
          type: 'success' as const,
          title: 'Domain verified',
          description: 'SSL certificate is being provisioned',
          action: 'Enable SSL',
        }
      case 'ACTIVE':
        return {
          type: 'success' as const,
          title: 'Domain is active',
          description: domain.sslEnabled
            ? 'Your domain is secured with SSL'
            : 'SSL certificate pending',
          action: null,
        }
      case 'FAILED':
        return {
          type: 'error' as const,
          title: 'Verification failed',
          description: 'DNS verification was unsuccessful. Please check your configuration.',
          action: 'Retry',
        }
      default:
        return null
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {domain.domain}
                <DomainStatus status={domain.status} sslEnabled={domain.sslEnabled} />
              </CardTitle>
              <CardDescription className="mt-1">
                Added {domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : 'recently'}
              </CardDescription>
            </div>
            <Badge
              variant={domain.sslEnabled ? 'default' : 'outline'}
              className={domain.sslEnabled ? 'bg-green-600' : ''}
            >
              {domain.sslEnabled ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  HTTPS
                </>
              ) : (
                'HTTP'
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {statusMessage && (
            <Alert
              variant={
                statusMessage.type === 'error'
                  ? 'destructive'
                  : statusMessage.type === 'warning'
                  ? 'default'
                  : 'default'
              }
              className={
                statusMessage.type === 'success'
                  ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900'
                  : statusMessage.type === 'warning'
                  ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900'
                  : statusMessage.type === 'info'
                  ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900'
                  : ''
              }
            >
              {statusMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
              {statusMessage.type === 'error' && <XCircle className="h-4 w-4" />}
              {statusMessage.type === 'warning' && <Clock className="h-4 w-4" />}
              {statusMessage.type === 'info' && <Loader2 className="h-4 w-4 animate-spin" />}
              <AlertTitle>{statusMessage.title}</AlertTitle>
              <AlertDescription className="mt-2">
                <p>{statusMessage.description}</p>
                {statusMessage.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      if (domain.status === 'VERIFIED') {
                        handleEnableSsl()
                      } else {
                        setIsOpen(true)
                      }
                    }}
                    disabled={isVerifying || isEnablingSsl}
                  >
                    {(isVerifying || isEnablingSsl) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {statusMessage.action}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://${domain.domain}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit
            </Button>
            {domain.status === 'ACTIVE' && !domain.sslEnabled && (
              <Button size="sm" onClick={handleEnableSsl} disabled={isEnablingSsl}>
                {isEnablingSsl && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Shield className="h-4 w-4 mr-1" />
                Enable SSL
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDnsInstructions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DNS Configuration Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure DNS for {domain.domain}</DialogTitle>
            <DialogDescription>
              Follow these steps to verify your domain ownership
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DnsInstructions
              domain={domain.domain}
              dnsRecords={dnsRecords}
              instructions={instructions}
              onVerify={handleVerify}
              isVerifying={isVerifying}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
