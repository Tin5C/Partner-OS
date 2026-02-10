// Space Context - Provides space configuration and state
// Updated to force recompile
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SpaceConfig, SpaceType, getSpaceConfigByType } from '@/config/spaces';

interface SpaceContextValue {
  spaceType: SpaceType;
  spaceConfig: SpaceConfig;
  isUnlocked: boolean;
  unlock: (password: string) => boolean;
}

const SpaceContext = createContext<SpaceContextValue | null>(null);

// Demo passwords for MVP
const SPACE_PASSWORDS: Record<SpaceType, string> = {
  internal: 'internal2025',
  partner: 'partner2025',
  vendor: 'vendor2025',
};

// Storage key for unlock state
function getStorageKey(spaceType: SpaceType): string {
  return `space_unlocked_${spaceType}`;
}

export function SpaceProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Determine space type from route
  const spaceType: SpaceType = useMemo(() => {
    if (location.pathname.startsWith('/internal')) return 'internal';
    if (location.pathname.startsWith('/vendor')) return 'vendor';
    if (location.pathname.startsWith('/partner')) return 'partner';
    return 'internal'; // Default
  }, [location.pathname]);
  
  const spaceConfig = useMemo(() => getSpaceConfigByType(spaceType), [spaceType]);
  
  // Unlock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(getStorageKey(spaceType)) === 'true';
  });
  
  // Re-check unlock when space changes
  useEffect(() => {
    const unlocked = sessionStorage.getItem(getStorageKey(spaceType)) === 'true';
    setIsUnlocked(unlocked);
  }, [spaceType]);
  
  const unlock = (password: string): boolean => {
    if (password === SPACE_PASSWORDS[spaceType]) {
      sessionStorage.setItem(getStorageKey(spaceType), 'true');
      setIsUnlocked(true);
      return true;
    }
    return false;
  };
  
  return (
    <SpaceContext.Provider value={{ spaceType, spaceConfig, isUnlocked, unlock }}>
      {children}
    </SpaceContext.Provider>
  );
}

export function useSpace() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
}
