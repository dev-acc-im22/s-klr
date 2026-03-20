import { NextRequest, NextResponse } from 'next/server'
import { automations } from '../route'

// GET /api/instagram/automations/[id] - Get single automation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const automation = automations.find((auto) => auto.id === id)

  if (!automation) {
    return NextResponse.json(
      { error: 'Automation not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(automation)
}

// PUT /api/instagram/automations/[id] - Update automation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const automationIndex = automations.findIndex((auto) => auto.id === id)

    if (automationIndex === -1) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      )
    }

    const { 
      name, 
      triggerType, 
      keywords, 
      message, 
      delay,
      isActive 
    } = body

    // Validate trigger type if provided
    if (triggerType) {
      const validTriggerTypes = ['NEW_FOLLOWER', 'KEYWORD_MENTION', 'STORY_REPLY', 'COMMENT']
      if (!validTriggerTypes.includes(triggerType)) {
        return NextResponse.json(
          { error: 'Invalid trigger type' },
          { status: 400 }
        )
      }
    }

    // Update automation
    const existingAutomation = automations[automationIndex]
    const updatedAutomation = {
      ...existingAutomation,
      ...(name && { name }),
      ...(triggerType && { triggerType }),
      ...(keywords !== undefined && { keywords: keywords ? JSON.stringify(keywords) : null }),
      ...(message && { message }),
      ...(delay !== undefined && { delay }),
      ...(isActive !== undefined && { isActive }),
    }

    // Update in array (mutating for demo)
    Object.assign(automations[automationIndex], updatedAutomation)

    return NextResponse.json(updatedAutomation)
  } catch {
    return NextResponse.json(
      { error: 'Failed to update automation' },
      { status: 500 }
    )
  }
}

// DELETE /api/instagram/automations/[id] - Delete automation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const automationIndex = automations.findIndex((auto) => auto.id === id)

    if (automationIndex === -1) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      )
    }

    // Remove from array (mutating for demo)
    automations.splice(automationIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Automation deleted successfully'
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete automation' },
      { status: 500 }
    )
  }
}
