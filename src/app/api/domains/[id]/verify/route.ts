import { NextRequest, NextResponse } from 'next/server'

// Mock data - same structure as in route.ts
interface CustomDomain {
  id: string
  userId: string
  domain: string
  status: 'PENDING' | 'VERIFYING' | 'VERIFIED' | 'ACTIVE' | 'FAILED'
  verifiedAt: string | null
  sslEnabled: boolean
  isPrimary: boolean
  wwwRedirect: boolean
  createdAt: string
  updatedAt: string
}

// In-memory store (shared via module level)
let customDomains: CustomDomain[] = [
  {
    id: 'domain-1',
    userId: 'user-1',
    domain: 'store.mydomain.com',
    status: 'ACTIVE',
    verifiedAt: '2024-01-15T10:00:00Z',
    sslEnabled: true,
    isPrimary: true,
    wwwRedirect: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'domain-2',
    userId: 'user-1',
    domain: 'shop.example.com',
    status: 'PENDING',
    verifiedAt: null,
    sslEnabled: false,
    isPrimary: false,
    wwwRedirect: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
]

// DNS verification records
interface DnsRecord {
  type: 'CNAME' | 'A' | 'TXT'
  name: string
  value: string
  required: boolean
}

// GET /api/domains/[id]/verify - Get DNS instructions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  // Generate DNS records based on domain type
  const dnsRecords: DnsRecord[] = []

  // Check if it's a subdomain or apex domain
  const parts = domain.domain.split('.')
  const isApexDomain = parts.length === 2

  if (isApexDomain) {
    // Apex domain - use A records
    dnsRecords.push({
      type: 'A',
      name: '@',
      value: '76.76.21.21',
      required: true,
    })
    dnsRecords.push({
      type: 'A',
      name: 'www',
      value: '76.76.21.21',
      required: false,
    })
  } else {
    // Subdomain - use CNAME
    dnsRecords.push({
      type: 'CNAME',
      name: parts[0],
      value: 'cname.creatorhub.store',
      required: true,
    })
  }

  // TXT record for verification
  dnsRecords.push({
    type: 'TXT',
    name: isApexDomain ? '@' : parts[0],
    value: `creatorhub-verification=${id}`,
    required: true,
  })

  return NextResponse.json({
    domain: domain.domain,
    status: domain.status,
    dnsRecords,
    instructions: [
      {
        step: 1,
        title: 'Access your DNS provider',
        description: `Log in to your domain registrar or DNS provider where ${domain.domain} is registered.`,
      },
      {
        step: 2,
        title: 'Add DNS records',
        description: 'Add the following DNS records to verify domain ownership:',
      },
      {
        step: 3,
        title: 'Wait for propagation',
        description: 'DNS changes can take up to 48 hours to propagate, but usually happen within minutes.',
      },
      {
        step: 4,
        title: 'Verify your domain',
        description: 'Click the "Verify Domain" button below to check if your DNS records are correctly configured.',
      },
    ],
  })
}

// POST /api/domains/[id]/verify - Trigger verification
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  if (domain.status === 'ACTIVE') {
    return NextResponse.json({
      success: true,
      message: 'Domain is already active',
      domain,
    })
  }

  // Simulate verification process
  // In production, this would actually check DNS records
  const simulateSuccess = Math.random() > 0.3 // 70% success rate for demo

  if (simulateSuccess) {
    domain.status = 'VERIFIED'
    domain.verifiedAt = new Date().toISOString()
    domain.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'Domain verified successfully! SSL provisioning will begin automatically.',
      domain,
      sslStatus: 'pending',
    })
  } else {
    domain.status = 'PENDING'
    domain.updatedAt = new Date().toISOString()

    return NextResponse.json(
      {
        success: false,
        error: 'DNS verification failed. Please ensure your DNS records are correctly configured and try again.',
        domain,
      },
      { status: 400 }
    )
  }
}
