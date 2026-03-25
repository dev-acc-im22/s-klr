'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, Shield, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DomainStatusType = 'PENDING' | 'VERIFYING' | 'VERIFIED' | 'ACTIVE' | 'FAILED'

interface DomainStatusProps {
  status: DomainStatusType
  sslEnabled?: boolean
  showSsl?: boolean
  className?: string
}

const statusConfig: Record<
  DomainStatusType,
  {
    label: string
    icon: typeof CheckCircle
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className: string
  }
> = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  VERIFYING: {
    label: 'Verifying',
    icon: Loader2,
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  VERIFIED: {
    label: 'Verified',
    icon: CheckCircle,
    variant: 'secondary',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function DomainStatus({ status, sslEnabled, showSsl = true, className }: DomainStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={config.variant} className={cn('gap-1', config.className)}>
        <Icon className={cn('h-3 w-3', status === 'VERIFYING' && 'animate-spin')} />
        {config.label}
      </Badge>
      {showSsl && status === 'ACTIVE' && (
        <Badge
          variant="outline"
          className={cn(
            'gap-1',
            sslEnabled
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          )}
        >
          {sslEnabled ? (
            <>
              <ShieldCheck className="h-3 w-3" />
              SSL Active
            </>
          ) : (
            <>
              <Shield className="h-3 w-3" />
              No SSL
            </>
          )}
        </Badge>
      )}
    </div>
  )
}

// SSL Badge Component
interface SSLBadgeProps {
  enabled: boolean
  className?: string
}

export function SSLBadge({ enabled, className }: SSLBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1',
        enabled
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200',
        className
      )}
    >
      {enabled ? (
        <>
          <ShieldCheck className="h-3 w-3" />
          SSL Secured
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          No SSL
        </>
      )}
    </Badge>
  )
}

// Primary Domain Badge
interface PrimaryBadgeProps {
  isPrimary: boolean
  className?: string
}

export function PrimaryBadge({ isPrimary, className }: PrimaryBadgeProps) {
  if (!isPrimary) return null

  return (
    <Badge
      variant="default"
      className={cn(
        'bg-primary text-primary-foreground gap-1',
        className
      )}
    >
      Primary
    </Badge>
  )
}
