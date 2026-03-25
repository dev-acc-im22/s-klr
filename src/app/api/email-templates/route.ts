import { NextRequest, NextResponse } from 'next/server'
import { mockEmailTemplates, defaultEmailTemplates, MockEmailTemplate } from '@/lib/mock-data/email'

// In-memory store for demo purposes (reset on server restart)
let templates: MockEmailTemplate[] = [...mockEmailTemplates]

// GET /api/email-templates - List all templates
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const includeDefaults = searchParams.get('includeDefaults') !== 'false'

  let result = [...templates]

  // Filter by type if provided
  if (type) {
    result = result.filter((t) => t.type === type.toUpperCase())
  }

  return NextResponse.json({
    templates: result,
    defaultTemplates: includeDefaults ? defaultEmailTemplates : undefined,
    total: result.length
  })
}

// POST /api/email-templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, body: templateBody, variables, isActive = true } = body

    if (!type || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Type, subject, and body are required' },
        { status: 400 }
      )
    }

    // Check if template of this type already exists
    const existing = templates.find((t) => t.type === type)
    if (existing) {
      return NextResponse.json(
        { error: 'Template of this type already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newTemplate: MockEmailTemplate = {
      id: `tpl_${Date.now()}`,
      type,
      subject,
      body: templateBody,
      variables: variables || [],
      isActive,
      createdAt: now,
      updatedAt: now
    }

    templates.push(newTemplate)

    return NextResponse.json(newTemplate, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

// PUT /api/email-templates - Bulk update templates
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { templates: updatedTemplates } = body

    if (!Array.isArray(updatedTemplates)) {
      return NextResponse.json(
        { error: 'Templates array is required' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const results: MockEmailTemplate[] = []

    for (const update of updatedTemplates) {
      const index = templates.findIndex((t) => t.id === update.id || t.type === update.type)
      
      if (index !== -1) {
        templates[index] = {
          ...templates[index],
          ...update,
          updatedAt: now
        }
        results.push(templates[index])
      }
    }

    return NextResponse.json({ updated: results, count: results.length })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update templates' },
      { status: 500 }
    )
  }
}

// DELETE /api/email-templates - Delete template(s)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, resetToDefaults } = body

    if (resetToDefaults) {
      // Reset all templates to defaults
      templates = [...defaultEmailTemplates]
      return NextResponse.json({
        success: true,
        message: 'All templates reset to defaults',
        templates
      })
    }

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Template IDs are required' },
        { status: 400 }
      )
    }

    const initialLength = templates.length
    templates = templates.filter((t) => !ids.includes(t.id))

    return NextResponse.json({
      success: true,
      deletedCount: initialLength - templates.length
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete templates' },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { templates }
