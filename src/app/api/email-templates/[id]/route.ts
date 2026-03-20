import { NextRequest, NextResponse } from 'next/server'
import { templates, defaultEmailTemplates, MockEmailTemplate } from '@/lib/mock-data/email'

// In-memory store reference
let templateStore = templates

// GET /api/email-templates/[id] - Get a single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Try to find by ID first, then by type
  let template = templateStore.find((t) => t.id === id)
  
  if (!template) {
    template = templateStore.find((t) => t.type === id.toUpperCase())
  }

  if (!template) {
    // Check if it's a default template
    const defaultTemplate = defaultEmailTemplates.find(
      (t) => t.id === id || t.type === id.toUpperCase()
    )
    
    if (defaultTemplate) {
      return NextResponse.json({
        template: defaultTemplate,
        isDefault: true
      })
    }

    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ template, isDefault: false })
}

// PATCH /api/email-templates/[id] - Update a template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Find template by ID or type
    const index = templateStore.findIndex(
      (t) => t.id === id || t.type === id.toUpperCase()
    )

    if (index === -1) {
      // If not found, check if it's a type and create from default
      const defaultTemplate = defaultEmailTemplates.find(
        (t) => t.type === id.toUpperCase()
      )
      
      if (defaultTemplate) {
        const now = new Date().toISOString()
        const newTemplate: MockEmailTemplate = {
          ...defaultTemplate,
          ...body,
          id: `tpl_${Date.now()}`,
          updatedAt: now
        }
        templateStore.push(newTemplate)
        return NextResponse.json({ template: newTemplate, created: true })
      }

      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const now = new Date().toISOString()
    templateStore[index] = {
      ...templateStore[index],
      ...body,
      updatedAt: now
    }

    return NextResponse.json({ template: templateStore[index], updated: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/email-templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const index = templateStore.findIndex(
    (t) => t.id === id || t.type === id.toUpperCase()
  )

  if (index === -1) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    )
  }

  const deleted = templateStore.splice(index, 1)[0]

  return NextResponse.json({
    success: true,
    deleted,
    message: 'Template deleted. It will use the default template.'
  })
}

// POST /api/email-templates/[id] - Reset to default
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    if (action === 'reset') {
      // Find the default template
      const defaultTemplate = defaultEmailTemplates.find(
        (t) => t.type === id.toUpperCase() || t.id === id
      )

      if (!defaultTemplate) {
        return NextResponse.json(
          { error: 'Default template not found' },
          { status: 404 }
        )
      }

      // Remove custom template if exists
      const index = templateStore.findIndex(
        (t) => t.type === id.toUpperCase() || t.id === id
      )
      
      if (index !== -1) {
        templateStore.splice(index, 1)
      }

      return NextResponse.json({
        success: true,
        message: 'Template reset to default',
        defaultTemplate
      })
    }

    if (action === 'duplicate') {
      const template = templateStore.find(
        (t) => t.id === id || t.type === id.toUpperCase()
      ) || defaultEmailTemplates.find(
        (t) => t.id === id || t.type === id.toUpperCase()
      )

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      const now = new Date().toISOString()
      const duplicated: MockEmailTemplate = {
        ...template,
        id: `tpl_${Date.now()}`,
        subject: `${template.subject} (Copy)`,
        createdAt: now,
        updatedAt: now
      }

      templateStore.push(duplicated)

      return NextResponse.json({
        success: true,
        template: duplicated
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
