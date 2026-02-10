// Partner Focus Data Context
// Provides FocusDataProvider to all partner UI components via React context

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { FocusDataProvider } from '@/data/partner/FocusDataProvider';
import { DemoFocusDataProvider } from '@/data/partner/DemoFocusDataProvider';
import { LiveFocusDataProvider } from '@/data/partner/FocusDataProvider';

interface FocusDataContextValue {
  provider: FocusDataProvider;
  demoMode: boolean;
}

const FocusDataContext = createContext<FocusDataContextValue | null>(null);

export function FocusDataProviderWrapper({
  demoMode = true,
  children,
}: {
  demoMode?: boolean;
  children: ReactNode;
}) {
  const value = useMemo<FocusDataContextValue>(() => {
    const provider = demoMode
      ? new DemoFocusDataProvider()
      : new LiveFocusDataProvider();
    return { provider, demoMode };
  }, [demoMode]);

  return (
    <FocusDataContext.Provider value={value}>
      {children}
    </FocusDataContext.Provider>
  );
}

export function useFocusData(): FocusDataContextValue {
  const ctx = useContext(FocusDataContext);
  if (!ctx) {
    throw new Error('useFocusData must be used within a FocusDataProviderWrapper');
  }
  return ctx;
}
