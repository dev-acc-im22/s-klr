'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Set a cookie
 */
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
}

/**
 * Ghost Mode Store
 * 
 * Manages the ghost mode state for admin testing.
 * When enabled, users can bypass authentication and access all features.
 * State is persisted to localStorage AND cookies (for middleware).
 */

interface GhostState {
  /** Whether ghost mode is currently active */
  isGhostMode: boolean;
  
  /** Toggle ghost mode on/off */
  toggleGhostMode: () => void;
  
  /** Set ghost mode to a specific value */
  setGhostMode: (value: boolean) => void;
}

export const useGhostStore = create<GhostState>()(
  persist(
    (set, get) => ({
      isGhostMode: false,
      
      toggleGhostMode: () => {
        const newValue = !get().isGhostMode;
        set({ isGhostMode: newValue });
        
        // Set cookie for middleware
        setCookie('ghost_mode', newValue ? 'true' : 'false');
        
        // Note: DOM class (ghost-mode-active) is handled by GhostModeEffect component
        
        // Navigate after state change
        if (typeof window !== 'undefined') {
          if (newValue) {
            // Navigate to dashboard when ghost mode is activated
            window.location.href = '/dashboard';
          } else {
            // Navigate to home when ghost mode is deactivated
            window.location.href = '/';
          }
        }
      },
      
      setGhostMode: (value: boolean) => {
        set({ isGhostMode: value });
        
        // Set cookie for middleware
        setCookie('ghost_mode', value ? 'true' : 'false');
        
        // Note: DOM class (ghost-mode-active) is handled by GhostModeEffect component
      },
    }),
    {
      name: 'creatorhub-ghost-mode',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Re-apply cookie on page load for middleware
        // Note: DOM manipulation (classList) is NOT done here to avoid React hydration mismatch
        if (state?.isGhostMode) {
          setCookie('ghost_mode', 'true');
        }
      },
    }
  )
);

/**
 * Mock Ghost User Data
 */
export const mockGhostUser = {
  id: 'ghost-user-id',
  email: 'ghost@creatorhub.test',
  name: 'Ghost Admin',
  username: 'ghostadmin',
  role: 'CREATOR',
  avatar: null,
  bio: 'Test account for development and admin testing',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  settings: {
    storeName: 'Ghost Store',
    storeDescription: 'A test store for development purposes',
    theme: 'default',
    customDomain: null,
  },
};
