import { NextRequest, NextResponse } from 'next/server'

// Mock data - same as in route.ts
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

// GET /api/domains/[id] - Get a specific domain
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domain = customDomains.find((d) => d.id === id)

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  return NextResponse.json(domain)
}

// DELETE /api/domains/[id] - Remove a domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const domainIndex = customDomains.findIndex((d) => d.id === id)

  if (domainIndex === -1) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  const domain = customDomains[domainIndex]
  const wasPrimary = domain.isPrimary

  // Remove the domain
  customDomains.splice(domainIndex, 1)

  // If the removed domain was primary, set the next active domain as primary
  if (wasPrimary) {
    const userDomains = customDomains.filter((d) => d.userId === domain.userId)
    const activeDomain = userDomains.find((d) => d.status === 'ACTIVE')
    if (activeDomain) {
      activeDomain.isPrimary = true
    } else if (userDomains.length > 0) {
      userDomains[0].isPrimary = true
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Domain removed successfully',
  })
}

// PATCH /api/domains/[id] - Update domain settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isPrimary, wwwRedirect } = body

    const domain = customDomains.find((d) => d.id === id)

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    // Update primary domain
    if (isPrimary !== undefined && isPrimary !== domain.isPrimary) {
      if (domain.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Only active domains can be set as primary' },
          { status: 400 }
        )
      }

      // Remove primary from other domains
      customDomains
        .filter((d) => d.userId === domain.userId && d.id !== id)
        .forEach((d) => {
          d.isPrimary = false
        })

      domain.isPrimary = isPrimary
    }

    // Update www redirect
    if (wwwRedirect !== undefined) {
      domain.wwwRedirect = wwwRedirect
    }

    domain.updatedAt = new Date().toISOString()

    return NextResponse.json(domain)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update domain' },
      { status: 500 }
    )
  }
}
