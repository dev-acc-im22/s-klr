'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DripType, Module, checkModuleAvailability, formatUnlockDate, getDaysUntilUnlock } from '@/types/course';

interface DripContentSettingsProps {
  modules: Module[];
  onModuleDripChange: (moduleId: string, dripSettings: {
    dripType: DripType;
    dripDate: Date | null;
    dripDays: number | null;
  }) => void;
  enrollmentDate?: Date;
  previewMode?: boolean;
}

export function DripContentSettings({
  modules,
  onModuleDripChange,
  enrollmentDate = new Date(),
  previewMode = false,
}: DripContentSettingsProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [previewDate, setPreviewDate] = useState<Date>(new Date());

  const dripTypeOptions = [
    { 
      value: 'immediate', 
      label: 'Immediate', 
      description: 'Available immediately upon enrollment',
      icon: Unlock 
    },
    { 
      value: 'scheduled', 
      label: 'Scheduled Date', 
      description: 'Available on a specific date',
      icon: Calendar 
    },
    { 
      value: 'after_previous', 
      label: 'After Previous', 
      description: 'Available X days after enrollment or completing previous module',
      icon: Clock 
    },
  ];

  const handleDripTypeChange = (moduleId: string, dripType: DripType) => {
    const currentModule = modules.find(m => m.id === moduleId);
    onModuleDripChange(moduleId, {
      dripType,
      dripDate: dripType === 'scheduled' ? (currentModule?.dripDate || new Date()) : null,
      dripDays: dripType === 'after_previous' ? (currentModule?.dripDays || 7) : null,
    });
  };

  const handleDateChange = (moduleId: string, date: Date | undefined) => {
    if (date) {
      onModuleDripChange(moduleId, {
        dripType: 'scheduled',
        dripDate: date,
        dripDays: null,
      });
    }
  };

  const handleDaysChange = (moduleId: string, days: number) => {
    onModuleDripChange(moduleId, {
      dripType: 'after_previous',
      dripDate: null,
      dripDays: days,
    });
  };

  const getAvailabilityPreview = (module: Module) => {
    const previousModule = modules.find(m => m.order === module.order - 1);
    const previousCompletionDate = previousModule ? new Date() : null;
    
    // Use preview date for simulation if in preview mode
    const checkDate = previewMode ? previewDate : new Date();
    
    const availability = checkModuleAvailability(
      { ...module, dripDate: module.dripDate },
      enrollmentDate,
      previousCompletionDate
    );
    
    return availability;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Drip Content Settings
            </CardTitle>
            <CardDescription>
              Control when each module becomes available to students
            </CardDescription>
          </div>
          {previewMode && (
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Preview Date:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(previewDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={previewDate}
                    onSelect={(date) => date && setPreviewDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How Drip Content Works</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Immediate:</strong> Students can access right after enrolling</li>
              <li><strong>Scheduled:</strong> Module unlocks on a specific date</li>
              <li><strong>After Previous:</strong> Module unlocks X days after enrollment or completing the previous module</li>
            </ul>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No modules to configure. Add modules to your course first.</p>
            </div>
          ) : (
            modules.map((module, index) => {
              const availability = getAvailabilityPreview(module);
              const Icon = dripTypeOptions.find(o => o.value === module.dripType)?.icon || Unlock;
              const isExpanded = expandedModule === module.id;

              return (
                <Card key={module.id} className={cn(
                  "transition-all",
                  !availability.isAvailable && "border-orange-200 bg-orange-50/50",
                  availability.isAvailable && "border-green-200 bg-green-50/30"
                )}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={module.id} className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="text-left">
                              <p className="font-medium">{module.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons?.length || 0} lessons
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <Badge 
                              variant={module.dripType === 'immediate' ? 'default' : 'secondary'}
                              className="gap-1"
                            >
                              <Icon className="h-3 w-3" />
                              {dripTypeOptions.find(o => o.value === module.dripType)?.label}
                            </Badge>
                            {previewMode && (
                              availability.isAvailable ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                  <Lock className="h-3 w-3 mr-1" />
                                  {availability.unlockDate && `In ${getDaysUntilUnlock(availability.unlockDate)} days`}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 pt-2">
                          {/* Drip Type Selector */}
                          <div className="space-y-3">
                            <Label>Drip Type</Label>
                            <RadioGroup
                              value={module.dripType}
                              onValueChange={(value: DripType) => handleDripTypeChange(module.id, value)}
                              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                            >
                              {dripTypeOptions.map((option) => (
                                <div key={option.value} className="flex items-center">
                                  <RadioGroupItem
                                    value={option.value}
                                    id={`${module.id}-${option.value}`}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={`${module.id}-${option.value}`}
                                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer w-full"
                                  >
                                    <option.icon className="h-5 w-5 mb-2 text-primary" />
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground text-center mt-1">
                                      {option.description}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Scheduled Date Picker */}
                          {module.dripType === 'scheduled' && (
                            <div className="space-y-2">
                              <Label>Available On</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !module.dripDate && "text-muted-foreground"
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {module.dripDate ? format(new Date(module.dripDate), 'PPP') : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={module.dripDate ? new Date(module.dripDate) : undefined}
                                    onSelect={(date) => handleDateChange(module.id, date)}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}

                          {/* Days After Previous */}
                          {module.dripType === 'after_previous' && (
                            <div className="space-y-2">
                              <Label>Days After {index === 0 ? 'Enrollment' : 'Previous Module'}</Label>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="number"
                                  min={1}
                                  max={365}
                                  value={module.dripDays || 7}
                                  onChange={(e) => handleDaysChange(module.id, parseInt(e.target.value) || 0)}
                                  className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">days</span>
                              </div>
                              {index > 0 && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <ArrowRight className="h-3 w-3" />
                                  Will unlock {module.dripDays || 7} days after completing Module {index}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Availability Preview */}
                          {previewMode && (
                            <div className={cn(
                              "rounded-lg p-3 mt-4",
                              availability.isAvailable 
                                ? "bg-green-100 text-green-800" 
                                : "bg-orange-100 text-orange-800"
                            )}>
                              <div className="flex items-center gap-2 font-medium">
                                {availability.isAvailable ? (
                                  <>
                                    <Unlock className="h-4 w-4" />
                                    Available Now
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4" />
                                    Locked
                                  </>
                                )}
                              </div>
                              <p className="text-sm mt-1">{availability.reason}</p>
                              {availability.unlockDate && (
                                <p className="text-sm mt-1 font-medium">
                                  Unlocks: {formatUnlockDate(availability.unlockDate)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              );
            })
          )}
        </div>

        {/* Timeline Preview */}
        {modules.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Content Release Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const availability = getAvailabilityPreview(module);
                  return (
                    <div key={module.id} className="relative flex items-start gap-4 pl-8">
                      <div className={cn(
                        "absolute left-3 w-3 h-3 rounded-full border-2 border-background",
                        availability.isAvailable 
                          ? "bg-green-500" 
                          : "bg-orange-400"
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{module.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {availability.isAvailable 
                            ? "Available immediately"
                            : availability.reason
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
