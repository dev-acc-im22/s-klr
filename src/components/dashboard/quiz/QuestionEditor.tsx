'use client';

import { useState } from 'react';
import { GripVertical, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

interface QuestionEditorProps {
  question: QuestionData;
  index: number;
  onUpdate: (id: string, data: Partial<QuestionData>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  isDragging,
}: QuestionEditorProps) {
  const [expanded, setExpanded] = useState(true);

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate(question.id, { options: newOptions });
  };

  const handleCorrectAnswerChange = (optionIndex: number) => {
    onUpdate(question.id, { correctAnswer: optionIndex });
  };

  return (
    <Card
      className={cn(
        'transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div className="flex items-center gap-1 pt-2 text-muted-foreground cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5" />
            <span className="text-sm font-medium">Q{index + 1}</span>
          </div>

          {/* Question content */}
          <div className="flex-1 space-y-4">
            {/* Question text */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Question {index + 1}
              </Label>
              <Input
                value={question.question}
                onChange={(e) =>
                  onUpdate(question.id, { question: e.target.value })
                }
                placeholder="Enter your question..."
                className="text-base font-medium"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Answer Options (click to mark correct answer)
              </Label>
              <div className="grid gap-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer',
                      question.correctAnswer === optionIndex
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => handleCorrectAnswerChange(optionIndex)}
                  >
                    {/* Correct answer indicator */}
                    <div
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-colors',
                        question.correctAnswer === optionIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </div>

                    {/* Option input */}
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(optionIndex, e.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      className="flex-1 h-8 border-0 bg-transparent focus-visible:ring-0"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Correct indicator */}
                    {question.correctAnswer === optionIndex ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(question.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to create a new empty question
export function createEmptyQuestion(index: number): QuestionData {
  return {
    id: `temp-${Date.now()}-${index}`,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    order: index,
  };
}
