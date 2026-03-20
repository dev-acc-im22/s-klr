# CreatorHub - Complete Problem & Solution Documentation

> **Purpose:** This document records ALL problems encountered during development and their solutions. Keep this updated to prevent recurring issues and serve as a reference for debugging.

---

## Table of Contents
1. [Preview Panel Issues](#issue-1-preview-panel-flickering--not-loading)
2. [Hydration Mismatch](#issue-2-hydration-mismatch-ghost-mode-active-class)
3. [Ghost Mode Routing](#issue-3-ghost-mode-routing-not-working)
4. [Navigation Links](#issue-4-navigation-links-broken-in-ghost-mode)
5. [Dashboard Layout](#issue-5-dashboard-pages-missing-layout-wrapper)
6. [UI Layout Issues](#issue-6-ui-layout-issues-pending)
7. [Navbar on Dashboard Pages](#issue-7-navbar-rendering-on-dashboard-pages-breaking-layout)
8. [Date Formatting Hydration Mismatch](#issue-8-date-formatting-hydration-mismatch)
9. [Prevention Guidelines](#prevention-guidelines)
10. [Key Technical Patterns](#key-technical-patterns)
11. [Files Modified Registry](#files-modified-registry)

---

## Issue 1: Preview Panel Flickering & Not Loading

### Symptoms
- Preview panel flickering constantly
- Preview not loading any content
- White screen or loading spinner indefinitely

### Root Causes
1. **Dev server was not running** - The development server needed to be started
2. **SessionProvider loading state** - Unnecessary loading fallback caused flicker
3. **Dashboard pages missing layout wrapper** - Pages were not wrapped with DashboardLayout

### Solution
```bash
# Start dev server
bun run dev
```

**SessionProvider Fix:**
```typescript
// BEFORE (caused flickering)
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </NextAuthProvider>
  );
}

// Removed unnecessary loading suspense boundary
```

**DashboardLayout Wrapper:**
```typescript
// All dashboard pages must be wrapped:
export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* page content */}
    </DashboardLayout>
  );
}
```

### Prevention
- Always verify dev server is running before debugging preview issues
- Avoid unnecessary Suspense boundaries in providers
- Ensure all dashboard pages use DashboardLayout

---

## Issue 2: Hydration Mismatch (ghost-mode-active class)

### Symptoms
```
Warning: Prop `class` did not match. Server: "..." Client: "... ghost-mode-active"
```
- Console errors about hydration mismatch
- UI flickering on initial load
- Ghost mode state not syncing properly

### Root Cause
Zustand store was directly modifying `document.body.classList` during rehydration before React finished hydrating. This caused a mismatch between server-rendered HTML and client-side DOM.

**Problematic Code:**
```typescript
// useGhostStore.ts - WRONG
toggleGhostMode: () => {
  const newValue = !get().isGhostMode;
  set({ isGhostMode: newValue });
  setCookie('ghost_mode', newValue ? 'true' : 'false');
  
  // PROBLEM: Direct DOM manipulation during hydration
  if (newValue) {
    document.body.classList.add('ghost-mode-active');
  } else {
    document.body.classList.remove('ghost-mode-active');
  }
},
```

### Solution
Separated concerns between state management and DOM manipulation:

**1. Modified `/src/store/useGhostStore.ts`:**
```typescript
toggleGhostMode: () => {
  const newValue = !get().isGhostMode;
  set({ isGhostMode: newValue });
  setCookie('ghost_mode', newValue ? 'true' : 'false');
  // Note: DOM class handled by GhostModeEffect component
  if (typeof window !== 'undefined') {
    if (newValue) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/';
    }
  }
},
```

**2. Created `/src/components/providers/GhostModeEffect.tsx`:**
```typescript
'use client';
import { useEffect } from 'react';
import { useGhostMode } from '@/hooks/useGhostMode';

export function GhostModeEffect() {
  const { isGhostMode, mounted } = useGhostMode();
  
  useEffect(() => {
    if (!mounted) return;
    
    if (isGhostMode) {
      document.body.classList.add('ghost-mode-active');
    } else {
      document.body.classList.remove('ghost-mode-active');
    }
    
    return () => {
      document.body.classList.remove('ghost-mode-active');
    };
  }, [isGhostMode, mounted]);
  
  return null;
}
```

**3. Updated `/src/app/layout.tsx`:**
```typescript
import { GhostModeEffect } from '@/components/providers/GhostModeEffect';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <GhostModeEffect />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Prevention
- **NEVER** manipulate DOM directly in Zustand stores
- Always use `useEffect` for DOM manipulation (runs after hydration)
- Use `mounted` check pattern for client-only rendering
- Separate state management from side effects

---

## Issue 3: Ghost Mode Routing Not Working

### Symptoms
- Ghost mode toggle doesn't redirect properly
- Middleware doesn't recognize ghost mode
- Auth required even in ghost mode

### Root Cause
Ghost mode state was only stored in localStorage, but middleware runs on the server side and cannot access localStorage.

### Solution
**Cookie Sync for Middleware Access:**

```typescript
// useGhostStore.ts
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=86400; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// In store
toggleGhostMode: () => {
  const newValue = !get().isGhostMode;
  set({ isGhostMode: newValue });
  setCookie('ghost_mode', newValue ? 'true' : 'false'); // Cookie for middleware
  // ...
},
```

**Middleware Update:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const ghostMode = request.cookies.get('ghost_mode')?.value === 'true';
  
  if (ghostMode) {
    // Allow access to dashboard routes
    return NextResponse.next();
  }
  // ... normal auth logic
}
```

### Prevention
- Use cookies for any state that middleware needs to access
- localStorage is client-only, cookies work on both client and server
- Sync both for consistency

---

## Issue 4: Navigation Links Broken in Ghost Mode

### Symptoms
- Clicking navbar links doesn't navigate
- Ghost mode toggle appears multiple times
- Layout breaks on navigation

### Root Cause
Navbar wasn't checking for ghost mode state properly before rendering, causing inconsistent UI.

### Solution
**Mounted Check Pattern in Navbar:**
```typescript
// components/layout/Navbar.tsx
const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false
);

// Only show ghost mode UI after mount
{mounted && isGhostMode && (
  <GhostModeIndicator />
)}
```

### Prevention
- Always use mounted checks when rendering client-specific content
- Don't assume localStorage/state is available during SSR

---

## Issue 5: Dashboard Pages Missing Layout Wrapper

### Symptoms
- Dashboard pages render without sidebar
- Inconsistent layout between pages
- Missing navigation on certain pages

### Root Cause
Some dashboard pages were not wrapped with DashboardLayout component.

### Solution
**Wrap ALL dashboard pages:**
```typescript
// Every page in /src/app/(dashboard)/*/
export default function SomeDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
}
```

### Prevention
- Create a checklist when adding new dashboard pages
- Consider using a layout.tsx file in the (dashboard) route group

---

## Issue 6: UI Layout Issues (Current - Pending Fix)

### Symptoms
1. **Side panel overlap** - Left and right panels overlapping
2. **Navbar not sleek** - Ghost mode indicator causing multiple rows
3. **Cropped menu items** - Left sidebar menu items being cut off

### Files to Modify
- `/src/components/layout/Navbar.tsx`
- `/src/components/dashboard/Sidebar.tsx`
- `/src/components/dashboard/DashboardLayout.tsx`
- `/src/components/dashboard/Header.tsx`

### Status
🔴 Pending resolution

---

## Issue 7: Navbar Rendering on Dashboard Pages (Breaking Layout)

### Symptoms
- Dashboard pages breaking when navigating from public pages
- Two navigation bars appearing (public Navbar + Dashboard sidebar)
- Layout conflicts and overlapping navigation elements

### Root Cause
The root layout (`/src/app/layout.tsx`) includes the Navbar component for ALL pages. Dashboard pages already have their own sidebar navigation through `DashboardLayout`, causing a conflict where both navigations render simultaneously.

### Solution
Modify the Navbar component to check the current route and not render on dashboard routes:

```typescript
// Navbar.tsx
export function Navbar() {
  const pathname = usePathname();
  // ... hooks must be called BEFORE any early return
  
  // Don't render Navbar on dashboard routes
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    return null;
  }
  
  return (
    // ... navbar JSX
  );
}
```

**IMPORTANT:** All React hooks must be called BEFORE the early return to avoid "hooks called conditionally" error.

### Prevention
- Be aware of layout composition with route groups
- Use pathname checks to conditionally render layout components
- Always call hooks before any conditional returns
- Consider using separate layout files for different route groups

---

## Issue 8: Date Formatting Hydration Mismatch

### Symptoms
```
Hydration failed because the server rendered text didn't match the client.
+ Mar 18, 2026 1:43 AM
- Mar 17, 2026 8:13 PM
```
- Dates showing different values on server vs client
- Hydration mismatch errors in console
- Affected components flickering on load

### Root Cause
Date formatting functions (like `format()` from date-fns, `new Date()`, `.toLocaleString()`) produce different results on server vs client due to:
1. **Timezone differences** - Server may be in UTC while client is in local timezone
2. **Time elapsed** - `new Date()` captures different moments on server and client
3. **Locale differences** - Server may not have access to user's locale

### Solution
Wrap all date formatting with mounted checks:

```typescript
// Pattern 1: Using useSyncExternalStore (recommended)
const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false
);

// In JSX:
{mounted ? format(date, 'MMM d, yyyy') : <Skeleton className="h-4 w-24" />}
```

```typescript
// Pattern 2: Using useState + useEffect
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// In JSX:
{mounted ? format(date, 'MMM d, yyyy') : <Skeleton className="h-4 w-24" />}
```

```typescript
// Pattern 3: For calendars with many dates (early return)
if (!mounted) {
  return <Skeleton className="h-[400px] w-full" />;
}
// ... rest of calendar rendering
```

```typescript
// Pattern 4: For new Date() in helpers
// BEFORE (causes hydration mismatch):
function getGreeting() {
  const hour = new Date().getHours(); // Different on server vs client
  // ...
}

// AFTER:
const [greeting, setGreeting] = useState('Hello!');
useEffect(() => {
  const hour = new Date().getHours();
  if (hour < 12) setGreeting('Good morning!');
  else if (hour < 18) setGreeting('Good afternoon!');
  else setGreeting('Good evening!');
}, []);
```

### Files Fixed (16 files total)

**Dashboard Pages:**
| File | Issue | Fix |
|------|-------|-----|
| `/src/app/(dashboard)/dashboard/coaching/page.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/app/(dashboard)/dashboard/bookings/page.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/app/(dashboard)/dashboard/bookings/[id]/page.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/app/(dashboard)/dashboard/community/page.tsx` | `format()` call | Added mounted check with Skeleton |
| `/src/app/(dashboard)/dashboard/email/page.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/app/(dashboard)/dashboard/page.tsx` | `new Date().getHours()` | Changed to useState + useEffect |

**Dashboard Components:**
| File | Issue | Fix |
|------|-------|-----|
| `/src/components/dashboard/coaching/SessionNotes.tsx` | `format()` call | Added mounted check with Skeleton |
| `/src/components/dashboard/coaching/SessionCalendar.tsx` | Multiple `format()` calls | Early return with Skeleton |
| `/src/components/dashboard/coaching/SessionCard.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/components/dashboard/bookings/BookingCard.tsx` | `format()` calls | Added mounted check with Skeleton |
| `/src/components/dashboard/bookings/BookingCalendar.tsx` | Multiple `format()` calls | Early return with Skeleton |
| `/src/components/dashboard/email/SubscriberList.tsx` | `format()` call | Added mounted check |

**Layout Components:**
| File | Issue | Fix |
|------|-------|-----|
| `/src/components/layout/Footer.tsx` | `new Date().getFullYear()` | Added mounted check with fallback |

### Prevention
- **NEVER** use `new Date()`, `Date.now()`, or date formatting functions directly in render
- Always wrap date formatting with mounted checks
- Use Skeleton as fallback to prevent layout shift
- For calendars, consider early return with full skeleton
- Test in different timezones to catch issues early

---

## Issue 9: Preview Panel Flickering (FINAL SOLUTION)

### Symptoms
- Output preview panel flickering constantly
- UI flashing between states on load
- Components rendering differently on server vs client
- Multiple re-renders during hydration
- Content flashing visible then hidden again

### Root Cause Analysis (THE REAL PROBLEM)

The flickering was caused by **conflicting hydration scripts** setting `visibility` at different times:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE FLICKERING CAUSE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ BEFORE (Multiple Conflicting Sources):                      │
│                                                                 │
│  1. HTML renders (server)                                       │
│  2. BlockingScript sets visibility:hidden                       │
│  3. HydrationScript sets visibility:visible ← TOO EARLY!        │
│  4. Content flashes on screen                                   │
│  5. HydrationProvider tries to add 'hydrated' class             │
│  6. Another script removes/adds visibility again                │
│  7. FLICKER HAPPENS!                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Additional Causes:**
1. **Fragmented Hydration State**: 6 components used local `useState` + `useEffect` pattern
2. **Zustand Persist Timing**: Rehydrated independently of React hydration
3. **Theme Provider**: `next-themes` rehydrated independently
4. **Framer Motion**: Animations starting with `initial="hidden"` causing flash

### Solution: Single Source of Truth

The fix requires **ONE** place to manage visibility, not multiple:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE FIX                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ AFTER (Single Source of Truth):                             │
│                                                                 │
│  1. HTML renders with visibility:hidden (inline style)          │
│     - This is the PRIMARY blocker                               │
│                                                                 │
│  2. HydrationScript runs                                        │
│     - ONLY sets theme from localStorage                         │
│     - Does NOT touch visibility                                 │
│                                                                 │
│  3. React hydrates                                              │
│                                                                 │
│  4. Zustand persist rehydrates                                  │
│                                                                 │
│  5. HydrationProvider detects BOTH complete                     │
│     - React hydration: useSyncExternalStore                     │
│     - Zustand hydration: persist.hasHydrated()                  │
│                                                                 │
│  6. HydrationProvider sets visibility:visible                   │
│     - Uses requestAnimationFrame for smoothness                 │
│     - Adds 'hydrated' class                                     │
│                                                                 │
│  RESULT: Clean, flicker-free render!                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### 1. Root Layout - CRITICAL INLINE STYLE

**File: `/src/app/layout.tsx`**
```typescript
// THE MOST IMPORTANT LINE - prevents flash before CSS loads
<html 
  lang="en" 
  suppressHydrationWarning 
  className="hydrating" 
  style={{ visibility: 'hidden' }}  // ← CRITICAL!
>
```

#### 2. HydrationScript - Theme ONLY, Not Visibility

**File: `/src/components/scripts/HydrationScript.tsx`**
```typescript
export function HydrationScript() {
  const code = `
(function() {
  var html = document.documentElement;
  
  // Set theme immediately from localStorage BEFORE React hydrates
  try {
    var themeData = localStorage.getItem('theme');
    if (themeData) {
      var parsed = JSON.parse(themeData);
      var theme = parsed?.state?.theme || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
    }
  } catch(e) {}
  
  // DO NOT set visibility here - let HydrationProvider handle it
})();
`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
```

#### 3. HydrationProvider - Single Visibility Manager

**File: `/src/components/providers/HydrationProvider.tsx`**
```typescript
'use client';

import { createContext, useContext, useSyncExternalStore, useEffect, useState, ReactNode } from 'react';
import { useGhostStore } from '@/store/useGhostStore';

interface HydrationContextValue {
  isHydrated: boolean;
  isStoreHydrated: boolean;
  isReady: boolean;
}

const HydrationContext = createContext<HydrationContextValue>({
  isHydrated: false,
  isStoreHydrated: false,
  isReady: false,
});

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useContext(HydrationContext).isHydrated;
}

export function useHydrationReady() {
  return useContext(HydrationContext).isReady;
}

export function HydrationProvider({ children }: { children: ReactNode }) {
  // React hydration detection
  const isReactHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  
  // Zustand persist hydration
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  
  useEffect(() => {
    const checkHydration = () => {
      const hasHydrated = useGhostStore.persist.hasHydrated();
      if (hasHydrated) setIsStoreHydrated(true);
      return hasHydrated;
    };
    
    if (checkHydration()) return;
    
    const unsubscribe = useGhostStore.persist.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });
    
    return unsubscribe;
  }, []);
  
  const isReady = isReactHydrated && isStoreHydrated;
  
  // SINGLE PLACE that sets visibility
  useEffect(() => {
    if (isReady && typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        const html = document.documentElement;
        html.classList.remove('hydrating');
        html.classList.add('hydrated');
        html.style.visibility = 'visible';  // ← ONLY HERE!
      });
    }
  }, [isReady]);
  
  return (
    <HydrationContext.Provider value={{ isHydrated: isReactHydrated, isStoreHydrated, isReady }}>
      {children}
    </HydrationContext.Provider>
  );
}
```

#### 4. CSS Fallback

**File: `/src/app/globals.css`**
```css
/* ============================================
   HYDRATION BLOCKING - Prevents FOUC
   ============================================ */

/* During hydration - prevent transitions */
html.hydrating * {
  transition: none !important;
  animation: none !important;
}

/* After hydration - enable smooth transitions */
html.hydrated * {
  transition-property: background-color, color, border-color, opacity;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

/* Color scheme for theme */
html.hydrating { color-scheme: light; }
html.hydrating.dark { color-scheme: dark; }
html.hydrated { color-scheme: light; }
html.hydrated.dark { color-scheme: dark; }

/* Fallback in case inline style is stripped */
html:not(.hydrated) {
  visibility: hidden;
}

html.hydrated {
  visibility: visible !important;
}
```

#### 5. Framer Motion Fix

**File: All homepage components**
```typescript
// BEFORE (causes flash)
<motion.div initial="hidden" animate="visible">

// AFTER (no flash)
<motion.div initial={false} animate="visible">
```

### Files Modified (Final List)

| File | Change |
|------|--------|
| `/src/app/layout.tsx` | Added `style={{ visibility: 'hidden' }}` to html |
| `/src/components/scripts/HydrationScript.tsx` | Theme only, removed visibility setting |
| `/src/components/scripts/BlockingScript.tsx` | **DELETED** - caused conflicts |
| `/src/components/scripts/ThemeScript.tsx` | **DELETED** - merged into HydrationScript |
| `/src/components/providers/HydrationProvider.tsx` | Single visibility manager |
| `/src/app/globals.css` | Added CSS fallback |
| `/src/components/home/*.tsx` | Added `initial={false}` to Framer Motion |
| `/src/components/dashboard/coaching/*.tsx` | Replaced local state with `useHydrated()` |
| `/src/components/dashboard/bookings/*.tsx` | Replaced local state with `useHydrated()` |

### Prevention Guidelines

#### 1. NEVER Use Multiple Visibility Managers
```typescript
// ❌ WRONG - Multiple scripts managing visibility
// Script 1:
html.style.visibility = 'visible';

// Script 2:
html.style.visibility = 'visible';

// Provider:
html.style.visibility = 'visible';

// ✅ RIGHT - ONE place only
// Only HydrationProvider sets visibility
```

#### 2. ALWAYS Use Inline Style on HTML
```typescript
// ❌ WRONG - Relying only on CSS
<html className="hydrating">

// ✅ RIGHT - Inline style as primary, CSS as fallback
<html className="hydrating" style={{ visibility: 'hidden' }}>
```

#### 3. Hydration Scripts Must NOT Set Visibility
```typescript
// ❌ WRONG - Script sets visibility too early
html.style.visibility = 'visible';  // This causes flickering!

// ✅ RIGHT - Script only sets theme
if (isDark) html.classList.add('dark');
// Visibility handled by HydrationProvider
```

#### 4. Use Unified Hydration Hooks
```typescript
// ❌ WRONG - Local hydration state
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

// ✅ RIGHT - Unified hook
import { useHydrated } from '@/components/providers/HydrationProvider';
const mounted = useHydrated();
```

#### 5. Framer Motion Must Skip Initial Hidden State
```typescript
// ❌ WRONG - Starts hidden
<motion.div initial="hidden" animate="visible">

// ✅ RIGHT - Skips hidden state
<motion.div initial={false} animate="visible">
```

### Testing Checklist

- [ ] No flickering on page load
- [ ] Theme persists across refresh (dark/light)
- [ ] Ghost mode persists across refresh
- [ ] No hydration mismatch errors in console
- [ ] Smooth transitions after hydration
- [ ] Content appears after brief delay (not instant flash)
- [ ] Works on hard refresh (Ctrl+Shift+R)

### Key Principles Summary

| Principle | Why It Matters |
|-----------|----------------|
| **Inline `style={{ visibility: 'hidden' }}`** | Hides content BEFORE CSS loads |
| **Single visibility manager** | Prevents race conditions |
| **Wait for React + Zustand** | Both must be ready before showing |
| **`requestAnimationFrame`** | Ensures smooth visual transition |
| **`initial={false}` on Framer Motion** | Prevents hidden→visible flash |
| **HydrationScript theme-only** | Never touch visibility in scripts |

---

## Prevention Guidelines

### 1. Hydration Safety
```typescript
// ALWAYS use this pattern for client-only content
const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false
);

if (!mounted) {
  return <ServerFallback />; // SSR-safe fallback
}

// Now safe to use client-only features
```

### 2. DOM Manipulation
```typescript
// NEVER do this in stores or during render:
document.body.classList.add('class');

// ALWAYS do this in useEffect:
useEffect(() => {
  document.body.classList.add('class');
  return () => document.body.classList.remove('class');
}, []);
```

### 3. Zustand Persistence with SSR
```typescript
// WRONG - DOM manipulation during rehydration
onRehydrateStorage: () => (state) => {
  document.body.classList.add('class'); // BAD
}

// RIGHT - Let React handle side effects
// Use a separate component with useEffect
```

### 4. Middleware State Access
```typescript
// Middleware runs on server - use cookies
// localStorage is NOT accessible in middleware

// Store in both for consistency:
set({ value });
localStorage.setItem('key', value);  // Client access
document.cookie = `key=${value}; path=/`; // Server/middleware access
```

### 5. Dev Server Management
```bash
# Always check if dev server is running
# Read dev log for errors
cat /home/z/my-project/dev.log

# Start dev server if needed
bun run dev
```

### 6. Lint Before Committing
```bash
# Always run lint check
bun run lint
```

---

## Key Technical Patterns

### 1. Mounted Check Pattern
Prevents hydration mismatch by only rendering client-specific content after mount:

```typescript
import { useSyncExternalStore } from 'react';

const mounted = useSyncExternalStore(
  () => () => {}, // Subscribe (no-op)
  () => true,      // Client snapshot
  () => false      // Server snapshot
);
```

### 2. useEffect for DOM Manipulation
Always use `useEffect` for DOM manipulation to ensure it runs after hydration:

```typescript
useEffect(() => {
  // Safe to manipulate DOM here
  document.body.classList.add('some-class');
  
  return () => {
    document.body.classList.remove('some-class');
  };
}, [dependency]);
```

### 3. Cookie + localStorage Sync
For state that needs both client and server access:

```typescript
// Set both
const setValue = (value: string) => {
  localStorage.setItem('key', value);
  document.cookie = `key=${value}; path=/; max-age=86400`;
};

// Read from appropriate source
const getValue = () => {
  // Client: prefer localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('key');
  }
  // Server: read from cookies (in middleware/request)
};
```

### 4. DashboardLayout Pattern
All dashboard pages should follow this structure:

```typescript
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Header title="Page Title" description="Description" />
        {/* Content */}
      </div>
    </DashboardLayout>
  );
}
```

---

## Files Modified Registry

### Core Files
| File | Purpose | Changes Made |
|------|---------|--------------|
| `/src/store/useGhostStore.ts` | Ghost mode state management | Removed DOM manipulation, added cookie sync |
| `/src/components/providers/GhostModeEffect.tsx` | NEW - DOM side effects | Handles body class after hydration |
| `/src/components/providers/SessionProvider.tsx` | Auth & theme providers | Removed loading fallback |
| `/src/app/layout.tsx` | Root layout | Added GhostModeEffect |

### Layout Components
| File | Purpose | Changes Made |
|------|---------|--------------|
| `/src/components/layout/Navbar.tsx` | Main navigation | Added mounted checks |
| `/src/components/dashboard/Sidebar.tsx` | Dashboard sidebar | Added mounted checks |
| `/src/components/dashboard/DashboardLayout.tsx` | Dashboard wrapper | Used on all dashboard pages |

### Pages Fixed
| File | Changes Made |
|------|--------------|
| `/src/app/(dashboard)/dashboard/page.tsx` | Added mounted checks, DashboardLayout |
| `/src/app/(dashboard)/products/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/courses/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/orders/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/analytics/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/settings/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/calendar/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/email-marketing/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/community/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/coaching/page.tsx` | Added DashboardLayout |
| `/src/app/(dashboard)/pricing/page.tsx` | Added DashboardLayout |

---

## Testing Checklist

After making changes, verify:

- [ ] Preview panel loads without flickering
- [ ] Ghost mode toggle works correctly
- [ ] No hydration mismatch errors in console
- [ ] Dashboard pages render with proper layout
- [ ] Body class `ghost-mode-active` applies correctly in ghost mode
- [ ] Page refresh maintains ghost mode state
- [ ] Navigation links work in both modes
- [ ] Lint passes: `bun run lint`
- [ ] No TypeScript errors

---

## Quick Reference - Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Prop 'class' did not match` | DOM manipulation during SSR | Use useEffect for DOM changes |
| `Cannot read property of undefined` | Accessing localStorage on server | Use `typeof window !== 'undefined'` check |
| `Hydration failed` | Client/server mismatch | Use mounted check pattern |
| Preview blank | Dev server not running | Run `bun run dev` |
| Middleware not seeing state | Using localStorage in middleware | Use cookies instead |

---

## Version History

| Date | Issue Fixed | Modified Files |
|------|-------------|----------------|
| Session 1 | Ghost mode routing | useGhostStore.ts, middleware.ts |
| Session 2 | Preview flickering | SessionProvider.tsx |
| Session 3 | Hydration mismatch | useGhostStore.ts, GhostModeEffect.tsx, layout.tsx |
| Session 4 | UI Layout issues | Pending |

---

*Last Updated: Session continuation*
*Next Update: After UI layout fixes*

---

## Contributing Guidelines

When fixing issues:
1. Document the problem in this file
2. Include root cause analysis
3. Provide code examples (before/after)
4. Add to prevention guidelines if applicable
5. Update files modified registry
6. Add to testing checklist if new verification needed

---

## New Features Implemented (Stan Store Parity)

### Feature Comparison - Stan Store Style

Based on Stan Store's feature set, the following features were implemented/enhanced:

| Feature | Individual Value | Status |
|---------|-----------------|--------|
| Mobile Optimized "Link-in-Bio" Store | $29/mo | ✅ Already implemented |
| Calendar Invites & Bookings | $15/mo | ✅ Enhanced |
| Course Builder | $119/mo | ✅ Already implemented |
| Audience Analytics | $10/mo | ✅ Enhanced |
| Instagram AutoDMs | $15/mo | ✅ NEW - Implemented |
| Email List / Newsletter Builder | $29/mo | ✅ Enhanced |
| Exclusive Creator Community Access | $97/mo | ✅ Enhanced |
| 1:1 Creator Strategy Coaching | $99/mo | ✅ Enhanced |
| ~~Social Media Template Library~~ | $30/mo | ❌ Skipped per user request |

**Total Value: $443/mo → Offered at: $29/mo (Save 93%)**

### Files Created

#### Instagram AutoDMs (NEW Feature)
| File | Purpose |
|------|---------|
| `/src/app/(dashboard)/dashboard/instagram/page.tsx` | Instagram AutoDMs dashboard |
| `/src/app/(dashboard)/dashboard/instagram/new/page.tsx` | Create automation form |
| `/src/app/(dashboard)/dashboard/instagram/[id]/page.tsx` | Edit automation form |
| `/src/app/api/instagram/automations/route.ts` | API - List/Create automations |
| `/src/app/api/instagram/automations/[id]/route.ts` | API - Single automation CRUD |

#### Email Composer
| File | Purpose |
|------|---------|
| `/src/app/(dashboard)/dashboard/email/compose/page.tsx` | Email compose page |
| `/src/app/(dashboard)/dashboard/email/templates/page.tsx` | Email templates library |

#### Public Booking Page
| File | Purpose |
|------|---------|
| `/src/app/book/[username]/page.tsx` | Public coaching booking page |

#### Homepage Feature Comparison
| File | Purpose |
|------|---------|
| `/src/components/home/FeatureComparison.tsx` | Stan Store-style feature list card |

#### Analytics Enhancements
| File | Purpose |
|------|---------|
| `/src/components/dashboard/analytics/DeviceBreakdownChart.tsx` | Mobile/Desktop/Tablet chart |
| `/src/components/dashboard/analytics/TopPagesChart.tsx` | Most visited pages |
| `/src/components/dashboard/analytics/RevenueByProductChart.tsx` | Revenue by product |
| `/src/components/dashboard/analytics/ConversionFunnel.tsx` | Visitor conversion funnel |

#### Community Enhancements
| File | Purpose |
|------|---------|
| `/src/components/dashboard/community/CommentSection.tsx` | Comments with like/reply |
| `/src/components/dashboard/community/PostCard.tsx` | Enhanced post card with interactions |

### Features Added

1. **Instagram AutoDMs**
   - 4 trigger types: New Follower, Keyword Mention, Story Reply, Comment on Post
   - Toggle automation active/inactive
   - Edit/Delete automations
   - Message template with {username} variable
   - Delay settings

2. **Email Composer**
   - Rich text editor with formatting
   - Variable insertion ({first_name}, {last_name}, etc.)
   - Side-by-side preview
   - Schedule for later
   - Email templates library (6 pre-built templates)

3. **Community Interactions**
   - Like/Unlike posts
   - Add comments
   - Pin/Unpin posts
   - Lock/Unlock comments
   - Delete posts (moderation)

4. **Analytics Enhancements**
   - Geographic breakdown (top countries)
   - Traffic sources with icons
   - Device breakdown (Mobile/Desktop/Tablet)
   - Top pages
   - Revenue by product
   - Conversion funnel

5. **Public Booking Page**
   - Creator profile display
   - Service selection
   - Calendar date picker
   - Time slot selection
   - Client details form
   - Booking confirmation

6. **Pricing Page Update**
   - Feature value comparison table
   - "Stop paying for multiple tools" messaging
   - 93% savings highlight
   - Social proof section
   - Enhanced competitor comparison

### Database Schema Added

```prisma
model InstagramAutomation {
  id          String   @id @default(cuid())
  userId      String
  name        String
  triggerType String   // NEW_FOLLOWER, KEYWORD_MENTION, STORY_REPLY, COMMENT
  keywords    String?  // JSON array
  message     String
  delay       Int      @default(0)
  isActive    Boolean  @default(true)
  sentCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```
