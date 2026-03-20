'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VariableInserter } from './VariableInserter';

// Toolbar button component - defined outside of render
function ToolbarButton({ 
  icon: Icon, 
  tooltip, 
  onClick,
  disabled = false,
  active = false 
}: { 
  icon: LucideIcon; 
  tooltip: string; 
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={active ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

interface TemplateEditorProps {
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  onVariablesChange: (variables: string[]) => void;
  onActiveChange: (isActive: boolean) => void;
  readOnly?: boolean;
}

export function TemplateEditor({
  subject,
  body,
  variables,
  isActive,
  onSubjectChange,
  onBodyChange,
  onVariablesChange,
  onActiveChange,
  readOnly = false
}: TemplateEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'html' | 'preview'>('editor');

  // Insert text at cursor position
  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // If no textarea, append to end
      onBodyChange(body + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newBody = body.substring(0, start) + text + body.substring(end);
    onBodyChange(newBody);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [body, onBodyChange]);

  // Wrap selected text with tags
  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const newBody = body.substring(0, start) + before + selectedText + after + body.substring(end);
    onBodyChange(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  }, [body, onBodyChange]);

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (!url) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end) || 'Link Text';
    const linkHtml = `<a href="${url}" style="color: #2563eb; text-decoration: underline;">${selectedText}</a>`;
    const newBody = body.substring(0, start) + linkHtml + body.substring(end);
    onBodyChange(newBody);
  }, [body, onBodyChange]);

  // Extract variables from body
  const extractVariables = useCallback((text: string) => {
    const regex = /\{\{([a-z_]+)\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, []);

  // Handle body change and extract variables
  const handleBodyChange = (newBody: string) => {
    onBodyChange(newBody);
    const extracted = extractVariables(newBody);
    if (JSON.stringify(extracted.sort()) !== JSON.stringify(variables.sort())) {
      onVariablesChange(extracted);
    }
  };

  return (
    <div className="space-y-4">
      {/* Subject Line */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject Line</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Enter email subject..."
          disabled={readOnly}
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="active">Active Template</Label>
          <p className="text-xs text-muted-foreground">
            This template will be used for automated emails
          </p>
        </div>
        <Switch
          id="active"
          checked={isActive}
          onCheckedChange={onActiveChange}
          disabled={readOnly}
        />
      </div>

      <Separator />

      {/* Editor Toolbar */}
      <div className="flex items-center gap-1 flex-wrap">
        <TooltipProvider>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <ToolbarButton
              icon={Bold}
              tooltip="Bold"
              onClick={() => wrapSelection('<strong>', '</strong>')}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={Italic}
              tooltip="Italic"
              onClick={() => wrapSelection('<em>', '</em>')}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={Underline}
              tooltip="Underline"
              onClick={() => wrapSelection('<u>', '</u>')}
              disabled={readOnly}
            />
          </div>

          <div className="flex items-center gap-1 border rounded-md p-1">
            <ToolbarButton
              icon={Link}
              tooltip="Insert Link"
              onClick={insertLink}
              disabled={readOnly}
            />
          </div>

          <div className="flex items-center gap-1 border rounded-md p-1">
            <ToolbarButton
              icon={List}
              tooltip="Bullet List"
              onClick={() => wrapSelection('<ul>\n<li>', '</li>\n</ul>')}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={ListOrdered}
              tooltip="Numbered List"
              onClick={() => wrapSelection('<ol>\n<li>', '</li>\n</ol>')}
              disabled={readOnly}
            />
          </div>

          <div className="flex items-center gap-1 border rounded-md p-1">
            <ToolbarButton
              icon={AlignLeft}
              tooltip="Align Left"
              onClick={() => wrapSelection('<div style="text-align: left;">', '</div>')}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={AlignCenter}
              tooltip="Align Center"
              onClick={() => wrapSelection('<div style="text-align: center;">', '</div>')}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={AlignRight}
              tooltip="Align Right"
              onClick={() => wrapSelection('<div style="text-align: right;">', '</div>')}
              disabled={readOnly}
            />
          </div>

          <div className="flex items-center gap-1 border rounded-md p-1">
            <ToolbarButton
              icon={Code}
              tooltip="Code Block"
              onClick={() => wrapSelection('<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">', '</code>')}
              disabled={readOnly}
            />
          </div>
        </TooltipProvider>

        <div className="flex-1" />

        <VariableInserter
          onInsert={insertAtCursor}
          availableVariables={variables}
        />
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        <Button
          variant={viewMode === 'editor' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('editor')}
        >
          Editor
        </Button>
        <Button
          variant={viewMode === 'html' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('html')}
        >
          HTML
        </Button>
        <Button
          variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('preview')}
        >
          Preview
        </Button>
      </div>

      {/* Editor Area */}
      {viewMode === 'editor' && (
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder="Write your email content here..."
          className="min-h-[400px] font-mono text-sm"
          disabled={readOnly}
        />
      )}

      {viewMode === 'html' && (
        <pre className="bg-muted p-4 rounded-lg overflow-auto min-h-[400px] text-xs">
          {body}
        </pre>
      )}

      {viewMode === 'preview' && (
        <div className="border rounded-lg overflow-hidden min-h-[400px] bg-white">
          <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
            <span className="text-sm font-medium">Subject:</span>
            <span className="text-sm text-muted-foreground">
              {subject.replace(/\{\{([a-z_]+)\}\}/g, (_, v) => `[${v}]`)}
            </span>
          </div>
          <div 
            className="p-4"
            dangerouslySetInnerHTML={{
              __html: body.replace(/\{\{([a-z_]+)\}\}/g, (_, v) => `<span class="bg-blue-100 text-blue-800 px-1 rounded">[${v}]</span>`)
            }}
          />
        </div>
      )}

      {/* Detected Variables */}
      {variables.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Detected Variables</Label>
          <div className="flex flex-wrap gap-1">
            {variables.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
