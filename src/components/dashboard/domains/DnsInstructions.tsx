'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

interface DnsInstructionsProps {
  domain: string
  dnsRecords: DnsRecord[]
  instructions: DnsInstruction[]
  onVerify?: () => void
  isVerifying?: boolean
}

export function DnsInstructions({
  domain,
  dnsRecords,
  instructions,
  onVerify,
  isVerifying,
}: DnsInstructionsProps) {
  const { toast } = useToast()
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    })
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'CNAME':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'A':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'TXT':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* DNS Records Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            DNS Configuration
          </CardTitle>
          <CardDescription>
            Add these DNS records to verify ownership of <strong>{domain}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dnsRecords.map((record, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-muted/50"
              >
                <Badge className={getRecordTypeColor(record.type)}>
                  {record.type}
                </Badge>
                <div className="flex-1 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Name</label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{record.name}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(record.name, 'Record name')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Value</label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono truncate max-w-[200px]">
                        {record.value}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(record.value, 'Record value')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {record.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Setup Steps</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {instructions.map((instruction) => (
              <div key={instruction.step} className="p-4">
                <button
                  className="w-full flex items-start gap-3 text-left"
                  onClick={() =>
                    setExpandedStep(
                      expandedStep === instruction.step ? null : instruction.step
                    )
                  }
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {instruction.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{instruction.title}</span>
                      {expandedStep === instruction.step ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {expandedStep === instruction.step && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {instruction.description}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onVerify} disabled={isVerifying} className="flex-1">
          {isVerifying ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Domain
            </>
          )}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Need Help?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Common DNS Issues</DialogTitle>
              <DialogDescription>
                Here are solutions to common problems when setting up custom domains
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-medium">DNS not propagating</h4>
                <p className="text-sm text-muted-foreground">
                  DNS changes can take up to 48 hours to propagate globally. Use a tool like{' '}
                  <a
                    href="https://dnschecker.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    DNS Checker <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  to check propagation status.
                </p>
              </div>
              <div>
                <h4 className="font-medium">CNAME vs A Record</h4>
                <p className="text-sm text-muted-foreground">
                  Use CNAME for subdomains (e.g., store.example.com) and A records for apex
                  domains (e.g., example.com). You cannot use CNAME for apex domains.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Already have records?</h4>
                <p className="text-sm text-muted-foreground">
                  If you already have DNS records for this domain, you may need to modify or
                  remove them before adding the new records.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Compact DNS Record Row for inline display
interface DnsRecordRowProps {
  record: DnsRecord
}

export function DnsRecordRow({ record }: DnsRecordRowProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    })
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'CNAME':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'A':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'TXT':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded border bg-muted/30">
      <Badge className={getRecordTypeColor(record.type)}>{record.type}</Badge>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-500">Name:</span>
          <code className="text-xs font-mono">{record.name}</code>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => copyToClipboard(record.name, 'Name')}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-500">Value:</span>
          <code className="text-xs font-mono truncate max-w-[150px]">{record.value}</code>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => copyToClipboard(record.value, 'Value')}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
