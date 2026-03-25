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
  const context = useContext(HydrationContext);
  return context.isHydrated;
}

export function useHydrationReady() {
  const context = useContext(HydrationContext);
  return context.isReady;
}

export function useStoreHydrated() {
  const context = useContext(HydrationContext);
  return context.isStoreHydrated;
}

export function HydrationProvider({ children }: { children: ReactNode }) {
  const isReactHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  
  // Make content visible as soon as React hydrates (don't wait for Zustand)
  useEffect(() => {
    if (isReactHydrated && typeof window !== 'undefined') {
      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        const html = document.documentElement;
        html.classList.remove('hydrating');
        html.classList.add('hydrated');
        // Make content visible
        html.style.visibility = 'visible';
      });
    }
  }, [isReactHydrated]);
  
  // Track Zustand hydration separately (for components that need it)
  useEffect(() => {
    const checkHydration = () => {
      const hasHydrated = useGhostStore.persist.hasHydrated();
      if (hasHydrated) {
        setIsStoreHydrated(true);
      }
      return hasHydrated;
    };
    
    if (checkHydration()) return;
    
    const unsubscribe = useGhostStore.persist.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });
    
    return unsubscribe;
  }, []);
  
  const isReady = isReactHydrated && isStoreHydrated;
  
  return (
    <HydrationContext.Provider value={{ isHydrated: isReactHydrated, isStoreHydrated, isReady }}>
      {children}
    </HydrationContext.Provider>
  );
}

export default HydrationProvider;
