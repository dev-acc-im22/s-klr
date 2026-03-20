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

// GET /api/domains/[id]/ssl - Get SSL status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  return NextResponse.json({
    domain: domain.domain,
    sslEnabled: domain.sslEnabled,
    status: domain.status,
    sslInfo: domain.sslEnabled
      ? {
          issuer: "Let's Encrypt",
          validFrom: domain.verifiedAt,
          validUntil: new Date(
            new Date(domain.verifiedAt || '').getTime() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          autoRenewal: true,
        }
      : null,
  })
}

// POST /api/domains/[id]/ssl - Enable/provision SSL
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  if (domain.sslEnabled) {
    return NextResponse.json({
      success: true,
      message: 'SSL is already enabled for this domain',
      domain,
    })
  }

  if (domain.status !== 'VERIFIED') {
    return NextResponse.json(
      {
        error: 'Domain must be verified before SSL can be provisioned',
        currentStatus: domain.status,
      },
      { status: 400 }
    )
  }

  // Simulate SSL provisioning
  // In production, this would trigger ACME challenge with Let's Encrypt
  const simulateSuccess = Math.random() > 0.2 // 80% success rate for demo

  if (simulateSuccess) {
    domain.sslEnabled = true
    domain.status = 'ACTIVE'
    domain.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'SSL certificate provisioned successfully!',
      domain,
      sslInfo: {
        issuer: "Let's Encrypt",
        validFrom: new Date().toISOString(),
        validUntil: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
        autoRenewal: true,
      },
    })
  } else {
    domain.status = 'FAILED'
    domain.updatedAt = new Date().toISOString()

    return NextResponse.json(
      {
        success: false,
        error: 'SSL provisioning failed. Please ensure your DNS records are correctly configured and try again.',
        domain,
      },
      { status: 400 }
    )
  }
}

// DELETE /api/domains/[id]/ssl - Disable SSL (not typically done, but available)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  if (!domain.sslEnabled) {
    return NextResponse.json(
      { error: 'SSL is not enabled for this domain' },
      { status: 400 }
    )
  }

  // Simulate SSL revocation
  domain.sslEnabled = false
  domain.status = 'VERIFIED'
  domain.updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    message: 'SSL certificate has been removed',
    domain,
  })
}
