import { NextRequest, NextResponse } from 'next/server'
import { mockCampaigns, mockSubscribers } from '@/lib/mock-data/email'

// In-memory store
let campaigns = [...mockCampaigns]

// GET /api/campaigns/[id] - Get a single campaign
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const campaign = campaigns.find((camp) => camp.id === id)

  if (!campaign) {
    return NextResponse.json(
      { error: 'Campaign not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(campaign)
}

// PATCH /api/campaigns/[id] - Update a campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = campaigns.findIndex((camp) => camp.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    const campaign = campaigns[index]
    
    // Can only edit DRAFT campaigns
    if (campaign.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Can only edit draft campaigns' },
        { status: 400 }
      )
    }

    const updated = {
      ...campaign,
      ...body,
      updatedAt: new Date().toISOString()
    }

    // Update status if scheduledAt is provided
    if (body.scheduledAt && !campaign.scheduledAt) {
      updated.status = 'SCHEDULED'
    }

    campaigns[index] = updated as typeof mockCampaigns[0]

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = campaigns.findIndex((camp) => camp.id === id)

  if (index === -1) {
    return NextResponse.json(
      { error: 'Campaign not found' },
      { status: 404 }
    )
  }

  const campaign = campaigns[index]

  // Can only delete DRAFT campaigns
  if (campaign.status !== 'DRAFT') {
    return NextResponse.json(
      { error: 'Can only delete draft campaigns' },
      { status: 400 }
    )
  }

  campaigns.splice(index, 1)

  return NextResponse.json({ success: true })
}

// POST /api/campaigns/[id] - Send or schedule campaign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body
    
    const index = campaigns.findIndex((camp) => camp.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    const campaign = campaigns[index]

    if (action === 'send') {
      // Simulate sending the campaign
      const activeSubscribers = mockSubscribers.filter((sub) => sub.isActive)
      
      const sent = {
        ...campaign,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        recipientCount: activeSubscribers.length,
        // Simulate some opens and clicks
        openCount: Math.floor(activeSubscribers.length * (0.4 + Math.random() * 0.3)),
        clickCount: Math.floor(activeSubscribers.length * (0.1 + Math.random() * 0.2)),
        updatedAt: new Date().toISOString()
      }

      campaigns[index] = sent as typeof mockCampaigns[0]

      return NextResponse.json({
        success: true,
        message: `Campaign sent to ${sent.recipientCount} subscribers`,
        campaign: sent
      })
    }

    if (action === 'schedule') {
      const { scheduledAt } = body
      
      if (!scheduledAt) {
        return NextResponse.json(
          { error: 'Scheduled date is required' },
          { status: 400 }
        )
      }

      const scheduled = {
        ...campaign,
        status: 'SCHEDULED',
        scheduledAt,
        updatedAt: new Date().toISOString()
      }

      campaigns[index] = scheduled as typeof mockCampaigns[0]

      return NextResponse.json({
        success: true,
        message: 'Campaign scheduled',
        campaign: scheduled
      })
    }

    if (action === 'test') {
      const { testEmail } = body
      
      if (!testEmail) {
        return NextResponse.json(
          { error: 'Test email address is required' },
          { status: 400 }
        )
      }

      // Simulate sending test email
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}`
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to process campaign action' },
      { status: 500 }
    )
  }
}
