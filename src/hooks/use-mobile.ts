import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Store for subscribers
const subscribers = new Set<() => void>()
let cachedValue: boolean | null = null
let hydrationComplete = false

// Get the current mobile state
function getMobileValue(): boolean {
  if (typeof window === "undefined") {
    return false
  }
  return window.innerWidth < MOBILE_BREAKPOINT
}

// Notify all subscribers of changes
function notifySubscribers() {
  cachedValue = getMobileValue()
  subscribers.forEach((callback) => callback())
}

// Subscribe to window resize events
function subscribe(callback: () => void) {
  // Initialize cached value on first client-side subscription
  if (cachedValue === null && typeof window !== "undefined") {
    cachedValue = getMobileValue()
  }

  subscribers.add(callback)

  // Only add resize listener once
  if (subscribers.size === 1 && typeof window !== "undefined") {
    window.addEventListener("resize", notifySubscribers)
  }

  return () => {
    subscribers.delete(callback)
    // Remove resize listener when no subscribers remain
    if (subscribers.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("resize", notifySubscribers)
    }
  }
}

// Snapshot functions for useSyncExternalStore
function getSnapshot(): boolean {
  // During hydration, return false to match server snapshot
  // After hydration, return the actual value
  if (!hydrationComplete) {
    return false
  }
  // Return cached value if available, otherwise compute it
  if (cachedValue !== null) {
    return cachedValue
  }
  return getMobileValue()
}

function getServerSnapshot(): boolean {
  // Always return false on the server
  return false
}

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses useSyncExternalStore for SSR-safe hydration
 */
export function useIsMobile(): boolean {
  // Use useSyncExternalStore for SSR-safe hydration
  const isMobile = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  
  // Mark hydration as complete after the first render
  // This ensures the server and client initial renders match
  React.useEffect(() => {
    hydrationComplete = true
    // Update cached value and notify subscribers if needed
    const newValue = getMobileValue()
    if (cachedValue !== newValue) {
      cachedValue = newValue
      subscribers.forEach((callback) => callback())
    }
  }, [])
  
  return isMobile
}
