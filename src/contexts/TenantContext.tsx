import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  TenantConfig, 
  getTenantConfig, 
  validateTenantPassword,
  isTenantUnlocked,
  unlockTenant,
  lockTenant,
  clearAllTenantAccess
} from '@/lib/tenantConfig';

interface TenantContextType {
  tenant: TenantConfig | null;
  tenantType: 'partner' | 'internal' | null;
  tenantSlug: string | null;
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
  unlock: (password: string) => { success: boolean; error?: string };
  lock: () => void;
  switchTenant: () => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse tenant info from URL
  const getTenantFromPath = useCallback(() => {
    const path = location.pathname;
    
    // Partner route: /p/:partnerSlug
    const partnerMatch = path.match(/^\/p\/([^/]+)/);
    if (partnerMatch) {
      return { type: 'partner' as const, slug: partnerMatch[1] };
    }
    
    // Internal route: /u/:userSlug
    const internalMatch = path.match(/^\/u\/([^/]+)/);
    if (internalMatch) {
      return { type: 'internal' as const, slug: internalMatch[1] };
    }
    
    return null;
  }, [location.pathname]);

  const tenantInfo = getTenantFromPath();
  const tenantType = tenantInfo?.type || null;
  const tenantSlug = tenantInfo?.slug || null;
  const tenant = tenantSlug && tenantType ? getTenantConfig(tenantSlug, tenantType) : null;

  // Check unlock status on mount and when tenant changes
  useEffect(() => {
    setIsLoading(true);
    if (tenantSlug && tenantType) {
      const unlocked = isTenantUnlocked(tenantSlug, tenantType);
      setIsUnlocked(unlocked);
      setError(tenant ? null : 'Tenant not found');
    } else {
      setIsUnlocked(false);
      setError(null);
    }
    setIsLoading(false);
  }, [tenantSlug, tenantType, tenant]);

  const unlock = useCallback((password: string): { success: boolean; error?: string } => {
    if (!tenantSlug || !tenantType) {
      return { success: false, error: 'No tenant selected' };
    }

    if (!tenant) {
      return { success: false, error: 'Tenant not found' };
    }

    const isValid = validateTenantPassword(tenantSlug, tenantType, password);
    if (isValid) {
      unlockTenant(tenantSlug, tenantType);
      setIsUnlocked(true);
      setError(null);
      return { success: true };
    }

    return { success: false, error: 'Invalid password' };
  }, [tenantSlug, tenantType, tenant]);

  const lock = useCallback(() => {
    if (tenantSlug && tenantType) {
      lockTenant(tenantSlug, tenantType);
      setIsUnlocked(false);
    }
  }, [tenantSlug, tenantType]);

  const switchTenant = useCallback(() => {
    clearAllTenantAccess();
    setIsUnlocked(false);
  }, []);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantType,
        tenantSlug,
        isUnlocked,
        isLoading,
        error,
        unlock,
        lock,
        switchTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
