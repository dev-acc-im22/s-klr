"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { webhookEvents, type WebhookEventType } from "@/lib/mock-data/webhooks"

interface EventSelectorProps {
  value: WebhookEventType[]
  onChange: (value: WebhookEventType[]) => void
  className?: string
}

export function EventSelector({ value, onChange, className }: EventSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (eventId: WebhookEventType) => {
    if (value.includes(eventId)) {
      onChange(value.filter((id) => id !== eventId))
    } else {
      onChange([...value, eventId])
    }
  }

  const handleSelectAll = () => {
    if (value.length === webhookEvents.length) {
      onChange([])
    } else {
      onChange(webhookEvents.map((e) => e.id as WebhookEventType))
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10", className)}
        >
          {value.length === 0 ? (
            "Select events..."
          ) : value.length === webhookEvents.length ? (
            "All events selected"
          ) : (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((eventId) => {
                const event = webhookEvents.find((e) => e.id === eventId)
                return (
                  <Badge key={eventId} variant="secondary" className="mr-1">
                    {event?.name || eventId}
                  </Badge>
                )
              })}
              {value.length > 3 && (
                <Badge variant="secondary">+{value.length - 3} more</Badge>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search events..." />
          <CommandList>
            <CommandEmpty>No events found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={handleSelectAll}
                className="font-medium border-b"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.length === webhookEvents.length
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Select All Events
              </CommandItem>
              {webhookEvents.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.id}
                  onSelect={() => handleSelect(event.id as WebhookEventType)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(event.id as WebhookEventType)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{event.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Event badges display component
interface EventBadgesProps {
  events: string[]
  className?: string
  maxDisplay?: number
}

export function EventBadges({ events, className, maxDisplay = 3 }: EventBadgesProps) {
  const displayEvents = events.slice(0, maxDisplay)
  const remaining = events.length - maxDisplay

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayEvents.map((eventId) => {
        const event = webhookEvents.find((e) => e.id === eventId)
        return (
          <Badge key={eventId} variant="outline" className="text-xs">
            {event?.name || eventId}
          </Badge>
        )
      })}
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remaining} more
        </Badge>
      )}
    </div>
  )
}
