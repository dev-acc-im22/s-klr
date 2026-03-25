import { NextRequest, NextResponse } from 'next/server'

// Mock data for domains
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

// In-memory store for demo purposes
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

// GET /api/domains - List all domains for the user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || 'user-1'

  const userDomains = customDomains.filter((d) => d.userId === userId)

  // Sort by primary first, then by creation date
  userDomains.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (!a.isPrimary && b.isPrimary) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return NextResponse.json({
    domains: userDomains,
  })
}

// POST /api/domains - Add a new custom domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, userId = 'user-1', wwwRedirect = true } = body

    // Validate required fields
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    // Normalize domain (remove protocol and www)
    let normalizedDomain = domain.toLowerCase().trim()
    normalizedDomain = normalizedDomain.replace(/^(https?:\/\/)?(www\.)?/, '')
    normalizedDomain = normalizedDomain.replace(/\/$/, '')

    // Validate domain format
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/
    if (!domainRegex.test(normalizedDomain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Check if domain already exists
    const existingDomain = customDomains.find(
      (d) => d.domain === normalizedDomain
    )
    if (existingDomain) {
      return NextResponse.json(
        { error: 'This domain is already added' },
        { status: 400 }
      )
    }

    // Check domain limit (max 5 domains per user)
    const userDomains = customDomains.filter((d) => d.userId === userId)
    if (userDomains.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 custom domains allowed' },
        { status: 400 }
      )
    }

    const newDomain: CustomDomain = {
      id: `domain-${Date.now()}`,
      userId,
      domain: normalizedDomain,
      status: 'PENDING',
      verifiedAt: null,
      sslEnabled: false,
      isPrimary: userDomains.length === 0, // First domain is primary
      wwwRedirect,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    customDomains.push(newDomain)

    return NextResponse.json(newDomain, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    )
  }
}
