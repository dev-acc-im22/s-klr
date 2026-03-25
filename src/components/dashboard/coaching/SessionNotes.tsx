"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, FileText, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/components/providers/HydrationProvider";

interface SessionNotesProps {
  session: {
    id: string;
    notes?: string;
    scheduledAt: Date;
    packageName?: string;
    clientName: string;
  };
  onSave?: (data: { notes: string }) => void;
  onMarkComplete?: () => void;
  isEditable?: boolean;
}

export function SessionNotes({
  session,
  onSave,
  onMarkComplete,
  isEditable = true,
}: SessionNotesProps) {
  const [notes, setNotes] = React.useState(session.notes || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const mounted = useHydrated();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.({ notes });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (value: string) => {
    setNotes(value);
    setHasChanges(value !== (session.notes || ""));
  };

  return (
    <div className="space-y-4">
      {/* Session Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          {session.packageName || "Session"} with {session.clientName}
        </div>
        <div className="text-muted-foreground">
          {mounted ? format(session.scheduledAt, "MMM d, yyyy h:mm a") : <Skeleton className="h-4 w-32" />}
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Session Notes</span>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs">
              Unsaved
            </Badge>
          )}
        </div>
        
        {isEditable ? (
          <>
            <Textarea
              value={notes}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Add notes about this session..."
              rows={6}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Notes are private and only visible to you
              </p>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground whitespace-pre-wrap min-h-[100px] p-3 rounded-lg bg-muted/50">
            {notes || "No notes for this session."}
          </div>
        )}
      </div>

      {/* Actions */}
      {onMarkComplete && (
        <div className="pt-4 border-t">
          <Button onClick={onMarkComplete} className="w-full sm:w-auto">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Session Complete
          </Button>
        </div>
      )}
    </div>
  );
}
