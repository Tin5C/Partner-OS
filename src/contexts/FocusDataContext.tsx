// Partner Data Context
// Provides PartnerDataProvider to all partner UI components via React context

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PartnerDataProvider } from '@/data/partner/PartnerDataProvider';
import { DemoPartnerDataProvider, LivePartnerDataProvider } from '@/data/partner/providers';

interface PartnerDataContextValue {
  provider: PartnerDataProvider;
  demoMode: boolean;
}

const PartnerDataContext = createContext<PartnerDataContextValue | null>(null);

export function PartnerDataProviderWrapper({
  demoMode = true,
  children,
}: {
  demoMode?: boolean;
  children: ReactNode;
}) {
  const value = useMemo<PartnerDataContextValue>(() => {
    const provider = demoMode
      ? new DemoPartnerDataProvider()
      : new LivePartnerDataProvider();
    return { provider, demoMode };
  }, [demoMode]);

  return (
    <PartnerDataContext.Provider value={value}>
      {children}
    </PartnerDataContext.Provider>
  );
}

export function usePartnerData(): PartnerDataContextValue {
  const ctx = useContext(PartnerDataContext);
  if (!ctx) {
    throw new Error('usePartnerData must be used within a PartnerDataProviderWrapper');
  }
  return ctx;
}

// Backward compatibility alias
export const FocusDataProviderWrapper = PartnerDataProviderWrapper;
export const useFocusData = usePartnerData;
