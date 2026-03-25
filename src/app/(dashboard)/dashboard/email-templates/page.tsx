'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Save,
  RotateCcw,
  Eye,
  Edit,
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useGhostMode } from '@/hooks/useGhostMode';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TemplateList, TemplateListItem, templateTypeConfig } from '@/components/dashboard/email-templates/TemplateList';
import { TemplateEditor } from '@/components/dashboard/email-templates/TemplateEditor';
import { TemplatePreview } from '@/components/dashboard/email-templates/TemplatePreview';
import { EmailTemplateType, defaultEmailTemplates, MockEmailTemplate } from '@/lib/mock-data/email';

// In-memory store for client-side state
let clientTemplates: MockEmailTemplate[] = [...defaultEmailTemplates];

export default function EmailTemplatesPage() {
  const router = useRouter();
  const { isGhostMode } = useGhostMode();
  const [templates, setTemplates] = useState<MockEmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MockEmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MockEmailTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [templateToReset, setTemplateToReset] = useState<MockEmailTemplate | null>(null);

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email-templates');
      const data = await response.json();
      
      if (data.templates && data.templates.length > 0) {
        clientTemplates = data.templates;
        setTemplates(data.templates);
      } else {
        // Use default templates if none exist
        setTemplates(defaultEmailTemplates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Fallback to defaults on error
      setTemplates(defaultEmailTemplates);
    } finally {
      setLoading(false);
    }
  };

  // Handle template selection for preview
  const handleSelect = (template: TemplateListItem) => {
    setSelectedTemplate(template as MockEmailTemplate);
    setPreviewOpen(true);
  };

  // Handle template edit
  const handleEdit = (template: TemplateListItem) => {
    setEditingTemplate({ ...template } as MockEmailTemplate);
    setHasUnsavedChanges(false);
    setEditOpen(true);
  };

  // Handle template save
  const handleSave = async () => {
    if (!editingTemplate) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/email-templates/${editingTemplate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editingTemplate.subject,
          body: editingTemplate.body,
          variables: editingTemplate.variables,
          isActive: editingTemplate.isActive
        })
      });

      const data = await response.json();
      
      if (data.template) {
        // Update local state
        const updatedTemplates = templates.map((t) => 
          t.type === editingTemplate.type ? data.template : t
        );
        setTemplates(updatedTemplates);
        clientTemplates = updatedTemplates;
        setHasUnsavedChanges(false);
        setEditOpen(false);
        setEditingTemplate(null);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset to default
  const handleReset = (template: TemplateListItem) => {
    setTemplateToReset(template as MockEmailTemplate);
    setResetConfirmOpen(true);
  };

  const confirmReset = async () => {
    if (!templateToReset) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/email-templates/${templateToReset.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state with default
        const defaultTemplate = defaultEmailTemplates.find(
          (t) => t.type === templateToReset.type
        );
        if (defaultTemplate) {
          const updatedTemplates = templates.map((t) => 
            t.type === templateToReset.type ? defaultTemplate : t
          );
          setTemplates(updatedTemplates);
          clientTemplates = updatedTemplates;
        }
        setResetConfirmOpen(false);
        setTemplateToReset(null);
      }
    } catch (error) {
      console.error('Failed to reset template:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (template: TemplateListItem) => {
    try {
      const newIsActive = !template.isActive;
      
      const response = await fetch(`/api/email-templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newIsActive })
      });

      const data = await response.json();
      
      if (data.template) {
        const updatedTemplates = templates.map((t) => 
          t.type === template.type ? { ...t, isActive: newIsActive } : t
        );
        setTemplates(updatedTemplates);
        clientTemplates = updatedTemplates;
      }
    } catch (error) {
      console.error('Failed to toggle template active state:', error);
    }
  };

  // Handle edit changes
  const handleSubjectChange = (subject: string) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, subject });
      setHasUnsavedChanges(true);
    }
  };

  const handleBodyChange = (body: string) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, body });
      setHasUnsavedChanges(true);
    }
  };

  const handleVariablesChange = (variables: string[]) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, variables });
      setHasUnsavedChanges(true);
    }
  };

  const handleActiveChange = (isActive: boolean) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, isActive });
      setHasUnsavedChanges(true);
    }
  };

  // Close edit dialog with unsaved changes check
  const handleCloseEdit = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirm) return;
    }
    setEditOpen(false);
    setEditingTemplate(null);
    setHasUnsavedChanges(false);
  };

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/email">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
              <p className="text-muted-foreground">
                Customize email templates for automated communications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setTemplateToReset(null);
                setResetConfirmOpen(true);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset All to Defaults
            </Button>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Template Variables</AlertTitle>
          <AlertDescription>
            Use variables like {'{name}'} and {'{creator_name}'} to personalize emails. 
            Variables are automatically replaced with actual data when emails are sent.
          </AlertDescription>
        </Alert>

        {/* Template List */}
        {loading && templates.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TemplateList
            templates={templates.map((t) => ({
              ...t,
              isDefault: defaultEmailTemplates.some(
                (d) => d.type === t.type && d.body === t.body
              )
            }))}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onReset={handleReset}
            onToggleActive={handleToggleActive}
          />
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Template Preview
              </DialogTitle>
              <DialogDescription>
                Preview how your email will look with sample data
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <TemplatePreview
                type={selectedTemplate.type}
                subject={selectedTemplate.subject}
                body={selectedTemplate.body}
                variables={selectedTemplate.variables}
              />
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setPreviewOpen(false);
                  if (selectedTemplate) {
                    handleEdit(selectedTemplate);
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={handleCloseEdit}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Template
              </DialogTitle>
              <DialogDescription>
                {editingTemplate && templateTypeConfig[editingTemplate.type]?.description}
              </DialogDescription>
            </DialogHeader>
            {editingTemplate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {templateTypeConfig[editingTemplate.type]?.name}
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-orange-500 border-orange-500">
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
                <Tabs defaultValue="editor">
                  <TabsList>
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor" className="mt-4">
                    <TemplateEditor
                      subject={editingTemplate.subject}
                      body={editingTemplate.body}
                      variables={editingTemplate.variables}
                      isActive={editingTemplate.isActive}
                      onSubjectChange={handleSubjectChange}
                      onBodyChange={handleBodyChange}
                      onVariablesChange={handleVariablesChange}
                      onActiveChange={handleActiveChange}
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4">
                    <TemplatePreview
                      type={editingTemplate.type}
                      subject={editingTemplate.subject}
                      body={editingTemplate.body}
                      variables={editingTemplate.variables}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !hasUnsavedChanges}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Confirm Dialog */}
        <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Template{templateToReset ? '' : 's'}</DialogTitle>
              <DialogDescription>
                {templateToReset
                  ? `Are you sure you want to reset "${templateTypeConfig[templateToReset.type]?.name}" to its default values? This cannot be undone.`
                  : 'Are you sure you want to reset all templates to their default values? This cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={templateToReset ? confirmReset : async () => {
                  setLoading(true);
                  try {
                    await fetch('/api/email-templates', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ resetToDefaults: true })
                    });
                    setTemplates([...defaultEmailTemplates]);
                    clientTemplates = [...defaultEmailTemplates];
                    setResetConfirmOpen(false);
                  } catch (error) {
                    console.error('Failed to reset templates:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4" />
                )}
                Reset{templateToReset ? ' Template' : ' All'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
