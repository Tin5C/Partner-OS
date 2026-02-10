// Vendor Data Context — provides VendorDataProvider to vendor UI components
// Completely isolated from Partner/Focus data contexts

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { VendorDataProvider } from '@/data/vendor/VendorDataProvider';
import { DemoVendorDataProvider } from '@/data/vendor/providers';

interface VendorDataContextValue {
  provider: VendorDataProvider;
  demoMode: boolean;
}

const VendorDataContext = createContext<VendorDataContextValue | null>(null);

export function VendorDataProviderWrapper({
  demoMode = true,
  children,
}: {
  demoMode?: boolean;
  children: ReactNode;
}) {
  const value = useMemo<VendorDataContextValue>(() => {
    // Only demo provider exists for now
    const provider = new DemoVendorDataProvider();
    return { provider, demoMode };
  }, [demoMode]);

  return (
    <VendorDataContext.Provider value={value}>
      {children}
    </VendorDataContext.Provider>
  );
}

export function useVendorData(): VendorDataContextValue {
  const ctx = useContext(VendorDataContext);
  if (!ctx) {
    throw new Error('useVendorData must be used within a VendorDataProviderWrapper');
  }
  return ctx;
}
